import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';

import { Destino } from '../../../models/destino';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { UserService } from 'app/shared/services/user.service';


@Component({
  selector: 'app-confirm-carga-retorno',
  templateUrl: './confirm-carga-retorno.component.html',
  styleUrls: ['./confirm-carga-retorno.component.scss'],
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
export class ConfirmCargaRetornoComponent implements OnInit {
  id_destino: string = '';
  destinos: Destino[];
  id_observador: number;
  id_centro: string;
  id_zona_pedido: 0;
  id_destinoInicial = 0;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCargaRetornoComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService,
    private alertService: AppAlertService,
    private userService: UserService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.id_centro = data.data); 

  }
  buildItemForm(item) {
    let id = (item.id !== null) ? item.id : '';

    let id_destino = this.id_destinoInicial = (item.id_destino !== null) ? item.id_destino : '';


    this.itemForm = this.fb.group({
      id: [id],
      id_destino: [id_destino, Validators.required]
    })
  }

  getItems() {
    this.getPedido();

  }
  getPedido() {
    this.getItemSub = this.nomencladoresService.getPedido(this.data.payload.id_pedido)
      .subscribe(data => {
        this.id_zona_pedido = data.data.id_zona_destino;
        this.getItemsDestino();
      })
  }
  getItemsDestino() {
    let valor: string;
    if (this.id_observador > 0) {
      valor = this.id_observador.toString();
    } else
      valor = this.id_centro;
    this.getItemSub = this.nomencladoresService.getAllOrigenesSelect()
      .subscribe(data => {
        this.destinos = data.data;
      });
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
  get f() { return this.itemForm.controls; }

  analisisZona() {
    let idZonaDestino = 0;
    this.destinos.forEach(element => {
      if (element.id_persona_rol == this.f.id_destino.value) {
        idZonaDestino = element.id_zona_destino;
      }
    });
    if (idZonaDestino == this.id_zona_pedido) {
      this.alertService.confirm({ message: 'Ha seleccionado un Destino fuera de la Zona del Destino actual' })
        .subscribe(res => {
          if (res) {
            return;
          }
        });
    }
  }

}
