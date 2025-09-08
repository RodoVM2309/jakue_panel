import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment";
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


import { Puerto } from 'app/shared/models/puerto';
import { DestinosService } from 'app/shared/services/destinos.service';
import { HomeService } from 'app/shared/components/home/home.service';
import { Product } from 'app/shared/models/product.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { ActivatedRoute } from '@angular/router';

export class Chofer {
  id: number;
  nombreChofer: string;
  iconUrl: string;
  status: number;
  latitud: number;
  longitud: number;
}
@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.scss'],
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
export class PendientesComponent implements OnInit {
  pendientesForm: FormGroup;
  filtro = {
    id_producto: 0,
    fecha: "",
    id_destino: 0
  };
  data: any;
  now = moment(new Date());
  productos: Product[];
  destinos: Puerto[] = [];
  choferes: Chofer[] = [];
  choferesEnPlaya: Chofer[] = [];
  choferesPendientes: Chofer[] = [];
  zoom = 8;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  };
  isCustomizerOpen: boolean = false;
  previous;
  urlIcon =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_";

  cbEnPlaya = true;
  cbPendientes = true;
  constructor(
    private homeService: HomeService,
    private destinosService: DestinosService,
    private loader: AppLoaderService,
    private errorService: AppErrorService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pendientesForm = new FormGroup({
      selectedProducto: new FormControl(''),
      selectedFecha: new FormControl(new Date()),
      selectedDestino: new FormControl('')
    });
    this.activatedRoute.data.subscribe(
      response => {
        this.destinos = response.destinos.data;
      }
    );
    this.filtro.fecha = this.homeService.formatoFecha(
      this.now,
      "amd",
      "-"
    );
    this.getDestinos();
    this.getChoferes();
  }

  getChoferes() {
    let temp = new Chofer();
    temp.id = 1;
    temp.nombreChofer = 'Juan Carlos Lopes';
    temp.status = 0;
    temp.iconUrl = this.urlIcon + "green.png";
    temp.latitud = -33.5248463;
    temp.longitud = -61.044874;
    this.choferes.push(temp);
    let temp1 = new Chofer();
    temp1.id = 2;
    temp1.nombreChofer = 'Ernesto González';
    temp1.status = 1;
    temp1.iconUrl = this.urlIcon + "blue.png";
    temp1.latitud = -33.4538463;
    temp1.longitud = -62.0424874;
    this.choferes.push(temp1);
    this.choferes.forEach(element => {
      if (element.status==0) {
        this.choferesEnPlaya.push(element)
      } else {
        this.choferesPendientes.push(element)
      }
    });
  }

  aplicarFiltro(valor, cmp) {
    this.data = [];
    switch (valor) {
      case "fecha":
        this.filtro.fecha = this.homeService.formatoFecha(
          cmp.value,
          "amd",
          "-"
        );
        break;
      case "id_producto":
        this.filtro.id_producto = cmp.value;
        break;
      case "id_destino":
        this.filtro.id_destino = cmp.value;
        this.getItemsProductos();
        break;
    }
  }
  getItemsProductos() {
    this.productos = [];
    this.destinosService.getTurnoPuerto(this.filtro).subscribe(data => {
      data.data.forEach(element => {
        let tempProducto = new Product();
        tempProducto.id = element.producto_id;
        tempProducto.descripcion = element.nombreProducto;
        this.productos.push(tempProducto);
      });
      this.pendientesForm.controls['selectedProducto'].setValue(this.productos[0].id);
      this.filtro.id_producto = parseInt(this.productos[0].id);

    });

  }
  getDestinos() {
    this.loader.open();
    this.destinosService.getDestinoPersona()
      .subscribe(pagedData => {
        this.destinos = [];
        if (pagedData.data) {
          pagedData.data.forEach(element => {
            this.loader.close();
            let puerto = new Puerto();
            puerto.id = element.id;
            puerto.descripcion = element.descripcion;
            this.destinos.push(puerto);
          });
          this.pendientesForm.controls['selectedDestino'].setValue(this.destinos[0].id);
          this.filtro.id_destino = this.destinos[0].id;
          this.getItemsProductos();
          if (this.loader !== null) {
            this.loader.close();
          }
        };
      },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({ message: 'Error, al buscar los puertos del destino' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
  limpiarFiltros() {
    this.filtro.id_producto = 0;
    this.filtro.fecha = '';
    this.pendientesForm.controls['selectedFecha'].setValue(this.filtro.fecha);
  }
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  OnChange($event) {
    //MatCheckboxChange {checked,MatCheckbox}
  }

  OnIndeterminateChange($event) {
    //true or false
  }

}
