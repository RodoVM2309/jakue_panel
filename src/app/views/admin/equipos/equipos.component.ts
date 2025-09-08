import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { EquiposService } from './../../../shared/services/equipos.service';
import { Equipo } from './../../../shared/models/equipo';
import { AddEquipoComponent } from './add-equipo/add-equipo.component';
import { Page } from '../../../shared/models/page';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss']
})
export class EquiposComponent implements OnInit {
  equipos: Equipo[];
  page = new Page();
  public getItemSub: Subscription;

  constructor(private dialog: MatDialog, private confirmService: AppConfirmService,
    private alertService: AppAlertService, private loader: AppLoaderService,
    private errorService: AppErrorService, 
    private equipoService: EquiposService) {
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

   setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.equipoService.getAllEquipos(this.page.pageNumber).subscribe(pagedData => {
        this.equipos = pagedData.data;        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Equipo' : 'Modificar Equipo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddEquipoComponent, {
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

          this.equipoService.postEquipo(res)
            .subscribe(data => {
              this.equipos.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Equipo agregado correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Este Equipo no se pudo agregar' });
            });
        } else {
          this.equipoService.updateEquipo(res)
            .subscribe(data => {
              this.equipos = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Equipo modificado correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });              
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este equipo no se pudo modificar' });
              });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el Equipo con Camión: ' + row.nombre_marca_camion + ' ' + row.nombre_tipo_camion + ' ' + row.patente_camion + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.equipoService.deleteEquipo(row.id)
            .subscribe(data => {
              this.loader.close();
              this.equipos = data;
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: '¡Equipo eliminado correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Equipo no se pudo eliminar' });
              });
        }
      });
  }

  bloquearEquipo(row) {
    this.confirmService.confirm({
      message: 'Está seguro de bloquear el Equipo: ' +
        row.nombre_marca_camion + ' ' + row.nombre_tipo_camion + ' ' + row.patente_camion +  '?'
    })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.equipoService.postBloquearEquipo(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Equipo Bloqueado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al bloquear el Equipo '});
            })
        }
      });
  }

  desBloquearEquipo(row) {
    this.confirmService.confirm({ message: 'Está seguro de desbloquear el Equipo: ' + row.nombre_marca_camion + ' ' + row.nombre_tipo_camion + ' ' + row.patente_camion + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.equipoService.postDesBloquearEquipo(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Equipo desbloqueado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al desbloquear el Equipo '});
            })
        }
      });
  }
}
