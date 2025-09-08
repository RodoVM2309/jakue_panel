import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';

import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';

import { Destino } from '../../../models/destino';
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
  selector: 'app-confirm-carga-destino',
  templateUrl: './confirm-carga-destino.component.html',
  styleUrls: ['./confirm-carga-destino.component.scss'],
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

export class ConfirmCargaDestinoComponent implements OnInit {
  id_destino: string = '';
  destinos: Destino[];

  id_zona_pedido: 0;
  id_destinoInicial = 0;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCargaDestinoComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService,
    private atencionService: AppAtencionService,
  ) { }

  filteredOptions: Observable<Destino[]>;

  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
  }

  displayFn(destino?: Destino): string | undefined {
    return destino ? destino.descripcion : undefined;
  }

  private _filter(descripcion: string): Destino[] {
    const filterValue = descripcion.toLowerCase();
    return this.destinos.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0);
  }

  buildItemForm(item) {
    const id = (item.id !== null) ? item.id : '';
    const id_destino = this.id_destinoInicial = (item.id_destino !== null) ? item.id_destino : '';
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
      });
  }

  getItemsDestino() {
    this.getItemSub = this.nomencladoresService.getAllDestinosSelect()
      .subscribe(data => {
        this.destinos = data.data;
        this.filteredOptions = this.itemForm.controls['id_destino'].valueChanges
          .pipe(
            startWith<string | Destino>(''),
            map(value => typeof value === 'string' ? value : value.descripcion),
            map(descripcion => descripcion ? this._filter(descripcion) : this.destinos.slice())
          );
      });
  }

  submit() {
    if (this.itemForm.value.id_corredor == 0) {
      this.itemForm.value.id_corredor = null;
    }
    if (this.itemForm.value.id_entregador == 0) {
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
