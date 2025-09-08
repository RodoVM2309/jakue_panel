import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';

import { EstadoViaje } from '../../../models/estadoViaje';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';

import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';

export class Entregador1 {
  id: number;
  id_entregador: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: number;
  nombre_entregador: string;
};

export class Corredor1 {
  id: number;
  id_corredor: number;
  nombre_corredor: string;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
};

@Component({
  selector: 'app-configuracion-centro',
  templateUrl: './configuracion-centro.component.html',
  styleUrls: ['./configuracion-centro.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    }
  ]
})

export class ConfiguracionCentroComponent implements OnInit {

  estadosViaje: EstadoViaje[];
  id_zona_pedido: 0;
  id_destinoInicial = 0;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfiguracionCentroComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService,
     ) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    let id = (item.id !== null) ? item.id : '';
    let fecha = (item.fecha !== null) ? item.fecha : '';
    let carta_porte = (item.carta_porte !== null) ? item.carta_porte : '';
    let cupo = (item.cupo !== null) ? item.cupo : '';

    this.itemForm = this.fb.group({
      id: [id],
      fecha: [fecha, Validators.required],
      carta_porte: [carta_porte, Validators.required],
      cupo: [cupo, Validators.required]
    });
  }

  getItems() {
    this.getPedido();

  }
  getPedido() {
    this.getItemSub = this.nomencladoresService.getPedido(this.data.payload.id_pedido)
      .subscribe(data => {
        this.id_zona_pedido = data.data.id_zona_destino;
      });
  }

  submit() {
    if (this.itemForm.value.id_corredor == 0) {
      this.itemForm.value.id_corredor = null;
    }
    if (this.itemForm.value.id_entregador == 0) {
      this.itemForm.value.id_entregador = null;
    }
    this.dialogRef.close(this.itemForm.value);
  }
  get f() { return this.itemForm.controls; }
 }
