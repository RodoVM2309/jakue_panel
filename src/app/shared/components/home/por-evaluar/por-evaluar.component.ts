import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { CentrosService } from './../../../../shared/services/centros.service';
import { InfoPersonaComponent } from '../../../../views/admin/personas/info-persona/info-persona.component';
import { InfoPedidoComponent} from './info-pedido/info-pedido.component';
import { Page } from '../../../../shared/models/page';
import { ChoferPorEvaluar } from '../../../../shared/models/chofer_por_evaluar';
import {EvaluarComponent} from './evaluar/evaluar.component';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { NomencladoresService } from '../../../services/nomencladores.service';


@Component({
  selector: 'app-por-evaluar',
  templateUrl: './por-evaluar.component.html',
  styleUrls: ['./por-evaluar.component.scss']
})
export class PorEvaluarComponent implements OnInit {
  public choferes: ChoferPorEvaluar[];
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
  
  constructor(private centrosService: CentrosService,
     public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, 
    private confirmService: AppConfirmService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService, 
    private alertService: AppAlertService,
    private nomencladoresService: NomencladoresService) {
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

  
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro == undefined) {
      this.filtro = '';
    }
    this.ELEMENT_DATA = [];
    this.centrosService.getChoferesPorEvaluar(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.choferes = pagedData.data;
      

    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase(); 
    const temp = this.choferes.filter(function (d) {
      return d.nombre_chofer.toLowerCase().indexOf(val) !== -1 || !val;
    
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
      data: { title: title, payload: { id: data.id_chofer } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  openPopUpEvaluar(data: any = {}) {
    let title = 'Evaluar';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EvaluarComponent, {
      width: '300px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_viaje } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        if (res.evaluacion > 0) {
          this.nomencladoresService.putViajeCamion(res)
            .subscribe(data1 => {
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: 'La evaluación del chofer se ha registrado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Error al evaluar ' });
              });
        }      
      });
  }
  openPopUpInfoPedido(data: any = {}) {
    let title = 'Información del Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPedidoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_pedido } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }


  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la evaluación del chofer: '+ row.nombre_chofer+' ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          row.evaluacion = 0;
          this.nomencladoresService.putViajeCamion(row)
            .subscribe(data => {
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('El chofer se ha eliminado de la lista por evaluar!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este chofer no se puede eliminar de la lista por evaluar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }


}