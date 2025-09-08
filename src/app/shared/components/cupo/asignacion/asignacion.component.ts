import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {  CupoV3 } from "app/shared/models/cupo";
import { CupoService } from "../cupo.service";
import { HomeService } from "../../home/home.service";
import { NomencladoresService } from "app/shared/services/nomencladores.service";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import {  Observable, Subscription, of, timer } from "rxjs";
import * as moment from "moment";

import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { AddCuposDisponiblesComponent } from "../add-cupos-disponibles/add-cupos-disponibles.component";
import { AddCuposSolicitadosComponent } from "../add-cupos-solicitados/add-cupos-solicitados.component";
import { AddSolicitudesC3Component } from "../cupera3/add-solicitudes-c3/add-solicitudes-c3.component";
import { InformacionCupoComponent } from "../informacion-cupo/informacion-cupo.component";
import { InformacionDemandaComponent } from "../informacion-demanda/informacion-demanda.component";

import { AsignarSolicitudComponent } from "../asignar-solicitud/asignar-solicitud.component";
import { DevolverComponent } from "../devolver/devolver.component";
import {
  CupoAsignadoApi,
  Demandas,
  CuposAsignar,
} from "app/shared/models/cuposDisponibles";
import { MessageService } from "app/shared/services/message.service";
import { InfoAplicarCabeceraComponent } from "../info-aplicar-cabecera/info-aplicar-cabecera.component";
import { RechazarCuposComponent } from "../rechazar-cupos/rechazar-cupos.component";

export class Producto {
  id: number;
  descripcion: string;
}
export class CupoAsignado {
  "id": number;
  "idCuitDestinatario": number;
  "nombre_destinatario": string;
  "s_puerto": string;
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
  "destino": string;
  "id_localidad": number;
  "caratulaMercadoATermino": string;
}

export class CupoDemandado {
  "id": number;
  "id_demandante": number;
  "nombre_demandante": string;
  "cuit": string;
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
  "isSelected": boolean = false;
}
export class Totales {
  "pendienteSoja": number = 0;
  "totalSoja": number = 0;
  "pendienteMaiz": number = 0;
  "totalMaiz": number = 0;
  "pendienteTrigo": number = 0;
  "totalTrigo": number = 0;
  "pendienteGirasol": number = 0;
  "totalGirasol": number = 0;
  "pendienteOtros": number = 0;
  "totalOtros": number = 0;
}
export class RowDisabled {
  "productoSoja": boolean = false;
  "productoMaiz": boolean = false;
  "productoTrigo": boolean = false;
  "productoGirasol": boolean = false;
  "productoOtros": boolean = false;
}

//Desde la api v2
export class Zona {
  id: number;
  descripcion: string;
}
export class Localidad {
  id: number;
  descripcion: string;
}
export class Caratula {
  id: string;
  descripcion: string;
}
@Component({
  selector: "app-asignacion",
  templateUrl: "./asignacion.component.html",
  styleUrls: ["./asignacion.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class AsignacionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fecha: string;
  @Input() listado;
  @Input() detalles;
  @Input() productosCentro;
  @Input() dataDemanda;
  @Output() cambiarFecha = new EventEmitter();

  cuposDisponibles: CupoV3[] = [];
  filtrarForm: FormGroup;
  now = new Date();
  minDate: any;
  seleccionados = [];
  isCustomizerOpen2: boolean = false;
  public getItemSub: Subscription;
  panningColumns = ["destino"];
  spans = [];
  spansDemanda = [];
  valorInicial: Totales = {
    pendienteSoja: 0,
    pendienteMaiz: 0,
    pendienteTrigo: 0,
    pendienteGirasol: 0,
    pendienteOtros: 0,
    totalSoja: 0,
    totalMaiz: 0,
    totalTrigo: 0,
    totalGirasol: 0,
    totalOtros: 0,
  };
  totalesSinAsignar: Totales = this.valorInicial;
  totalesDemandados: Totales = this.valorInicial;
  columnDisabled: RowDisabled = {
    productoSoja: false,
    productoMaiz: false,
    productoTrigo: false,
    productoGirasol: false,
    productoOtros: false,
  };
  otrosproductos = [];
  cupoAsignados: CupoAsignado[] = [];
  demandaCupo: CupoDemandado[] = [];
  demandaCupoOriginal: CupoDemandado[] = [];
  selectCupoAsignados: CupoAsignado[] = [];
  selectCupoDemandado: CupoDemandado[] = [];
  dataSource = new MatTableDataSource();
  dataSourceDemanda = new MatTableDataSource();
  displayedColumns: string[] = [
    "nombre_destinatario",
    "nombre_destino",
    "total",
    "producto1",
    "producto2",
    "producto3",
    "producto4",
    "producto5",
  ];
  displayedColumnsDemanda: string[] = [
    "nombre_demandante",
    "nombre_destino_d",
    "total_d",
    "producto1_d",
    "producto2_d",
    "producto3_d",
    "producto4_d",
    "producto5_d",
  ];
  productos: Producto[] = [
    {
      id: 1,
      descripcion: "Soja",
    },
    {
      id: 2,
      descripcion: "Maiz",
    },
    {
      id: 3,
      descripcion: "Trigo",
    },
    {
      id: 5,
      descripcion: "Girasol",
    },
  ];

  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `,
  };
  filtro = {
    fechaCupo: this.now,
    id_producto: 0,
    producto: "",
  };
  filtroV2 = {
    id_producto: "1",
    idCuitDestinatario: "-1",
    idDestino: "",
    destSolic: "",
    zona: "",
    corredor: "",
    contraparte: "",
    producto: "",
    contrato: "",
  };
  indexCebada: number;
  public pageSize = 5;
  public totalSize = 0;
  filtroespeciales = [];
  quantity: number = 0;
  public fechaBuscada: string = "";

  height = 400;
  y = 346;
  oldY = 0;
  grabber = false;
  id_producto: number;
  fechaHoraUltimaActualizacion: string = "";
  ElapsTime: number = 30;
  InitialTime: number = 0;
  First: boolean = true;
  searchEndDate: moment.Moment;
  InitialDate: moment.Moment;
  remainingTime: number;
  private subscription: Subscription;
  everySecond: Observable<number> = timer(0, 1000);

  cuposDisponiblesApi: any[] = [];
  cuposDemandadosApi: any[] = [];
  solicitudesApi: any[] = [];
  detallesDisponiblesApi: any;
  detallesDemandadosApi: any;

  zonas: Zona[] = [
    {
      id: 0,
      descripcion: "Sin especificar",
    },
  ];
  localidades: Localidad[] = [
    {
      id: -1,
      descripcion: "Todas",
    },
  ];
  caratulas: Caratula[] = [
    {
      id: "Todas",
      descripcion: "Todas",
    },
  ];

  zonaControl = new FormControl("");
  localidadControl = new FormControl("");
  caratulaControl = new FormControl("");

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  @HostListener("document:mouseup", ["$event"])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  resizer(offsetY: number) {
    this.height += offsetY;
  }

  @HostListener("document:mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    this.grabber = true;
    this.oldY = event.clientY;
  }

  SearchDate: moment.Moment = moment();
  TimerExpired: EventEmitter<any> = new EventEmitter<any>();
  horas: number = 0;
  minutes: number;
  minute: string;
  seconds: number;
  second: string;
  message: any;
  isInMobile = false;
  selectedOtroProducto = "";
  usaMTR: boolean = false;

  constructor(
    private cupoService: CupoService,
    private homeService: HomeService,
    private nomencladoresService: NomencladoresService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private messageService: MessageService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    public router: Router
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "IniciarProducto":
            this.otrosproductos = [];
            break;
          case "Asignacion":
            this.getDataCuposDisponibles(this.message.data);
            if (this.filtrarForm.controls["selectedProducto"].value != 0) {
              this.aplicarFiltroProducto(
                this.filtrarForm.controls["selectedProducto"].value
              );
            }
            break;
          case "DemandasV1":
            this.getDataCuposDemandados(this.message.data);
            if (this.filtrarForm.controls["selectedProducto"].value != 0) {
              this.aplicarFiltroProducto(
                this.filtrarForm.controls["selectedProducto"].value
              );
            }
            break;

          default:
            break;
        }
      });
    this.isInMobile = window.screen.width > 991 ? false : true;
  }

  ngOnInit() {
    this.minDate = this.now;
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
    this.filtrarForm = new FormGroup({
      selectedFecha: new FormControl(new Date(this.fecha + " 12:00:00")),
      selectedProducto: new FormControl(this.filtro.id_producto),
      quantity: new FormControl(this.quantity),
    });

    this.getConfigCentro();
    this.getZonas();
    this.fechaBuscada = this.homeService.formatoFecha(this.now, "amd", "-");
    this.localidadControl.setValue(this.localidades[0].id);
    this.caratulaControl.setValue(this.caratulas[0].id);
    this.getData();
  }

  getData() {
    this.otrosproductos = [];
    if (this.listado.length > 0) {
      const data = {
        listado: this.listado,
        detalles: this.detalles,
      };
      this.getDataCuposDisponibles(data);
    }

    this.getDataCuposDemandados(this.dataDemanda);
    if (this.otrosproductos.length > 0) {
      this.aplicarFiltroProducto({ value: this.otrosproductos[0].id });
    }
  }

  getDataCuposDisponibles(data) {
    this.cuposDisponiblesApi = [];
    this.solicitudesApi = [];
    this.selectCupoAsignados = [];
    this.cupoAsignados = [];
    this.filtro.producto = "";
    this.filtro.id_producto = 0;
    // this.dataSource.data = this.cupoAsignados;
    this.totalesSinAsignar = this.valorInicial;
    this.columnDisabled = {
      productoSoja: false,
      productoMaiz: false,
      productoTrigo: false,
      productoGirasol: false,
      productoOtros: false,
    };
    this.totalesSinAsignar = {
      pendienteSoja: 0,
      pendienteMaiz: 0,
      pendienteTrigo: 0,
      pendienteGirasol: 0,
      pendienteOtros: 0,
      totalSoja: 0,
      totalMaiz: 0,
      totalTrigo: 0,
      totalGirasol: 0,
      totalOtros: 0,
    };
    let indice = 0;
    this.cuposDisponiblesApi = data.listado;
    this.detallesDisponiblesApi = data.detalles;
    this.solicitudesApi = data.solicitudes;
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const listado = this.cuposDisponiblesApi[index];
      if (listado.destinos.length > 0) {
        for (let i = 0; i < listado.destinos.length; i++) {
          const destino = listado.destinos[i];
          if (destino.productos.length > 0) {
            let newRow = new CupoAsignado();
            indice++;
            newRow.id = indice;
            newRow.idCuitDestinatario =
              listado.idCuitDestinatario == null
                ? ""
                : listado.idCuitDestinatario;
            newRow.nombre_destinatario =
              this.detallesDisponiblesApi.destinatario[
                listado.idCuitDestinatario
              ].nombreDestinatario == null
                ? "Sin definir"
                : this.detallesDisponiblesApi.destinatario[
                    listado.idCuitDestinatario
                  ].nombreDestinatario;
            newRow.id_destino = destino.id_destino;
            newRow.id_localidad = destino.id_localidad;
            newRow.nombre_destino =
              destino.id_destino !== 0
                ? this.detallesDisponiblesApi.destino[destino.id_destino]
                    .nombreDestino
                : "Sin definir";
            newRow.s_puerto =
              destino.id_destino !== 0
                ? this.detallesDisponiblesApi.destino[destino.id_destino]
                    .s_puerto
                : null;
            newRow.checked = false;

            // Busco localidades y las agrego al select
            let indexLocalidad = this.localidades.findIndex(
              (localidad) => localidad.descripcion === destino.nombre_localidad
            );

            if (indexLocalidad === -1) {
              let localidad: Localidad = {
                descripcion: destino.nombre_localidad,
                id: destino.id_localidad,
              };
              this.localidades.push(localidad);
            }
            // ----------------------------------------

            for (let j = 0; j < destino.productos.length; j++) {
              const producto = destino.productos[j];
              switch (producto.id_producto) {
                case 1:
                  newRow.pendientes1 = parseInt(producto.pendientes);
                  newRow.total1 = parseInt(producto.total);
                  break;
                case 2:
                  newRow.pendientes2 = parseInt(producto.pendientes);
                  newRow.total2 = parseInt(producto.total);
                  break;
                case 3:
                  newRow.pendientes3 = parseInt(producto.pendientes);
                  newRow.total3 = parseInt(producto.total);
                  break;
                case 5:
                  newRow.pendientes5 = parseInt(producto.pendientes);
                  newRow.total5 = parseInt(producto.total);
                  break;
                default:
                  newRow.pendientes4 = parseInt(producto.pendientes);
                  newRow.total4 = parseInt(producto.total);
                  let prodparams = {
                    id: producto.id_producto,
                    descripcion:
                      this.detallesDisponiblesApi.producto[producto.id_producto]
                        .nombreProducto,
                  };
                  this.addProductoLista(prodparams);
                  break;
              }

              producto.cupos.forEach((cupo) => {
                let index;

                if (
                  cupo.caratulaMercadoATermino == "" ||
                  cupo.caratulaMercadoATermino == null
                ) {
                  index = this.caratulas.findIndex(
                    (caratula) => caratula.descripcion === "Sin Especificar"
                  );
                } else {
                  index = this.caratulas.findIndex(
                    (caratula) =>
                      caratula.descripcion === cupo.caratulaMercadoATermino
                  );
                }
                if (index === -1) {
                  if (
                    cupo.caratulaMercadoATermino == "" ||
                    cupo.caratulaMercadoATermino == null
                  ) {
                    let newCaratula: Caratula = {
                      descripcion: "Sin Especificar",
                      id: "Sin Especificar",
                    };
                    this.caratulas.push(newCaratula);
                  } else {
                    let newCaratula: Caratula = {
                      descripcion: cupo.caratulaMercadoATermino,
                      id: cupo.caratulaMercadoATermino,
                    };
                    this.caratulas.push(newCaratula);
                  }
                }
              });
            }
            this.cupoAsignados.push(newRow);
          }
        }
      }
    }

    this.caratulas.shift();
    this.caratulas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

    let indexSinEspecificar = this.caratulas.findIndex(
      (caratula) => caratula.descripcion === "Sin Especificar"
    );

    if (indexSinEspecificar != -1) {
      this.caratulas.splice(indexSinEspecificar, 1);
      this.caratulas.unshift({
        id: "Sin Especificar",
        descripcion: "Sin Especificar",
      });
      this.caratulas.unshift({
        id: "Todas",
        descripcion: "Todas",
      });
    } else {
      this.caratulas.unshift({
        id: "Todas",
        descripcion: "Todas",
      });
    }

    this.totalizarCuposDisponibles();

    this.dataSource.data = this.cupoAsignados;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spanRow("nombre_destinatario", (d) => d.nombre_destinatario);

    // this.cupoAsignados.forEach((element) => {
    //   this.cupoService
    //     .getLocalidadDestino(element.id_destino)
    //     .subscribe((resp) => {
    //       let index = this.localidades.findIndex(
    //         (localidad) => localidad.descripcion === resp.data.nombreLocalidad
    //       );
    //       if (index === -1) {
    //         let localidad: Localidad = {
    //           descripcion: resp.data.nombreLocalidad,
    //           id: element.id_localidad,
    //         };
    //         this.localidades.push(localidad);
    //       }
    //     });
    // });

    /* if (this.filtrarForm.controls['selectedProducto'].value != 0) {
      this.aplicarFiltroProducto(this.filtrarForm.controls['selectedProducto'].value)
    } */
  }

  aplicarFiltroCaratula(valor) {
    // Cupos
    if (valor === "Todas") {
      if (this.listado.length > 0) {
        this.localidades = [
          {
            id: -1,
            descripcion: "Todas",
          },
        ];
        const data = {
          listado: this.listado,
          detalles: this.detalles,
        };
        this.getDataCuposDisponibles(data);
      }
    } else {
      if (this.listado.length > 0) {
        let lista = this.listado.map((item) => {
          let destinos = item.destinos.map((destino) => {
            let productos = destino.productos.map((producto) => {
              let cupos;
              if (valor == "Sin Especificar") {
                cupos = producto.cupos.filter(
                  (cupo) => cupo.caratulaMercadoATermino === ""
                );
              } else {
                cupos = producto.cupos.filter(
                  (cupo) => cupo.caratulaMercadoATermino === valor
                );
              }
              if (cupos.length > 0) {
                let pendientes = cupos.filter((cupo) => cupo.asignado === "1");
                return {
                  cupos: cupos,
                  id_producto: producto.id_producto,
                  pendientes: pendientes.length,
                  total: cupos.length,
                };
              }
            });

            let filtered_productos = productos.filter(function (item) {
              return item != null;
            });

            if (filtered_productos.length > 0) {
              return {
                productos: filtered_productos,
                id_destino: destino.id_destino,
                id_localidad: destino.id_localidad,
              };
            }
          });

          let filtered_destinos = destinos.filter(function (item) {
            return item != null;
          });

          if (filtered_destinos.length > 0) {
            return {
              idCuitDestinatario: item.idCuitDestinatario,
              destinos: filtered_destinos,
            };
          }
        });

        let filtered_list = lista.filter(function (item) {
          return item != null;
        });

        this.localidades = [
          {
            id: -1,
            descripcion: "Todas",
          },
        ];

        const data = {
          listado: filtered_list,
          detalles: this.detalles,
        };

        this.getDataCuposDisponibles(data);
      }
    }
    // Demandas
    this.getDataCuposDemandados(this.dataDemanda, valor);
  }

  aplicarFiltroLocalidad(valor) {
    if (valor === -1) {
      if (this.listado.length > 0) {
        this.caratulas = [
          {
            id: "Todas",
            descripcion: "Todas",
          },
        ];

        const data = {
          listado: this.listado,
          detalles: this.detalles,
        };
        this.getDataCuposDisponibles(data);
      }
    } else {
      if (this.listado.length > 0) {
        let lista = this.listado.map((item) => {
          let destinos = item.destinos.filter(
            (item) => item.id_localidad === valor
          );
          if (destinos.length > 0) {
            return {
              idCuitDestinatario: item.idCuitDestinatario,
              destinos: destinos,
            };
          }
        });

        let filtered_list = lista.filter(function (item) {
          return item != null;
        });

        this.caratulas = [
          {
            id: "Todas",
            descripcion: "Todas",
          },
        ];

        const data = {
          listado: filtered_list,
          detalles: this.detalles,
        };
        this.getDataCuposDisponibles(data);
      }
    }
  }

  getDataCuposDemandados(data, filtro = null) {
    this.selectCupoDemandado = [];
    if (this.loader === null) {
      this.loader.open();
    }
    this.cuposDemandadosApi = [];
    this.detallesDemandadosApi = [];
    this.demandaCupo = [];
    this.demandaCupoOriginal = [];
    this.totalesDemandados = this.valorInicial;
    this.columnDisabled = {
      productoSoja: false,
      productoMaiz: false,
      productoTrigo: false,
      productoGirasol: false,
      productoOtros: false,
    };
    this.totalesDemandados = {
      pendienteSoja: 0,
      pendienteMaiz: 0,
      pendienteTrigo: 0,
      pendienteGirasol: 0,
      pendienteOtros: 0,
      totalSoja: 0,
      totalMaiz: 0,
      totalTrigo: 0,
      totalGirasol: 0,
      totalOtros: 0,
    };

    if (filtro) {
      if (filtro === "Todas") {
        this.cuposDemandadosApi = data.demandantes;
        this.detallesDemandadosApi = data.detalles;
        this.zonaControl.setValue(this.zonas[0].id);
        this.aplicarFiltroZona(this.zonas[0].id);
      } else {
        if (data.demandantes.length > 0) {
          let lista = data.demandantes.map((item) => {
            let productos = item.productos.map((producto) => {
              let demandas;
              if (filtro == "Sin Especificar") {
                demandas = producto.demandas.filter(
                  (dem) => dem.caratula_mtr === null
                );
              } else {
                demandas = producto.demandas.filter(
                  (dem) => dem.caratula_mtr === filtro
                );
              }
              let filtered_demandas = demandas.filter(function (item) {
                return item != null;
              });
              if (filtered_demandas.length > 0) {
                return {
                  demandas: filtered_demandas,
                  id_producto: producto.id_producto,
                };
              }
            });
            let filtered_productos = productos.filter(function (item) {
              return item != null;
            });
            if (filtered_productos.length > 0) {
              return {
                id_demandante: item.id_demandante,
                productos: filtered_productos,
              };
            }
          });

          let filtered_list = lista.filter(function (item) {
            return item != null;
          });

          this.cuposDemandadosApi = filtered_list;
          this.detallesDemandadosApi = data.detalles;
          this.zonaControl.setValue(this.zonas[0].id);
          this.aplicarFiltroZona(this.zonas[0].id);
        } else {
          this.cuposDemandadosApi = [];
          this.detallesDemandadosApi = [];
          this.zonaControl.setValue(this.zonas[0].id);
          this.aplicarFiltroZona(this.zonas[0].id);
        }
      }
    } else {
      if (data == undefined) {
        this.cuposDemandadosApi = [];
        this.detallesDemandadosApi = [];
        this.zonaControl.setValue(this.zonas[0].id);
        this.aplicarFiltroZona(this.zonas[0].id);
      } else {
        this.cuposDemandadosApi = data.demandantes;
        this.detallesDemandadosApi = data.detalles;
        this.zonaControl.setValue(this.zonas[0].id);
        this.aplicarFiltroZona(this.zonas[0].id);
      }
    }

    let indice = 0;
    for (
      let index = 0;
      index < this.cuposDemandadosApi.length
        ? 0
        : this.cuposDemandadosApi.length;
      index++
    ) {
      const demandante = this.cuposDemandadosApi[index];
      if (demandante.productos.length > 0) {
        let newRow = new CupoDemandado();
        indice++;
        newRow.id = indice;
        newRow.id_demandante = demandante.id_demandante;
        newRow.nombre_demandante =
          this.detallesDemandadosApi.id_demandante[
            demandante.id_demandante
          ].nombre_demandante;
        newRow.cuit =
          this.detallesDemandadosApi.id_demandante[
            demandante.id_demandante
          ].cuit;
        newRow.nombre_destino = "";
        newRow.checked = false;
        for (let i = 0; i < demandante.productos.length; i++) {
          const prod = demandante.productos[i];
          let totalPendientes = 0;
          let total = 0;
          prod.demandas.forEach((item) => {
            switch (this.zonas[0].id) {
              case -1:
                totalPendientes =
                  totalPendientes + (item.cantidad - item.asignado);
                total = total + item.cantidad;
                break;
              case 0:
                if (!item.id_zona_solicitud) {
                  totalPendientes =
                    totalPendientes + (item.cantidad - item.asignado);
                  total = total + item.cantidad;
                }
                break;
              default:
                if (item.id_zona_solicitud == this.zonas[0].id) {
                  totalPendientes =
                    totalPendientes + (item.cantidad - item.asignado);
                  total = total + item.cantidad;
                }
                break;
            }
          });
          switch (prod.id_producto) {
            case 1:
              newRow.pendientes1 = totalPendientes;
              newRow.total1 = total;
              break;
            case 2:
              newRow.pendientes2 = totalPendientes;
              newRow.total2 = total;
              break;
            case 3:
              newRow.pendientes3 = totalPendientes;
              newRow.total3 = total;
              break;
            case 5:
              newRow.pendientes5 = totalPendientes;
              newRow.total5 = total;
              break;
            default:
              let prodparams = {
                id: prod.id_producto,
                descripcion:
                  this.detallesDemandadosApi.id_producto[prod.id_producto]
                    .nombre_producto,
              };
              newRow.pendientes4 = totalPendientes;
              newRow.total4 = total;
              this.addProductoLista(prodparams);
              break;
          }
        }
        if (
          newRow.pendientes1 != 0 ||
          newRow.total1 != 0 ||
          newRow.pendientes2 != 0 ||
          newRow.total2 != 0 ||
          newRow.pendientes3 != 0 ||
          newRow.total3 != 0 ||
          newRow.pendientes4 != 0 ||
          newRow.total4 != 0 ||
          newRow.pendientes5 != 0 ||
          newRow.total5 != 0
        ) {
          this.demandaCupo.push(newRow);
        }
      }
    }
    this.totalizarCuposDemandados();
    this.dataSourceDemanda.data = this.demandaCupo;
    this.demandaCupoOriginal = this.demandaCupo;
    this.dataSourceDemanda.paginator = this.paginator;
    this.dataSourceDemanda.sort = this.sort;
    this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
    this.zonaControl.setValue(this.zonas[0].id);

    /* this.cupoService.getDemandaCupos(fecha).subscribe(
      res => {
        this.cuposDemandadosApi = res.data.demandantes;
        this.detallesDemandadosApi = res.data.detalles;
        this.zonaControl.setValue(this.zonas[0].id);
        this.aplicarFiltroZona(this.zonas[0].id);
        if (this.loader !== null) {
          this.loader.close();
        }
      },
      error => {
        this.loader.close();

      }
 ); */

    if (this.loader !== null) {
      this.loader.close();
    }
  }

  totalizarCuposDisponibles() {
    for (let index = 0; index < this.cupoAsignados.length; index++) {
      const element = this.cupoAsignados[index];
      this.totalesSinAsignar.pendienteSoja += element.pendientes1;
      this.totalesSinAsignar.pendienteMaiz += element.pendientes2;
      this.totalesSinAsignar.pendienteTrigo += element.pendientes3;
      this.totalesSinAsignar.pendienteGirasol += element.pendientes5;
      this.totalesSinAsignar.pendienteOtros += element.pendientes4;
      this.totalesSinAsignar.totalSoja += element.total1;
      this.totalesSinAsignar.totalMaiz += element.total2;
      this.totalesSinAsignar.totalTrigo += element.total3;
      this.totalesSinAsignar.totalGirasol += element.total5;
      this.totalesSinAsignar.totalOtros += element.total4;
    }
  }

  totalizarCuposDemandados() {
    this.totalesDemandados.pendienteSoja = 0;
    this.totalesDemandados.pendienteMaiz = 0;
    this.totalesDemandados.pendienteTrigo = 0;
    this.totalesDemandados.pendienteGirasol = 0;
    this.totalesDemandados.pendienteOtros = 0;
    this.totalesDemandados.totalSoja = 0;
    this.totalesDemandados.totalMaiz = 0;
    this.totalesDemandados.totalTrigo = 0;
    this.totalesDemandados.totalGirasol = 0;
    this.totalesDemandados.totalOtros = 0;

    for (let index = 0; index < this.demandaCupo.length; index++) {
      const element = this.demandaCupo[index];
      this.totalesDemandados.pendienteSoja += element.pendientes1;
      this.totalesDemandados.pendienteMaiz += element.pendientes2;
      this.totalesDemandados.pendienteTrigo += element.pendientes3;
      this.totalesDemandados.pendienteGirasol += element.pendientes5;
      this.totalesDemandados.pendienteOtros += element.pendientes4;
      this.totalesDemandados.totalSoja += element.total1;
      this.totalesDemandados.totalMaiz += element.total2;
      this.totalesDemandados.totalTrigo += element.total3;
      this.totalesDemandados.totalGirasol += element.total5;
      this.totalesDemandados.totalOtros += element.total4;
    }
  }

  aplicarFiltroProducto(valor) {
    this.filtro.id_producto = valor.value == undefined ? valor : valor.value;
    this.otrosproductos.forEach((element) => {
      if (element.id == this.filtro.id_producto) {
        this.filtro.producto = element.descripcion;
        this.selectedOtroProducto = this.filtro.producto;
      }
    });
    for (let index = 0; index < this.cupoAsignados.length; index++) {
      const element = this.cupoAsignados[index];
      let temp = this.getCuposAsignados(
        element.idCuitDestinatario,
        element.id_destino,
        this.filtro.id_producto
      );
      this.cupoAsignados[index].pendientes4 = temp.pendientes;
      this.cupoAsignados[index].total4 = temp.total;
    }
    let tempCupoAsignado = [];
    this.cupoAsignados.forEach((element) => {
      if (
        element.pendientes1 != 0 ||
        element.total1 != 0 ||
        element.pendientes2 != 0 ||
        element.total2 != 0 ||
        element.pendientes3 != 0 ||
        element.total3 != 0 ||
        element.pendientes4 != 0 ||
        element.total4 != 0 ||
        element.pendientes5 != 0 ||
        element.total5 != 0
      ) {
        tempCupoAsignado.push(element);
      }
    });
    this.dataSource.data = tempCupoAsignado;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spanRow("nombre_destinatario", (d) => d.nombre_destinatario);

    for (let index = 0; index < this.demandaCupo.length; index++) {
      const element = this.demandaCupo[index];
      let temp = this.getCuposDemandados(
        element.id_demandante,
        this.filtro.id_producto
      );
      this.demandaCupo[index].pendientes4 = temp.pendientes;
      this.demandaCupo[index].total4 = temp.total;
    }
    let tempDemanda = [];
    this.demandaCupo.forEach((element) => {
      if (
        element.pendientes1 != 0 ||
        element.total1 != 0 ||
        element.pendientes2 != 0 ||
        element.total2 != 0 ||
        element.pendientes3 != 0 ||
        element.total3 != 0 ||
        element.pendientes4 != 0 ||
        element.total4 != 0 ||
        element.pendientes5 != 0 ||
        element.total5 != 0
      ) {
        tempDemanda.push(element);
      }
    });
    this.dataSourceDemanda.data = tempDemanda;
    this.dataSourceDemanda.paginator = this.paginator;
    this.dataSourceDemanda.sort = this.sort;
    this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
  }

  aplicarFiltroZona(valor) {
    this.demandaCupo = [];
    this.demandaCupoOriginal = [];
    this.totalesDemandados = this.valorInicial;
    this.columnDisabled = {
      productoSoja: false,
      productoMaiz: false,
      productoTrigo: false,
      productoGirasol: false,
      productoOtros: false,
    };
    this.totalesDemandados = {
      pendienteSoja: 0,
      pendienteMaiz: 0,
      pendienteTrigo: 0,
      pendienteGirasol: 0,
      pendienteOtros: 0,
      totalSoja: 0,
      totalMaiz: 0,
      totalTrigo: 0,
      totalGirasol: 0,
      totalOtros: 0,
    };
    let indice = 0;
    for (let index = 0; index < this.cuposDemandadosApi.length; index++) {
      const demandante = this.cuposDemandadosApi[index];
      if (demandante.productos.length > 0) {
        let newRow = new CupoDemandado();
        indice++;
        newRow.id = indice;
        newRow.id_demandante = demandante.id_demandante;
        newRow.nombre_demandante =
          this.detallesDemandadosApi.id_demandante[
            demandante.id_demandante
          ].nombre_demandante;
        newRow.cuit =
          this.detallesDemandadosApi.id_demandante[
            demandante.id_demandante
          ].cuit;
        newRow.nombre_destino = "";
        newRow.checked = false;
        for (let i = 0; i < demandante.productos.length; i++) {
          const prod = demandante.productos[i];
          let totalPendientes = 0;
          let total = 0;
          prod.demandas.forEach((item) => {
            switch (valor) {
              case -1:
                totalPendientes =
                  totalPendientes + (item.cantidad - item.asignado);
                total = total + item.cantidad;
                break;
              case 0:
                if (!item.id_zona_solicitud) {
                  totalPendientes =
                    totalPendientes + (item.cantidad - item.asignado);
                  total = total + item.cantidad;
                }
                break;
              default:
                if (item.id_zona_solicitud == valor) {
                  totalPendientes =
                    totalPendientes + (item.cantidad - item.asignado);
                  total = total + item.cantidad;
                }
                break;
            }
          });
          switch (prod.id_producto) {
            case 1:
              newRow.pendientes1 = totalPendientes;
              newRow.total1 = total;
              break;
            case 2:
              newRow.pendientes2 = totalPendientes;
              newRow.total2 = total;
              break;
            case 3:
              newRow.pendientes3 = totalPendientes;
              newRow.total3 = total;
              break;
            case 5:
              newRow.pendientes5 = totalPendientes;
              newRow.total5 = total;
              break;
            default:
              let prodparams = {
                id: prod.id_producto,
                descripcion:
                  this.detallesDemandadosApi.id_producto[prod.id_producto]
                    .nombre_producto,
              };
              this.addProductoLista(prodparams);
              break;
          }

          prod.demandas.forEach((demanda) => {
            let index;
            if (demanda.caratula_mtr == "" || demanda.caratula_mtr == null) {
              index = this.caratulas.findIndex(
                (caratula) => caratula.descripcion === "Sin Especificar"
              );
            } else {
              index = this.caratulas.findIndex(
                (caratula) => caratula.descripcion === demanda.caratula_mtr
              );
            }
            if (index === -1) {
              if (demanda.caratula_mtr == "" || demanda.caratula_mtr == null) {
                let newCaratula: Caratula = {
                  descripcion: "Sin Especificar",
                  id: "Sin Especificar",
                };
                this.caratulas.push(newCaratula);
              } else {
                let newCaratula: Caratula = {
                  descripcion: demanda.caratula_mtr,
                  id: demanda.caratula_mtr,
                };
                this.caratulas.push(newCaratula);
              }
            }
          });
        }
        if (
          newRow.pendientes1 != 0 ||
          newRow.total1 != 0 ||
          newRow.pendientes2 != 0 ||
          newRow.total2 != 0 ||
          newRow.pendientes3 != 0 ||
          newRow.total3 != 0 ||
          newRow.pendientes4 != 0 ||
          newRow.total4 != 0 ||
          newRow.pendientes5 != 0 ||
          newRow.total5 != 0
        ) {
          this.demandaCupo.push(newRow);
        }
      }
    }

    this.caratulas.shift();
    this.caratulas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

    let indexSinEspecificar = this.caratulas.findIndex(
      (caratula) => caratula.descripcion === "Sin Especificar"
    );

    if (indexSinEspecificar != -1) {
      this.caratulas.splice(indexSinEspecificar, 1);
      this.caratulas.unshift({
        id: "Sin Especificar",
        descripcion: "Sin Especificar",
      });
      this.caratulas.unshift({
        id: "Todas",
        descripcion: "Todas",
      });
    } else {
      this.caratulas.unshift({
        id: "Todas",
        descripcion: "Todas",
      });
    }

    this.totalizarCuposDemandados();
    this.dataSourceDemanda.data = this.demandaCupo;
    this.demandaCupoOriginal = this.demandaCupo;
    this.dataSourceDemanda.paginator = this.paginator;
    this.dataSourceDemanda.sort = this.sort;
    this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
    if (this.filtrarForm.controls["selectedProducto"].value != 0)
      this.aplicarFiltroProducto(
        this.filtrarForm.controls["selectedProducto"].value
      );
  }

  getCuposAsignados(id_dador, id_destino, id_producto) {
    let valores = {
      pendientes: 0,
      total: 0,
    };
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      let dador = this.cuposDisponiblesApi[index];
      if (dador.idCuitDestinatario == id_dador) {
        for (let i = 0; i < dador.destinos.length; i++) {
          let destino = dador.destinos[i];
          if (destino.id_destino == id_destino) {
            for (let j = 0; j < destino.productos.length; j++) {
              let prod = destino.productos[j];
              if (prod.id_producto == id_producto) {
                valores.pendientes = prod.pendientes;
                valores.total = prod.total;
                return valores;
              }
            }
          }
        }
      }
    }
    return valores;
  }
  getCuposDemandados(id_demandante, id_producto) {
    let valores = {
      pendientes: 0,
      total: 0,
    };
    for (let index = 0; index < this.cuposDemandadosApi.length; index++) {
      const demandante = this.cuposDemandadosApi[index];
      if (demandante.id_demandante == id_demandante) {
        for (let index = 0; index < demandante.productos.length; index++) {
          const element = demandante.productos[index];
          if (element.id_producto == id_producto) {
            let totalPendientes = 0;
            let total = 0;
            element.demandas.forEach((item) => {
              totalPendientes =
                totalPendientes + (item.cantidad - item.asignado);
              total = total + item.cantidad;
            });
            valores.pendientes = totalPendientes;
            valores.total = total;
          }
        }
      }
    }
    return valores;
  }

  getItemsProductos() {
    this.otrosproductos = [];
    this.cupoService.getProductos().subscribe((data) => {
      data.data.forEach((element) => {
        if (
          element.id !== 1 &&
          element.id !== 2 &&
          element.id !== 3 &&
          element.id !== 5
        ) {
          this.otrosproductos.push(element);
        }
      });
      if (this.otrosproductos.length > 0) {
        this.filtro.id_producto = this.otrosproductos[0].id;
        this.filtro.producto = this.otrosproductos[0].descripcion;
      }
      this.filtrarForm.controls["selectedProducto"].setValue(
        this.filtro.id_producto
      );
    });
  }

  addProductoLista(prod) {
    let encontrado = false;
    for (let i = 0; i < this.otrosproductos.length; i++) {
      if (this.otrosproductos[i].id === prod.id) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      this.otrosproductos.push(prod);
    }
    if (this.otrosproductos.length > 0) {
      this.filtro.id_producto = this.otrosproductos[0].id;
      this.filtro.producto = this.otrosproductos[0].descripcion;
      this.filtrarForm.controls["selectedProducto"].setValue(
        this.filtro.id_producto
      );
    }
  }

  onCheckboxChangeRowDisabledAsignado(chck, cupo, index, prod) {
    this.id_producto =
      prod === 4 ? this.filtrarForm.controls["selectedProducto"].value : prod;
    this.filtro.id_producto = this.id_producto;
    if (prod !== 4) {
      let ind = this.productos.findIndex(
        (item) => item.id === this.filtro.id_producto
      );
      this.filtro.producto = ind == -1 ? "" : this.productos[ind].descripcion;
    } else {
      let ind = this.otrosproductos.findIndex(
        (item) => item.id === this.filtro.id_producto
      );
      this.filtro.producto =
        ind == -1 ? "" : this.otrosproductos[ind].descripcion;
      this.selectedOtroProducto = this.filtro.producto;
    }
    if (chck.checked) {
      this.selectCupoAsignados.push(cupo);
    } else {
      let temparray: CupoAsignado[] = [];
      this.selectCupoAsignados.forEach((element) => {
        if (element.id !== cupo.id) {
          temparray.push(element);
        }
      });
      this.selectCupoAsignados = temparray;
    }
    if (
      this.selectCupoAsignados.length == 0 &&
      this.selectCupoDemandado.length == 0
    ) {
      this.columnDisabled = {
        productoSoja: false,
        productoMaiz: false,
        productoTrigo: false,
        productoGirasol: false,
        productoOtros: false,
      };
    } else {
      this.columnDisabled = {
        productoSoja: true,
        productoMaiz: true,
        productoTrigo: true,
        productoGirasol: true,
        productoOtros: true,
      };
      switch (prod) {
        case 1:
          this.columnDisabled.productoSoja = false;
          break;
        case 2:
          this.columnDisabled.productoMaiz = false;
          break;
        case 3:
          this.columnDisabled.productoTrigo = false;
          break;
        case 4:
          this.columnDisabled.productoOtros = false;
          break;
        case 5:
          this.columnDisabled.productoGirasol = false;
          break;
        default:
          break;
      }
    }
  }

  addCupoDisponibles() {
    let title = "Agregar Cupos Disponibles";
    this.filtroV2.id_producto =
      this.filtro.id_producto == 0 ? "1" : this.filtro.id_producto.toString();
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddCuposDisponiblesComponent,
      {
        width: "95vw",
        height: "97vh",
        disableClose: true,
        panelClass: "no-padding-dialog",
        data: {
          title: title,
          cupera: 1,
          filtros: this.filtroV2,
          destinatario: "",
          fechaSelected: this.filtrarForm.controls["selectedFecha"].value,
          productos: this.productosCentro,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.cambiarFecha.emit({ fecha: this.fechaBuscada });

      this.localidadControl.setValue(this.localidades[0].id);
      this.caratulaControl.setValue(this.caratulas[0].id);
      // this.getDataCuposDemandados(this.dataDemanda);
      return;
    });
  }
  addCupoSolicitados(tipo: number) {
    let title = "";
    let produc = [];
    this.productos.forEach((element) => {
      produc.push(element);
    });
    this.otrosproductos.forEach((element) => {
      produc.push(element);
    });
    let caratula = this.caratulaControl.value==='Todas' ? null: {
      id: this.caratulaControl.value.id,
      descripcion: this.caratulaControl.value.descripcion,
    };
    let zona = this.zonas.find( item => item.id == this.zonaControl.value)
    if (tipo === 1) {
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        AddCuposSolicitadosComponent,
        {
          width: "48vw",
          height: "65vh",
          disableClose: true,
          data: { title: title,
            tipo: tipo,
            redirigir: false,
            productos: this.productosCentro,
            caratula: caratula,
            zona: zona }
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.cambiarFecha.emit({ fecha: this.fechaBuscada });
        //this.getDataCuposDemandados(this.fechaBuscada);
        return;
      });
    } else {
      //Escoger si mostrar de 1.0 o 25
      const formularioCupera = localStorage.getItem("formularioCupera");
      switch (formularioCupera) {
        case "1":
          let dialogRef: MatDialogRef<any> = this.dialog.open(
            AddCuposSolicitadosComponent,
            {
              width: "720px",
              height: "80vh",
              disableClose: true,
              data: {
                title: title,
                tipo: 0,
                productos: this.productosCentro,
                redirigir: false,
              },
            }
          );
          dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
              return;
            }
            //this.renderDataTable(this.fechaBuscada);
            //this.getDataCuposDisponibles(this.fechaBuscada);
            this.cambiarFecha.emit({ fecha: this.fechaBuscada });
            //this.getDataCuposDemandados(this.fechaBuscada);
            return;
          });
          break;
        case "2":
          let dialogRef2: MatDialogRef<any> = this.dialog.open(
            AddSolicitudesC3Component,
            {
              width: "70vw",
              height: "67vh",
              disableClose: true,
              data: {
                title: title,
                tipo: tipo,
                redirigir: false,
                productos: this.productosCentro,
                filtros: this.filtroV2,
              },
            }
          );
          dialogRef2.afterClosed().subscribe((res) => {
            if (!res) {
              return;
            }
            //this.renderDataTable(this.fechaBuscada);
            //this.getDataCuposDisponibles(this.fechaBuscada);
            /* let valorFecha = this.homeService.formatoFecha(
              this.filtrarForm.controls["selectedFecha"].value,
              "amd",
              "-"
            ); */
            //this.cambiarFecha.emit({ fecha: valorFecha });
            this.cambiarFecha.emit({ fecha: this.fechaBuscada });
            //this.getDataCuposDemandados(this.fechaBuscada);
            return;
          });
          break;
        case "3":
          let dialogRef3: MatDialogRef<any> = this.dialog.open(
            AddSolicitudesC3Component,
            {
              width: "70vw",
              height: "67vh",
              disableClose: true,
              data: {
                title: title,
                tipo: tipo,
                redirigir: false,
                productos: this.productosCentro,
                filtros: this.filtroV2,
              },
            }
          );
          dialogRef3.afterClosed().subscribe((res) => {
            if (!res) {
              return;
            }
            //this.renderDataTable(this.fechaBuscada);
            //this.getDataCuposDisponibles(this.fechaBuscada);
            /* let valorFecha = this.homeService.formatoFecha(
              this.filtrarForm.controls["selectedFecha"].value,
              "amd",
              "-"
            ); */
            //this.cambiarFecha.emit({ fecha: valorFecha });
            this.cambiarFecha.emit({ fecha: this.fechaBuscada });
            //this.getDataCuposDemandados(this.fechaBuscada);
            return;
          });
          break;

        default:
          break;
      }
    }
  }
  onCheckboxChangeRowDisabledDemanda(chck, cupo, index, prod) {
    if (chck.checked) {
      for (let index = 0; index < this.demandaCupo.length; index++) {
        const element = this.demandaCupo[index];
        if (element.id !== cupo.id) {
          this.demandaCupo[index].isSelected = true;
        }
      }
      this.selectCupoDemandado.push(cupo);
    } else {
      for (let index = 0; index < this.demandaCupo.length; index++) {
        this.demandaCupo[index].isSelected = false;
      }
      let temparray: CupoDemandado[] = [];
      this.selectCupoDemandado.forEach((element) => {
        if (element.id !== cupo.id) {
          temparray.push(element);
        }
      });
      this.selectCupoDemandado = temparray;
    }

    //this.dataSourceDemanda = new MatTableDataSource(this.demandaCupo);
    //this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
    if (
      this.selectCupoDemandado.length == 0 &&
      this.selectCupoAsignados.length == 0
    ) {
      this.columnDisabled = {
        productoSoja: false,
        productoMaiz: false,
        productoTrigo: false,
        productoGirasol: false,
        productoOtros: false,
      };
    } else {
      this.columnDisabled = {
        productoSoja: true,
        productoMaiz: true,
        productoTrigo: true,
        productoGirasol: true,
        productoOtros: true,
      };
      switch (prod) {
        case 1:
          this.columnDisabled.productoSoja = false;
          break;
        case 2:
          this.columnDisabled.productoMaiz = false;
          break;
        case 3:
          this.columnDisabled.productoTrigo = false;
          break;
        case 4:
          this.columnDisabled.productoOtros = false;
          break;
        case 5:
          this.columnDisabled.productoGirasol = false;
          break;
        default:
          break;
      }
    }
  }

  checkboxChange(chck, cupo, ref_Array) {
    if (chck.checked) {
      ref_Array.push(cupo);
    } else {
      let temparray: CupoAsignado[] = [];
      ref_Array.forEach((element) => {
        if (element.id !== cupo.id) {
          temparray.push(element);
        }
      });
      ref_Array = temparray;
    }
    return ref_Array;
  }

  aplicarFiltroFecha(fecha) {
    this.fechaBuscada = this.homeService.formatoFecha(fecha.value, "amd", "-");
    this.cambiarFecha.emit({ fecha: this.fechaBuscada });

    this.localidades = [
      {
        id: -1,
        descripcion: "Todas",
      },
    ];

    this.caratulas = [
      {
        id: "Todas",
        descripcion: "Todas",
      },
    ];
    // this.getDataCuposDemandados(this.fechaBuscada);
  }

  searchCupos(
    idCuitDestinatario: number,
    id_destino: number,
    id_producto: number
  ) {
    let cupos: CupoAsignadoApi[] = [];
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      let listado = this.cuposDisponiblesApi[index];
      if (listado.idCuitDestinatario == idCuitDestinatario) {
        for (let i = 0; i < listado.destinos.length; i++) {
          let destino = listado.destinos[i];
          if (destino.id_destino == id_destino) {
            for (let j = 0; j < destino.productos.length; j++) {
              let prod = destino.productos[j];
              if (prod.id_producto == id_producto) {
                cupos = prod.cupos;
                return cupos;
              }
            }
          }
        }
      }
    }
    return cupos;
  }

  searchDemandas(id_demandante: number, id_producto: number) {
    let demandas: Demandas[] = [];
    for (let index = 0; index < this.cuposDemandadosApi.length; index++) {
      const demandante = this.cuposDemandadosApi[index];
      if (demandante.id_demandante == id_demandante) {
        for (let index = 0; index < demandante.productos.length; index++) {
          const element = demandante.productos[index];
          if (element.id_producto == id_producto) {
            demandas = element.demandas;
            return demandas;
          }
        }
      }
    }
    return demandas;
  }

  BuscarSolicitudesVencidas() {
    this.demandaCupo = [];
    this.filtrarForm.controls["quantity"].value;
    this.quantity = this.filtrarForm.controls["quantity"].value;
    this.cupoService
      .getDemandasVencidas(this.filtrarForm.controls["quantity"].value)
      .subscribe(
        (res) => {
          let indice = 0;
          let demandaSolicitudes = res.data;
          this.totalesDemandados = this.valorInicial;
          for (let index = 0; index < demandaSolicitudes.length; index++) {
            const cupo = demandaSolicitudes[index];
            if (cupo.productos.length > 0) {
              for (let j = 0; j < cupo.productos.length; j++) {
                const prod = cupo.productos[j];
                let newRow = new CupoDemandado();
                indice++;
                newRow.id = indice;
                newRow.id_demandante = cupo.id_demandante;
                newRow.nombre_demandante = cupo.nombre_demandante;
                newRow.checked = false;
                switch (prod.id_producto) {
                  case 1:
                    newRow.pendientes1 =
                      parseInt(prod.cantidad) - parseInt(prod.asignado);
                    newRow.total1 = parseInt(prod.cantidad);
                    break;
                  case 2:
                    newRow.pendientes2 =
                      parseInt(prod.cantidad) - parseInt(prod.asignado);
                    newRow.total2 = parseInt(prod.cantidad);
                    break;
                  case 3:
                    newRow.pendientes3 =
                      parseInt(prod.cantidad) - parseInt(prod.asignado);
                    newRow.total3 = parseInt(prod.cantidad);
                    break;
                  case 4:
                    newRow.pendientes4 =
                      parseInt(prod.cantidad) - parseInt(prod.asignado);
                    newRow.total4 = parseInt(prod.cantidad);
                    break;
                  case 5:
                    newRow.pendientes5 =
                      parseInt(prod.cantidad) - parseInt(prod.asignado);
                    newRow.total5 = parseInt(prod.total);
                    break;
                  default:
                    break;
                }
                this.demandaCupo.push(newRow);
              }
            }
          }
          for (let index = 0; index < this.demandaCupo.length; index++) {
            const element = this.demandaCupo[index];
            this.totalesDemandados.pendienteSoja += element.pendientes1;
            this.totalesDemandados.pendienteMaiz += element.pendientes2;
            this.totalesDemandados.pendienteTrigo += element.pendientes3;
            this.totalesDemandados.pendienteGirasol += element.pendientes5;
            this.totalesDemandados.pendienteOtros += element.pendientes4;
            this.totalesDemandados.totalSoja += element.total1;
            this.totalesDemandados.totalMaiz += element.total2;
            this.totalesDemandados.totalTrigo += element.total3;
            this.totalesDemandados.totalGirasol += element.total5;
            this.totalesDemandados.totalOtros += element.total4;
          }

          this.dataSourceDemanda.data = this.demandaCupo;
          this.dataSourceDemanda.paginator = this.paginator;
          this.dataSourceDemanda.sort = this.sort;
          this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
        },
        (error) => {}
      );
    this.dataSourceDemanda.data = this.demandaCupo;
    this.dataSourceDemanda.paginator = this.paginator;
    this.dataSourceDemanda.sort = this.sort;
    this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
  }
  BuscarSolicitudesFecha() {
    this.demandaCupo = [];
    this.dataSourceDemanda.data = this.demandaCupo;
    this.filtrarForm.controls["quantity"].setValue(0);
    this.loader.open();
    this.cupoService.getDemandaCupos(this.fechaBuscada).subscribe(
      (res) => {
        this.loader.close();
        let indice = 0;
        this.demandaCupo = [];
        let demandaSolicitudes = res.data;
        this.totalesDemandados = this.valorInicial;
        for (let index = 0; index < demandaSolicitudes.length; index++) {
          const cupo = demandaSolicitudes[index];
          if (cupo.productos.length > 0) {
            for (let j = 0; j < cupo.productos.length; j++) {
              const prod = cupo.productos[j];
              let newRow = new CupoDemandado();
              indice++;
              newRow.id = indice;
              newRow.id_demandante = cupo.id_demandante;
              newRow.nombre_demandante = cupo.nombre_demandante;
              newRow.checked = false;
              switch (prod.id_producto) {
                case 1:
                  newRow.pendientes1 =
                    parseInt(prod.cantidad) - parseInt(prod.asignado);
                  newRow.total1 = parseInt(prod.cantidad);
                  break;
                case 2:
                  newRow.pendientes2 =
                    parseInt(prod.cantidad) - parseInt(prod.asignado);
                  newRow.total2 = parseInt(prod.cantidad);
                  break;
                case 3:
                  newRow.pendientes3 =
                    parseInt(prod.cantidad) - parseInt(prod.asignado);
                  newRow.total3 = parseInt(prod.cantidad);
                  break;
                case 4:
                  newRow.pendientes4 =
                    parseInt(prod.cantidad) - parseInt(prod.asignado);
                  newRow.total4 = parseInt(prod.cantidad);
                  break;
                case 5:
                  newRow.pendientes5 =
                    parseInt(prod.cantidad) - parseInt(prod.asignado);
                  newRow.total5 = parseInt(prod.total);
                  break;
                default:
                  break;
              }
              this.demandaCupo.push(newRow);
            }
          }
        }

        for (let index = 0; index < this.demandaCupo.length; index++) {
          const element = this.demandaCupo[index];
          this.totalesDemandados.pendienteSoja += element.pendientes1;
          this.totalesDemandados.pendienteMaiz += element.pendientes2;
          this.totalesDemandados.pendienteTrigo += element.pendientes3;
          this.totalesDemandados.pendienteGirasol += element.pendientes5;
          this.totalesDemandados.pendienteOtros += element.pendientes4;
          this.totalesDemandados.totalSoja += element.total1;
          this.totalesDemandados.totalMaiz += element.total2;
          this.totalesDemandados.totalTrigo += element.total3;
          this.totalesDemandados.totalGirasol += element.total5;
          this.totalesDemandados.totalOtros += element.total4;
        }
        this.dataSourceDemanda.data = this.demandaCupo;
        this.dataSourceDemanda.paginator = this.paginator;
        this.dataSourceDemanda.sort = this.sort;
        this.spanRowDemanda("nombre_demandante", (d) => d.nombre_demandante);
      },
      (error) => {
        this.loader.close();
      }
    );
  }

  LimpiarFiltro() {
    // this.getDataCuposDemandados(this.dataDemanda);
    this.cambiarFecha.emit({ fecha: this.fechaBuscada });
  }

  openPopUpInfoCupo(
    nombre_destinatario,
    idCuitDestinatario,
    id_product: number,
    pendiente,
    total,
    id_destino,
    producto
  ) {
    let id_producto: number =
      id_product === 4
        ? this.filtrarForm.controls["selectedProducto"].value
        : id_product;
    let cupos = this.searchCupos(idCuitDestinatario, id_destino, id_producto);
    let heightPop: number = 30 + total * 10;
    let heightPopUp: string = "30vh";
    if (heightPop > 80) heightPopUp = "80vh";
    else heightPopUp = heightPop.toString();
    let title = "INFORMACIÓN DE CUPOS";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InformacionCupoComponent,
      {
        width: "95vw",
        height: heightPopUp,
        disableClose: true,
        data: {
          title: title,
          payload: {
            cupos: cupos,
            nombre_destinatario: nombre_destinatario,
            idCuitDestinatario: idCuitDestinatario,
            fecha: this.homeService.formatoFecha(
              this.filtrarForm.controls["selectedFecha"].value,
              "amd",
              "-"
            ),
            id_producto:
              id_producto != 4 ? id_producto : this.filtro.id_producto,
            pendiente: pendiente,
            total: total,
            id_destino: id_destino,
            producto: producto != "Otros" ? producto : this.filtro.producto,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.getDataCuposDemandados(this.dataDemanda);
        this.cambiarFecha.emit({ fecha: this.fechaBuscada });
      }
      return;
    });
  }

  openPopUpInfoDemanda(
    id_demandante,
    id_producto: number,
    pendiente,
    total,
    producto
  ) {
    let demandas = this.searchDemandas(id_demandante, id_producto);
    let heightPop: number = 30 + total * 10;
    let heightPopUp: string = "30vh";
    if (heightPop > 80) heightPopUp = "80vh";
    else heightPopUp = heightPop.toString();
    let title = "INFORMACIÓN DE DEMANDAS";
    let fecha: any;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InformacionDemandaComponent,
      {
        width: "95vw",
        // height: heightPopUp,
        disableClose: true,
        data: {
          title: title,
          payload: {
            demandas: demandas,
            id_demandante: id_demandante,
            demandante:
              this.detallesDemandadosApi.id_demandante[id_demandante]
                .nombre_demandante,
            fecha: this.fechaBuscada,
            id_producto:
              id_producto != 4 ? id_producto : this.filtro.id_producto,
            pendiente: pendiente,
            total: total,
            producto: producto != "Otros" ? producto : this.filtro.producto,
            cantidadDias: this.quantity,
          },
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.getDataCuposDemandados(this.dataDemanda);
        this.cambiarFecha.emit({ fecha: this.fechaBuscada });
      }
      return;
    });
  }

  rechazarcupos() {
    if (this.selectCupoAsignados.length == 0) {
      this.atencionService
        .confirm({
          message: "Debe Seleccionar al menos un cupo para poder rechazar",
        })
        .subscribe((res) => {
          if (res) {
            return;
          }
        });
    } else {
      let valorFecha = this.homeService.formatoFecha(
        this.filtrarForm.controls["selectedFecha"].value,
        "amd",
        "-"
      );

      let cuposAsignados: CuposAsignar[] = [];

      this.selectCupoAsignados.forEach((element) => {
        let cupos = this.searchCupos(
          element.idCuitDestinatario,
          element.id_destino,
          this.id_producto
        );

        cupos.forEach((cupo) => {
          /* let temp = new CuposAsignar();
          temp
          temp.id = cupo.id;
          temp.idCupoTerminal = cupo.idCupoTerminal;
          temp.nombreDestinatario = cupo.nombreDestinatario;
          temp.nombreDestino = cupo.destino["descripcion"]; */
          cuposAsignados.push(cupo);
        });
      });

      let dialogRef: MatDialogRef<any> = this.dialog.open(
        RechazarCuposComponent,
        {
          width: "95vw",
          height: "93vh",
          disableClose: true,
          data: {
            payload: {
              cupos: cuposAsignados,
              fecha: this.homeService.formatoFecha(
                this.filtrarForm.controls["selectedFecha"].value,
                "amd",
                "-"
              ),
              id_producto: this.id_producto,
              filtro: this.filtro,
            },
          },
          panelClass: "no-padding-dialog",
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.cambiarFecha.emit({ fecha: valorFecha });
        return;
      });
    }
  }

  openPopUpAsignarSolicitud() {
    let valorFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );

    let cuposAsignados: CuposAsignar[] = [];

    this.selectCupoAsignados.forEach((element) => {
      let cupos = this.searchCupos(
        element.idCuitDestinatario,
        element.id_destino,
        this.id_producto
      );

      cupos.forEach((cupo) => {
        let temp = new CuposAsignar();
        temp.id = cupo.id;
        temp.idCupoTerminal = cupo.idCupoTerminal;
        temp.fecha = cupo.fecha;
        temp.idCuitDestinatario = cupo.idCuitDestinatario;
        temp.cosecha = cupo.cosecha;
        temp.cartaPorte = cupo.cartaPorte;
        temp.ctg = cupo.ctg;
        temp.idCupoEstado = cupo.idCupoEstado;
        temp.fechaCTG_Desde = cupo.fechaCTG_Desde;
        temp.ultimaGeocalizacion = cupo.ultimaGeocalizacion;
        temp.id_entregador = cupo.id_entregador;
        temp.id_pedido = cupo.id_pedido;
        temp.estado = cupo.estado;
        temp.id_producto = cupo.id_producto;
        temp.id_destino = cupo.id_destino;
        temp.idCuitMercadoATermino = cupo.idCuitMercadoATermino;
        temp.dominio = cupo.dominio;
        temp.fechaActivado = cupo.fechaActivado;
        temp.fechaArribado = cupo.fechaArribado;
        temp.fechaTomado = cupo.fechaTomado;
        temp.fechaConfirmado = cupo.fechaConfirmado;
        temp.fechaAnulado = cupo.fechaAnulado;
        temp.fechaDesviadoO = cupo.fechaDesviadoO;
        temp.fechaRegresado = cupo.fechaRegresado;
        temp.fechaDesviadoD = cupo.fechaDesviadoD;
        temp.fechaRechazado = cupo.fechaRechazado;
        temp.fechaDescargado = cupo.fechaDescargado;
        temp.codGrano = cupo.codGrano;
        temp.cuitChoferAfip = cupo.cuitChoferAfip;
        temp.cuitCorredorCAfip = cupo.cuitCorredorCAfip;
        temp.cuitCorredorVAfip = cupo.cuitCorredorVAfip;
        temp.cuitDestinatarioAfip = cupo.cuitDestinatarioAfip;
        temp.cuitDestinoAfip = cupo.cuitDestinoAfip;
        temp.cuitIntermediarioFleteAfip = cupo.cuitIntermediarioFleteAfip;
        temp.cuitMercadoATerminoAfip = cupo.cuitMercadoATerminoAfip;
        temp.cuitOrigenAfip = cupo.cuitOrigenAfip;
        temp.cuitRemComercialAfip = cupo.cuitRemComercialAfip;
        temp.cuitRepresentanteEntregadorAfip =
          cupo.cuitRepresentanteEntregadorAfip;
        temp.cuitTransportistaAfip = cupo.cuitTransportistaAfip;
        temp.esAnulado = cupo.esAnulado;
        temp.esRechazado = cupo.esRechazado;
        temp.idCupo = cupo.idCupo;
        temp.idTerminal = cupo.idTerminal;
        temp.idCuitOrigen = cupo.idCuitOrigen;
        temp.idCuitIntermediarioFlete = cupo.idCuitIntermediarioFlete;
        temp.idCuitRemComercial = cupo.idCuitRemComercial;
        temp.idCuitCorredorV = cupo.idCuitCorredorV;
        temp.idCuitCorredorC = cupo.idCuitCorredorC;
        temp.idCuitRepresentanteEntregador = cupo.idCuitRepresentanteEntregador;
        temp.idCuitDestino = cupo.idCuitDestino;
        temp.idCuitIntermediarioFleteFlete = cupo.idCuitIntermediarioFleteFlete;
        temp.idCuitTransportista = cupo.idCuitTransportista;
        temp.idCuitChofer = cupo.idCuitChofer;
        temp.fechaCTG_Hasta = cupo.fechaCTG_Hasta;
        temp.fechaCP_Carga = cupo.fechaCP_Carga;
        temp.fechaCP_Vto = cupo.fechaCP_Vto;
        temp.codLocalidadOrigen = cupo.codLocalidadOrigen;
        temp.codLocalidadDestino = cupo.codLocalidadDestino;
        temp.desvio = cupo.desvio;
        temp.idTurnoDetalle = cupo.idTurnoDetalle;
        temp.renspa = cupo.renspa;
        temp.nroEstablecimientoOrigen = cupo.nroEstablecimientoOrigen;
        temp.pesoNetoEstimado = cupo.pesoNetoEstimado;
        temp.kmRecorrer = cupo.kmRecorrer;
        temp.cantHorasSalidaCamion = cupo.cantHorasSalidaCamion;
        temp.nroContrato = cupo.nroContrato;
        temp.nroPlantaRuca = cupo.nroPlantaRuca;
        temp.idEstadoEnPlanta = cupo.idEstadoEnPlanta;
        temp.creado = cupo.creado;
        temp.modificado = cupo.modificado;
        temp.creadoPor = cupo.creadoPor;
        temp.modificadoPor = cupo.modificadoPor;
        temp.consultadoXAFIP = cupo.consultadoXAFIP;
        temp.ultima_latitud = cupo.ultima_latitud;
        temp.ultima_longitud = cupo.ultima_longitud;
        temp.asignado = cupo.asignado;
        temp.ultimo = cupo.ultimo;
        temp.nombreDestinatario = cupo.nombreDestinatario;
        temp.nombreDestino = cupo.nombreDestino;
        temp.pendiente = cupo.pendiente;
        temp.vinculado = cupo.vinculado;
        temp.caratulaMercadoATermino = cupo.caratulaMercadoATermino;
        cuposAsignados.push(temp);
      });
    });

    let demandas: Demandas[] = [];
    let id_demandante = 0;
    this.selectCupoDemandado.forEach((element) => {
      let demanda = this.searchDemandas(
        element.id_demandante,
        this.id_producto
      );
      demanda.forEach((cupo) => {
        cupo.id_demandante = element.id_demandante;
        id_demandante = element.id_demandante;
        cupo.id_producto = this.id_producto;
        cupo.nombreDemandante =
          this.detallesDemandadosApi.id_demandante[
            element.id_demandante
          ].nombre_demandante;
        cupo.cuitDemandante =
          this.detallesDemandadosApi.id_demandante[element.id_demandante].cuit;
        cupo.nombreProducto =
          this.detallesDemandadosApi.id_producto[
            this.id_producto
          ].nombre_producto;
        demandas.push(cupo);
      });
    });
    let title = "ASIGNACIÓN DE CUPOS";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AsignarSolicitudComponent,
      {
        width: "95vw",
        height: "93vh",
        disableClose: true,
        data: {
          title: title,
          payload: {
            fecha: this.homeService.formatoFecha(
              this.filtrarForm.controls["selectedFecha"].value,
              "amd",
              "-"
            ),
            solicitudCupos: this.selectCupoAsignados,
            solicitudDemanda: this.selectCupoDemandado,
            cuposSolicitados: cuposAsignados,
            demandasSolicitadas: demandas,
            filtro: this.filtro,
            id_producto: this.id_producto,
          },
        },
        panelClass: "no-padding-dialog",
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.cambiarFecha.emit({ fecha: valorFecha });
      //this.getDataCuposDemandados(this.fechaBuscada);
      return;
    });
  }

  openPopUpInfoAplicarCabecera() {
    let cuposAsignados: CuposAsignar[] = [];
    this.filtro.id_producto = this.id_producto;
    let ind = this.productos.findIndex(
      (item) => item.id === this.filtro.id_producto
    );
    this.filtro.producto = this.productos[ind].descripcion;
    this.selectCupoAsignados.forEach((element) => {
      let cupos = this.searchCupos(
        element.idCuitDestinatario,
        element.id_destino,
        this.id_producto
      );
      cupos.forEach((cupo) => {
        let temp = new CuposAsignar();
        temp.id = cupo.id;
        temp.idCupoTerminal = cupo.idCupoTerminal;
        temp.fecha = cupo.fecha;
        temp.idCuitDestinatario = cupo.idCuitDestinatario;
        temp.cosecha = cupo.cosecha;
        temp.cartaPorte = cupo.cartaPorte;
        temp.ctg = cupo.ctg;
        temp.idCupoEstado = cupo.idCupoEstado;
        temp.fechaCTG_Desde = cupo.fechaCTG_Desde;
        temp.ultimaGeocalizacion = cupo.ultimaGeocalizacion;
        temp.id_entregador = cupo.id_entregador;
        temp.id_pedido = cupo.id_pedido;
        temp.estado = cupo.estado;
        temp.id_producto = cupo.id_producto;
        temp.id_destino = cupo.id_destino;
        temp.idCuitMercadoATermino = cupo.idCuitMercadoATermino;
        temp.dominio = cupo.dominio;
        temp.fechaActivado = cupo.fechaActivado;
        temp.fechaArribado = cupo.fechaArribado;
        temp.fechaTomado = cupo.fechaTomado;
        temp.fechaConfirmado = cupo.fechaConfirmado;
        temp.fechaAnulado = cupo.fechaAnulado;
        temp.fechaDesviadoO = cupo.fechaDesviadoO;
        temp.fechaRegresado = cupo.fechaRegresado;
        temp.fechaDesviadoD = cupo.fechaDesviadoD;
        temp.fechaRechazado = cupo.fechaRechazado;
        temp.fechaDescargado = cupo.fechaDescargado;
        temp.codGrano = cupo.codGrano;
        temp.cuitChoferAfip = cupo.cuitChoferAfip;
        temp.cuitCorredorCAfip = cupo.cuitCorredorCAfip;
        temp.cuitCorredorVAfip = cupo.cuitCorredorVAfip;
        temp.cuitDestinatarioAfip = cupo.cuitDestinatarioAfip;
        temp.cuitDestinoAfip = cupo.cuitDestinoAfip;
        temp.cuitIntermediarioFleteAfip = cupo.cuitIntermediarioFleteAfip;
        temp.cuitMercadoATerminoAfip = cupo.cuitMercadoATerminoAfip;
        temp.cuitOrigenAfip = cupo.cuitOrigenAfip;
        temp.cuitRemComercialAfip = cupo.cuitRemComercialAfip;
        temp.cuitRepresentanteEntregadorAfip =
          cupo.cuitRepresentanteEntregadorAfip;
        temp.cuitTransportistaAfip = cupo.cuitTransportistaAfip;
        temp.esAnulado = cupo.esAnulado;
        temp.esRechazado = cupo.esRechazado;
        temp.idCupo = cupo.idCupo;
        temp.idTerminal = cupo.idTerminal;
        temp.idCuitOrigen = cupo.idCuitOrigen;
        temp.idCuitIntermediarioFlete = cupo.idCuitIntermediarioFlete;
        temp.idCuitRemComercial = cupo.idCuitRemComercial;
        temp.idCuitCorredorV = cupo.idCuitCorredorV;
        temp.idCuitCorredorC = cupo.idCuitCorredorC;
        temp.idCuitRepresentanteEntregador = cupo.idCuitRepresentanteEntregador;
        temp.idCuitDestino = cupo.idCuitDestino;
        temp.idCuitIntermediarioFleteFlete = cupo.idCuitIntermediarioFleteFlete;
        temp.idCuitTransportista = cupo.idCuitTransportista;
        temp.idCuitChofer = cupo.idCuitChofer;
        temp.fechaCTG_Hasta = cupo.fechaCTG_Hasta;
        temp.fechaCP_Carga = cupo.fechaCP_Carga;
        temp.fechaCP_Vto = cupo.fechaCP_Vto;
        temp.codLocalidadOrigen = cupo.codLocalidadOrigen;
        temp.codLocalidadDestino = cupo.codLocalidadDestino;
        temp.desvio = cupo.desvio;
        temp.idTurnoDetalle = cupo.idTurnoDetalle;
        temp.renspa = cupo.renspa;
        temp.nroEstablecimientoOrigen = cupo.nroEstablecimientoOrigen;
        temp.pesoNetoEstimado = cupo.pesoNetoEstimado;
        temp.kmRecorrer = cupo.kmRecorrer;
        temp.cantHorasSalidaCamion = cupo.cantHorasSalidaCamion;
        temp.nroContrato = cupo.nroContrato;
        temp.nroPlantaRuca = cupo.nroPlantaRuca;
        temp.idEstadoEnPlanta = cupo.idEstadoEnPlanta;
        temp.creado = cupo.creado;
        temp.modificado = cupo.modificado;
        temp.creadoPor = cupo.creadoPor;
        temp.modificadoPor = cupo.modificadoPor;
        temp.consultadoXAFIP = cupo.consultadoXAFIP;
        temp.ultima_latitud = cupo.ultima_latitud;
        temp.ultima_longitud = cupo.ultima_longitud;
        cuposAsignados.push(temp);
      });
    });
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InfoAplicarCabeceraComponent,
      {
        width: "95vw",
        height: "93vh",
        disableClose: true,
        data: {
          payload: {
            fecha: this.homeService.formatoFecha(
              this.filtrarForm.controls["selectedFecha"].value,
              "amd",
              "/"
            ),
            cuposSeleccionados: cuposAsignados,
            filtro: this.filtro,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.cambiarFecha.emit({ fecha: this.fechaBuscada });
      //this.getDataCuposDemandados(this.fechaBuscada);
      return;
    });
  }

  openPopUpDevolverSolicitud() {
    let heightPop: number = 30 + this.selectCupoAsignados.length * 10;
    let heightPopUp: string = "30vh";
    if (heightPop > 80) heightPopUp = "80vh";
    else heightPopUp = heightPop.toString();
    let title = "DEVOLVER CUPOS";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DevolverComponent, {
      width: "95vw",
      height: heightPopUp,
      disableClose: true,
      data: {
        title: title,
        payload: {
          fecha: this.homeService.formatoFecha(
            this.filtrarForm.controls["selectedFecha"].value,
            "amd",
            "-"
          ),
          solicitudCupos: this.selectCupoAsignados,
          simple: false,
          filtro: this.filtro,
          id_producto: this.id_producto,
        },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.cambiarFecha.emit({ fecha: this.fechaBuscada });
      //this.getDataCuposDemandados(this.fechaBuscada);
      return;
    });
  }

  refreshStop() {
    this.getConfigCentro();
  }

  getConfigCentro() {
    this.getItemSub = this.nomencladoresService
      .getConfiguracionCentro()
      .subscribe((data) => {
        this.fechaHoraUltimaActualizacion =
          data.data.fecha_ultima_actualizacion;
        var currentTime: moment.Moment = moment();
        this.InitialDate = moment(
          this.fechaHoraUltimaActualizacion == null
            ? currentTime
            : this.fechaHoraUltimaActualizacion
        );
        this.remainingTime = this.InitialDate.diff(currentTime);
        this.remainingTime = this.remainingTime / 1000;
        this.minutes = Math.floor(this.remainingTime / 60) % 30;
        if (this.minutes <= 0) {
          this.InitialTime = 30 + this.minutes;
        } else {
          this.InitialTime = 30 - this.minutes;
        }
        this.SearchDate = moment();
        this.searchEndDate = this.SearchDate.add(this.InitialTime, "minutes");
        this.minutes = this.InitialTime;
        if (this.minutes < 10) {
          this.minute = "0" + this.minutes;
        } else {
          this.minute = this.minutes.toString();
        }
        this.seconds = Math.floor(this.remainingTime * 60);
        if (this.seconds < 10) {
          this.second = "0" + this.seconds;
        } else {
          this.second = this.seconds.toString();
        }
        this.runTimer();
      });
  }

  runTimer() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      var currentTime: moment.Moment = moment();
      this.remainingTime = this.searchEndDate.diff(currentTime);
      this.remainingTime = this.remainingTime / 1000;
      if (this.remainingTime <= 0) {
        this.subscription.unsubscribe();
        this.cambiarFecha.emit({ fecha: this.fechaBuscada });
        this.localidadControl.setValue(this.localidades[0].id);
        this.caratulaControl.setValue(this.caratulas[0].id);
        // this.getDataCuposDemandados(this.dataDemanda);
        this.getConfigCentro();
        this.cambiarFecha.emit({ fecha: this.fechaBuscada });
      } else {
        this.minutes = Math.floor(this.remainingTime / 60);
        if (this.minutes < 10) {
          this.minute = "0" + this.minutes;
        } else {
          this.minute = this.minutes.toString();
        }
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
        if (this.seconds < 10) {
          this.second = "0" + this.seconds;
        } else {
          this.second = this.seconds.toString();
        }
      }
    });
  }

  spanRow(key, accessor) {
    this.spans = [];
    for (let i = 0; i < this.cupoAsignados.length; ) {
      let currentValue = accessor(this.cupoAsignados[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      for (let j = i + 1; j < this.cupoAsignados.length; j++) {
        if (currentValue != accessor(this.cupoAsignados[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }

  spanRowDemanda(key, accessor) {
    this.spansDemanda = [];
    for (let i = 0; i < this.demandaCupo.length; ) {
      let currentValue = accessor(this.demandaCupo[i]);
      let count = 1;
      for (let j = i + 1; j < this.demandaCupo.length; j++) {
        if (currentValue != accessor(this.demandaCupo[j])) {
          break;
        }
        count++;
      }
      if (!this.spansDemanda[i]) {
        this.spansDemanda[i] = {};
      }
      this.spansDemanda[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  getRowSpanDemanda(col, index) {
    return this.spansDemanda[index] && this.spansDemanda[index][col];
  }

  selectedRow: any;

  selectedRowIndex: number;

  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  getZonas() {
    this.cupoService.getZonas().subscribe((data) => {
      data.data.zonaSolicitud.forEach((element) => {
        this.zonas.push(element);
      });
      this.zonaControl.setValue(this.zonas[0].id);
    });
  }

  // getLocalidades() {
  //   this.cupoService.getLocalidades().subscribe((data) => {
  //     data.data.localidades.forEach((element) => {
  //       this.localidades.push(element);
  //     });
  //     this.localidadControl.setValue(this.localidades[0].id);
  //   });
  // }
}
