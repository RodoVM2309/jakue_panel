import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { Camion } from './../../../shared/models/camion';
import { Equipo } from './../../../shared/models/equipo';
import { CamionService } from './../../../shared/services/camion.service';
import { EquiposService } from './../../../shared/services/equipos.service';
import { AddCamionComponent } from './add-camion/add-camion.component';
import { Page } from '../../../shared/models/page';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.scss']
})
export class CamionComponent implements OnInit, OnDestroy {
  camiones: Camion[];
  page = new Page();
  equipo: Equipo;
  isEquipoBloqueado = false;
  public filtro;
  public getItemSub: Subscription;
  constructor(public router: Router, private dialog: MatDialog, private confirmService: AppConfirmService,
    private alertService: AppAlertService, private loader: AppLoaderService,
    private errorService: AppErrorService, 
    private camionService: CamionService, private equipoService: EquiposService) {
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
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    this.camionService.getAllCamiones(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.camiones = pagedData.data;
      for (let i = 0; i < this.camiones.length; i++) {
        this.camiones[i].desc_bloqueado = (this.camiones[i].bloqueado === 0) ? 'NO' : 'SI';
        this.camiones[i].desc_carga_peligrosa = (this.camiones[i].carga_peligrosa === 0) ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUp(data: any = {}, isNew?) {
    const title = isNew ? 'Agregar Camión' : 'Modificar Camión';
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddCamionComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.loader.open();
        if (isNew) {
          this.camionService.postCamion(res)
            .subscribe(data1 => {
              this.camiones.unshift(data1);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Camión agragado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.confirmService.confirm({ message: 'Datos incorrectos' })
                  .subscribe(res1 => {
                    if (res1) {
                    }
                  });
              });
        } else {
          this.camionService.updateCamion(res)
            .subscribe(data1 => {
              this.camiones = data1;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Camión modificado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Hay problemas con los datos del Camión' });
              });
        }
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el Camión: ' + row.nombre_marca_camion + ' - ' + row.patente + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.camionService.deleteCamion(row.id)
            .subscribe(data => {
              this.loader.close();
              this.camiones = data;
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: '¡Camión eliminado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Camión no se pudo eliminar' });
              });
        }
      });
  }

  bloquearCamion(row) {
    this.getItemSub = this.equipoService.getEquipoxCamion(row.id)
      .subscribe(data => {
        this.equipo = data.data[0];
        if (this.equipo !== undefined) {
          if (this.equipo.bloqueado === 1) {
              this.isEquipoBloqueado = true;
            } else {
            this.isEquipoBloqueado = false;
          }
        }
        if (this.isEquipoBloqueado) {
          this.confirmService.confirm({ message: 'Bloquear dupla Chofer/Equipo' })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        } else {
          this.confirmService.confirm({ message: 'Ud. está seguro de bloquear el camión: ' +
          row.nombre_marca_camion + ' - ' + row.patente + '?' })
            .subscribe(res => {
              if (res) {
                this.loader.open();
                this.camionService.postBloquearCamion(row)
                  .subscribe(data1 => {
                    this.loader.close();
                    this.setPage({ offset: 0 });
                    this.alertService.confirm({ message: '¡Camión Bloqueado!', tipo: 'exito' })
                    .subscribe(res1 => {
                      if (res1) {
                        return;
                      }
                    });
                  }, err => {
                    this.loader.close();
                    this.errorService.confirm({ message: 'Error ocurrido al bloquear el camión ' + err });
                  });
              }
            });
        }

      });
  };

  desBloquearCamion(row) {
    this.confirmService.confirm({ message: 'Ud. está seguro de desbloquear el camión: ' +
    row.nombre_marca_camion + ' - ' + row.patente + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.camionService.postDesBloquearCamion(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Camión desbloqueado!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al desbloquear el camión ' + err });
            });
        }
      });
  }
}
