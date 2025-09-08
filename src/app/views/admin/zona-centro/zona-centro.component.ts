import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { AddZonaCentroComponent} from './add-zona-centro/add-zona-centro.component';
import { ZonasService } from './../../../shared/services/zonas.service';
import { Zona } from '../../../shared/models/zona';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-zona-centro',
  templateUrl: './zona-centro.component.html',
  styleUrls: ['./zona-centro.component.scss']
})
export class ZonaCentroComponent implements OnInit {
  public zonas: Zona[];
  public getItemSub: Subscription;
  tipocentro: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  constructor(private zonasService: ZonasService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private errorService: AppErrorService, private atencionService: AppAtencionService,
    private alertService: AppAlertService) { }

    ngOnInit() {
      this.tipocentro = localStorage.getItem('clienteMuvin');
      this.getItems();
    }

    ngOnDestroy() {
      if (this.getItemSub) {
        this.getItemSub.unsubscribe();
      }
    }

    getItems() {
      this.getItemSub = this.zonasService.getAllZonas()
        .subscribe(data => {
          this.zonas = data.data;
        });
    }

    updateFilter(event) {
      const val = event.target.value.toLowerCase();
      const temp = this.zonas.filter(function(d) {
        return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.zonas = temp;
      if(val === ''){
        this.getItems();
      }
    }

    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Agregar Zona' : 'Modificar Zona';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddZonaCentroComponent, {
        width: '420px',
        disableClose: true,
        data: { title: title, payload: data, isNew: isNew }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            // If user press cancel
            return;
          }
          this.loader.open();
          if (isNew) {
            this.zonasService.postZona(res)
              .subscribe(data => {
                this.getItems();
                this.loader.close();
                this.alertService.confirm({ message: '¡Zona Agregada!', tipo: 'exito' }).subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
              },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Esta Zona ya se encuentra ingresada.' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
          } else {
            this.zonasService.updateZona(res)
              .subscribe(data => {
                this.getItems();
                 this.loader.close();
                 this.alertService.confirm({ message: '¡Zona Modificada!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Esta Zona no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
          }
        });
    }

    deleteItem(row) {
      this.confirmService.confirm({message: '¿Está seguro de eliminar la Zona: ' + row.descripcion + '?'})
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.zonasService.deleteZona(row.id)
              .subscribe(data => {
                this.loader.close();
                this.getItems();                 
                 this.alertService.confirm({ message: '¡Zona Eliminada!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Error al eliminar la Zona' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
          }
        });
    }


}
