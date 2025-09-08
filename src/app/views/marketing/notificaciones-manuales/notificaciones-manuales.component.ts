import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { Page } from '../../../shared/models/page';
import { Chofer } from "../../../shared//models/chofer";
import { Grupo_Notificacion } from '../../../shared/models/grupo_notificacion';
import { SendsmsService } from './../../../shared/services/sendsms.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { MarketingService } from 'app/shared/services/marketing.service';
import { AddGrupoComponent } from './add-grupo/add-grupo.component';
import { ChoferesNotificacionComponent } from './choferes-notificacion/choferes-notificacion.component';
import { AddSmsComponent } from "../../../shared/components/home/asignar-viaje/add-sms/add-sms.component";

@Component({
  selector: 'app-notificaciones-manuales',
  templateUrl: './notificaciones-manuales.component.html',
  styleUrls: ['./notificaciones-manuales.component.scss']
})
export class NotificacionesManualesComponent implements OnInit {
  grupos: Grupo_Notificacion[];
  page = new Page();
  public getItemSub: Subscription;
  choferesNotificacion: Chofer[];
  constructor(private marketingService: MarketingService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService, private smsService: SendsmsService, ) {
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
    this.loader.open();

    this.marketingService.getAllGrupos(this.page.pageNumber).subscribe(pagedData => {
      this.loader.close();
      this.grupos = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    },
      err => {
        this.loader.close();
      }
    );

  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Grupo' : 'Modificar Grupo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddGrupoComponent, {
      width: '520px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open(res);
        if (isNew) {
          this.marketingService.postGrupo(res)
            .subscribe(data => {
              this.grupos.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({ message: '¡Grupo Agregado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Este Grupo ya se encuentra ingresado.' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.marketingService.updateGrupo(res)
            .subscribe(data => {
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({ message: '¡Grupo Modificado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Grupo no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  openPopUpChoferes(data: any = {}) {
    let title = 'Listado de Choferes del Grupo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ChoferesNotificacionComponent, {
      width: '90vw',
      height: '93vh',
      disableClose: false,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: 'Está seguro de eliminar el grupo: ' + row.nombre + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.marketingService.deleteGrupo(row.id)
            .subscribe(data => {
              this.setPage({ offset: 0 });
              this.loader.close();
              this.alertService.confirm({ message: 'Grupo Eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Grupo no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  openPopUpSendNotificaciones(data: any = {}) {
    const title = "Notificaciones a los Choferes";
    this.loader.open();
    this.marketingService.getFiltroChoferes(1, data.id)
      .subscribe(pagedData => {
        this.choferesNotificacion = pagedData.data;
        this.loader.close();
        let cantChoferesSend = 0;
        let isError = false;
        if (this.choferesNotificacion.length === 0) {
          this.atencionService
            .confirm({
              message: "No existen choferes que cumplan las condiciones."
            })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        } else {
          this.loader.close();
          const dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
            width: "720px",
            disableClose: true,
            data: { title: title, payload: data }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (!res) {
              // If user press cancel
              return;
            }
            let datos = {
              id_grupo:data.id,
              mensaje: res.mensaje
            } 
            this.marketingService.postNotificacionesGrupo(datos)
              .subscribe(data => {
                
                if (this.loader !== null) {
                  this.loader.close();
                };
                this.alertService.confirm({title:'¡Notificiones enviadas!', message: ' ' +data.data.message, tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              },
                err => {
                  this.loader.close();
                  this.atencionService.confirm({ message: 'Errores al enviar las notificaciones.' }).subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
                });


          })
        }
      },
        err => {
          this.loader.close();
        }
      );
  }
}
