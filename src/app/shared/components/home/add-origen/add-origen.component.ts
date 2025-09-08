/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { OrigenesService } from './../../../../shared/services/origenes.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { MapsAPILoader } from '@agm/core';
declare let googlemaps: any;

export class Pais {
  id: number;
  descripcion: string;
};

export class Provincia {
  id: number;
  descripcion: string;
};

export class Localidad {
  id: number;
  descripcion: string;
};

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
};

@Component({
  selector: 'app-add-origen',
  templateUrl: './add-origen.component.html',
  styleUrls: ['./add-origen.component.scss']
})
export class AddOrigenComponent implements OnInit {
  public itemForm: FormGroup;
  paises: Pais[];
  provincias: Provincia[];
  localidades: Localidad[];
  pages: any;

  public latitud: number;
  public longitud: number;
  public localidad: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  lat: number;
  lng: number;
  zoom: number = 7;
  marcadores: Marcador[] = [];
  marcadorSel: any = null;
  draggable = '1';
  panelOpenState = false;
  deshabilitarCoord = true;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddOrigenComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private origenesService: OrigenesService,
    private confirmService: AppConfirmService,
    private mapsAPILoader: MapsAPILoader,
    private snack: MatSnackBar,
    private ngZone: NgZone,
    private loader: AppLoaderService) { }

  ngOnInit() {
     //console.log(this.data.title);
    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
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
          this.localidad = place.name;
          this.lat = this.latitude;
          this.lng = this.longitude;
          this.itemForm.controls['latitud'].setValue(this.latitude);
          this.itemForm.controls['longitud'].setValue(this.longitude);
          const nuevoMarcador: Marcador = {
            lat: this.latitude,
            lng: this.longitude,
            titulo: this.localidad,
            draggable: true
          };
          if (this.marcadores.length > 0) {
            this.marcadores[0] = nuevoMarcador;
          } else {
            this.marcadores.push(nuevoMarcador);
          }
        });
      });
    });

    this.getPais();
    if (this.data.payload.id_pais !== undefined) {
      this.cargarDatosInicialesPaisLocalidad(this.data.payload.id_pais, this.data.payload.id_provincia, this.data.payload.id_localidad);
    }
    this.buildItemForm(this.data.payload);
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.lat = this.latitude;
        this.lng = this.longitude;
        const nuevoMarcador: Marcador = {
          lat: this.latitude,
          lng: this.longitude,
          titulo: 'Mi posición',
          draggable: true
        };
        if (this.marcadores.length > 0) {
          this.marcadores[0] = nuevoMarcador;
        } else {
          this.marcadores.push(nuevoMarcador);
        }
      });
    }
  }

  buildItemForm(item) {
    const pais = (item.id_pais !== undefined) ? item.id_pais : '';
    const provincia = (item.id_provincia !== undefined) ? item.id_provincia : '';
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required],
      id_localidad: [item.id_localidad, Validators.required],
      direccion: [item.direccion],
      nombre_contacto: [item.nombre_contacto || ''],
      telefono: [item.telefono || ''],
      email: [item.email || '', Validators.email],
      longitud: [item.longitud || '', Validators.required],
      latitud: [item.latitud || '', Validators.required],
      pais: [pais],
      provincia: [provincia]
    });

    if (item.longitud !== '' && item.latitud !== '') {
      const nuevoMarcador: Marcador = {
        lat: item.latitud,
        lng: item.longitud,
        titulo: '',
        draggable: true
      };
      if (this.marcadores.length > 0) {
        this.marcadores[0] = nuevoMarcador;
      } else {
        this.marcadores.push(nuevoMarcador);
      }
    };
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  getPais() {
    this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
      });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls['pais'].value);
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
    this.getLocalidadesxProvincia(this.itemForm.controls['provincia'].value);
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

  cargarDatosInicialesPaisLocalidad(pais, provincia, localidad) {
    this.loader.open();
    this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
        this.itemForm.controls['pais'].setValue(pais);
        this.personasService.getProvincias(pais)
          .subscribe(data1 => {
            this.provincias = data1.data;
            this.localidades = [];
            this.itemForm.controls['provincia'].setValue(provincia);
            this.personasService.geLocalidades(provincia)
              .subscribe(data2 => {
                this.localidades = data2.data;
                this.itemForm.controls['id_localidad'].setValue(localidad);
                if (this.loader !== null) {
                  this.loader.close();
                  this.snack.open('Carga con éxito!', 'OK', { duration: 4000 });
                }
              });
          });
      });
  }



  clickMapa(evento) {
    const nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: '',
      draggable: true
    };
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);
    if (this.marcadores.length > 0) {
      this.marcadores[0] = nuevoMarcador;
    } else {
      this.marcadores.push(nuevoMarcador);
    }
  }

  clickMarcador(marcador: Marcador, i: number) {
    this.marcadorSel = marcador;
    if (this.marcadorSel.draggable) {
      this.draggable = '1';
    } else {
      this.draggable = '0';
    }
  }

  cambiarDraggable() {
    if (this.draggable === '1') {
      this.marcadorSel.draggable = true;
    } else {
      this.marcadorSel.draggable = false;
    }
  }

  dragEndMarcador(marcador: Marcador, evento) {
    const lat = evento.coords.lat;
    const lng = evento.coords.lng;
    marcador.lat = lat;
    marcador.lng = lng;
    this.marcadores[0] = marcador;
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);

  }

}
