import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

import { Page } from '../../../shared/models/page';
import { CentroIntermediario } from './../../../shared/models/centro';
import { CentrosService } from './../../../shared/services/centros.service';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { VincularIntermediarioComponent } from './vincular-intermediario/vincular-intermediario.component';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

@Component({
  selector: 'app-vincular-centro-intermediario',
  templateUrl: './vincular-centro-intermediario.component.html',
  styleUrls: ['./vincular-centro-intermediario.component.scss']
})
export class VincularCentroIntermediarioComponent implements OnInit {
  public intermediarios: CentroIntermediario[];
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
  searchIntermediario: FormControl;


  constructor(private centrosService: CentrosService,
    public router: Router, private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.searchIntermediario = new FormControl();
    this.searchIntermediario.valueChanges
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
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    this.centrosService.getIntermediarioByIdCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.intermediarios = pagedData.data;
      for (let i = 0; i < this.intermediarios.length; i++) {
        this.intermediarios[i].desc_bloqueado = (this.intermediarios[i].bloqueado === 0) ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
  openPopUpVincular() {
    let title = 'Agregar Transportadora';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularIntermediarioComponent, {
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
        this.centrosService.postCentroIntermediario(res)
          .subscribe(data => {
            this.intermediarios.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.alertService.confirm({ message: '¡Intermediario Agregado!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          },
            err => {
              this.loader.close();
              this.atencionService.confirm({ message: 'No se pudo agregar el Intermediario.' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Intermediario';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: '¿Está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_intermediario + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroIntermediario(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Intermediario ' + hecho + '!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
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

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro que desea eliminar el Intermediario: ' + row.nombre_intermediario + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteCentroIntermediario(row.id_intermediario)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: '¡Intermediario eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'No se pudo eliminar el ¡Intermediario' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil - Transportadora';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',

      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }



}
