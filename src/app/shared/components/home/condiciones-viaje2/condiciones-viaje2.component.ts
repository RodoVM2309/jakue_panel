/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TipoCamion } from '../../../models/tipo-camion';
import { Subscription } from 'rxjs';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { MapsAPILoader } from '@agm/core';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

export class CondicionesViaje {
  id?: number;
  id_pedido?: number;
  condiciones_pago?: string;
  da_gasoil?: number;
  da_efectivo?: number;
  tipo_precio?: number;
  precio_viaje?: number;
  precio_viaje2?: number;
  carga_peligrosa?: number;
  observaciones?: string;
  tipo_acoplado?= [];
  longitud?: number;
  latitud?: number;
  id_medio_pago?: number;
  localidad_carga?: string;
  zona_destino?: string;
  kilometros?: number;
}

export class TipoDifusion {
  id: number;
  descripcion: string;
  checked?: boolean;
}

@Component({
  selector: 'app-condiciones-viaje2',
  templateUrl: './condiciones-viaje2.component.html',
  styleUrls: ['./condiciones-viaje2.component.scss']
})
export class CondicionesViaje2Component implements OnInit {
  formData = {};
  condicionesViajeForm: FormGroup;
  public tiposAcoplados: TipoCamion[];
  public getItemSub: Subscription;

  public latitud: number;
  public longitud: number;
  public isInvalid: any;
  public inactivo: boolean = false;

  public greaterThanValue: number;
  public lessThanValue: number;

  public localidad: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public mostrarzona: boolean = false;
  public isDisabled: boolean;
  public tipo_tarifas = [{ id: 1, descripcion: 'Por toneladas' }, { id: 2, descripcion: 'Por KM' }];
  public unidadtipotarifa = 'tn';
  public condicionesp: CondicionesViaje;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public medios: any;
  public acoplados: any;
  public zonasIdeales: any;
  public pedidotipoacoplados: any;
  public pedidoZonasIdeales: any;
  public pedidoselect: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private nomecladoresServices: NomencladoresService,
    public dialogRef: MatDialogRef<CondicionesViaje2Component>) {

  }

  ngOnInit() {
    this.pedidoselect = this.data.payload;
    this.getMediosPago();
    this.getTipoAcoplado();
    this.mostrarzona = (this.pedidoselect.tipopedido !== 'largo') ? true : false;
    this.condicionesViajeForm = new FormGroup({
      difusion1: new FormControl({ value: '', disabled: true }),
      difusion2: new FormControl({ value: '', disabled: true }),
      difusion3: new FormControl({ value: '', disabled: true }),
      condiciones_pago: new FormControl(''),
      da_gasoil: new FormControl({ value: '', disabled: true }),
      da_efectivo: new FormControl({ value: '', disabled: true }),
      tipo_precio: new FormControl(1),
      precio_viaje: new FormControl(''),
      precio_viaje2: new FormControl(''),
      medio_pago: new FormControl(''),
      pais: new FormControl(''),
      provincia: new FormControl(''),
      longitud: new FormControl(''),
      latitud: new FormControl(''),
      tipo_acoplado: new FormControl(''),
      carga_peligrosa: new FormControl({ value: '', disabled: true }),
      observaciones: new FormControl(''),
      localidad_carga: new FormControl(''),
      zona_destino: new FormControl(''),
      zona_ideales: new FormControl(''),
      km: new FormControl({ value: '', disabled: true }), 
      kilometros: new FormControl('')
    });
    this.actTipoDifusion(this.pedidoselect.difundido);   
    this.nomecladoresServices.getPedidoCondiciones(this.pedidoselect.id_pedido)
      .subscribe(data => {
        this.condicionesp = data.data;
        this.pedidoZonasIdeales = data.data.zona_ideales;
        this.f['tipo_precio'].setValue(this.descDescElement(this.tipo_tarifas, this.condicionesp.tipo_precio));
        this.f['precio_viaje'].setValue(this.condicionesp.precio_viaje);
        this.f['precio_viaje2'].setValue(this.condicionesp.precio_viaje2);
        this.f['condiciones_pago'].setValue(this.condicionesp.condiciones_pago);
        this.f['observaciones'].setValue(this.condicionesp.observaciones);
        this.f['da_gasoil'].setValue(this.condicionesp.da_gasoil);
        this.f['da_efectivo'].setValue(this.condicionesp.da_efectivo);
        this.f['carga_peligrosa'].setValue(this.condicionesp.carga_peligrosa);
        this.f['localidad_carga'].setValue(this.condicionesp.localidad_carga);
        this.f['zona_destino'].setValue(this.condicionesp.zona_destino);
        this.f['medio_pago'].setValue(this.descDescElement(this.medios, this.condicionesp.id_medio_pago));
        this.unidadtipotarifa = (this.condicionesp.tipo_precio === 1) ? 'tn' : 'viaje';
        let valoresZonasIdeales = [];
        for (let i = 0; i < this.pedidoZonasIdeales.length; i++) {
          valoresZonasIdeales.push(this.pedidoZonasIdeales[i].id);
        }
        this.f['zona_ideales'].setValue(valoresZonasIdeales);
        this.f['km'].setValue((this.condicionesp.kilometros !== null && this.condicionesp.kilometros !== 0)? 1 : 0);
        this.f['kilometros'].setValue((this.condicionesp.kilometros !== null && this.condicionesp.kilometros !== 0)? this.condicionesp.kilometros : 0);
      });
  }

  actTipoDifusion(tipodifusion) {
    switch (tipodifusion) {
      case 1:
        this.f['difusion1'].setValue(1);
        this.f['difusion2'].setValue(0);
        this.f['difusion3'].setValue(0);
        break;
      case 2:
        this.f['difusion1'].setValue(0);
        this.f['difusion2'].setValue(1);
        this.f['difusion3'].setValue(0);
        break;
      case 3:
        this.f['difusion1'].setValue(0);
        this.f['difusion2'].setValue(0);
        this.f['difusion3'].setValue(1);
        break;
      case 4:
        this.f['difusion1'].setValue(1);
        this.f['difusion2'].setValue(1);
        this.f['difusion3'].setValue(0);
        break;
      case 5:
        this.f['difusion1'].setValue(1);
        this.f['difusion2'].setValue(0);
        this.f['difusion3'].setValue(1);
        break;
      case 6:
        this.f['difusion1'].setValue(0);
        this.f['difusion2'].setValue(1);
        this.f['difusion3'].setValue(1);
        break;
      case 7:
        this.f['difusion1'].setValue(1);
        this.f['difusion2'].setValue(1);
        this.f['difusion3'].setValue(1);
        break;
      default:
        this.f['difusion1'].setValue(0);
        this.f['difusion2'].setValue(0);
        this.f['difusion3'].setValue(0);
        break;
    }
  }

  getMediosPago() {
    this.nomecladoresServices.getMediospago()
      .subscribe(data => {
        this.medios = data.data;
      });
  }

  getTipoAcoplado() {
    this.nomecladoresServices.getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.acoplados = data.data.tipoAcoplado;
        this.nomecladoresServices.getPedidoTipoAcoplado(this.pedidoselect.id_pedido)
          .subscribe(data => {
            let valorescaoplados = [];
            this.pedidotipoacoplados = data.data;
            for (let i = 0; i < this.pedidotipoacoplados.length; i++) {
              this.pedidotipoacoplados[i].no = i + 1;
              valorescaoplados.push(i + 1);
              this.pedidotipoacoplados[i].acoplado = this.descDescElement(this.acoplados, this.pedidotipoacoplados[i].id)
            }
            this.f['tipo_acoplado'].setValue(valorescaoplados);
          });
      });
  }
  getZonaIdeal() {
    let valoresZonasIdeales = [];
    for (let i = 0; i < this.pedidoZonasIdeales.length; i++) {
      valoresZonasIdeales.push(this.pedidoZonasIdeales[i].id);
    }
    this.f['zona_ideales'].setValue(valoresZonasIdeales);
  }

  get f() { return this.condicionesViajeForm.controls; }

  descDescElement(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return arr[i].descripcion;
      }
    }
  }
}
