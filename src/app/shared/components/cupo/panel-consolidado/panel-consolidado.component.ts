import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { CupoService } from "../cupo.service";
import { HomeService } from "../../home/home.service";

import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "@shared/helpers/date.adapter";

import { DetalleConsolidadoComponent } from "../detalle-consolidado/detalle-consolidado.component";
import { Subscription } from "rxjs";
import {
  V2Disponibles,
  Cupo,
  Detalles,
  Listado,
} from "app/shared/models/v2-disponibles";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { UserService } from "app/shared/services/user.service";
import { MessageService } from "app/shared/services/message.service";

export class DetalleDestinatario {
  idDestinatario: string;
  nombreDestinatario: string;
  idCuitDestinatario: string;
  id_destino: number;
  nombre_destino: string;
  id_producto: number;
  nombre_producto: string;
  total_cupos: number;
  por_asignar: number;
  por_vincular: number;
  estado_ctg: number;
  sin_ctg: number;
  mas_50km: number;
  menos_50km: number;
  cargados: number;
  menos_50km_destino: number;
  en_destino: number;
  descargado: number;
  anulados: number;
  cupos: Cupo[];
}
export class DetalleReceptor {
  id_receptor: number;
  nombre_receptor: string;
  nombre_destino: string;
  id_destino: number;
  cuitReceptor: string;
  id_producto: number;
  nombre_producto: string;
  total_cupos: number;
  por_asignar: number;
  por_vincular: number;
  estado_ctg: number;
  sin_ctg: number;
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
  selector: "app-panel-consolidado",
  templateUrl: "./panel-consolidado.component.html",
  styleUrls: ["./panel-consolidado.component.scss"],
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
export class PanelConsolidadoComponent implements OnInit {
  @Input() fecha: string;
  @Input() listado;
  @Input() detalles;
  @Output() cambiarFecha = new EventEmitter();
  filtrarForm: FormGroup;
  isSidenavOpen = true;
  public totalSize = 0;
  filtro = {
    fecha: this.homeService.formatoFecha(new Date().toString(), "amd", "-"),
    id_producto: 1,
    id_dador: 0,
  };
  filtro1 = {
    fecha: this.homeService.formatoFecha(new Date().toString(), "amd", "-"),
    id_producto: 1,
    id_dador: 0,
    id_receptor: 0,
    id_destino: 0,
    estado: "",
  };
  minDate = new Date();
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  displayedColumns: string[] = [
    "first_color",
    "destino",
    "total",
    //"pend_asignar",
    //"pend_vincular",
    "ctg",
    'sin_ctg',
    //"mas50",
    //"menos50",
    //"cargado",
    //"menos50_destino",
    "en_destino",
    "descargados",
    //"anulados",
  ];
  displayedColumns2: string[] = [
    "first_color_2",
    "receptor",
     "total_2",
    /*"pend_asignar_2",
    "pend_vincular_2", */
    "ctg_2",
    'sin_ctg2',
    /* "mas50_2",
    "menos50_2",
    "cargado_2",
    "menos50_dest_2", */
    "en_destino_2",
    "descargados_2",
   /* "anulados_2",
     "acciones" */
  ];
  expandedElement: DetalleReceptor;
  listadoDestinatarios = [];
  otrosproductos = [];
  selectedDestinatario = {
    idCuitDestinatario: "-1",
    nombreDestinatario: "",
    total_cupos: 0,
    pendientes: 0,
  };
  selectedDestinatarioInicial = {
    idCuitDestinatario: "-1",
    nombreDestinatario: "",
    total_cupos: 0,
    pendientes: 0,
  };
  public getItemSub: Subscription;
  consolidadoData: any;
  nombre_productoselect: string = "";
  previousDetalle: any;

  myname: string = "";
  mycuit: string = "";
  myid_receptor: number = 0;
  dataV2: V2Disponibles;
  cuposDisponiblesApi: Listado[];
  detallesDisponiblesApi: Detalles;
  detallesDestinatario: DetalleDestinatario[];
  detallesReceptor: DetalleReceptor[];
  private subscription: Subscription;
  message: any;

  constructor(
    private cupoService: CupoService,
    private dialog: MatDialog,
    private homeService: HomeService,
    private loader: AppLoaderService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "PanelConsolidado":
            //this.getDataCuposDisponibles( this.message.data);
            this.loadDataV2(this.message.data);
            break;

          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.expandedElement = null;
    this.myname = localStorage.getItem("nameUser");
    this.mycuit = localStorage.getItem("cuit_cuil");
    this.userService
      .getIdPersonaRol(localStorage.getItem("rol"))
      .subscribe((data) => (this.myid_receptor = data.data));
    //this.myid_receptor = parseInt(localStorage.getItem("idUserRol"));
    this.filtrarForm = new FormGroup({
      selectedFecha: new FormControl(new Date(this.fecha + " 12:00:00")),
      selectedProducto: new FormControl(null),
    });
    // this.getItemsProductos();
    // this.cargaInicial();
    let data = {
      listado: [],
    };
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

  loadDataProducto() {
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
            console.log("Entrando por aqui");
            for (let j = 0; j < destino.productos.length; j++) {
              const produc = destino.productos[j];
              console.log("dentro de los productos", produc.nombreProducto);
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
                  detalle.estado_ctg = 0;
                  detalle.sin_ctg = 0;
                  detalle.mas_50km = 0;
                  detalle.menos_50km = 0;
                  detalle.cargados = 0;
                  detalle.menos_50km_destino = 0;
                  detalle.en_destino = 0;
                  detalle.descargado = 0;
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

          if (element1.idCupoEstado == "1") {
            element.sin_ctg = element.sin_ctg + 1;
            element1.estadoCalculado = "sin_ctg";
            continue;
          }
          if (element1.idCupoEstado == "2") {
            element.estado_ctg = element.estado_ctg + 1;
            element1.estadoCalculado = "estado_ctg";
            continue;
          }
          if (element1.idCupoEstado == "3") {
            element.descargado = element.descargado + 1;
            element1.estadoCalculado = "descargado";
            continue;
          }
          if (element1.idCupoEstado == "5") {
              element.en_destino = element.en_destino + 1;
              element1.estadoCalculado = "en_destino";
            continue;
          }
          if (element1.esAnulado) {
            if (element1.esAnulado.toUpperCase() == "S") {
              element.anulados = element.anulados + 1;
              element1.estadoCalculado = "anulado";
              continue;
            }
          }
          if (element1.idCupoEstado === null )  {
            element.sin_ctg = element.sin_ctg + 1;
            element1.estadoCalculado = "sin_ctg";
            continue;
          }
          if (element1.pendienteGeneral) {
            element.por_asignar = element.por_asignar + 1;
            element1.estadoCalculado = "por_asignar";
            continue;
          }
          if (element1.estadoViaje === null) {
              element.por_vincular = element.por_vincular + 1;
              element1.estadoCalculado = "por_vincular";
          } else {
            switch (element1.estadoViaje) {
              case "1":
                element.mas_50km = element.mas_50km + 1;
                element1.estadoCalculado = "mas_50km";
                break;
              case "2":
                element.menos_50km = element.menos_50km + 1;
                element1.estadoCalculado = "menos_50km";
                break;
              case "3":
                element.cargados = element.cargados + 1;
                element1.estadoCalculado = "cargados";
                break;
              case "4":
                element.menos_50km_destino = element.menos_50km_destino + 1;
                element1.estadoCalculado = "menos_50km_destino";
                break;
              case "5":
                element.en_destino = element.en_destino + 1;
                element1.estadoCalculado = "en_destino";
                break;

              default:
                break;
            }
          }

        }
      });
    }
    this.dataSource.data = this.detallesDestinatario;
    console.log( "loadDataProducto dataSource = ", this.dataSource );
    //this.cargarDetalles(this.detallesDestinatario[0]);
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
        total: totalCupos,
        pendientes: totalPendientes,
      };
      this.listadoDestinatarios.push(tempDestinatario);
    }
    this.selectedDestinatario = this.listadoDestinatarios[0];
    this.expandedElement = null;
    this.loadDataProducto();
  }

  aplicarFiltro(element, cmp) {
    if (element == "fecha") {
      this.filtro.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
      this.filtro1.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
      this.cambiarFecha.emit({ fecha: this.filtro.fecha });
      //this.loadDataV2();
    } else {
      this.filtro.id_producto = cmp;
      this.filtro1.id_producto = cmp;
      if (cmp === 1 || cmp === 2 || cmp === 3 || cmp === 5) {
        this.filtrarForm.controls["selectedProducto"].setValue(null);
      }
      this.loadDataProducto();
    }
  }

  cargarPanelConsolidado() {
    this.getItemSub = this.cupoService
      .getPanelConsolidado(this.filtro)
      .subscribe((data) => {
        this.consolidadoData = data.data;
        this.dataSource.data = this.consolidadoData;
        // this.nombre_productoselect = (this.consolidadoData.nombre_producto !== undefined) ? this.consolidadoData.nombre_producto : '';
        //this.dataSource2.data = [];
      });
  }

  cargarDadores(cmp) {
    this.filtro.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
    this.filtro1.fecha = this.homeService.formatoFecha(cmp.value, "amd", "-");
    this.limpiarTodo();
    //this.cargaInicial();
  }

  cargarConsolidado(item) {
    this.selectedDestinatario = item;
    /*  this.filtro.id_producto = 1;
     this.filtro1.id_producto = 1;
     this.filtro.id_dador = this.selectedDestinatario.id_dador;
     this.filtro1.id_dador = this.selectedDestinatario.id_dador;
     this.cargarPanelConsolidado();*/
    this.loadDataProducto();
  }

  cargarAlfanumerico(valor, row,recupera?: boolean) {
    console.log("ROW = ",row);
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
        sin_ctg = true;
        break;
      case "estado_ctg":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "estado_ctg"
        );
        title = " Estado CTG";
        break;
      case "sin_ctg":
        someCupos = row.cupos.filter(
          (item) => item.estadoCalculado === "sin_ctg"
        );
        title = " Sin CTG";
        sin_ctg = true;
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
      default:
        break;
    }

    console.log( "Somos cupos = ",someCupos );

    if (someCupos.length > 0) {
      let heightPop: number = 30 + someCupos.length * 10;
      if (valor == "sin_ctg") {
        heightPop = heightPop + 20;
      }
      let heightPopUp: number = 50;
      if (heightPop > 80) heightPopUp = 80;
      else heightPopUp = heightPop;
      let fecha: any;
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        DetalleConsolidadoComponent,
        {
          width: "55vw",
          height: heightPopUp.toString() + "vh",
          disableClose: true,
          data: {
            title: title,
            cupera: 1,
            payload: {
              cupos: someCupos,
              height: heightPopUp,
              sinCtg: sin_ctg,
              recupera: recupera },
          },
        }
      );
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
  }

  cargarDetalles(row) {
    //this.filtro1.id_destino = parseInt(row.id_destino);
    if (this.previousDetalle != row) {
      this.dataSource2.data = [];
      this.previousDetalle = row;
      this.detallesReceptor = [];
      row.cupos.forEach((element) => {
        let tempCupo = new Cupo();
        tempCupo = element;
        tempCupo.estadoCalculado = "";
        console.log("IdCupo:", tempCupo.idCupoTerminal);
        if (element.cupoAsignadoUltimo !== null) {
          let id_receptor = parseInt(element.cupoAsignadoUltimo.id);
          let cuitReceptor = element.cupoAsignadoUltimo.receptorCuit;
          //&& item.id_producto == produc.id_producto
          let detalleDadorTemp = this.detallesReceptor.find(
            (item) =>
              item.cuitReceptor === cuitReceptor &&
              item.id_producto == row.id_producto
          );
          if (detalleDadorTemp === undefined) {
            const detalle = new DetalleReceptor();
            detalle.id_receptor = id_receptor;
            detalle.cuitReceptor = cuitReceptor;
            detalle.id_producto = row.id_producto;
            detalle.nombre_receptor = this.detallesDisponiblesApi.receptor[
              cuitReceptor
            ].nombreReceptor;
            detalle.total_cupos = 0;
            detalle.por_asignar = 0;
            detalle.por_vincular = 0;
            detalle.estado_ctg = 0;
            detalle.sin_ctg = 0;
            detalle.mas_50km = 0;
            detalle.menos_50km = 0;
            detalle.cargados = 0;
            detalle.menos_50km_destino = 0;
            detalle.en_destino = 0;
            detalle.descargado = 0;
            detalle.anulados = 0;
            detalle.cupos = [];
            detalle.cupos.push(tempCupo);
            this.detallesReceptor.push(detalle);
          } else {
            detalleDadorTemp.cupos.push(tempCupo);
          }
        } else {
          let detalleDadorTemp = this.detallesReceptor.find(
            (item) =>
              item.cuitReceptor === this.mycuit &&
              item.id_producto == row.id_producto
          );
          if (detalleDadorTemp === undefined) {
            const detalle = new DetalleReceptor();
            detalle.id_receptor = this.myid_receptor;
            detalle.nombre_receptor = this.myname;
            detalle.id_producto = row.id_producto;
            detalle.cuitReceptor = this.mycuit;
            detalle.total_cupos = 0;
            detalle.por_asignar = 0;
            detalle.por_vincular = 0;
            detalle.estado_ctg = 0;
            detalle.sin_ctg = 0;
            detalle.mas_50km = 0;
            detalle.menos_50km = 0;
            detalle.cargados = 0;
            detalle.menos_50km_destino = 0;
            detalle.en_destino = 0;
            detalle.descargado = 0;
            detalle.anulados = 0;
            detalle.cupos = [];
            detalle.cupos.push(tempCupo);
            this.detallesReceptor.push(detalle);
          } else {
            detalleDadorTemp.cupos.push(tempCupo);
          }
        }
      });
      if (this.detallesReceptor.length > 0) {
        this.detallesReceptor.forEach((element) => {
          element.total_cupos = element.cupos.length;
          for (let index = 0; index < element.cupos.length; index++) {
            const element1 = element.cupos[index];

            if (element1.idCupoEstado == "1") {
              element.sin_ctg = element.sin_ctg + 1;
              element1.estadoCalculado = "sin_ctg";
              continue;
            }
            if (element1.idCupoEstado == "2") {
              element.estado_ctg = element.estado_ctg + 1;
              element1.estadoCalculado = "estado_ctg";
              continue;
            };
            if (element1.idCupoEstado == "3") {
              element.descargado = element.descargado + 1;
              element1.estadoCalculado = "descargado";
              continue;
            };
            if (element1.idCupoEstado == "5") {
              element.en_destino = element.en_destino + 1;
                element1.estadoCalculado = "en_destino";
              continue;
            };
            if (element1.esAnulado) {
              if (element1.esAnulado.toUpperCase() == "S") {
                element.anulados = element.anulados + 1;
                element1.estadoCalculado = "anulado";
                continue;
              }
            };
            if (element1.idCupoEstado === null )  {
              element.sin_ctg = element.sin_ctg + 1;
              element1.estadoCalculado = "sin_ctg";
              continue;
            }
            if (element1.pendienteGeneral) {
              element.por_asignar = element.por_asignar + 1;
              element1.estadoCalculado = "por_asignar";
              continue;
            };

            if (element1.estadoViaje === null) {
                element.por_vincular = element.por_vincular + 1;
                element1.estadoCalculado = "por_vincular";
            } else {
              switch (element1.estadoViaje) {
                case "1":
                  element.mas_50km = element.mas_50km + 1;
                  element1.estadoCalculado = "mas_50km";
                  break;
                case "2":
                  element.menos_50km = element.menos_50km + 1;
                  element1.estadoCalculado = "menos_50km";
                  break;
                case "3":
                  element.cargados = element.cargados + 1;
                  element1.estadoCalculado = "cargados";
                  break;
                case "4":
                  element.menos_50km_destino = element.menos_50km_destino + 1;
                  element1.estadoCalculado = "menos_50km_destino";
                  break;
                case "5":
                  element.en_destino = element.en_destino + 1;
                  element1.estadoCalculado = "en_destino";
                  break;

                default:
                  break;
              }
            }

          }
        });
      }
      this.dataSource2.data = this.detallesReceptor;
    }
  }

  limpiarTodo() {
    this.selectedDestinatario = this.selectedDestinatarioInicial;
    this.consolidadoData = [];
    this.dataSource.data = [];
    this.dataSource2.data = [];
    this.filtro.id_producto = 1;
    this.filtro1.id_producto = 1;
  }
}
