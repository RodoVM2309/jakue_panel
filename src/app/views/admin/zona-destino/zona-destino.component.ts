import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { ZonaDestinoService } from './../../../shared/services/zona-destino.service';
import { ZonaDestino } from './../../../shared/models/zona-destino';
import { AddZonaDestinoComponent } from './add-zona-destino/add-zona-destino.component';
import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-zona-destino',
  templateUrl: './zona-destino.component.html',
  styleUrls: ['./zona-destino.component.scss']
})
export class ZonaDestinoComponent implements OnInit {
  public zona_destino: ZonaDestino[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private zona_destinoService: ZonaDestinoService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
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
      this.getItemSub.unsubscribe();
    }
  }

    setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.zona_destinoService.getAllZonaDestino(this.page.pageNumber).subscribe(pagedData => {
        this.zona_destino = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.zona_destino.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.zona_destino = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Zona Destino' : 'Modificar Zona Destino';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddZonaDestinoComponent, {
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
          this.zona_destinoService.postZonaDestino(res)
            .subscribe(data => {
              this.zona_destino.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Zona Destino agregada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Zona Destino ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.zona_destinoService.updateZonaDestino(res)
            .subscribe(data => {
              this.zona_destino = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Zona Destino modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Zona Destino no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar esta Zona Destino?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.zona_destinoService.deleteZonaDestino(row.id)
            .subscribe(data => {
               this.loader.close();
              this.zona_destino = data;
              this.setPage({ offset: 0 });             
              this.snack.open('Zona Destino eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Zona Destino no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
