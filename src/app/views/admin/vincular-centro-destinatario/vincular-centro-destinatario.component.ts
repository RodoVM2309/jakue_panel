import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { CentroDestinatario } from './../../../shared/models/centro';
import { VincularDestinatarioComponent } from './vincular-destinatario/vincular-destinatario.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-vincular-centro-destinatario',
  templateUrl: './vincular-centro-destinatario.component.html',
  styleUrls: ['./vincular-centro-destinatario.component.scss']
})
export class VincularCentroDestinatarioComponent implements OnInit {
  public destinatarios: CentroDestinatario[];
  page = new Page();
  public getItemSub: Subscription;
  public  filtro;
  public cliente: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  constructor(
    private centrosService: CentrosService,
    public router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService: AppAlertService
  ) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }
  ngOnInit() {
      this.cliente = localStorage.getItem('clienteMuvin');
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
      this.centrosService.getDestinatarioByIdCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
        this.destinatarios = pagedData.data;
        for (let i = 0; i < this.destinatarios.length; i++) {
          this.destinatarios[i].desc_bloqueado = (this.destinatarios[i].bloqueado === 0) ? 'NO' : 'SI';
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  openPopUpVincular() {
    let title = 'Agregar destinatario';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularDestinatarioComponent, {
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
        this.centrosService.postCentroDestinatario(res)
          .subscribe(data => {
            this.destinatarios.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Destinatario agregado al centro!', 'OK', { duration: 4000 });
            return;
          });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Destinatario';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: 'Ud. está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_destinatario + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroDestinatario(row)
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
    this.confirmService.confirm({ message: 'Está seguro que desea eliminar del centro el destinatario: ' + row.nombre_destinatario + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteCentroDestinatario( row.id_destinatario)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.snack.open('Destinatario eliminado del centro!', 'OK', { duration: 4000 });
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
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil - Destinatario';
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
