import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AddTipoCamionComponent} from './add-tipo-camion/add-tipo-camion.component';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { TipoCamion } from '../../../shared/models/tipo-camion';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-tipo-camion',
  templateUrl: './tipo-camion.component.html',
  styleUrls: ['./tipo-camion.component.scss']
})
export class TipoCamionComponent implements OnInit {
  public tipoCamiones : TipoCamion[];
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
      this.nomencladoresService.getAllTipoCamiones(this.page.pageNumber).subscribe(pagedData => {
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        this.tipoCamiones = pagedData.data;
      });
  }
    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Agregar Tipo de Camión' : 'Modificar Tipo de Camión';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddTipoCamionComponent, {
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
            this.nomencladoresService.postTipoCamion(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                this.loader.close();
               this.snack.open('Tipo de Camión Agregado!', 'OK', { duration: 4000 })
                return; 
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al agregar el tipo de camión' });
              })
          } else {
            this.nomencladoresService.updateTipoCamion(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Tipo de Camión Modificado!', 'OK', { duration: 4000 }) 
                return; 
              })
          }
        })
    }
    deleteItem(row) {
      this.confirmService.confirm({message: `Está seguro de eliminar el Tipo de Camión: ${row.descripcion}?`})
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.nomencladoresService.deleteTipoCamion(row.id)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Tipo de Camión eliminado!', 'OK', { duration: 4000 });
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al eliminar el tipo de camión' });
              });
          }
        });
    }

}
