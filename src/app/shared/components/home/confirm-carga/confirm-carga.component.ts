import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';

import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { HomeService } from '../home.service';

import { EstadoViaje } from '../../../models/estadoViaje';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/helpers/date.adapter';

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
  selector: 'app-confirm-carga',
  templateUrl: './confirm-carga.component.html',
  styleUrls: ['./confirm-carga.component.scss'],
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

export class ConfirmCargaComponent implements OnInit {

  estadosViaje: EstadoViaje[];
  id_zona_pedido: 0;
  id_destinoInicial = 0;
  updateCupo=false;
  updateCarta_porte=false;
  updateFecha=false;
  updateForm= false;
  editarCupo=false;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCargaComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService,
    private homeService:HomeService, private errorService: AppErrorService, 
    private atencionService: AppAtencionService, private alertService: AppAlertService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    let id = (item.id !== null) ? item.id : '';
    let fecha = (item.fecha !== null) ? item.fecha : '';
    let carta_porte = (item.carta_porte !== null) ? item.carta_porte : '';    
    let cupo = (item.cupo !== null) ? item.cupo : '';
    this.updateCupo = (item.id_cupo !== null) ? true : false;
    this.updateCarta_porte = carta_porte !== '' ? false : false;
    this.updateFecha = fecha !== '' ? true : false;
    this.updateForm = this.updateCupo && this.updateFecha && this.updateCarta_porte ? true : false;

    this.itemForm = this.fb.group({
      id: [id],
      fecha: [fecha, Validators.required],
      fecha_disabled: [this.homeService.formatoFecha(fecha,"amd", "-")],
      carta_porte: [carta_porte,[Validators.required,
        Validators.pattern("^[0-9]*$")]],
      carta_porte_disabled: [carta_porte],
      cupo: [cupo, Validators.required],
      cupo_disabled: [cupo]
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
