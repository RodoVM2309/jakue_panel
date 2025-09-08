import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NomencladoresService } from '../../../../services/nomencladores.service';
import { EstadoDescarga } from '../../../../models/estadoDescarga';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';


@Component({
  selector: 'app-add-estado-descarga-retorno',
  templateUrl: './add-estado-descarga-retorno.component.html',
  styleUrls: ['./add-estado-descarga-retorno.component.scss'],
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
export class AddEstadoDescargaRetornoComponent implements OnInit {
  public itemForm: FormGroup;
  public estadosDescarga: EstadoDescarga[];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddEstadoDescargaRetornoComponent>,
  private fb: FormBuilder, private nomecladoresServices: NomencladoresService) { }

  
  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload,this.data.id_viaje)
  }
  buildItemForm(item,idViaje) {
    this.itemForm = this.fb.group({
      id:[item.id || ''],
      id_viaje: [ parseInt(idViaje) || ''],
      descripcion: [item.descripcion || ''],
      id_estado_descarga:[ item.id_estado_descarga || '', Validators.required],
      fecha: ['', [Validators.required]]
    })
  }

  getItems(){
    this.getEstadosDescarga();

  }
  
  getEstadosDescarga() {
    let dato =  [
      {
          "id": 3,
          "descripcion": "Conforme"
      },          
      {
          "id": 2,
          "descripcion": "Rechazado"
      }
  ];
  this.estadosDescarga = dato;
  }
  
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
  

}
