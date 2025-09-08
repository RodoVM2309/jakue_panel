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
import { Product } from '../../../models/product.model';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/helpers/date.adapter';
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
  selector: 'app-add-pedido-dador-retorno',
  templateUrl: './add-pedido-dador-retorno.component.html',
  styleUrls: ['./add-pedido-dador-retorno.component.scss'],
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
export class AddPedidoDadorRetornoComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  formData = {};
  addPedidoForm: FormGroup;
  selectedOrigen = '';
  origenes: Origen;
  selectedZona = '';
  zonas: ZonaDestino;
  selectedDador = '';
  centros: Dador;
  id_centro: string;
  selectProducto = '';
  productos: Product;
  idPedido: any;
  mostrarIntermediario = false;
  intermediarios: Intermediario[];
  minDate: any;
  maxDate: any;
  public getItemSub: Subscription;
  myId: string;
  destinos: any[]=[];

  constructor(private centrosService: CentrosService, private origenesService: OrigenesService,
    private nomencladoresService: NomencladoresService, private snack: MatSnackBar, private dialog: MatDialog,
    private loader: AppLoaderService, private alertService: AppAlertService, public router: Router,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
     public dialogLocaRef: MatDialogRef<AddPedidoDadorRetornoComponent>,
     private userService: UserService ) {

      }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.id_centro = data.data);
    this.addPedidoForm = new FormGroup({
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      desdeDate: new FormControl('', [Validators.required]),
      hastaDate: new FormControl('', [Validators.required]),
      selectedOrigen: new FormControl('', [Validators.required]),
      selectedDestino: new FormControl('', [Validators.required]),
      selectedCentro: new FormControl('', [Validators.required]),
      selectedProducto: new FormControl('', [Validators.required])
    });
    this.getItems();
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.myId = data.data);
  }

  getItems() {
    //this.getItemsOrigen();
    this.getItemsCentro();
    this. getItemsDestinos();

  }
  selectCentro() {
    this.id_centro = this.addPedidoForm.controls.selectedCentro.value;
    this.getItemsOrigen();
    this.getItemsProductos();


  }
  getItemsOrigen() {
    this.loader.open('Buscando lugar de carga');
    this.getItemSub = this.nomencladoresService.getAllOrigenesCargador(this.id_centro)
      .subscribe(data => {
        this.loader.close();
        this.origenes = data.data;
      }, err => {
        this.loader.close();
      })
  }
  getItemsDestinos() {
    this.loader.open('Buscando destinos');
    this.getItemSub = this.nomencladoresService.getAllDestinosSelect()
      .subscribe(data => {
        this.loader.close();
        this.destinos = data.data;
      }, err => {
        this.loader.close();
      })
  }

   getItemsCentro() {
    this.getItemSub = this.nomencladoresService.getMisCentros()
      .subscribe(data => {
        this.centros = data.data;
      }, err => {
      })
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
      }, err => {
      });
  }

  getItemsProductos() {
    this.getItemSub = this.nomencladoresService.getAllProductosSelectCargador(this.id_centro)
      .subscribe(data => {
        this.productos = data.data;
      }, err => {
      })
  }
  get f() { return this.addPedidoForm.controls; }

  initValue() {
    this.f.desdeDate.setValue('');
    this.f.hastaDate.setValue('');
    this.f.selectedOrigen.setValue('');
    this.f.selectedDestino.setValue('');
    this.f.selectedCentro.setValue('');
    //this.f.selectedDador.setValue('');
    this.f.quantity.setValue(0);
    this.f.selectedProducto.setValue(0);
  }
  postPedido() {
    const newPedido = {
      fecha_desde: this.f.desdeDate.value,
      fecha_hasta: this.f.hastaDate.value,
      id_destino: this.f.selectedOrigen.value,
      id_centro: this.f.selectedCentro.value,
      id_origen: this.f.selectedDestino.value,
      id_cliente: this.myId,
      cantidad: this.f.quantity.value,
      reduccion: 0,
      id_producto: this.f.selectedProducto.value,
      bloqueado: 0,
      solicitud: 1,
      id_generador: this.myId,
      tipo: 2
    };
    this.loader.open();
    this.nomencladoresService.postPedidoDador(newPedido)
      .subscribe(data => {
        this.loader.close();
        this.idPedido = data.data.id;
        this.getItems();
        this.initValue();
        this.alertService.confirm({ message: '¡Pedido agregado correctamente!',  tipo: 'exito' })
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
