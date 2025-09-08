import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { SituacionPuertoService } from './../../../shared/services/situacion-puerto.service';
import { SituacionPuerto } from './../../../shared/models/situacion-puerto';
import { AddSituacionpuertoComponent } from './add-situacionpuerto/add-situacionpuerto.component';

@Component({
  selector: 'app-situacionpuerto',
  templateUrl: './situacionpuerto.component.html',
  styleUrls: ['./situacionpuerto.component.scss']
})
export class SituacionpuertoComponent implements OnInit {
  public situacion_puerto: SituacionPuerto[];
  public getItemSub: Subscription;
  constructor(private situacionpuertoService: SituacionPuertoService, public router: Router, private dialog: MatDialog,
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
    this.getItemSub = this.situacionpuertoService.getAllSituacionPuerto()
      .subscribe(data => {
        this.situacion_puerto = data.data;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.situacion_puerto.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.situacion_puerto = temp;
    if(val === ''){
      this.getItems();
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Estado de Destino' : 'Modificar Estado de Destino';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSituacionpuertoComponent, {
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
          this.situacionpuertoService.postSituacionPuerto(res)
            .subscribe(data => {
              this.situacion_puerto.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Estado de Destino agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Estado de Destino ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.situacionpuertoService.updateSituacionPuerto(res)
            .subscribe(data => {
              this.situacion_puerto = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Estado de Destino modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Estado de Destino no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Estado de Destino?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.situacionpuertoService.deleteSituacionPuerto(row.id)
            .subscribe(data => {
              this.loader.close();
              this.situacion_puerto = data;
              this.getItems();              
              this.snack.open('Estado de Destino eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Estado de Destino no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
