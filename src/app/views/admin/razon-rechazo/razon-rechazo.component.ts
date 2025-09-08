import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { RazonRechazoService } from './../../../shared/services/razon-rechazo.service';
import { DesvioMotivo } from './../../../shared/models/desvioMotivo';
import { AddRazonRechazoComponent } from './add-razon-rechazo/add-razon-rechazo.component';

@Component({
  selector: 'app-razon-rechazo',
  templateUrl: './razon-rechazo.component.html',
  styleUrls: ['./razon-rechazo.component.scss']
})
export class RazonRechazoComponent implements OnInit {
  public desvio_motivo: DesvioMotivo[];
  public getItemSub: Subscription;
  constructor(private desvio_motivoService: RazonRechazoService, 
    public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService:AppAlertService) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {
    this.getItemSub = this.desvio_motivoService.getAllRazonRechazo()
      .subscribe(data => {
        this.desvio_motivo = data.data;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.desvio_motivo.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.desvio_motivo = temp;
    if(val === ''){
      this.getItems();
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar la Razon de Rechazo' : 'Modificar Razon de Rechazo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddRazonRechazoComponent, {
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
          this.desvio_motivoService.postRazonRechazo(res)
            .subscribe(data => {
              this.desvio_motivo.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Razon de Rechazo agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Razon de Rechazo ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.desvio_motivoService.updateRazonRechazo(res)
            .subscribe(data => {
              this.desvio_motivo = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Razón de Rechazo modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Razón de Rechazo no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar esta Razón de Rechazo?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.desvio_motivoService.deleteRazonRechazo(row.id)
            .subscribe(data => {
              this.loader.close();
              this.desvio_motivo = data;
              this.getItems();              
              this.snack.open('Razón de Rechazo eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Razón de Rechazo no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
