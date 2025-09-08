import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { CentroOperador } from './../../../shared/models/centro';
import { VincularOperadorComponent } from './vincular-operador/vincular-operador.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { PersonasService } from './../../../shared/services/personas.service';
import { Person } from './../../../shared/models/person';
import { AddPersonaComponent } from './../personas/add-persona/add-persona.component';

@Component({
  selector: 'app-vincular-centro-operador',
  templateUrl: './vincular-centro-operador.component.html',
  styleUrls: ['./vincular-centro-operador.component.scss']
})
export class VincularCentroOperadorComponent implements OnInit {
  public personas: Person[];
  public operadores: CentroOperador[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  public filtroCuit;
  public cliente: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  constructor(private personasService: PersonasService, 
    private errorService: AppErrorService, 
    private atencionService: AppAtencionService, 
    private centrosService: CentrosService, 
    public router: Router, 
    private dialog: MatDialog,
    private snack: MatSnackBar, 
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, 
    private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;

  }

  ngOnInit() {
    //this.getItems();
    this.cliente = localStorage.getItem('clienteMuvin');
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
    if (this.filtroCuit == undefined) {
      this.filtroCuit = '';
    }
    this.centrosService.getOperadoresByIdCentro(this.page.pageNumber, this.filtro, this.filtroCuit).subscribe(pagedData => {
      this.operadores = pagedData.data;
      for (let i = 0; i < this.operadores.length; i++) {
        this.operadores[i].desc_bloqueado = (this.operadores[i].bloqueado === 0) ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUpVincular() {
    let title = 'Agregar Operador';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularOperadorComponent, {
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
        this.centrosService.postCentroOperador(res)
          .subscribe(data => {
            this.operadores.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Operador agregado al centro!', 'OK', { duration: 4000 });
            return;
          });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Operador';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: '¿Está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_operador + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroOperador(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.snack.open(entidad + ' ' + hecho + '!', 'OK', { duration: 4000 });
              return;
            }, err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error ocurrido al ' + accion + ' el ' + entidad + ' ' + err });

            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: 'Está seguro que desea eliminar del centro el Operador: ' + row.nombre_operador + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteCentroOperador( row.id_operador)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.snack.open('Operador eliminado del centro!', 'OK', { duration: 4000 });
              return;
            });
        }
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  updateFilterCUIT(event) {
    const val = event.target.value.toLowerCase();
    this.filtroCuit = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil- Operador';
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
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Persona' : 'Modificar Persona';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
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
        this.loader.open(res);
        if (isNew) {
          this.personasService.postPersona(res)
            .subscribe(data => {
              this.personas.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({ message: '¡Persona Agregada!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Esta Persona ya se encuentra ingresada.' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.personasService.updatePersona(res)
            .subscribe(data => {
              this.personas = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({ message: '¡Persona Modificada!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Esta Persona no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
}