import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AddMarcaAcopladoComponent} from './add-marca-acoplado/add-marca-acoplado.component';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { MarcaAcoplado } from '../../../shared/models/marca-acoplado';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-marca-acoplado',
  templateUrl: './marca-acoplado.component.html',
  styleUrls: ['./marca-acoplado.component.scss']
})
export class MarcaAcopladoComponent implements OnInit, OnDestroy {
  public marcaAcoplados : MarcaAcoplado[];
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
      this.nomencladoresService.getAllMarcaAcoplados(this.page.pageNumber).subscribe(pagedData => {
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        this.marcaAcoplados = pagedData.data;
      });
  }
    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Agregar Marca de Acoplado' : 'Modificar Marca de Acoplado';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddMarcaAcopladoComponent, {
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
            this.nomencladoresService.postMarcaAcoplado(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                this.loader.close();
                this.snack.open('Marca de Acoplado Agregada!', 'OK', { duration: 4000 })
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Marca duplicada' });
              });
          } else {
            this.nomencladoresService.updateMarcaAcoplado(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                 this.snack.open('Marca de Acoplado Modificada!', 'OK', { duration: 4000 }); 
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al modificar la Marca del Acoplado' });
              });
          }
        });
    }
    deleteItem(row) {
      this.confirmService.confirm({message: `Está seguro de eliminar la Marca: ${row.descripcion}?`})
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.nomencladoresService.deleteMarcaAcoplado(row.id)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                 this.snack.open('Marca eliminada!', 'OK', { duration: 4000 }); 
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al eliminar la Marca' });
              });
          }
        },
        err => {
          this.alertService.confirm({ message: '!Error' + err });
        });
    }

}
