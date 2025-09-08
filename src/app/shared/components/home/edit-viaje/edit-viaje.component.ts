import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { NomencladoresService } from '../../../services/nomencladores.service';

import { Destinatario } from '../../../models/destinatario';
import { Destino } from '../../../models/destino';
import { Entregador } from '../../../models/entregador';
import { Corredor } from '../../../models/corredor';
import { EstadoViaje } from '../../../models/estadoViaje';

@Component({
  selector: 'app-edit-viaje',
  templateUrl: './edit-viaje.component.html',
  styleUrls: ['./edit-viaje.component.scss']
})
export class EditViajeComponent implements OnInit {
  id_destino: string = '';
  destinos: Destino;
  selectedDestinatario: string = '';
  destinatarios: Destinatario;
  entregadores: Entregador;
  corredores: Corredor;
  estadosViaje:EstadoViaje;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditViajeComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);


  }
  buildItemForm(item) {
    let id = (item.id !== null) ? item.id : '';
    //let fecha = (item.fecha !== null) ?item.fecha : '';
    let id_destino = (item.id_destino !== null) ? item.id_destino : '';
    let destinatario = (item.id_destinatario !== null) ? item.id_destinatario : '';
    let entregador = (item.id_entregador !== null) ? item.id_entregador : '';
  //  let id_estado_viaje = (item.id_estado_viaje !== null) ? item.id_estado_viaje : '';
    let corredor = (item.id_corredor !== null) ? item.id_corredor : '';
    let carta_porte = (item.carta_porte!== null) ? item.carta_porte : '';
    let cupo = (item.cupo!== null) ? item.cupo : '';
    this.itemForm = this.fb.group({
      id: [id],
      id_destino: [id_destino],
      id_destinatario: [destinatario],
      id_entregador: [entregador],
      id_corredor: [corredor],
      carta_porte:[carta_porte],
      cupo:[cupo]

    })
  }
  
  getItems() {
    this.getItemsDestino();
    this.getItemsDestinatario();
    this.getItemsEntregador();
    this.getItemsCorredor();

  }
  getItemsDestino() {
    this.getItemSub = this.nomencladoresService.getAllDestinos()
      .subscribe(data => {
        this.destinos = data.data;
      })
  }
  getItemsEntregador() {
    this.getItemSub = this.nomencladoresService.getAllEntregador()
      .subscribe(data => {
        this.entregadores = data.data;
      })
  }
  getItemsDestinatario() {
    this.getItemSub = this.nomencladoresService.getAllDestinatario()
      .subscribe(data => {
        this.destinatarios = data.data;
      })
  }
  getItemsCorredor() {
    this.getItemSub = this.nomencladoresService.getAllCorredor()
      .subscribe(data => {
        this.corredores = data.data;
      })
  }
 
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
