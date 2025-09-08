import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { TipoDestinoService } from './../../../shared/services/tipo-destino.service';
import { TipoDestino } from './../../../shared/models/tipo-destino';
import { AddTipoDestinoComponent } from './add-tipo-destino/add-tipo-destino.component';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-tipo-destino',
  templateUrl: './tipo-destino.component.html',
  styleUrls: ['./tipo-destino.component.scss']
})
export class TipoDestinoComponent implements OnInit {
  public tipo_destino: TipoDestino[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private tipos_destinoService: TipoDestinoService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService:AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
      this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tipo_destino.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.tipo_destino = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

    setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.tipos_destinoService.getAllTipodestino(this.page.pageNumber).subscribe(pagedData => {
        this.tipo_destino = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Tipo de Destino' : 'Modificar Tipo de Destino';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddTipoDestinoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.tipos_destinoService.postTipodestino(res)
            .subscribe(data => {
              this.tipo_destino.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Tipo de Destino agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Tipo de Destino ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.tipos_destinoService.updateTipodestino(res)
            .subscribe(data => {
              this.tipo_destino = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Tipo de Destino modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Tipo de Destino no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el Tipo de Destino?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.tipos_destinoService.deleteTipodestino(row.id)
            .subscribe(data => {
              this.loader.close();
              this.tipo_destino = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Tipo de destino eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Tipo de destino no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
