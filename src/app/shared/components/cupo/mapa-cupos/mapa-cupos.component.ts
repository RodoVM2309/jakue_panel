import { Component, OnInit } from '@angular/core';
import {
   DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { CupoService } from '../cupo.service';
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";

@Component({
  selector: "app-mapa-cupos",
  templateUrl: "./mapa-cupos.component.html",
  styleUrls: ["./mapa-cupos.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ],
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
export class MapaCuposComponent implements OnInit {
  //Map
  zoom = 8;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  };
  filtro = {
    id_producto: 0,
    fecha_desde: '',
    fecha_hasta: ''    
  };
  minDate: any;
  maxDate: any;
  previous;
  isCustomizerOpen: boolean = false;
  public getItemSub: Subscription;
  productos: any = [];
  destinos: any;
  cupos: any = [];
  filtrarForm: FormGroup;
  urlIcon =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_";
  constructor(
    public cupoServices: CupoService,
    public nomencladoresServices: NomencladoresService
  ) { 
    this.filtrarForm = new FormGroup({
      selectedFecha1: new FormControl(this.filtro.fecha_desde),
      selectedFecha2: new FormControl(this.filtro.fecha_hasta)
    });
  }

  ngOnInit() {
    this.getItemsProductos();
    this.getData();
  }
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  getData() {
    this.cupos = [];
    if(this.filtro.fecha_desde !== ''){
      this.filtro.fecha_desde = this.cupoServices.formatoFecha(this.filtro.fecha_desde, "amd", "-");
    }
    if(this.filtro.fecha_hasta !== ''){
      this.filtro.fecha_hasta = this.cupoServices.formatoFecha(this.filtro.fecha_hasta, "amd", "-");
    }
    this.getItemSub = this.cupoServices
      .getCuposAllMap(this.filtro)
      .subscribe(data => {
        data.data.forEach(element => {
          switch (element.id_producto) {
            case 1:
              element.iconUrl = this.urlIcon + "yellow.png";
              break;
            case 2:
              element.iconUrl = this.urlIcon + "orange.png";
              break;
            case 3:
              element.iconUrl = this.urlIcon + "white.png";
              break;
            case 5:
              element.iconUrl = this.urlIcon + "green.png";
              break;
            case 24:
              element.iconUrl = this.urlIcon + "purple.png";
              break;
            default:
              element.iconUrl = this.urlIcon + "red.png";
              break;
          }
          this.cupos.push(element);
        });
      });
  }

  getItemsProductos() {
    this.productos = [];
    this.getItemSub = this.nomencladoresServices
      .getAllProductos()
      .subscribe(data => {
        this.productos = data.data;
      });
  }

  getItemsDestino() {
    this.destinos = [];
    this.getItemSub = this.nomencladoresServices
      .getAllDestinosSelect()
      .subscribe(data => {
        this.destinos = data.data;
      });
  }

  limpiarFiltros() {
    this.filtro.id_producto = 0;
    this.filtro.fecha_desde = '';
    this.filtro.fecha_hasta = '';
    this.filtrarForm.controls['selectedFecha1'].setValue(this.filtro.fecha_desde);
    this.filtrarForm.controls['selectedFecha2'].setValue(this.filtro.fecha_hasta);
    /* this.filtro.id_destino = null; */
    this.getData();
  }

  aplicarFiltro(cmp, tipo) {
    if (tipo === "producto") {
      this.filtro.id_producto = cmp.value;
    } else {
      if (tipo === 'fecha_desde') {
        this.minDate = cmp.value;
        this.filtro.fecha_desde = cmp.target.value.toString().toLowerCase();
      } else {
        if (tipo === 'fecha_hasta') {
          this.maxDate = cmp.value;
          this.filtro.fecha_hasta = cmp.target.value.toString().toLowerCase();
        }
      }
      /* if (tipo === 'destino') {
        this.filtro.id_destino = cmp.value;
      } */
      this.getData();
    }
  }
}
