/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Inject
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatCheckboxChange,
} from "@angular/material";
import { Validators, FormGroup, FormControl, FormArray, ValidatorFn, AbstractControl } from "@angular/forms";
import { TipoCamion } from "../../../models/tipo-camion";
import { Subscription } from "rxjs";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { MapsAPILoader } from "@agm/core";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";

export class Pais {
  id: number;
  descripcion: string;
}

export class Provincia {
  id: number;
  descripcion: string;
}

export class Localidad {
  id: number;
  descripcion: string;
}
export class TipoDifusion {
  id: number;
  descripcion: string;
  checked?: boolean;
}
export class zonasSelect {
  id: number;
}

@Component({
  selector: "app-condiciones-viaje",
  templateUrl: "./condiciones-viaje.component.html",
  styleUrls: ["./condiciones-viaje.component.scss"]
})
export class CondicionesViajeComponent implements OnInit {
  formData = {};
  condicionesViajeForm: FormGroup;
  public tiposAcoplados: TipoCamion[];
  public zonasIdeales: TipoCamion[];
  public getItemSub: Subscription;
  paises: Pais[];
  medios: any;
  provincias: Provincia[];
  localidades: Localidad[];

  scroll = 0 ;

  public latitud: number;
  public longitud: number;
  public isInvalid: any;
  public inactivo: boolean = false;

  public greaterThanValue: any;
  public lessThanValue: any;

  public localidad: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public tipo_Difusion: number = 0;
  public mostrarzona: boolean = false;
  public estado: boolean = false;
  public isDisabled: boolean;
  public tipo_tarifas = [
    { id: 1, descripcion: "Por toneladas" },
    { id: 2, descripcion: "Por KM" }
  ];
  public selectedTipoDifusion: string;
  public tipoDifusion: TipoDifusion[] = [
    { id: 1, descripcion: "Choferes libres", checked: false },
    { id: 2, descripcion: "Mis intermediarios/Transportes", checked: false },
    { id: 3, descripcion: "Otros intermediarios/Transportes", checked: false }
  ];
  public unidadtipotarifa = "tn";
  public tipo_dif: any;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public dd = [];
  isTipoDifusion: boolean = false;
  esNecesarioTelefono: boolean = false;
  condicionesDifusion: any;
  habilitarKm: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nomecladoresServices: NomencladoresService,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<CondicionesViajeComponent>
  ) { }

  ngOnInit() {
    this.mostrarzona = this.data.payload.tipopedido !== "largo" ? true : false;
    this.getItemsTiposAcoplados();
    this.getItemsZonasIdeales();
    this.getPais();
    this.getMediosPago();
    this.condicionesViajeForm = new FormGroup({
      condiciones_pago: new FormControl(""),
      selectedTipoDifusion: new FormControl("", [Validators.required]),
      da_gasoil: new FormControl(""),
      da_efectivo: new FormControl(""),
      tipo_precio: new FormControl(1),
      precio_viaje: new FormControl(""),
      precio_viaje2: new FormControl(""),
      id_medio_pago: new FormControl(""),
      pais: new FormControl(""),
      provincia: new FormControl(""),
      longitud: new FormControl(this.longitud, [Validators.required]),
      latitud: new FormControl(this.latitud, [Validators.required]),
      tipo_acoplado: new FormControl("", [Validators.required]),
      zona_ideal: new FormControl("", [Validators.required]),
      carga_peligrosa: new FormControl(""),
      observaciones: new FormControl(""),
      telefono_contacto: new FormControl(""),
      localidad_carga: new FormControl("", [Validators.required]),
      todosacoplados: new FormControl(""),
      todoszonasIdeales: new FormControl(this.dd),
      zona_destino: this.mostrarzona
        ? new FormControl("", [Validators.required])
        : new FormControl(""),
      km: new FormControl(""),
      kilometros: new FormControl("", [Validators.min(0), Validators.max(9999)])
    });
    //set google maps defaults
    this.zoom = 8;
    this.latitude = -32.96104572191259;
    this.longitude = -61.15374192669714;
    this.isDisabled = false;
    this.seleccionandoTodosZonasIdeales(true);

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: []
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.localidad = place.name;
          this.latitud = this.latitude;

          this.longitud = this.longitude;
          this.f.latitud.setValue(this.latitude);
          this.f.longitud.setValue(this.longitud);
          this.f.localidad_carga.setValue(this.localidad);
          this.zoom = 8;
        });
      });
    });
  }

  onChange1(mchkChange: MatCheckboxChange) {
    for (let i = 0; i < this.tipoDifusion.length; i++) {
      if (this.tipoDifusion[i].id === (((mchkChange.source.value) as any) as TipoDifusion).id) {
        this.tipoDifusion[i].checked = mchkChange.checked;
      }
    }
    if (this.tipoDifusion[0].checked === false && this.tipoDifusion[1].checked === false && this.tipoDifusion[2].checked === false) {
      this.isTipoDifusion = false;
      this.tipo_Difusion = 0;
      this.condicionesViajeForm.controls["selectedTipoDifusion"].setValue("");
    } else {
      this.isTipoDifusion = true;
      if (this.tipoDifusion[0].checked === true && this.tipoDifusion[1].checked === false && this.tipoDifusion[2].checked === false) {
        this.tipo_Difusion = 1;
      } else {
        if (this.tipoDifusion[0].checked === false && this.tipoDifusion[1].checked === true && this.tipoDifusion[2].checked === false) {
          this.tipo_Difusion = 2;
        } else {
          if (this.tipoDifusion[0].checked === false && this.tipoDifusion[1].checked === false && this.tipoDifusion[2].checked === true) {
            this.tipo_Difusion = 3;
          } else {
            if (this.tipoDifusion[0].checked === true && this.tipoDifusion[1].checked === true && this.tipoDifusion[2].checked === false) {
              this.tipo_Difusion = 4;
            } else {
              if (this.tipoDifusion[0].checked === true && this.tipoDifusion[1].checked === false && this.tipoDifusion[2].checked === true) {
                this.tipo_Difusion = 5;
              } else {
                if (this.tipoDifusion[0].checked === false && this.tipoDifusion[1].checked === true && this.tipoDifusion[2].checked === true) {
                  this.tipo_Difusion = 6;
                } else {
                  this.tipo_Difusion = 7;
                }
              }
            }
          }
        }
      }
      this.condicionesViajeForm.controls["selectedTipoDifusion"].setValue(this.tipo_Difusion.toString());
    }
    if (this.tipo_Difusion > 1) this.esNecesarioTelefono = true;
    else this.esNecesarioTelefono = false;
  }

  validarTelefono() {
    if (
      this.condicionesViajeForm.controls["telefono_contacto"].value !== null &&
      this.condicionesViajeForm.controls[
        "telefono_contacto"
      ].value.toString() !== ""
    )
      this.esNecesarioTelefono = false;
    else this.esNecesarioTelefono = true;
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.latitud = this.latitude;
        this.longitude = position.coords.longitude;
        this.longitud = this.longitude;
        this.f.latitud.setValue(this.latitude);
        this.f.longitud.setValue(this.longitud);
        this.f.localidad_carga.setValue(this.localidad);
        this.zoom = 8;
      });
    }
  }

  get f() {
    return this.condicionesViajeForm.controls;
  }

  submit() {
    let todooK = true;

    if (todooK === true) {
      if (this.condicionesViajeForm.controls["da_gasoil"].value) {
        this.condicionesViajeForm.controls["da_gasoil"].setValue(1);
      } else {
        this.condicionesViajeForm.controls["da_gasoil"].setValue(0);
      }
      if (this.condicionesViajeForm.controls["da_efectivo"].value) {
        this.condicionesViajeForm.controls["da_efectivo"].setValue(1);
      } else {
        this.condicionesViajeForm.controls["da_efectivo"].setValue(0);
      }
      if (this.condicionesViajeForm.controls["carga_peligrosa"].value) {
        this.condicionesViajeForm.controls["carga_peligrosa"].setValue(1);
      } else {
        this.condicionesViajeForm.controls["carga_peligrosa"].setValue(0);
      }
      this.condicionesDifusion = this.condicionesViajeForm.value;
      this.condicionesDifusion.telefono_contacto = this.condicionesViajeForm.controls[
        "telefono_contacto"
      ].value.toString();
      this.dialogRef.close(this.condicionesDifusion);
    }
  }

  onClick() {
    this.estado = true;
  }

  onChange(event: any) {
    if (this.estado) {
      if (this.lessThanValue !== null && this.greaterThanValue > 0) {
        if (this.greaterThanValue > 0) {
          this.inactivo = true;
        } else {
          this.inactivo = false;
        }
        if (this.greaterThanValue > this.lessThanValue) {
          this.isInvalid = this.greaterThanValue > this.lessThanValue;
        } else {
          this.isInvalid = false;
        }
      } else {
        this.isInvalid = false;
      }
    }
  }

  getItemsTiposAcoplados() {
    this.tiposAcoplados = [];
    this.getItemSub = this.nomecladoresServices
      .getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.tiposAcoplados = data.data.tipoAcoplado;
      });
  }
  getItemsZonasIdeales() {
    this.zonasIdeales = [];
    this.getItemSub = this.nomecladoresServices
      .getAllZonaIdealesSelect()
      .subscribe(data => {
        this.zonasIdeales = data.data;

        for (let i = 0; i < this.zonasIdeales.length; i++) {
          this.dd.push(this.zonasIdeales[i].id);
        }
        this.f.zona_ideal.setValue(this.dd);
      });
  }

  getPais() {
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
    });
  }
  getMediosPago() {
    this.nomecladoresServices.getMediospago().subscribe(data => {
      this.medios = data.data;
    });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.condicionesViajeForm.controls["pais"].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v).subscribe(data => {
      this.provincias = data.data;
      this.localidades = [];
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  getLocalidades() {
    this.loader.open();
    this.getLocalidadesxProvincia(
      this.condicionesViajeForm.controls["provincia"].value
    );
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v).subscribe(data => {
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
  seleccionandoTodosZonasIdeales(event) {

    if (event) {
      const dd = [];
      for (let i = 0; i < this.zonasIdeales.length; i++) {
        dd.push(this.zonasIdeales[i].id);
      }
      this.f.zona_ideal.setValue(dd);
    } else {
      this.f.zona_ideal.reset();
    }
  }
  onChangeTodosZonasIdeales(event) {
    if (event.checked) {
      const dd = [];
      for (let i = 0; i < this.zonasIdeales.length; i++) {
        dd.push(this.zonasIdeales[i].id);
      }
      this.f.zona_ideal.setValue(dd);
    } else {
      this.f.zona_ideal.reset();
    }
  }

  onChangeZonaIdeal() {
    if (this.f.tipo_acoplado.value.length !== this.zonasIdeales.length) {
      if (this.f.todoszonasIdeales.value) {
        this.f.todoszonasIdeales.setValue(false);
      }
    } else {
      if (!this.f.todoszonasIdeales.value) {
        this.f.todoszonasIdeales.setValue(true);
      }
    }
  }

  actUnidadTipoTarifa(event) {
    this.unidadtipotarifa = event.value === 1 ? "tn" : "viaje";
  }

  onChangeKm(chk) {
    this.habilitarKm = chk.checked;
    this.f.kilometros.reset();
  }

}
