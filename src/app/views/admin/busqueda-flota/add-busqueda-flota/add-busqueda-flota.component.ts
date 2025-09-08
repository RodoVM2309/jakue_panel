import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import {
  MatDialogRef,  MAT_DIALOG_DATA
} from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TipoCamion } from '../../../../shared/models/tipo-camion';
import { Pais } from '../../../../shared/models/pais';
import { Product } from '../../../../shared/models/product.model';
import { Subscription } from 'rxjs';
import { NomencladoresService } from '../../../../shared/services/nomencladores.service';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { MapsAPILoader } from '@agm/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Router } from '@angular/router';
declare let googlemaps: any;

export class Provincia {
  id: number;
  descripcion: string;
};

export class Localidad {
  id: number;
  descripcion: string;
};

export class CondicionesViaje {
  id?: number;
  id_pedido?: number;
  condiciones_pago?: string;
  da_gasoil?: number;
  da_efectivo?: number;
  precio_viaje?: number;
  carga_peligrosa?: number;
  observaciones?: string;
  tipo_acoplado?= [];
  longitud?: number;
  latitud?: number;
}

@Component({
  selector: 'app-add-busqueda-flota',
  templateUrl: './add-busqueda-flota.component.html',
  styleUrls: ['./add-busqueda-flota.component.scss']
})
export class AddBusquedaFlotaComponent implements OnInit {
  formData = {};
  addBusquedaForm: FormGroup;
  public tiposAcoplados: TipoCamion[];
  public getItemSub: Subscription;
  paises: Pais[];
  medios: any;
  provincias: Provincia[];
  localidades: Localidad[];

  public latitud_localidad: number;
  public latitud_zona_destino: number;
  public longitud_localidad: number;
  public longitud_zona_destino: number;
  public localidad_carga: string;
  public zona_destino: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public searchControl1: FormControl;
  public zoom: number;
  public mostrarzona: boolean = false;
  selectProducto: string = '';
  productos: Product[];
  minDate: any;
  maxDate: any;

  @ViewChild("search") public searchElementRef: ElementRef;
  @ViewChild("search1") public searchElementRef1: ElementRef;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private nomecladoresServices: NomencladoresService,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<AddBusquedaFlotaComponent>) {

  }
  ngOnInit() {
    this.mostrarzona = true;
    this.getItemsTiposAcoplados();
    this.getPais();
    this.getMediosPago();
    this.getItemsProductos();
    this.addBusquedaForm = new FormGroup({
      condiciones_pago: new FormControl('', [Validators.min(0), Validators.max(999)]),
      da_gasoil: new FormControl(''),
      da_efectivo: new FormControl(''),
      precio_viaje: new FormControl(''),
      id_medio_pago: new FormControl(''),
      pais: new FormControl(''),
      provincia: new FormControl(''),
      longitud_localidad: new FormControl(this.longitud_localidad, [Validators.required]),
      latitud_localidad: new FormControl(this.latitud_localidad, [Validators.required]),
      longitud_zona_destino: new FormControl(this.latitud_zona_destino, [Validators.required]),
      latitud_zona_destino: new FormControl(this.latitud_zona_destino, [Validators.required]),
      selectedProducto: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      tipo_acoplado: new FormControl('', [Validators.required]),
      carga_peligrosa: new FormControl(''),
      observaciones: new FormControl(''),
      localidad_carga: new FormControl('', [Validators.required]),
      zona_destino: new FormControl('', [Validators.required]),
      todosacoplados: new FormControl('')
    });
    //set google maps defaults
    this.zoom = 8;
    this.latitude = -32.96104572191259;
    this.latitud_localidad = -30.96104572191259;
    this.latitud_zona_destino = -32.96104572191259;
    this.longitude = -60.15374192669714;
    this.longitud_localidad = -61.15374192669714;
    this.longitud_zona_destino = -60.15374192669714;

    //Quitar en produccion
    this.localidad_carga = 'Bayamo';
    this.zona_destino = ' Manzanillo';
    this.f.latitud_localidad.setValue(this.latitud_localidad);
    this.f.latitud_zona_destino.setValue(this.latitud_zona_destino);
    this.f.longitud_localidad.setValue(this.longitud_localidad);
    this.f.longitud_zona_destino.setValue(this.longitud_zona_destino);
    this.f.localidad_carga.setValue(this.localidad_carga);
    this.f.zona_destino.setValue(this.zona_destino);

    this.searchControl = new FormControl();
    this.searchControl1 = new FormControl();

    this.setCurrentPosition();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: []
      });
      let autocomplete3 = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement, {
        types: []
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.localidad_carga = place.name;
          this.latitud_localidad = place.geometry.location.lat();
          this.longitud_localidad = place.geometry.location.lng();
          this.f.latitud_localidad.setValue(this.latitud_localidad);
          this.f.longitud_localidad.setValue(this.longitud_localidad);
          this.f.localidad_carga.setValue(this.localidad_carga);
          this.zoom = 8;
        });
      });
      autocomplete3.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete3.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zona_destino = place.name;
          this.latitud_zona_destino = place.geometry.location.lat();
          this.longitud_zona_destino = place.geometry.location.lng();
          this.f.latitud_zona_destino.setValue(this.latitud_zona_destino);
          this.f.longitud_zona_destino.setValue(this.longitud_zona_destino);
          this.f.zona_destino.setValue(this.zona_destino);
          this.zoom = 8;
        });
      });

    });

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitud_localidad = position.coords.latitude;
        this.longitud_localidad = position.coords.longitude;
        this.latitud_zona_destino = position.coords.latitude;
        this.longitud_zona_destino = position.coords.longitude;
        this.f.latitud_localidad.setValue(this.latitud_localidad);
        this.f.latitud_zona_destino.setValue(this.latitud_zona_destino);
        this.f.longitud_localidad.setValue(this.longitud_localidad);
        this.f.longitud_zona_destino.setValue(this.longitud_zona_destino);
        this.f.localidad_carga.setValue(this.localidad_carga);
        this.f.zona_destino.setValue(this.zona_destino);
        this.zoom = 8;
      });
    }
  }

  get f() { return this.addBusquedaForm.controls; }

  submit() {

    if (this.addBusquedaForm.controls['da_gasoil'].value) {
      this.addBusquedaForm.controls['da_gasoil'].setValue(1);
    } else {
      this.addBusquedaForm.controls['da_gasoil'].setValue(0);
    }
    if (this.addBusquedaForm.controls['da_efectivo'].value) {
      this.addBusquedaForm.controls['da_efectivo'].setValue(1);
    } else {
      this.addBusquedaForm.controls['da_efectivo'].setValue(0);
    }
    if (this.addBusquedaForm.controls['carga_peligrosa'].value) {
      this.addBusquedaForm.controls['carga_peligrosa'].setValue(1);
    } else {
      this.addBusquedaForm.controls['carga_peligrosa'].setValue(0);
    }
    this.dialogRef.close(this.addBusquedaForm.value);
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === 'desde') {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }
  public handleAddressChange(address: Address) {
    this.latitud_localidad = address.geometry.location.lng();
    this.longitud_localidad = address.geometry.location.lat();
  }
  public handleAddressChange1(address: Address) {
    this.latitud_zona_destino = address.geometry.location.lng();
    this.longitud_zona_destino = address.geometry.location.lat();
  }

  getItemsTiposAcoplados() {
    this.tiposAcoplados = [];
    this.getItemSub = this.nomecladoresServices.getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.tiposAcoplados = data.data.tipoAcoplado;
      });
  }

  getPais() {
    this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
      });
  }
  getMediosPago() {
    this.nomecladoresServices.getMediospago()
      .subscribe(data => {
        this.medios = data.data;
      });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.addBusquedaForm.controls['pais'].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v)
      .subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }

  getLocalidades() {
    this.loader.open();
    this.getLocalidadesxProvincia(this.addBusquedaForm.controls['provincia'].value);
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v)
      .subscribe(data => {
        this.localidades = data.data;
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }

  onChangeTodosAcoplados(event) {
    if (event.checked) {
      const dd = [];
      for (let i = 0; i < this.tiposAcoplados.length; i++) {
        dd.push(this.tiposAcoplados[i].id);
      }
      this.f.tipo_acoplado.setValue(dd);
    } else {
      this.f.tipo_acoplado.reset();
    }
  }

  onChangeAcoplado() {
    if (this.f.tipo_acoplado.value.length !== this.tiposAcoplados.length) {
      if (this.f.todosacoplados.value) {
        this.f.todosacoplados.setValue(false);
      }
    } else {
      if (!this.f.todosacoplados.value) {
        this.f.todosacoplados.setValue(true);
      }
    }
  }
  getItemsProductos() {
    this.getItemSub = this.nomencladoresService.getAllProductosSelect()
      .subscribe(data => {
        this.productos = data.data;
      })
  }
  goToBusqueda() {
    this.router.navigateByUrl('/centro/busqueda-flota');
  }
}
