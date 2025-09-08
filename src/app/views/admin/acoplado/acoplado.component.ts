import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { Acoplado } from './../../../shared/models/acoplado';
import { Equipo } from './../../../shared/models/equipo';
import { AcopladosService } from './../../../shared/services/acoplados.service';
import { EquiposService } from './../../../shared/services/equipos.service';
import { AddAcopladoComponent } from './add-acoplado/add-acoplado.component';
import { Page } from '../../../shared/models/page';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-acoplado',
  templateUrl: './acoplado.component.html',
  styleUrls: ['./acoplado.component.scss']
})
export class AcopladoComponent implements OnInit, OnDestroy {
  acoplados: Acoplado[];
  page = new Page();
  equipo: Equipo;
  isEquipoBloqueado = false;
  public  filtro;
  public getItemSub: Subscription;
  constructor(private dialog: MatDialog, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private acopladosService: AcopladosService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private equipoService: EquiposService, private alertService: AppAlertService) {
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
      this.acopladosService.getAllAcoplados(this.page.pageNumber, this.filtro).subscribe(pagedData => {
        this.acoplados = pagedData.data;
        for (let i = 0; i < this.acoplados.length; i++) {
          this.acoplados[i].desc_bloqueado = (this.acoplados[i].bloqueado === 0) ? 'NO' : 'SI';
          this.acoplados[i].desc_carga_peligrosa = (this.acoplados[i].carga_peligrosa === 0) ? 'NO' : 'SI';
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
   
  }

  openPopUp(data: any = {}, isNew?) {
    const title = isNew ? 'Agregar Acoplado' : 'Modificar Acoplado';
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddAcopladoComponent, {
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
          this.acopladosService.postAcoplado(res)
            .subscribe(data1 => {
              this.acoplados.unshift(data1);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Acoplado agregado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Este Acoplado ya existe ' });
              });
        } else {
          this.acopladosService.updateAcoplado(res)
            .subscribe(data1 => {
              this.acoplados = data1;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Acoplado modificado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Acoplado no se pudo modificar' });
              });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el acoplado: ' +
    row.nombre_marca_acoplado + ' - ' + row.patente + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.acopladosService.deleteAcoplado(row.id)
            .subscribe(data => {
              this.loader.close();
              this.acoplados = data;
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: '¡Acoplado eliminado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este acoplado no se pudo eliminar' });
              });
        }
      });
  }

  bloquearAcoplado(row) {
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
          this.confirmService.confirm({ message: 'Está seguro de bloquear el Acoplado: ' +
           row.nombre_marca_acoplado + ' - ' + row.patente + '?' })
            .subscribe(res => {
              if (res) {
                this.loader.open();
                this.acopladosService.postBloquearAcoplado(row)
                  .subscribe(data1 => {
                    this.loader.close();
                    this.setPage({ offset: 0 });
                    this.alertService.confirm({ message: '¡Acoplado Bloqueado!', tipo: 'exito' })
                    .subscribe(res1 => {
                      if (res1) {
                        return;
                      }
                    });
                  }, err => {
                    this.loader.close();
                    this.errorService.confirm({ message: 'Error ocurrido al bloquear el Acoplado ' + err });
                  });
              }
            });
        }
      });
  }
  desBloquearAcoplado(row) {
    this.confirmService.confirm({ message: 'Etá seguro de desbloquear el Acoplado: ' +
    row.nombre_marca_acoplado + ' - ' + row.patente + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.acopladosService.postDesBloquearAcoplado(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Acoplado Desbloqueado!', tipo: 'exito' })
              .subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al desbloquear el Acoplado ' + err });
            });
        }
      });
  }

}
