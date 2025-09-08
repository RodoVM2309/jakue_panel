import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { DestinosService } from './../../../shared/services/destinos.service';
import { Destino } from './../../../shared/models/destino';
import { SituacionPuertoComponent } from './situacion-puerto/situacion-puerto.component';

@Component({
  selector: 'app-estado-puerto',
  templateUrl: './estado-puerto.component.html',
  styleUrls: ['./estado-puerto.component.scss']
})
export class EstadoPuertoComponent implements OnInit {
  public destinos: Destino[];
  public getItemSub: Subscription;
  constructor(private destinosService: DestinosService, 
    public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {
    this.getItemSub = this.destinosService.getAllDestinosPuertos()
      .subscribe(data => {
        this.destinos = data.data;
        for (let i = 0; i < this.destinos.length; i++) {
          this.destinos[i].desc_bloqueado = (this.destinos[i].bloqueado === 0) ? 'NO' : 'SI';
        }
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.destinos.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.destinos = temp;
    if(val === ''){
      this.getItems();
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = 'Actualizar estado del puerto';
     let dialogRef: MatDialogRef<any> = this.dialog.open(SituacionPuertoComponent, {
      width: '420px',
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
        this.destinosService.updateDestino(res)
          .subscribe(data => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.destinos = data;
            this.getItems();            
            this.snack.open('Puerto Actualizado!', 'OK', { duration: 4000 });
            return;
          });
      });

  }

}
