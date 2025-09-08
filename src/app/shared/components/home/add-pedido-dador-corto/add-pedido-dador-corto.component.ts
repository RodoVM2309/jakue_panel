import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialogRef, MatDialog, MatProgressBar, MatButton, MatSelect, MatSnackBar,
  NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { Origen } from '../../../models/origen';
import { ZonaDestino } from '../../../models/zona-destino';
import { Dador } from '../../../models/dador';
//import { Destinatario } from '../../../models/destinatario';
import { Product } from '../../../models/product.model';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { AddOrigenComponent } from '../add-origen/add-origen.component';
import { OrigenesService } from './../../../../shared/services/origenes.service';
import { CentrosService } from './../../../../shared/services/centros.service';
import { VincularClienteComponent } from '../vincular-cliente/vincular-cliente.component';
import { Intermediario } from 'app/views/admin/vincular-centro-intermediario/vincular-intermediario/vincular-intermediario.component';

import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-add-pedido-dador-corto',
  templateUrl: './add-pedido-dador-corto.component.html',
  styleUrls: ['./add-pedido-dador-corto.component.scss'],
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
export class AddPedidoDadorCortoComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  formData = {};
  addPedidoForm: FormGroup;
  selectedOrigen: string = '';
  origenes: Origen;
  selectedZona: string = '';
  zonas: ZonaDestino;
  selectedDador: string = '';
  centros: Dador;
  //selectedDestinatario: string = '';
  //destinatario: Destinatario;
  selectProducto: string = '';
  productos: Product;
  idPedido: any;
  mostrarIntermediario: boolean = false;
  intermediarios: Intermediario[];
  minDate: any;
  maxDate: any;
  public getItemSub: Subscription;
  myId: string;

  constructor(private centrosService: CentrosService, private origenesService: OrigenesService,
    private nomencladoresService: NomencladoresService, private snack: MatSnackBar, private dialog: MatDialog,
    private loader: AppLoaderService, private alertService: AppAlertService, public router: Router,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    public dialogLocaRef: MatDialogRef<AddPedidoDadorCortoComponent>,
    private userService: UserService ) { }

  ngOnInit() {

    this.addPedidoForm = new FormGroup({
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      desdeDate: new FormControl('', [Validators.required]),
      hastaDate: new FormControl('', [Validators.required]),
      selectedOrigen: new FormControl('', [Validators.required]),
      selectedCentro: new FormControl('', [Validators.required]),
      selectedProducto: new FormControl('', [Validators.required]),
      contrato: new FormControl(''),
      observaciones: new FormControl('')
    });
    this.getItems();
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.myId = data.data);
  }

  getItems() {

    this.getItemsCentro();
    this.getItemsProductos();
    //this.getItemsZona();
  }
  selectCentro() {
    const zcentro = this.addPedidoForm.controls.selectedCentro.value;
    this.getItemsOrigen(zcentro);
  }
  getItemsOrigen(xcentro) {
    this.getItemSub = this.nomencladoresService.getAllOrigenesCentro(xcentro)
      .subscribe(data => {
        this.origenes = data.data;
      })
  }
  /* getItemsZona() {
    this.getItemSub = this.nomencladoresService.getAllZonas()
      .subscribe(data => {
        this.zonas = data.data;
      });
  } */
  getItemsCentro() {
    this.getItemSub = this.nomencladoresService.getMisCentros()
      .subscribe(data => {
        this.centros = data.data;
      })
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
      });
  }

  getItemsProductos() {
    this.getItemSub = this.nomencladoresService.getAllProductosSelect()
      .subscribe(data => {
        this.productos = data.data;
      })
  }
  get f() { return this.addPedidoForm.controls; }
  initValue() {
    this.f.desdeDate.setValue('');
    this.f.hastaDate.setValue('');
    this.f.selectedOrigen.setValue('');
    //this.f.selectedZona.setValue('');
    //this.f.selectedDador.setValue('');
    this.f.quantity.setValue(0);
    this.f.selectedProducto.setValue(0);
    this.f.contrato.setValue('');
    this.f.observaciones.setValue('');
  }
  postPedido() {
        const newPedido = {
          fecha_desde: this.f.desdeDate.value,
          fecha_hasta: this.f.hastaDate.value,
          id_origen: this.f.selectedOrigen.value,
          id_centro: this.f.selectedCentro.value,
          id_cliente: this.myId,
          cantidad: this.f.quantity.value,
          reduccion: 0,
          contrato: this.f.contrato.value,
          observaciones: this.f.observaciones.value,
          id_producto: this.f.selectedProducto.value,
          bloqueado: 0,
          solicitud: 1,
          id_generador: this.myId,
          tipo: 3
        }
        this.loader.open();
        this.nomencladoresService.postPedido(newPedido)
          .subscribe(data => {
            this.idPedido = data.data.id;
            this.getItems();
            this.loader.close();
            this.initValue();
            this.alertService.confirm({ message: '¡Pedido agregado correctamente!', tipo: 'exito' })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'El Pedido no se pudo agregar, intentelo nuevamente' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });




  }

  gotoHome() {
    this.dialogLocaRef.close();
  }

  onChange(event) {
    this.mostrarIntermediario = event.checked;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === 'desde') {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }
}
