import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  DateAdapter, MatDialog,
  MatDialogRef, MatPaginator,
  MatSort, MatTableDataSource, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";

import { HomeService } from "../../home/home.service";

import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "@shared/helpers/date.adapter";
import {
  Cupo,
  Detalles,
  Listado, V2Disponibles
} from "app/shared/models/v2-disponibles";
import { MessageService } from "app/shared/services/message.service";
import { UserService } from "app/shared/services/user.service";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { DetalleConsolidadoComponent } from "../../cupo/detalle-consolidado/detalle-consolidado.component";
import { ListadoDestinatario } from "../../cupo/panel-consolidado-v2/panel-consolidado-v2.component";
import { DetalleDestinatario, DetalleTransportadora } from "./models/detalle-destinatario";
import { DetalleCupoChoferComponent } from "../../cupo/detalle-cupo-chofer/detalle-cupo-chofer.component";

@Component({
  selector: 'app-panel-consolidado-pedido',
  templateUrl: './panel-consolidado-pedido.component.html',
  styleUrls: ['./panel-consolidado-pedido.component.scss'],
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
      ),
    ]),
  ],
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
      useValue: "es-AR",
    },
  ],
})
export class PanelConsolidadoPedidoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fecha: string;
  @Input() listado;
  @Input() detalles;
  @Input() productos;
  @Input() myData;
  @Output() cambiarFecha = new EventEmitter();
  @Output() chanceProductos = new EventEmitter();
  @ViewChild("tablaFiltros") tablaFiltros: ElementRef;
  public getItemSub: Subscription;
  public subscription: Subscription;
  filtrarForm: FormGroup;
  minDate = new Date();
  hoyString = moment().format("YYYY-MM-DD");
  hoyMoment: moment.Moment = moment();
  dia5Moment: moment.Moment = moment();
  filtro = {
    id_producto: 1,
    fecha: "",
  };
  filtro1 = {
    fecha: this.homeService.formatoFecha(new Date().toString(), "amd", "-"),
    id_producto: 1,
    id_dador: 0,
    id_receptor: 0,
    id_destino: 0,
    estado: "",
  };
  isInMobile = false;
  message: any;
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  displayedColumns: string[] = [
    //"first_color",
    "destino",
    "total",
    "chofer",
    // "ctg",
    // "sin_ctg",
    "en_destino",
    "rechazado",
    "descargados",
    //"anulados",
  ];
  displayedColumns2: string[] = [
    //"first_color_2",
    "receptor",
    "total_2",
    "chofer_2",
    // "ctg_2",
    // "sin_ctg_2",
    "en_destino_2",
    "rechazado_2",
    "descargados_2",
    //"anulados_2",
    /* "acciones" */
  ];
  expandedElement: DetalleTransportadora | null;
  listadoDestinatarios: ListadoDestinatario[] = [];
  previousDetalle: any;
  detallesTransportadora: DetalleTransportadora[];
  dataV2: V2Disponibles;
  cuposDisponiblesApi: Listado[] = [];
  detallesDisponiblesApi: Detalles;
  detallesDestinatario: DetalleDestinatario[];
  selectedDestinatario: ListadoDestinatario = {
    idCuitDestinatario: "-1",
    nombreDestinatario: "",
    totalCupos: 0,
    totalPendientes: 0,
  };
  myid_receptor: number = 0;
  height = 400;
  isSidenavOpen = true;
  otrosproductos = [];


  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private userService: UserService,
    private homeService: HomeService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "PanelConsolidadoV2":
            //this.getDataCuposDisponibles( this.message.data);
            this.loadDataV2(this.message.data);
            break;
          case "productos":
            this.loadProductos();
            break;
          default:
            break;
        }
      });
    this.isInMobile = window.screen.width > 991 ? false : true;
  }

  ngOnInit() {
    this.userService
      .getIdPersonaRol(localStorage.getItem("rol"))
      .subscribe((data) => (this.myid_receptor = data.data));

    this.filtrarForm = new FormGroup({
      selectedFecha: new FormControl(new Date(this.fecha + " 12:00:00")),
      selectedProducto: new FormControl(this.filtro.id_producto),
    });
    if (this.productos.length > 0) {
      let tempProducto = this.productos.find(
        (item) => item.descripcion.toLowerCase() === "soja"
      );
      if (tempProducto) {
        this.filtrarForm.controls["selectedProducto"].setValue(tempProducto.id);
        this.filtro.id_producto = tempProducto.id;
      } else {
        this.filtrarForm.controls["selectedProducto"].setValue(
          this.productos[0].id
        );
        this.filtro.id_producto = this.productos[0].id;
      }
    } else {
      this.chanceProductos.emit();
      //this.inicializarProductos();
    }
    if (this.listado.length > 0) {
      const data = {
        listado: this.listado,
        detalles: this.detalles,
      };
      this.loadDataV2(data);
    }
  }

  loadDataV2(data) {
    //this.loader.open('Por favor espere..', 'Buscando datos...');
    this.dataSource2.data = [];
    this.dataV2 = new V2Disponibles();
    this.cuposDisponiblesApi = [];
    this.detallesDisponiblesApi = new Detalles();
    //this.loader.close();
    this.cuposDisponiblesApi = data.listado;
    this.detallesDisponiblesApi = data.detalles;
    if (this.cuposDisponiblesApi.length > 0) {
      this.getItemsDadores();
      this.getItemsProductos();
      //this.cargarConsolidado(this.listadoDestinatarios[0]);
    } else {
      this.listadoDestinatarios = [];
      this.detallesDestinatario = [];
      this.dataSource.data = this.detallesDestinatario;

    }
  }
  getItemsDadores() {
    this.listadoDestinatarios = [];
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const listado = this.cuposDisponiblesApi[index];
      let totalCupos = 0;
      let totalPendientes = 0;
      if (listado.destinos.length > 0) {
        for (let i = 0; i < listado.destinos.length; i++) {
          const destino = listado.destinos[i];
          if (destino.productos.length > 0) {
            for (let j = 0; j < destino.productos.length; j++) {
              const produc = destino.productos[j];
              totalCupos = totalCupos + produc.total;
              totalPendientes = totalPendientes + produc.pendientes;
            }
          }
        }
      }
      let tempDestinatario = {
        idCuitDestinatario: listado.idCuitDestinatario,
        nombreDestinatario: this.detallesDisponiblesApi.destinatario[
          listado.idCuitDestinatario
        ].nombreDestinatario,
        totalCupos: totalCupos,
        totalPendientes: totalPendientes,
      };
      this.listadoDestinatarios.push(tempDestinatario);
    }
    /* for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const cupo = this.cuposDisponiblesApi[index];
      let tempDestinatario: ListadoDestinatario = {
        idCuitDestinatario: cupo.idCuitDestinatario,
        nombreDestinatario: this.detallesDisponiblesApi.destinatario[cupo.idCuitDestinatario].razon_social,
        totalCupos: 0,
        totalPendientes: 0
      }
      this.addDestinatario(tempDestinatario);
    }*/
    this.selectedDestinatario = this.listadoDestinatarios[0];
    //this.expandedElement = null;
    this.loadData();
  }

  cargarConsolidado(item) {
    this.selectedDestinatario = item;
    this.loadData();
  }

  loadData() {
    this.detallesDestinatario = [];

    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const listado = this.cuposDisponiblesApi[index];
      if (
        listado.destinos.length > 0 &&
        listado.idCuitDestinatario ===
        this.selectedDestinatario.idCuitDestinatario
      ) {
        for (let i = 0; i < listado.destinos.length; i++) {
          const destino = listado.destinos[i];
          if (destino.productos.length > 0) {
            for (let j = 0; j < destino.productos.length; j++) {
              const produc = destino.productos[j];
              console.log(
                "dentro de los productos",
                this.detallesDisponiblesApi.producto[produc.id_producto]
                  .nombreProducto
              );
              if (produc.id_producto === this.filtro.id_producto) {
                let detalleDadorTemp = this.detallesDestinatario.find(
                  (item) =>
                    item.idCuitDestinatario === listado.idCuitDestinatario &&
                    item.id_producto == produc.id_producto &&
                    item.id_destino == destino.id_destino
                );
                if (detalleDadorTemp === undefined) {
                  const detalle = new DetalleDestinatario();
                  detalle.idCuitDestinatario = listado.idCuitDestinatario;
                  detalle.nombreDestinatario = this.detallesDisponiblesApi.destinatario[
                    listado.idCuitDestinatario
                  ].nombreDestinatario;
                  detalle.id_destino = destino.id_destino;
                  detalle.nombre_destino = this.detallesDisponiblesApi.destino[
                    destino.id_destino
                  ].nombreDestino;
                  detalle.id_producto = produc.id_producto;
                  detalle.nombre_producto = this.detallesDisponiblesApi.producto[
                    produc.id_producto
                  ].nombreProducto;
                  detalle.total_cupos = 0;
                  detalle.por_asignar = 0;
                  detalle.por_vincular = 0;
                  detalle.ctg = 0;
                  detalle.sin_ctg = 0;
                  detalle.mas_50km = 0;
                  detalle.menos_50km = 0;
                  detalle.cargados = 0;
                  detalle.menos_50km_destino = 0;
                  detalle.en_destino = 0;
                  detalle.choferAsignado = 0;
                  detalle.descargado = 0;
                  detalle.rechazado = 0;
                  detalle.anulados = 0;
                  detalle.cupos = [];
                  produc.cupos.forEach((element) => {
                    detalle.cupos.push(element);
                  });
                  this.detallesDestinatario.push(detalle);
                } else {
                  produc.cupos.forEach((element) => {
                    detalleDadorTemp.cupos.push(element);
                  });
                }
              }
            }
          }
        }
      }
    }
    if (this.detallesDestinatario.length > 0) {
      this.detallesDestinatario.forEach((element) => {
        element.total_cupos = element.cupos.length;
        for (let index = 0; index < element.cupos.length; index++) {
          const element1 = element.cupos[index];
          element1.idCuitChoferAsignado ? element.choferAsignado = element.choferAsignado + 1 : false;

          if (element1.idCupoEstado == "1") {
            element.sin_ctg = element.sin_ctg + 1;
            element1.estadoCalculado = "sin_ctg";
            continue;
          }
          if (element1.idCupoEstado == "2") {
            element.ctg = element.ctg + 1;
            element1.estadoCalculado = "ctg";
            continue;
          }
          if (element1.idCupoEstado == "3") {
            element.descargado = element.descargado + 1;
            element1.estadoCalculado = "descargado";
            continue;
          }
          if (element1.idCupoEstado == "4") {
            element.rechazado = element.rechazado + 1;
            element1.estadoCalculado = "rechazado";
            continue;
          }
          if (element1.idCupoEstado == "5") {
            element.en_destino = element.en_destino + 1;
            element1.estadoCalculado = "en_destino";
            continue;
          }
          if (element1.idCupoEstado === null) {
            element.sin_ctg = element.sin_ctg + 1;
            element1.estadoCalculado = "sin_ctg";
            continue;
          }
        }
      });
    }
    this.dataSource.data = this.detallesDestinatario;
    this.expandedElement = null;
  }

  addDestinatario(element: ListadoDestinatario) {
    let tempDestinatario = this.listadoDestinatarios.find(
      (item) => item.idCuitDestinatario === element.idCuitDestinatario
    );
    if (tempDestinatario == undefined) {
      this.listadoDestinatarios.push(element);
    } else {
      tempDestinatario.totalCupos++;
    }
  }

  cargarDetalles(row) {
    //this.filtro1.id_destino = parseInt(row.id_destino);
    if (this.previousDetalle != row) {
      this.dataSource2.data = [];
      this.previousDetalle = row;
      this.detallesTransportadora = [];
      row.cupos.forEach((element) => {
        let tempCupo = new Cupo();
        tempCupo = element;
        tempCupo.estadoCalculado = "";
        console.log("IdCupo:", tempCupo.idCupoTerminal);
        if (element.derivacion) {
          let id_transportadora = element.derivacion.id_transportadora;
          let transportadora = element.derivacion.transportadora;
          let detalleDadorTemp = this.detallesTransportadora.find(
            (item) =>
              item.id_transportadora === id_transportadora &&
              item.id_producto == row.id_producto
          );
          if (detalleDadorTemp === undefined) {
            const detalle = new DetalleTransportadora();
            detalle.id_transportadora = id_transportadora;
            detalle.transportadora = transportadora;
            detalle.id_receptor = null;
            detalle.cuitReceptor = '';
            detalle.id_producto = row.id_producto;
            detalle.nombre_receptor = '';
            //detalle.nombre_receptor = "";
            detalle.total_cupos = 0;
            detalle.por_asignar = 0;
            detalle.por_vincular = 0;
            detalle.ctg = 0;
            detalle.sin_ctg = 0;
            detalle.mas_50km = 0;
            detalle.menos_50km = 0;
            detalle.cargados = 0;
            detalle.menos_50km_destino = 0;
            detalle.en_destino = 0;
            detalle.choferAsignado = 0;
            detalle.descargado = 0;
            detalle.rechazado = 0;
            detalle.anulados = 0;
            detalle.cupos = [];
            detalle.cupos.push(tempCupo);
            this.detallesTransportadora.push(detalle);
          } else {
            detalleDadorTemp.cupos.push(tempCupo);
          }
        } else {
          let detalleDadorTemp = this.detallesTransportadora.find(
            (item) =>
              item.id_transportadora === '000000000' &&
              item.id_producto == row.id_producto
          );
          if (detalleDadorTemp === undefined) {
            const detalle = new DetalleTransportadora();
            detalle.id_transportadora = '000000000';
            detalle.transportadora = 'Pendientes de asignación';
            detalle.id_receptor = this.myid_receptor;
            detalle.nombre_receptor = 'Pendientes de asignación';
            detalle.id_producto = row.id_producto;
            detalle.cuitReceptor = this.myData.micuit;
            detalle.total_cupos = 0;
            detalle.por_asignar = 0;
            detalle.por_vincular = 0;
            detalle.ctg = 0;
            detalle.sin_ctg = 0;
            detalle.mas_50km = 0;
            detalle.menos_50km = 0;
            detalle.cargados = 0;
            detalle.menos_50km_destino = 0;
            detalle.en_destino = 0;
            detalle.choferAsignado = 0;
            detalle.descargado = 0;
            detalle.rechazado = 0;
            detalle.anulados = 0;
            detalle.cupos = [];
            detalle.cupos.push(tempCupo);
            this.detallesTransportadora.push(detalle);
          } else {
            detalleDadorTemp.cupos.push(tempCupo);
          }
        }
      });
      if (this.detallesTransportadora.length > 0) {
        this.detallesTransportadora.forEach((element) => {
          element.total_cupos = element.cupos.length;
          for (let index = 0; index < element.cupos.length; index++) {
            const element1 = element.cupos[index];
            element1.idCuitChoferAsignado ? element.choferAsignado = element.choferAsignado + 1 : false;

            if (element1.idCupoEstado == "1") {
              element.sin_ctg = element.sin_ctg + 1;
              element1.estadoCalculado = "sin_ctg";
              continue;
            }
            if (element1.idCupoEstado == "2") {
              element.ctg = element.ctg + 1;
              element1.estadoCalculado = "ctg";
              continue;
            }
            if (element1.idCupoEstado == "3") {
              element.descargado = element.descargado + 1;
              element1.estadoCalculado = "descargado";
              continue;
            }
            if (element1.idCupoEstado == "4") {
              element.rechazado = element.rechazado + 1;
              element1.estadoCalculado = "rechazado";
              continue;
            }
            if (element1.idCupoEstado == "5") {
              element.en_destino = element.en_destino + 1;
              element1.estadoCalculado = "en_destino";
              continue;
            }
            if (element1.idCupoEstado === null) {
              element.sin_ctg = element.sin_ctg + 1;
              element1.estadoCalculado = "sin_ctg";
              continue;
            }
          }
        });
      }
      this.detallesTransportadora.sort((a, b) => a.transportadora.localeCompare(b.transportadora));
      this.dataSource2.data = this.detallesTransportadora;
    }
  }
  aplicarFiltroProducto(cmd) {
    this.filtro.id_producto = cmd.value;

    //this.buscar();
  }
  aplicarFiltro(element, cmp) {
    if (element == "fecha") {
      this.filtro.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
      this.filtro1.fecha = this.filtro.fecha;
      this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      //this.loadDataV2();
    } else {
      this.filtro.id_producto = cmp;
      this.filtro1.id_producto = cmp;
      if (cmp === 1 || cmp === 2 || cmp === 3 || cmp === 5) {
        this.filtrarForm.controls["selectedProducto"].setValue(cmp);
      }
      this.loadData();
      //this.getItemsDadores();
    }
  }

  loadProductos() {
    if (this.productos.length > 0) {
      let tempProducto = this.productos.find(
        (item) => item.descripcion.toLowerCase() === "soja"
      );
      if (tempProducto) {
        this.filtrarForm.controls["selectedProducto"].setValue(tempProducto.id);
        this.filtro.id_producto = tempProducto.id;
      } else {
        this.filtrarForm.controls["selectedProducto"].setValue(
          this.productos[0].id
        );
        this.filtro.id_producto = this.productos[0].id;
      }
    }
  }

  cargarAlfanumerico(valor, row, recupera?: boolean) {
    this.filtro1.estado = valor;
    let someCupos: Cupo[] = [];
    let title = valor;
    let sin_ctg = false;
    switch (valor) {
      case "total":
        someCupos = row.cupos;
        title = " Todos los cupos";
        break;
      case "por_asignar":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "por_asignar"
        );
        title = " Por Asignar";
        break;
      case "por_vincular":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "por_vincular"
        );
        title = " Por Vincular";
        break;
      case "sin_ctg":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "sin_ctg"
        );
        title = " Sin CTG";
        sin_ctg = true;
        break;
      case "ctg":
        someCupos = row.cupos.filter((item) => item.estadoCalculado === "ctg");
        title = " Estado CTG";
        break;
      case "mas_50km":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "mas_50km"
        );
        title = " Pendientes a  + 50 km";
        break;
      case "menos_50km":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "menos_50km"
        );
        title = " Pendientes a  - 50 km";
        break;
      case "cargados":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "cargados"
        );
        title = " Cargado";
        break;
      case "menos_50km_destino":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "menos_50km_destino"
        );
        title = " Menos 50 km del destino";
        break;
      case "en_destino":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "en_destino"
        );
        title = "En Destino";
        break;
      case "rechazado":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "rechazado"
        );
        title = " Descargados";
        break;
      case "descargado":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "descargado"
        );
        title = " Descargados";
        break;
      case "anulados":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "anulado"
        );
        title = " Anulados";
        break;
      case "choferAsignado":
        someCupos = row.cupos.filter(
          (item) => item.idCuitChoferAsignado !== null
        );
        title = " Chofer Asignado";
        break;
      default:
        break;
    }
    if (someCupos.length > 0) {
      let heightPop: number = 30 + someCupos.length * 10;
      if (valor == "sin_ctg") {
        heightPop = heightPop + 10;
      }
      let heightPopUp: number = 50;
      if (heightPop > 80) heightPopUp = 80;
      else heightPopUp = heightPop;
      let fecha: any;
      console.log('heightPopUp', heightPopUp);

      let payload = { cupos: someCupos, height: heightPopUp, sinCtg: sin_ctg, recupera: recupera }

      if (valor === "choferAsignado") {
        this.getModalAsignarChofer(heightPopUp, title, payload);
      } else {
        this.getModalAlfanumericos(heightPopUp, title, payload);
      }

      // let dialogRef: MatDialogRef<any> = this.dialog.open(
      //   DetalleConsolidadoComponent,
      //   {
      //     width: "55vw",
      //     height: heightPopUp.toString() + "vh",
      //     disableClose: true,
      //     data: {
      //       title: title,
      //       cupera: 2,
      //       payload: { cupos: someCupos, height: heightPopUp, sinCtg: sin_ctg, recupera: recupera },
      //     },
      //   }
      // )
      // dialogRef.afterClosed().subscribe((res) => {
      //   if (!res) {
      //     return;
      //   } else {
      //     this.filtro.fecha = this.homeService.formatoFecha(
      //       this.filtrarForm.controls["selectedFecha"].value,
      //       "amd",
      //       "-"
      //     );
      //     this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      //   }
      //   return;
      // });
    }
  }

  getModalAlfanumericos(heightPopUp, title, payload) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      DetalleConsolidadoComponent,
      {
        width: "55vw",
        height: heightPopUp.toString() + "vh",
        disableClose: true,
        data: {
          title: title,
          cupera: 2,
          payload: payload,
        },
      }
    )
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.filtro.fecha = this.homeService.formatoFecha(
          this.filtrarForm.controls["selectedFecha"].value,
          "amd",
          "-"
        );
        this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      }
      return;
    });
  }

  getModalAsignarChofer(heightPopUp, title, payload) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      DetalleCupoChoferComponent,
      {
        width: "55vw",
        height: heightPopUp.toString() + "vh",
        disableClose: true,
        data: {
          title: title,
          cupera: 2,
          payload: payload,
        },
      }
    )
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.filtro.fecha = this.homeService.formatoFecha(
          this.filtrarForm.controls["selectedFecha"].value,
          "amd",
          "-"
        );
        this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      }
      return;
    });
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
              if (
                produc.id_producto !== 1 &&
                produc.id_producto !== 2 &&
                produc.id_producto !== 3 &&
                produc.id_producto !== 5
              ) {
                const temp = {
                  id: produc.id_producto,
                  descripcion: this.detallesDisponiblesApi.producto[
                    produc.id_producto
                  ].nombreProducto,
                };
                this.otrosproductos.push(temp);
              }
            }
          }
        }
      }
    }
  }

}
