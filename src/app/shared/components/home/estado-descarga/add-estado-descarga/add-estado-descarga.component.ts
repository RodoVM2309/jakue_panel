import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NomencladoresService } from '@muvin/services';
import { EstadoDescarga } from '@muvin/models';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';


@Component({
  selector: 'app-add-estado-descarga',
  templateUrl: './add-estado-descarga.component.html',
  styleUrls: ['./add-estado-descarga.component.scss'],
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
export class AddEstadoDescargaComponent implements OnInit {
  public itemForm: FormGroup;
  public estadosDescarga: EstadoDescarga[];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddEstadoDescargaComponent>,
  private fb: FormBuilder, private nomecladoresServices: NomencladoresService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload,this.data.id_viaje)
  }
  buildItemForm(item,idViaje) {
    this.itemForm = this.fb.group({
      id:[item.id || ''],
      id_viaje: [ parseInt(idViaje) || ''],
      id_destino: [ parseInt(item.id_destino) || ''],
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
          "id": 6,
          "descripcion": "Conforme"
      },
      {
          "id": 7,
          "descripcion": "Rechazado"
      }
  ];
  this.estadosDescarga = dato;
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }


}
