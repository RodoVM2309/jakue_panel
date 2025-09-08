import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { TipoCamion } from 'app/shared/models/tipo-camion';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import { ZonaChoferesLibresService } from 'app/shared/services/zona-choferes-libres.service';
declare let googlemaps: any;

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
};

@Component({
  selector: 'app-add-grupo',
  templateUrl: './add-grupo.component.html',
  styleUrls: ['./add-grupo.component.scss']
})
export class AddGrupoComponent implements OnInit {
  formData = {};
  itemFormGrupo: FormGroup;
  public zonas: any = [];
  public tiposAcoplados: TipoCamion[];
  public getItemSub: Subscription;
  public latitud: number;
  public longitud: number;
  public localidad: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public nombre: any = '';

  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  marcadores: Marcador[] = [];
  marcadorSel: any = null;
  draggable = '1';
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private nomecladoresServices: NomencladoresService,
    private zonaChoferesLibresService: ZonaChoferesLibresService,
    private mapsAPILoader: MapsAPILoader,
    private fb: FormBuilder,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<AddGrupoComponent>) { }

  ngOnInit() {
    this.getAllTiposAcoplados();
    this.getAllZonaIdeal();
    //create search FormControl
    this.searchControl = new FormControl();

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
          this.itemFormGrupo.controls['latitud'].setValue(this.latitude);
          this.itemFormGrupo.controls['longitud'].setValue(this.longitude);
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

    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemFormGrupo = this.fb.group({
      id: [item.id || ''],
      nombre: [item.nombre || '', Validators.required],
      zona_ideal: [item.zona_ideal || '', Validators.required],
      tipo_acoplados:  [item.tipos_acoplados || '', Validators.required],
      todosacoplados: [''], 
      radio:  [item.radio || '', Validators.required],     
      longitud: [item.longitud || '', Validators.required],
      latitud: [item.latitud || '', Validators.required]
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
    this.dialogRef.close(this.itemFormGrupo.value);
  }

  get f() { return this.itemFormGrupo.controls; }

  getAllTiposAcoplados() {
    this.tiposAcoplados = [];
    this.getItemSub = this.nomecladoresServices.getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.tiposAcoplados = data.data.tipoAcoplado;
      });
  }

  getAllZonaIdeal() {
    this.zonas = [];
    this.getItemSub = this.zonaChoferesLibresService.getAllZonaChoferesLibresSelect()
      .subscribe(data => {
        this.zonas = data.data;
      });
  }

  onChangeTodosAcoplados(event) {
    if (event.checked) {
      const dd = [];
      for (let i = 0; i < this.tiposAcoplados.length; i++) {
        dd.push(this.tiposAcoplados[i].id);
      }
      this.f.tipo_acoplados.setValue(dd);
    } else {
      this.f.tipo_acoplados.reset();
    }
  }

  onChangeAcoplado() {
    if (this.f.tipo_acoplados.value.length !== this.tiposAcoplados.length) {
      if (this.f.todosacoplados.value) {
        this.f.todosacoplados.setValue(false);
      }
    } else {
      if (!this.f.todosacoplados.value) {
        this.f.todosacoplados.setValue(true);
      }
    }
  }

  clickMapa(evento) {
    const nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: '',
      draggable: true
    };
    this.itemFormGrupo.controls['latitud'].setValue(evento.coords.lat);
    this.itemFormGrupo.controls['longitud'].setValue(evento.coords.lng);
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
    this.itemFormGrupo.controls['latitud'].setValue(evento.coords.lat);
    this.itemFormGrupo.controls['longitud'].setValue(evento.coords.lng);

  }

}
