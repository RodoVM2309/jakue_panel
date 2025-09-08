import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {  Subscription} from 'rxjs';
import { NomencladoresService } from '../../../services/nomencladores.service';

import { Destinatario } from '../../../models/destinatario';
import { Destino } from '../../../models/destino';
import { Entregador } from '../../../models/entregador';
import { Corredor } from '../../../models/corredor';
import { EstadoViaje } from '../../../models/estadoViaje';
import { DesvioMotivo } from '../../../models/desvioMotivo';
import { Desvio } from '../../../models/desvio';

@Component({
  selector: 'app-desvio',
  templateUrl: './desvio.component.html',
  styleUrls: ['./desvio.component.scss']
})
export class DesvioComponent implements OnInit {

  id_destino =  0;
  destinos: Destino;
  destinos1: Destino;
  selectedDestinatario = '';
  destinatarios: Destinatario;
  entregadores: Entregador;
  corredores: Corredor;
  estadosViaje: EstadoViaje;
  desviosMotivo: DesvioMotivo;
  desvio: Desvio[];
  id_desvio_motivo = 0;
  idDesvio = 0;
  observaciones = '';
  id_destinoDesvio = 0;
  errorValidacion = false;
  newDesvio = true;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DesvioComponent>,
    private fb: FormBuilder, 
    private nomencladoresService: NomencladoresService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
  }
  
  buildItemForm(item) {
    const id = (item.id !== null) ? item.id : '';
    const idDesvio = (item.idDesvio !== null) ? this.idDesvio : '';
    const destino = (item.id_destino !== null) ? item.id_destino : '';
    const destinatario = (item.id_destinatario !== null) ? item.id_destinatario : '';
    const entregador = (item.id_entregador !== null) ? item.id_entregador : '';
    const corredor = (item.id_corredor !== null) ? item.id_corredor : '';
    const carta_porte = (item.carta_porte !== null) ? item.carta_porte : '';
    const cupo = (item.cupo !== null) ? item.cupo : '';
    const id_estado_viaje = (item.id_estado_viaje !== null) ? item.id_estado_viaje : '';
    const desvio_motivo = (this.id_desvio_motivo !== null) ? this.id_desvio_motivo : '';
    const destinoDesvio = (this.id_destinoDesvio !== null) ? this.id_destinoDesvio : '';
    const obser = (this.observaciones !== null) ? this.observaciones : '';

    this.itemForm = this.fb.group({
      id: [id, {disabled: true}],
      idDesvio: [idDesvio, {disabled: true}],
      isNew: [this.newDesvio, {disabled: true}],
      id_estado_viaje: [id_estado_viaje],
      id_destino: [destino],
      id_destinatario: [destinatario],
      id_entregador: [entregador],
      id_corredor: [corredor],
      carta_porte: [carta_porte],
      cupo: [cupo],
      id_desvio_motivo: [desvio_motivo, Validators.required],
      id_newDestino: [destinoDesvio, Validators.required],
      observaciones: [obser, Validators.required]
    });
  }

  getItems() {
    this.getItemsEstadoViaje();
    this.getItemsDestino();
    this.getItemsDestinatario();
    this.getItemsEntregador();
    this.getItemsCorredor();
    this.getItemsDesvioMotivo();

  }
  
  getItemsEstadoViaje() {
    this.getItemSub = this.nomencladoresService.getAllEstadoViaje()
      .subscribe(data => {
        this.estadosViaje = data.data;
      });
  }
  getItemsDestino() {
    this.getItemSub = this.nomencladoresService.getAllDestinosSelect()
      .subscribe(data => {
        this.destinos = this.destinos1 = data.data;
      });
  }
  getItemsEntregador() {
    this.getItemSub = this.nomencladoresService.getEntregadorByCentroSelect()
      .subscribe(data => {
        this.entregadores = data.data;
      });
  }
  getItemsDestinatario() {
    this.getItemSub = this.nomencladoresService.getDestinatarioByCentroSelect()
      .subscribe(data => {
        this.destinatarios = data.data;
      });
  }
  getItemsCorredor() {
    this.getItemSub = this.nomencladoresService.getCorredorByCentroSelect()
      .subscribe(data => {
        this.corredores = data.data;
      });
  }
  getItemsDesvioMotivo() {
    this.getItemSub = this.nomencladoresService.getAllDesviosMotivo()
      .subscribe(data => {
        this.desviosMotivo = data.data;
      });
  }
  get f() { return this.itemForm.controls; }
  submit() {
    if (this.f.id_newDestino.value === this.f.id_destino.value) {
      this.errorValidacion = true;
      return;

    }
    this.dialogRef.close(this.itemForm.value)
  }


}
