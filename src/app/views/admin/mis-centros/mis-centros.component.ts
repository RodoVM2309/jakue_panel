import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar, MatRadioChange } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from '../../../shared/services/centros.service';
import { Centro } from '../../../shared/models/centro';

import { NomencladoresService } from '../../../shared/services/nomencladores.service';

import { InfoPersonaComponent } from '../../../views/admin/personas/info-persona/info-persona.component';


import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-mis-centros',
  templateUrl: './mis-centros.component.html',
  styleUrls: ['./mis-centros.component.scss']
})
export class MisCentrosComponent implements OnInit {
  public centros: Centro[];
 
  public getItemSub: Subscription;
  
  selectSituacion: string;
  selectedDestino: Centro;
  temp = [];
  constructor( public router: Router, private dialog: MatDialog,
     private nomecladoresServices: NomencladoresService
     ) {
    
  }

  ngOnInit() {
    this.getItemsCentro();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getItemsCentro() {
    this.getItemSub = this.nomecladoresServices.getMisCentros()
      .subscribe(data => {
        this.centros = data.data;
      })
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  updateFilter(event) {
   
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.centros = rows;
  }  
}
