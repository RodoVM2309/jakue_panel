
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { Subscription, of } from "rxjs";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";


import * as moment from "moment";

import { NomencladoresService } from "app/shared/services/nomencladores.service";
import { V2Disponibles, Cupo, Dadore, Detalles, Listado } from "app/shared/models/v2-disponibles";
import { CupoService } from "../cupo.service";
import { HomeService } from "../../home/home.service";
import { DevolverComponent } from "../devolver/devolver.component";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { DetalleConsolidadoComponent } from "../detalle-consolidado/detalle-consolidado.component";
import { forEach } from '@angular/router/src/utils/collection';
import { MessageService } from "app/shared/services/message.service";
export class CupoDetalleDador {
  "id": number;
  "id_dador": number;
  "nombre_dador": string;
  "id_destino": number;
  "nombre_destino": string;
  "pendientes1": number = 0;
  "total1": number = 0;
  "pendientes2": number = 0;
  "total2": number = 0;
  "pendientes3": number = 0;
  "total3": number = 0;
  "pendientes4": number = 0;
  "total4": number = 0;
  "pendientes5": number = 0;
  "total5": number = 0;
  "checked": boolean = false;
}

export class DetalleDestinatario {
  idCuitDestinatario: string;
  nombreDestinatario: string;
  id_producto: number;
  nombre_producto: string;
  total_cupos: number;
  por_asignar: number;
  por_vincular: number;
  estado_ctg: number;
  mas_50km: number;
  menos_50km: number;
  cargados: number;
  menos_50km_destino: number;
  en_destino: number;
  descargado: number;
  anulados: number;
  cupos: Cupo[];

}

@Component({
  selector: 'app-detalle-dador',
  templateUrl: './detalle-dador.component.html',
  styleUrls: ['./detalle-dador.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-AR'
    }
  ]
})
export class DetalleDadorComponent implements OnInit {
  @Input() fecha: string;
  @Input() listado;
  @Input() detalles;
  @Output() cambiarFecha = new EventEmitter();

  filtrarForm: FormGroup;
  now = moment(new Date()).format("YYYY-MM-DD");
  seleccionados = [];
  isCustomizerOpen2: boolean = false;
  public getItemSub: Subscription;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "first_color",
    "destinatario",
    "total",
    "pend_asignar",
    "pend_vincular",
    "ctg",
    "mas50",
    "menos50",
    "cargado",
    "menos50_destino",
    "en_destino",
    "descargados",
    "anulados",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `
  };
  filtro = {
    fecha: this.homeService.formatoFecha(new Date().toString(), "amd", "-"),
    id_producto: 1
  };
  filtro1 = {
    fecha: this.homeService.formatoFecha(new Date().toString(), "amd", "-"),
    id_producto: 1,
    id_dador: 0,
    estado: ""
  };
  minDate = new Date();
  public pageSize = 5;
  public totalSize = 0;
  filtroespeciales = [];
  otrosproductos = [];
  f = 1;
  DATA: any[];
  selectCupoDetalleDador: CupoDetalleDador[] = [];

  dataV2: V2Disponibles;
  cuposDisponiblesApi: Listado[];
  detallesDisponiblesApi: Detalles;
  detalleDestinatario: DetalleDestinatario[];
  private subscription: Subscription;
  message: any;

  constructor(
    private cupoService: CupoService,
    private nomencladoresService: NomencladoresService,
    private dialog: MatDialog,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    public router: Router,
    public homeService: HomeService,
    private messageService: MessageService,
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      switch (this.message.text) {
        case 'DetalleDador':
          //this.getDataCuposDisponibles( this.message.data);
          this.loadDataV2(this.message.data);
          break;

        default:
          break;
      }
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Elementos por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último ";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.filtrarForm = new FormGroup({
      selectedProducto: new FormControl(this.filtro.id_producto),
      selectedFecha: new FormControl(new Date(this.fecha + ' 12:00:00'))
    });
    //this.getItemsProductos();
    //this.cargaInicial();
    let data = {
      listado: [],

    }
    if (this.listado.length > 0) {
      const data = {
        listado: this.listado,
        detalles: this.detalles
      }
      this.loadDataV2(data);
    }

  }



  loadDataV2(data) {
    //this.loader.open('Por favor espere..', 'Buscando datos...');
    this.dataV2 = new V2Disponibles();
    this.cuposDisponiblesApi = [];
    this.detallesDisponiblesApi = new Detalles();
    this.cuposDisponiblesApi = data.listado;
    this.detallesDisponiblesApi = data.detalles;
    this.loadDataProducto();
    this.getItemsProductos();
  }

  loadDataProducto() {
    let indice = 0;
    this.detalleDestinatario = [];
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const listado = this.cuposDisponiblesApi[index];
      if (listado.destinos.length > 0) {
        for (let i = 0; i < listado.destinos.length; i++) {
          const destino = listado.destinos[i];
          if (destino.productos.length > 0) {
            for (let j = 0; j < destino.productos.length; j++) {
              const produc = destino.productos[j];
              if (produc.id_producto === this.filtro.id_producto) {
                let detalleDestinatarioTemp = this.detalleDestinatario.find(item => (item.idCuitDestinatario === listado.idCuitDestinatario && item.id_producto == produc.id_producto))
                if (detalleDestinatarioTemp === undefined) {
                  const detalle = new DetalleDestinatario();
                  detalle.idCuitDestinatario = listado.idCuitDestinatario;
                  detalle.nombreDestinatario = this.detallesDisponiblesApi.destinatario[detalle.idCuitDestinatario].nombreDestinatario;
                  detalle.id_producto = produc.id_producto;
                  detalle.nombre_producto = this.detallesDisponiblesApi.producto[produc.id_producto].nombreProducto;
                  detalle.total_cupos = 0;
                  detalle.por_asignar = 0;
                  detalle.por_vincular = 0;
                  detalle.estado_ctg = 0;
                  detalle.mas_50km = 0;
                  detalle.menos_50km = 0;
                  detalle.cargados = 0;
                  detalle.menos_50km_destino = 0;
                  detalle.en_destino = 0;
                  detalle.descargado = 0;
                  detalle.anulados = 0;
                  detalle.cupos = [];
                  produc.cupos.forEach(element => {
                    element.estadoCalculado='';
                    detalle.cupos.push(element)
                  });
                  this.detalleDestinatario.push(detalle);
                } else {
                  produc.cupos.forEach(element => {
                    detalleDestinatarioTemp.cupos.push(element)
                  });
                }
              }
            }
          }
        }
      }
    }
    if (this.detalleDestinatario.length > 0) {

      this.detalleDestinatario.forEach(element => {
        element.total_cupos = element.cupos.length;
        for (let index = 0; index < element.cupos.length; index++) {
          const element1 = element.cupos[index];
          if (element1.pendienteGeneral) {
            element.por_asignar = element.por_asignar + 1;
            element1.estadoCalculado= 'por_asignar';
            continue;
          }
          if (element1.idCupoEstado == '3') {
            element.descargado = element.descargado + 1;
            element1.estadoCalculado= 'descargado';
            continue;
          }
          if (element1.esAnulado) {
          if (element1.esAnulado.toUpperCase() == 'S') {
            element.anulados = element.anulados + 1;
            element1.estadoCalculado= 'anulado';
            continue;
          }
          }
          if (element1.idCupoEstado == '5') {
            if (element1.estadoViaje == '9') {
              element.descargado = element.descargado + 1;
              element1.estadoCalculado= 'descargado';
            } else {
              element.en_destino = element.en_destino + 1;
              element1.estadoCalculado= 'en_destino';
            }
            continue;
          }
          if (element1.estadoViaje === null) {
            if (element1.idCupoEstado == '2') {
              element.estado_ctg = element.estado_ctg + 1;
              element1.estadoCalculado= 'estado_ctg';
            } else {
              element.por_vincular = element.por_vincular + 1;
              element1.estadoCalculado= 'por_vincular';
            }
          } else {
            switch (element1.estadoViaje) {
              case '1':
                element.mas_50km =element.mas_50km +1;
                element1.estadoCalculado= 'mas_50km';
                break;
              case '2':
                element.menos_50km =element.menos_50km +1;
                element1.estadoCalculado= 'menos_50km';
                break;
              case '3':
                element.cargados =element.cargados +1;
                element1.estadoCalculado= 'cargados';
                break;
              case '4':
                element.menos_50km_destino =element.menos_50km_destino +1;
                element1.estadoCalculado= 'menos_50km_destino';
                break;
              case '5':
                element.en_destino =element.en_destino +1;
                element1.estadoCalculado= 'en_destino';
                break;

              default:
                break;
            }
          }
        };
      });
    }
    this.dataSource.data = this.detalleDestinatario;
  }

  cargarAlfanumerico(valor, row: DetalleDestinatario) {
    let someCupos: Cupo[] = [];
    let title = valor;
    switch (valor) {
      case 'total':
        someCupos = row.cupos;
        title = ' Todos los cupos';
        break;
      case 'por_asignar':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'por_asignar');
        title = ' Por Asignar';
        break;
      case 'por_vincular':
        someCupos = row.cupos.filter(item => item.estadoCalculado==='por_vincular');
        title = ' Por Vincular';
        break;
      case 'estado_ctg':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'estado_ctg');
        title = ' Estado CTG';
        break;
      case 'mas_50km':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'mas_50km');
        title = ' Pendientes a  + 50 km';
        break;
      case 'menos_50km':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'menos_50km');
        title = ' Pendientes a  - 50 km';
        break;
      case 'cargados':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'cargados');
        title = ' Cargado';
        break;
      case 'menos_50km_destino':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'menos_50km_destino');
        title = ' Menos 50 km del destino';
        break;
      case 'en_destino':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'en_destino');
        title = 'En Destino';
        break;
      case 'anulados':
        someCupos = row.cupos.filter(item => item.estadoCalculado=== 'anulado');
        title = 'Anulados';
        break;
      default:
        break;
    }
    if (someCupos.length > 0) {
      let heightPop: number = 30 + (someCupos.length * 25);
      let heightPopUp: number = 50;
      if (heightPop > 80) heightPopUp = 80
      else heightPopUp = heightPop;
      let fecha: any;
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        DetalleConsolidadoComponent,
        {
          width: "55vw",
          height: heightPopUp.toString() + 'vh',
          disableClose: true,
          data: {
            title: title,
            payload: { cupos: someCupos, height: heightPopUp }
          }
        }
      );
    }

  }

  aplicarFiltro(element, cmp) {
    if (element == 'fecha') {
      this.filtro.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
      this.filtro1.fecha = this.filtro.fecha;
      this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      // this.loadDataV2();
    } else {
      this.filtro.id_producto = cmp;
      this.filtro1.id_producto = cmp;
      if (cmp === 1 || cmp === 2 || cmp === 3 || cmp === 5) {
        this.filtrarForm.controls['selectedProducto'].setValue(null);
      }
      this.loadDataProducto();
    }
  }

  getItemsProductos() {
    this.otrosproductos = [];
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const dador = this.cuposDisponiblesApi[index];
      if (dador.destinos.length > 0) {
        for (let i = 0; i < dador.destinos.length; i++) {
          const destino = dador.destinos[i];
          if (destino.productos.length > 0) {
            for (let j = 0; j < destino.productos.length; j++) {
              const produc = destino.productos[j];
              if (produc.id_producto !== 1 && produc.id_producto !== 2 && produc.id_producto !== 3 && produc.id_producto !== 5) {
                const temp = {
                  id: produc.id_producto,
                  descripcion: this.detallesDisponiblesApi.producto[produc.id_producto].nombreProducto
                }
                this.otrosproductos.push(temp);
              }
            }
          }
        }
      }
    }
  }



}
