import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { DesvioMotivoService } from './../../../shared/services/desvio-motivo.service';
import { DesvioMotivo } from './../../../shared/models/desvioMotivo';
import { AddDesvioMotivoComponent } from './add-desvio-motivo/add-desvio-motivo.component';

@Component({
  selector: 'app-desvio-motivo',
  templateUrl: './desvio-motivo.component.html',
  styleUrls: ['./desvio-motivo.component.scss']
})
export class DesvioMotivoComponent implements OnInit {
  public desvio_motivo: DesvioMotivo[];
  public getItemSub: Subscription;
  constructor(private desvio_motivoService: DesvioMotivoService, public router: Router, private dialog: MatDialog,
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
    this.getItemSub = this.desvio_motivoService.getAllDesviomotivo()
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
    let title = isNew ? 'Agregar Motivo de Desvio' : 'Modificar Motivo de Desvio';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddDesvioMotivoComponent, {
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
          this.desvio_motivoService.postDesviomotivo(res)
            .subscribe(data => {
              this.desvio_motivo.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Motivo de Desvio agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo de Desvio ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.desvio_motivoService.updateDesviomotivo(res)
            .subscribe(data => {
              this.desvio_motivo = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Motivo de Desvio modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo de Desvio no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Motivo de Desvio?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.desvio_motivoService.deleteDesviomotivo(row.id)
            .subscribe(data => {
              this.loader.close();
              this.desvio_motivo = data;
              this.getItems();              
              this.snack.open('Motivo de desvio eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo de desvio no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
