/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import {  Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MapsAPILoader } from "@agm/core";

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
}
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
@Component({
  selector: "app-add-bocas",
  templateUrl: "./add-bocas.component.html",
  styleUrls: ["./add-bocas.component.scss"]
})
export class AddBocasComponent implements OnInit {
  public itemForm: FormGroup;
  showMap: boolean = true;
  pages: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 8;
  marcadores: Marcador[] = [];
  paises: Pais[];
  provincias: Provincia[];
  filteredOptions: Observable<Localidad[]>;
  localidades: Localidad[];
  marcadorSel: any = null;
  draggable: string = "1";
  panelOpenState = false;
  deshabilitarCoord: boolean = true;
  
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBocasComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.getPais();
    this.buildItemForm(this.data.payload);
    if (this.data.payload.localidad !== undefined) {      
      this.cargarDatosInicialesPaisLocalidad(
        this.data.payload.id_pais,
        this.data.payload.localidad.id_provincia,
        this.data.payload.id_localidad
      );
    }
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: []
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.f.latitud.setValue(this.latitude);
          this.f.longitud.setValue(this.longitude);
          this.zoom = 8;
        });
      });
    });
  }

  get f() {
    return this.itemForm.controls;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  buildItemForm(item) {
    if (item.longitud) {
      const nuevoMarcador: Marcador = {
        lat: item.latitud,
        lng: item.longitud,
        titulo: "",
        draggable: true
      };
      this.marcadores.push(nuevoMarcador);
      this.latitude  = item.latitud;
      this.longitude = item.longitud;
    } else {
      this.setCurrentPosition();
    }
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      razon_social: [item.razon_social || "", Validators.required],
      direccion: [item.direccion || "", Validators.required],
      rrcc: [item.rrcc || "", Validators.required],
      es_agro: [item.es_agro || "", Validators.required],
      longitud: [item.longitud || "", Validators.required],
      latitud: [item.latitud || "", Validators.required],
      id_localidad: [item.id_localidad || "", Validators.required],
      pais: [item.id_pais !== undefined ? item.id_pais : ""],
      provincia: [item.localidad !== undefined ? item.localidad.id_provincia : ""],
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }
  closeMap() {
    this.showMap = false;
  }

  openMap() {
    this.showMap = true;
  }

  clickMapa(evento) {
    const nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: "",
      draggable: true
    };
    this.itemForm.controls["latitud"].setValue(evento.coords.lat);
    this.itemForm.controls["longitud"].setValue(evento.coords.lng);
    if (this.marcadores.length > 0) {
      this.marcadores[0] = nuevoMarcador;
    } else {
      this.marcadores.push(nuevoMarcador);
    }
  }

  clickMarcador(marcador: Marcador, i: number) {
    this.marcadorSel = marcador;
    if (this.marcadorSel.draggable) {
      this.draggable = "1";
    } else {
      this.draggable = "0";
    }
  }

  borrarMarcador(idx: number) {
    this.marcadores.splice(idx, 1);
  }

  cambiarDraggable() {
    if (this.draggable === "1") {
      this.marcadorSel.draggable = true;
    } else {
      this.marcadorSel.draggable = false;
    }
  }

  dragEndMarcador(marcador: Marcador, evento) {
    let lat = evento.coords.lat;
    let lng = evento.coords.lng;
    marcador.lat = lat;
    marcador.lng = lng;
    this.marcadores[0] = marcador;
    this.itemForm.controls["latitud"].setValue(evento.coords.lat);
    this.itemForm.controls["longitud"].setValue(evento.coords.lng);
  }
  
  private _filter(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  cargarDatosInicialesPaisLocalidad(pais, provincia, localidad) {
    this.loader.open();
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
      this.itemForm.controls["pais"].setValue(pais);
      this.personasService.getProvincias(pais).subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        this.itemForm.controls["provincia"].setValue(provincia);
        this.personasService.geLocalidades(provincia).subscribe(data => {
          this.localidades = data.data;
          this.itemForm.controls["id_localidad"].setValue(localidad);
          this.filteredOptions = this.itemForm.controls[
            "id_localidad"
          ].valueChanges.pipe(
            startWith<string | Localidad>(""),
            map(value =>
              typeof value === "string" ? value : value.descripcion
            ),
            map(descripcion =>
              descripcion ? this._filter(descripcion) : this.localidades.slice()
            )
          );
          if (this.loader !== null) {
            this.loader.close();
          }
        });
      });
    });
  }
  getPais() {
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
    });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls["pais"].value);
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
    this.getLocalidadesxProvincia(this.itemForm.controls["provincia"].value);
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v).subscribe(data => {
      this.localidades = data.data;
      this.filteredOptions = this.itemForm.controls[
        "id_localidad"
      ].valueChanges.pipe(
        startWith<string | Localidad>(""),
        map(value => (typeof value === "string" ? value : value.descripcion)),
        map(descripcion =>
          descripcion ? this._filter(descripcion) : this.localidades.slice()
        )
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  displayFn(localidad?: Localidad): string | undefined {
    return localidad ? localidad.descripcion : undefined;
  }
}
