import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AddMarcaCamionComponent} from './add-marca-camion/add-marca-camion.component';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { MarcaCamion } from '../../../shared/models/marca-camion';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-marca-camion',
  templateUrl: './marca-camion.component.html',
  styleUrls: ['./marca-camion.component.scss']
})
export class MarcaCamionComponent implements OnInit {
  public marcaCamiones : MarcaCamion[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private nomencladoresService:NomencladoresService,public router: Router,private dialog: MatDialog,
    private snack: MatSnackBar,private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService:AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

    ngOnInit() {
      //this.getItems();
      this.setPage({ offset: 0 });
    }
    ngOnDestroy() {
      if (this.getItemSub) {
        this.getItemSub.unsubscribe()
      }
    }

    setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.nomencladoresService.getAllMarcaCamiones(this.page.pageNumber).subscribe(pagedData => {
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        this.marcaCamiones = pagedData.data;
      });
  }
    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Agregar Marca de Camión' : 'Modificar Marca de Camión';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddMarcaCamionComponent, {
        width: '720px',
        disableClose: true,
        data: { title: title, payload: data, isNew:isNew }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            // If user press cancel
            return;
          }
          this.loader.open();
          if (isNew) {
            this.nomencladoresService.postMarcaCamion(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                this.loader.close();
               this.snack.open('Marca de Camion Agregada!', 'OK', { duration: 4000 })
                return; 
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al agregar la Marca' });
              })
          } else {
            this.nomencladoresService.updateMarcaCamion(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Marca de Camion Modificada!', 'OK', { duration: 4000 }) 
                return; 
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al modificar la Marca' });
              });
          }
        });
    }
    deleteItem(row) {
      this.confirmService.confirm({message: `Está seguro de eliminar la Marca: ${row.descripcion}?`})
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.nomencladoresService.deleteMarcaCamion(row.id)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Marca eliminada!', 'OK', { duration: 4000 }) 
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al eliminar la Marca' });
              });
          }
        });
    }

}
