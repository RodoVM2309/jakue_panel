import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { CentroTransporte } from './../../../shared/models/centro';
import { VincularTransporteComponent } from './vincular-transporte/vincular-transporte.component';
import { AsignacionZonaChoferComponent } from './asignacion-zona-chofer/asignacion-zona-chofer.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-vincular-centro-transporte',
  templateUrl: './vincular-centro-transporte.component.html',
  styleUrls: ['./vincular-centro-transporte.component.scss']
})
export class VincularCentroTransporteComponent implements OnInit {
  public transportes: CentroTransporte[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  tipocentro: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  searchTransportista: FormControl;

  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private errorService: AppErrorService, private atencionService: AppAtencionService,
    private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }


  ngOnInit() {
    //this.getItems();
    this.searchTransportista = new FormControl();
    this.searchTransportista.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        valor => {
          this.filtro = valor.toLowerCase();
          this.setPage({ offset: 0 });
        });
    this.tipocentro = localStorage.getItem('clienteMuvin');
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro == undefined) {
      this.filtro = '';
    }
    this.centrosService.getTransporteByIdCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.transportes = pagedData.data;
      for (let i = 0; i < this.transportes.length; i++) {
        this.transportes[i].desc_bloqueado = (this.transportes[i].bloqueado === 0) ? 'NO' : 'SI';
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

  openPopUpVincular(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Transportista' : 'Modificar Intermediario';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularTransporteComponent, {
      width: '420px',
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
          this.centrosService.postCentroTransporte(res)
            .subscribe(data => {
              this.transportes.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: 'Transportista Agregado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService
                  .confirm({ message: "Error: Se presentaron error al crear el  transportista!" })
                  .subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
              });
        } else {
          if (res.id_intermediario === 0) {
            res.id_intermediario = null;
          }
          this.centrosService.updateCentroTransporte(res)
            .subscribe(data => {
               this.loader.close();
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: 'Transportista Modificado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Transporte';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: 'Ud. está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_transporte + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroTransporte(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: 'Transporte ' + hecho + '!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
              return;
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al ' + accion + ' el ' + entidad }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  openPopUpAsignarZonaChofer(data: any = {}) {
    let title = 'Asignar zona a choferes';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AsignacionZonaChoferComponent, {
      width: '320px',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        this.centrosService.postZonaChofer(res)
          .subscribe(data => {
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.alertService.confirm({ message: '¡Zona Asignada!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });

      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: 'Está seguro que desea Eliminar el Transporte: ' + row.nombre_transporte + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteCentroTransporte(row.id_transporte)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: 'Transportista Eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este transportista no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil - Transportista';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

}
