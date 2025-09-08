import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatProgressBar, MatButton, MatSelect, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription, from } from 'rxjs';

import { TransporteChoferService } from './../../../shared/services/transporte-chofer.service';
import { PersonasService } from './../../../shared/services/personas.service';
import { TransporteChofer } from './../../../shared/models/transporte-chofer';
import { VincularChoferComponent } from './vincular-chofer/vincular-chofer.component';
import {AsignacionAliasChoferComponent} from './asignacion-alias-chofer/asignacion-alias-chofer.component';
import { VincularEquipoComponent } from './vincular-equipo/vincular-equipo.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';
import { SendsmsService } from './../../../shared/services/sendsms.service';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-vincular-transporte-chofer',
  templateUrl: './vincular-transporte-chofer.component.html',
  styleUrls: ['./vincular-transporte-chofer.component.scss']
})
export class VincularTransporteChoferComponent implements OnInit {
  public choferes: TransporteChofer[];
  page = new Page();
  public getItemSub: Subscription;
  public  filtro;
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `
  };
  constructor(private transportechoferService: TransporteChoferService, public router: Router,
    private dialog: MatDialog, public personasService: PersonasService,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private smsService: SendsmsService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private alertService: AppAlertService) {
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
     if(this.filtro == undefined){
        this.filtro = '';
      }
      this.transportechoferService.getAllTransporteChoferes(this.page.pageNumber, this.filtro).subscribe(pagedData => {
        this.choferes = pagedData.data;
        for (let i = 0; i < this.choferes.length; i++) {
          this.choferes[i].desc_bloqueado = (this.choferes[i].bloqueado === 0) ? 'NO' : 'SI';
          this.choferes[i].registrado = (this.choferes[i].registrado_app === 0) ? 'NO' : 'SI';
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

  openPopUpVincular() {
    let title = 'Agregar Chofer';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularChoferComponent, {
      width: '420px',
      disableClose: true,
      data: { title: title }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.transportechoferService.postTransporteChofer(res)
          .subscribe(data => {
            if (data.success) {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Chofer Agregado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            } else {
              this.loader.close();
              this.errorService.confirm({ message: 'No se pudo Agregar el Chofer' });
            }
          }, err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo Agregar el Chofer' });
            return;
          });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'chofer';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: 'Está seguro que desea ' + accion + ' el ' + entidad + ': ' + row.nombre_chofer + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.transportechoferService.updateTransporteChofer(row)
            .subscribe(data => {
              this.loader.close();
             this.setPage({ offset: 0 });
             this.alertService.confirm({ message: entidad + ' ' + hecho + '!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al ' + accion + ' el ' + entidad });
            });
        }
      });
  }

  deleteItem(row) {
    this.loader.open();
    let isCentro= localStorage.getItem("rol") === '3'?true : false;
    this.personasService.getChoferById(row.id_chofer,isCentro)
      .subscribe(data => {
        if (data.success) {
          if (this.loader !== null) {
            this.loader.close();
          }
          if (data.data.chofer.estado === 'Ocupado') {
            this.atencionService.confirm({ message: '¡No se puede Eliminar el Chofer: ' + row.nombre_chofer + ' porque el mismo está en un viaje!' });
            return;
          } else {
            this.confirmService.confirm({ message: '¿Está seguro que desea Eliminar el Chofer: ' + row.nombre_chofer + '?' })
              .subscribe(res => {
                if (res) {
                  this.loader.open();
                  this.transportechoferService.deleteTransporteChofer(row.id_transporte, row.id_chofer)
                    .subscribe(data => {
                      this.loader.close();
                      this.setPage({ offset: 0 });
                      this.alertService.confirm({ message: '¡Chofer Eliminado de la Empresa de Transporte!', tipo: 'exito' }).subscribe(res => {
                        if (res) {
                          return;
                        }
                      });
                    });
                }
              });
          }
        }
      });
  }

  openPopUpAliasChofer(data: any = {}) {
    let title = 'Agregar Alias';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AsignacionAliasChoferComponent, {
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

        this.transportechoferService.updateTransporteChofer(res)
          .subscribe(data => {
            if (data.success) {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Alias agregado al Chofer!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            } else {
              this.errorService.confirm({ message: 'No se pudo agregar un Alias'});
            }
          }, err => {
            this.errorService.confirm({ message: 'No se pudo agregar un Alias'});
            return;
          });


      });
  }

  openPopUpVincularEquipo(data: any = {}) {
    this.loader.open();
    let isCentro= localStorage.getItem("rol") === '3'?true : false;
    this.personasService.getChoferById(data.id_chofer,isCentro)
      .subscribe(data => {
        if (data.success) {
          if (this.loader !== null) {
            this.loader.close();
          }
          if (data.data.chofer.estado === 'Ocupado') {
            this.errorService.confirm({ message: '¡No se puede cambiar de equipo al chofer porque el mismo está en un viaje!'});
            return;
          } else {
            let title = 'Vincular Equipo al Chofer';
            let dialogRef: MatDialogRef<any> = this.dialog.open(VincularEquipoComponent, {
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
                if (res.id !== '') {
                  if (res.id_equipo === 0) {
                    res.id_equipo = null;
                  }
                  this.transportechoferService.updateChoferEquipo(res)
                    .subscribe(data => {
                      if (data.success) {
                        if (this.loader !== null) {
                          this.loader.close();
                        }
                        this.setPage({ offset: 0 });
                        this.alertService.confirm({ message: '¡Chofer actualizado!', tipo: 'exito' }).subscribe(res => {
                          if (res) {
                            return;
                          }
                        });
                      } else {
                        this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
                      }
                    }, err => {
                      this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
                      return;
                    });
                } else {
                  if (res.id_equipo !== 0) {
                    this.transportechoferService.postChoferEquipo(res)
                      .subscribe(data => {
                        if (data.success) {
                          if (this.loader !== null) {
                            this.loader.close();
                          }
                          this.setPage({ offset: 0 });
                          this.alertService.confirm({ message: '¡Chofer actualizado!', tipo: 'exito' }).subscribe(res => {
                            if (res) {
                              return;
                            }
                          });
                        } else {
                          this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
                        }
                      }, err => {
                        this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
                        return;
                      });
                  }
                }

              });
          }
        } else {
          this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
        }
      }, err => {
        this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!'});
        return;
      });



  }

  openPopUpsms(data: any = {}) {
    this.loader.open();
    let message =  "Hola! Te invitamos a Jakue, la comunidad logistica de la Agroindustria. Descargala y accede a los beneficios! http://bit.ly/2PpG6jM";
    let numbers = parseInt(data.celular);
    let contenido = { message: message, number: numbers };
      this.smsService.postSMS(contenido)
      .subscribe(data => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.snack.open('SMS Enviado!', 'OK', { duration: 4000 });
        return;
      },
        err => {
          this.loader.close();
          this.alertService.confirm({ message: 'No se pudieron enviar el SMS' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil - Chofer';
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
