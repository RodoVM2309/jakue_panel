import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { CentrosService } from './../../../../shared/services/centros.service';
import { InfoPersonaComponent } from '../../../../views/admin/personas/info-persona/info-persona.component';
import { Page } from '../../../../shared/models/page';

import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';

export class ChoferZona {
  id: number;
  nombre_persona: string;
  patente: string;
  patente_acoplado: string;
  nombre_transportista: string;
  nombre_intermediario: string;
  nombre_zona: string;
  app_instalada: number;
  longitud: number;
  latitud: number;
  estado: string;
  desc_app: string;
};



@Component({
  selector: 'app-flota-intermediario',
  templateUrl: './flota-intermediario.component.html',
  styleUrls: ['./flota-intermediario.component.scss']
})
export class FlotaIntermediarioComponent implements OnInit {
  public choferes: ChoferZona[];
  page = new Page();
  ELEMENT_DATA = [];
  public getItemSub: Subscription;
  public filtro;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
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
    if (this.filtro == undefined) {
      this.filtro = '';
    }
    this.ELEMENT_DATA = [];
    this.centrosService.getChoferesIntermediario(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      if (pagedData.data.length !== 0) {
        for (let j = 0; j < pagedData.data.length; j++) {
          if (pagedData.data[j].choferes.length !== 0) {
            for (let i = 0; i < pagedData.data[j].choferes.length; i++) {
              this.ELEMENT_DATA.push(
                {
                  id: pagedData.data[j].choferes[i].id,
                  nombre_persona: pagedData.data[j].choferes[i].nombre_persona,
                  patente: pagedData.data[j].choferes[i].patente,
                  patente_acoplado: pagedData.data[j].choferes[i].patente_acoplado,
                  nombre_transportista: pagedData.data[j].choferes[i].nombre_transportista,
                  nombre_intermediario: pagedData.data[j].intermediario.razon_social,
                  nombre_zona: pagedData.data[j].choferes[i].nombre_zona,
                  app_instalada: pagedData.data[j].choferes[i].app_instalada,
                  longitud: pagedData.data[j].choferes[i].longitud,
                  latitud: pagedData.data[j].choferes[i].latitud,
                  estado: pagedData.data[j].choferes[i].estado,
                  desc_app: '',
                  id_usuario:pagedData.data[j].choferes[i].id_usuario
                });
            }
          }
        }
        this.choferes = this.ELEMENT_DATA;
        for (let i = 0; i < this.choferes.length; i++) {
          this.choferes[i].desc_app = (this.choferes[i].app_instalada === 0 || this.choferes[i].app_instalada === null) ? 'No' : 'Si';
        }
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.choferes.filter(function (d) {
      return d.nombre_persona.toLowerCase().indexOf(val) !== -1 || !val;
    
    });
    this.choferes = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    }
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil';
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
