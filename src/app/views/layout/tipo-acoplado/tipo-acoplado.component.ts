import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AddTipoAcopladoComponent} from './add-tipo-acoplado/add-tipo-acoplado.component';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { TipoAcoplado } from '../../../shared/models/tipo-acoplado';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-tipo-acoplado',
  templateUrl: './tipo-acoplado.component.html',
  styleUrls: ['./tipo-acoplado.component.scss']
})
export class TipoAcopladoComponent implements OnInit {
  public tipoAcoplados : TipoAcoplado[];
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
      this.nomencladoresService.getAllTipoAcoplados(this.page.pageNumber).subscribe(pagedData => {
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        this.tipoAcoplados = pagedData.data;
      });
  }
    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Agregar Tipo de Acoplado' : 'Modificar Tipo de Acoplado';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddTipoAcopladoComponent, {
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
            this.nomencladoresService.postTipoAcoplado(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                this.loader.close();
               this.snack.open('Tipo de acoplado Agregado!', 'OK', { duration: 4000 })
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al agregar el Acoplado' });
              })
          } else {
            this.nomencladoresService.updateTipoAcoplado(res)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Tipo de acoplado Modificado!', 'OK', { duration: 4000 }) 
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al modificar el acoplado' });
              });
          }
        });
    }
    deleteItem(row) {
      this.confirmService.confirm({message: `Está seguro de eliminar el Tipo de Acoplado : ${row.descripcion}?`})
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.nomencladoresService.deleteTipoAcoplado(row.id)
              .subscribe(data => {
                this.setPage({ offset: 0 });
                 this.loader.close();
                this.snack.open('Tipo de acoplado eliminado!', 'OK', { duration: 4000 }) 
                return;
              },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al elimiar el Acoplado' });
              });
          }
        });
    }

}
