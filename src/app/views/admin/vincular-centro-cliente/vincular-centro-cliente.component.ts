import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { CentroCliente } from './../../../shared/models/centro';
import { VincularClienteComponent } from './vincular-cliente/vincular-cliente.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-vincular-centro-cliente',
  templateUrl: './vincular-centro-cliente.component.html',
  styleUrls: ['./vincular-centro-cliente.component.scss']
})
export class VincularCentroClienteComponent implements OnInit {
  public clientes: CentroCliente[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  public cliente: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  searchCargador: FormControl;

  constructor(private centrosService: CentrosService,
    public router: Router, private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.searchCargador = new FormControl();
    this.searchCargador.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        valor => {
          this.filtro = valor.toLowerCase();
          this.setPage({ offset: 0 });
        });
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
    };
    this.loader.open('Por favor espere..','Buscando cargadores...');
    this.centrosService.getClientesByIdCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.clientes = pagedData.data;
      this.loader.close();
      for (let i = 0; i < this.clientes.length; i++) {
        this.clientes[i].desc_bloqueado = (this.clientes[i].bloqueado === 0) ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    },
    err => {
      this.loader.close();     
    });
  }
  openPopUpVincular() {
    let title = 'Agregar Cargador';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularClienteComponent, {
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
        this.loader.open('Por favor espere..','Agregando cargador...')
        this.centrosService.postCentroCliente(res)
          .subscribe(data => {
            this.loader.close();
            this.clientes.unshift(data);
            this.setPage({ offset: 0 });            
            this.alertService.confirm({ message: '¡Cargador agregado!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          },
            err => {
              this.loader.close();
              this.atencionService.confirm({ message: 'No se pudo agregar el cargador.' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Cargador';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: 'Ud. está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_cliente + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroCliente(row)
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
              this.errorService.confirm({ message: 'Error ocurrido al ' + accion + ' el ' + entidad + ' ' + err });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro que desea eliminar del centro el cargador: ' + row.nombre_cliente + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open('Por favor espere..','Eliminando cargador...');
          this.centrosService.deleteCentroCliente(row.id_cliente)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: '¡Cargador eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo eliminar el Cargador' }).subscribe(res => {
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
    /* const temp = this.corredores.filter(function (d) {
      return d.nombre_corredor.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.corredores = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    } */
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil - Cliente';
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
