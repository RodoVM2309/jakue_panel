import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { CentroCorredor } from './../../../shared/models/centro';
import { VincularCorredorComponent } from './vincular-corredor/vincular-corredor.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-vincular-centro-corredor',
  templateUrl: './vincular-centro-corredor.component.html',
  styleUrls: ['./vincular-centro-corredor.component.scss']
})
export class VincularCentroCorredorComponent implements OnInit {
  public corredores: CentroCorredor[];
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
  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
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
    this.centrosService.getCorredoresByIdCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.corredores = pagedData.data;
      for (let i = 0; i < this.corredores.length; i++) {
        this.corredores[i].desc_bloqueado = (this.corredores[i].bloqueado === 0) ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUpVincular() {
    let title = 'Agregar Corredor';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularCorredorComponent, {
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
        this.centrosService.postCentroCorredor(res)
          .subscribe(data => { 
            if (this.loader !== null) {
              this.loader.close();
            }
            this.corredores.unshift(data);
            this.setPage({ offset: 0 });           
            this.snack.open('Corredor agregado al centro!', 'OK', { duration: 4000 });
            return;
          });
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Corredor';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: 'Ud. está seguro de ' + accion + ' el ' + entidad + ': ' + row.nombre_corredor + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.centrosService.updateCentroCorredor(row)
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
    this.confirmService.confirm({ message: 'Está seguro que desea eliminar del centro el Corredor: ' + row.nombre_corredor + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteCentroCorredor( row.id_corredor)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.snack.open('Corredor eliminado del centro!', 'OK', { duration: 4000 });
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
    let title = 'Información del perfil - Corredor';
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