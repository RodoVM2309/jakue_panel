import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {  Subscription, of } from 'rxjs';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { HomeService } from '../home.service';

import { Destinatario } from '../../../models/destinatario';
import { Destino } from '../../../models/destino';
import { Entregador } from '../../../models/entregador';
import { Corredor } from '../../../models/corredor';
import { EstadoViaje } from '../../../models/estadoViaje';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';

import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { UserService } from 'app/shared/services/user.service';

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
  selector: 'app-confirm-carga-parametros',
  templateUrl: './confirm-carga-parametros.component.html',
  styleUrls: ['./confirm-carga-parametros.component.scss'],
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




export class ConfirmCargaParametrosComponent implements OnInit {
  id_destino: string = '';
  destinos: Destino[];
  selectedDestinatario: string = '';
  destinatarios: Destinatario[];
  entregadores: Entregador[];
  entregadornulo: Entregador1;
  corredores: Corredor[];
  corredornulo: Corredor1;
  estadosViaje: EstadoViaje[];
  id_zona_pedido: 0;
  id_observador: number;
  id_centro: string;
  minDate: any;
  id_destinoInicial = 0;
  updateFecha=false;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCargaParametrosComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService, 
    private homeService: HomeService,
   private atencionService: AppAtencionService,
    private alertService: AppAlertService,
    private userService: UserService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.id_centro = data.data);   
    if(this.data.payload.fecha_cupo !== null){
      this.minDate = this.data.payload.fecha_cupo;
      
    }
  }
  buildItemForm(item) {
    const id = (item.id !== null) ? item.id : '';
    const destinatario = (item.id_destinatario !== null) ? item.id_destinatario : '';
    const entregador = (item.id_entregador !== null) ? item.id_entregador : (item.id_destinatario !== null) ? 0 : '';
    const corredor = (item.id_corredor !== null) ? item.id_corredor : (item.id_destinatario !== null) ? 0 : '';
    const fecha_cupo =(item.fecha_cupo !== null) ?  this.homeService.formatoFecha(item.fecha_cupo,"amd", "-") : '';
    this.updateFecha =(fecha_cupo !== "") ?  true : false;
    this.id_observador = item.id_observador_viaje;  
    this.itemForm = this.fb.group({
      id: [id],
      id_destinatario: [destinatario, Validators.required],
      id_entregador: [entregador, Validators.required],
      id_corredor: [corredor, Validators.required],
      fecha_cupo: [fecha_cupo, Validators.required],
      fecha_cupo_disabled: [fecha_cupo]
    })
  }

  getItems() {
    this.getPedido();

  }
  getPedido() {
    this.getItemSub = this.nomencladoresService.getPedido(this.data.payload.id_pedido)
      .subscribe(data => {
        this.id_zona_pedido = data.data.id_zona_destino;
        this.getItemsEstadoViaje();
      })
  }
  getItemsEstadoViaje() {
    this.getItemSub = this.nomencladoresService.getAllEstadoViaje()
      .subscribe(data => {
        this.estadosViaje = data.data;
        this.getItemsDestinatario();
      });
  }
  getItemsEntregador() {
    let valor:string;
    /* if(this.id_observador>0 ){
      valor = this.id_observador.toString();
    }else {
        valor = this.id_centro;
      } */
    this.getItemSub = this.nomencladoresService.getEntregadorByCentroSelect()
      .subscribe(data => {
        this.entregadores = data.data;
        this.entregadornulo = {
          id: 0,
          id_entregador: 0,
          id_rol: 0,
          id_usuario: 0,
          nombre_entregador: 'NO INTERVIENE',
          nombre_persona: 'NO INTERVIENE',
          direccion_persona: '',
          localidad_persona: '',
          nombre_rol: '',
          cuit_persona: 0
        };
        this.entregadores.push(this.entregadornulo);
        this.getItemsCorredor();
      })
  }
  getItemsDestinatario() {
    let valor:string;/* 
    if(this.id_observador>0){
      valor = this.id_observador.toString();
    }else
      valor = this.id_centro; */
    this.getItemSub = this.nomencladoresService.getDestinatarioByCentroSelect()
      .subscribe(data => {
        this.destinatarios = data.data;
        this.getItemsEntregador();
      })
  }
  getItemsCorredor() {
    let valor:string;/* 
    if(this.id_observador> 0){
      valor = this.id_observador.toString();
    }else
      valor = this.id_centro; */
    this.getItemSub = this.nomencladoresService.getCorredorByCentroSelect()
      .subscribe(data => {
        this.corredores = data.data;
        this.corredornulo = {
          id: 0,
          id_corredor: 0,
          id_rol: 0,
          id_usuario: 0,
          nombre_persona: '',
          direccion_persona: '',
          localidad_persona: '',
          nombre_rol: '',
          nombre_corredor: 'NO INTERVIENE'
        }
        this.corredores.push(this.corredornulo);
      })
  }
  submit() {
    if(this.itemForm.value.id_corredor == 0){
      this.itemForm.value.id_corredor = null;
    }
    if(this.itemForm.value.id_entregador == 0){
      this.itemForm.value.id_entregador = null;
    }
    this.dialogRef.close(this.itemForm.value)
  }
  get f() { return this.itemForm.controls; }

  analisisZona() {
    let idZonaDestino = 0;
    this.destinos.forEach(element => {
      if (element.id_persona_rol == this.f.id_destino.value)
        idZonaDestino = element.id_zona_destino;

    });
    /*if ( this.id_destinoInicial != this.f.id_destino.value) {
      this.alertService.confirm({ message: 'Ha seleccionado un destino diferente al destino inicial' })
      .subscribe(res => {
        if (res) {
          return
        }
      });
    }*/
    if (idZonaDestino == this.id_zona_pedido) {
      this.atencionService.confirm({ message: 'Ha seleccionado un Destino fuera de la Zona del Destino actual' })
        .subscribe(res => {
          if (res) {
            return
          }
        });
    }
  }

}
