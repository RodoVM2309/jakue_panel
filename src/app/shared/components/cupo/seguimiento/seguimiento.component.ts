import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MatPaginator,
  PageEvent,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
} from "@angular/material";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "saturn-datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import * as moment from "moment";
import { SatDatepicker } from "saturn-datepicker";
import { MessageService } from "app/shared/services/message.service";
import { Subscription } from "rxjs";
import { CupoService } from "../cupo.service";
import {
  Cupo,
  Seguimiento,
  Asignados,
  Demanda,
  Devoluciones,
  DestinatarioV3,
  ItemsCuit,
  ItemsBasico,
} from "../../../models/v2-demandados";
import { ExelService } from "app/shared/services/exel.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { HomeService } from "../../home/home.service";
import { UserService } from "app/shared/services/user.service";
import { AddSolicitudesC3Component } from "../cupera3/add-solicitudes-c3/add-solicitudes-c3.component";

export class Solicitud {
  cuitDestinatario: string;
  nombreDestinatario: string;
  id_destino: string;
  nombreDestino: string;
  corredor: string;
  contraparte: string;
  contrato: string;
  solicitud: string;
  solicitado: number;
  rechazado: number;
  devuelto: number;
  choferes_vinculados: number;
  noAsignado: number;
  asignado: number;
  cumplido: number;
  porciento: number;
  conAsignacion: boolean;
  idProducto: number;
  observaciones: string;
  derivacion:number;
  derivaciones?:number;
}
export class derivacionObject{
  cantidad_derivada: string;
  id:string;
  id_transportadora:string;
  transportadora: string
}

@Component({
  selector: "app-seguimiento",
  templateUrl: "./seguimiento.component.html",
  styleUrls: ["./seguimiento.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class SeguimientoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fecha: string;
  @Input() listado;
  @Input() detalles;
  @Output() cambiarFecha = new EventEmitter();
  @Input() rangoFecha: any;
  @Input() productos;
  @Input() myData;
  @ViewChild("picker") dateRange: SatDatepicker<any>;
  seguimientoForm: FormGroup;

  destinatarios: DestinatarioV3[] = [];
  destinatariosApi: DestinatarioV3[] = [];
  destinatariosCon: DestinatarioV3[] = [];
  destinatariosSin: DestinatarioV3[] = [];
  destinos: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];
  destinosApi: ItemsCuit[] = [];
  corredores: ItemsBasico[] = [];
  contrapartes: ItemsBasico[] = [];
  contratos: ItemsBasico[] = [];
  tiposAsignacion = [
    {
      id: 1,
      descripcion: "Con Asignación",
    },
    {
      id: 0,
      descripcion: "Sin Asignación",
    },
  ];

  filtro = {
    id_producto: 0,
    idCuitDestinatario: "-1",
    id_destino: "",
    corredor: "",
    contraparte: "",
    producto: "",
    contrato: "",
    conAsignacion: true,
  };
  tipoAccion = [
    { id: 1, descripcion: "Por solicitud " },
    { id: 2, descripcion: "Totales" },
  ];
  inicialDate = {};
  public getItemSub: Subscription;
  private subscription: Subscription;
  message: any;
  isInMobile = false;
  disabledDestino = true;
  disabledCorredor = true;
  disabledContraparte = true;
  disabledContrato = true;

  dataset: Solicitud[] = [];
  //Material
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    // "corredor",
    "contraparte",
    // "contrato",
    // "solicitud",
    // "solicitado",
    // "rechazado",
    "asignado",
    // "noAsignado",
    "devuelto",
    "chofer",
    "derivacion",
    "cumplido",
    "porciento",
  ];
  pageEvent: PageEvent = new PageEvent();
  isTotales: boolean = true;
  copiaDataset: Solicitud[] = [];
  cuposSinSolicitud: Cupo[] = [];
  seguimientoApi: Seguimiento;
  demandasNoUsadas: Demanda[] = [];
  ref: any;
  primerDia = "";
  ultimoDia = "";
  chancedDate: boolean = true;
  lbCorredor = "";

  constructor(
    private messageService: MessageService,
    private cupoService: CupoService,
    private excelService: ExelService,
    private loader: AppLoaderService,
    private homeService: HomeService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "Seguimiento":
            this.getDataDemandas(this.message.data);
            break;
          case "mydata":
            this.loadLabel();
            break;
          default:
            break;
        }
      });
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.copiaDataset = [...this.dataset];
    this.paginator._intl.itemsPerPageLabel = "Por páginas:";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
    this.primerDia = moment().weekday(1).format("YYYY-MM-DD");
    this.ultimoDia = moment().weekday(7).format("YYYY-MM-DD");
    this.seguimientoForm = new FormGroup({
      selectedFecha: new FormControl({
        begin: new Date(this.primerDia + " 12:00:00"),
        end: new Date(this.ultimoDia + " 12:00:00"),
      }),
      selectedProducto: new FormControl(this.filtro.id_producto),
      selectedDestinatario: new FormControl(this.filtro.idCuitDestinatario),
      selectedDestino: new FormControl(this.filtro.id_destino),
      selectedCorredor: new FormControl(this.filtro.corredor),
      selectedContraparte: new FormControl(this.filtro.contraparte),
      selectedContrato: new FormControl(this.filtro.contrato),
      selectedSolicitud: new FormControl(2),
      selectedTipo: new FormControl(1),
    });
    //this.inicializarProductos();
    //this.getItemsProductos();
    if (this.productos.length > 0) {
      if (this.filtro.id_producto === 0) {
        let tempProducto = this.productos.find(
          (item) => item.descripcion.toLowerCase() === "soja"
        );
        if (tempProducto) {
          this.seguimientoForm.controls["selectedProducto"].setValue(
            tempProducto.id
          );
          this.filtro.id_producto = tempProducto.id.toString();
        } else {
          //this.inicializarProductos();
          this.seguimientoForm.controls["selectedProducto"].setValue(
            this.productos[0].id
          );
          this.filtro.id_producto = this.productos[0].id.toString();
        }
      }

    }
    this.filtro.conAsignacion = true;
    this.inicializarDestinatarios();
    this.seguimientoForm.controls["selectedDestinatario"].setValue("0");
    this.aplicarFiltroTipo(1);
    this.seguimientoForm.controls['selectedSolicitud'].setValue(2);
    this.inicializarCorredor();
    this.inicializarContratos();
    this.loadLabel();
  }

  loadLabel() {
    if (this.myData.soyCorredor) {
      this.lbCorredor = "SIN OTRO CORREDOR";
    } else {
      this.lbCorredor = "DIRECTO";
    }
  }

  loadData(fechaDesde, fechaHasta) {
    this.loader.open("Por favor espere...");
    this.cupoService.getV3Demandas(fechaDesde, fechaHasta).subscribe(
      (res) => {
        this.loader.close();
        this.seguimientoApi = res.data;
        this.getDataDemandas(this.seguimientoApi);
        this.chancedDate = false;
      },
      (error) => {
        this.loader.close();
      }
    );
  }
  getDerivaciones(derivacionObject:derivacionObject[] ):number{
    return derivacionObject.reduce((total, d) => total + Number(d.cantidad_derivada), 0);
  }
  getDataDemandas(data: Seguimiento) {
    console.log(data);
    this.dataset = [];
    let seguimiento: Seguimiento = data;
    let asignados: Asignados[] = [];
    let devoluciones: Devoluciones[] = [];
    let demandas: Demanda[] = [];
    asignados = seguimiento.asignado;
    demandas = seguimiento.demandas;
    demandas.forEach((element) => {
      element.usada = false;
    });
    this.destinatariosCon = [];
    this.destinatariosSin = [];
    for (let index = 0; index < asignados.length; index++) {
      if (asignados[index].id_producto == this.filtro.id_producto.toString()) {
        let asignado:Asignados = {} as Asignados;
        asignado = asignados[index];
        let newSolicitud = new Solicitud();
        newSolicitud.cuitDestinatario = asignado.idCuitDestinatario;
        newSolicitud.nombreDestinatario = asignado.nombreDestinatario;
        newSolicitud.id_destino = asignado.id_destino;
        newSolicitud.nombreDestino = asignado.nombreDestino;
        newSolicitud.choferes_vinculados = parseInt(asignado.choferes_vinculados);
        newSolicitud.idProducto = parseInt(asignado.id_producto);
        newSolicitud.derivaciones =  this.getDerivaciones(asignado.derivacion);
        let isCorredor =
          seguimiento.receptores[asignado.cuit].esCorredor == "0"
            ? false
            : true;
        newSolicitud.corredor = isCorredor
          ? seguimiento.receptores[asignado.cuit].razon_social
          : this.lbCorredor;
        newSolicitud.contrato = asignado.nroContrato;
        newSolicitud.conAsignacion = true;
        newSolicitud.contraparte = isCorredor
          ? ""
          : seguimiento.receptores[asignado.cuit].razon_social;
        newSolicitud.solicitud = "";
        newSolicitud.rechazado =
          asignado.estado == "1" ? parseInt(asignado.asignados) : 0;
        newSolicitud.devuelto = parseInt(asignado.devueltos);
        newSolicitud.solicitado = 0;
        newSolicitud.noAsignado =
          parseInt(asignado.asignados) -
          newSolicitud.rechazado -
          newSolicitud.devuelto;
        newSolicitud.asignado = parseInt(asignado.asignados);
        newSolicitud.cumplido = parseInt(asignado.cumplidos);
        //newSolicitud.observaciones= asignado.ob
        newSolicitud.porciento =
          newSolicitud.asignado > 0
            ? Math.round((newSolicitud.cumplido / newSolicitud.asignado) * 100)
            : 100;
        if (newSolicitud.conAsignacion) {
          let deman = demandas.find(
            (item) => item.id_demanda_cupo == asignado.id_demanda
          );
          if (deman !== undefined) {
            let index = demandas.indexOf(deman);
            deman.usada = true;
            demandas[index] = deman;
            let contraparte =
              deman.contraparte != null
                ? seguimiento.receptores[deman.contraparte].razon_social
                : deman.contraparte;
            newSolicitud.contraparte = isCorredor
              ? contraparte
              : seguimiento.receptores[asignado.cuit].razon_social;
            newSolicitud.solicitud =
              deman.fechaCupo + " - ID" + deman.id_demanda_cupo.toString();
            newSolicitud.solicitado = parseInt(deman.cantidad);
            newSolicitud.noAsignado =
              parseInt(deman.cantidad) -
              parseInt(asignado.asignados) -
              parseInt(asignado.devueltos);
            newSolicitud.observaciones = deman.observaciones
              ? deman.observaciones
              : "";
          } else {
            newSolicitud.solicitud = "SIN";
          }
        }
        this.dataset.push(newSolicitud);
        /* let prodparams = {
          id: parseInt(asignado.id_producto),
          descripcion: seguimiento.productos[asignado.id_producto].descripcion
        }
        this.addProducto(prodparams); */
        let destinatarioparams = {
          cuit: asignado.idCuitDestinatario,
          razon_social: asignado.nombreDestinatario,
        };
        this.addDestinatarioCon(destinatarioparams);
        // this.addDestinatarioApi(destinatarioparams);
        if (asignado.id_destino) {
          let destinoparams = {
            cuit: asignado.id_destino,
            descripcion: asignado.nombreDestino,
          };
          this.addDestinoCon(asignado.idCuitDestinatario, destinoparams);
          // this.addDestinoApi(asignado.idCuitDestinatario, destinoparams);
        }
        let contratooparams = {
          descripcion:
            !newSolicitud.contrato || newSolicitud.contrato == ""
              ? "Sin nominar"
              : newSolicitud.contrato,
        };
        this.addContrato(contratooparams);
      }
    }
    this.demandasNoUsadas = [];
    demandas.forEach((element) => {
      let destinatarioparams = {
        cuit:
          !element.destinatario || element.destinatario == ""
            ? "0"
            : element.destinatario,
        razon_social:
          !element.destinatario || element.destinatario == ""
            ? "Sin nominar"
            : seguimiento.receptores[element.destinatario].razon_social,
      };
      this.addDestinatarioSin(destinatarioparams);
      if (element.id_producto == this.filtro.id_producto.toString()) {
        if (!element.usada) {
          this.demandasNoUsadas.push(element);
        }
      }
      /* let prodparams = {
        id: parseInt(element.id_producto),
        descripcion: this.seguimientoApi.productos[element.id_producto].descripcion
      }
      this.addProducto(prodparams); */
    });

    this.copiaDataset = [...this.dataset];
    this.seguimientoForm.controls["selectedSolicitud"].setValue(2);
    if (this.productos.length > 0) {
      if (this.filtro.id_producto === 0) {
        let tempProducto = this.productos.find(
          (item) => item.descripcion.toLowerCase() === "soja"
        );
        if (tempProducto) {
          this.seguimientoForm.controls["selectedProducto"].setValue(
            tempProducto.id
          );
          this.filtro.id_producto = tempProducto.id.toString();
        } else {
          //this.inicializarProductos();
          this.seguimientoForm.controls["selectedProducto"].setValue(
            this.productos[0].id
          );
          this.filtro.id_producto = this.productos[0].id.toString();
        }
      }
    }
    /* if (this.seguimientoForm.controls['selectedTipo'].value==0 && this.destinatariosSin.length > 0) {
      this.seguimientoForm.controls['selectedDestinatario'].setValue(this.destinatariosSin[0].id);
    } else if (this.destinatariosCon.length > 0){
      this.seguimientoForm.controls['selectedDestinatario'].setValue(this.destinatariosCon[0].id);
    }  */
    this.seguimientoForm.controls["selectedDestinatario"].setValue("-1");
    if (this.destinos.length > 0) {
      this.seguimientoForm.controls["selectedDestino"].setValue(
        this.destinos[0].id
      );
    }
    if (this.corredores.length > 0) {
      this.seguimientoForm.controls["selectedCorredor"].setValue(
        this.corredores[0].id
      );
    }
    if (this.contrapartes.length > 0) {
      this.seguimientoForm.controls["selectedContraparte"].setValue(
        this.contrapartes[0].id
      );
    }
    if (this.contratos.length > 0) {
      this.seguimientoForm.controls["selectedContrato"].setValue(
        this.contratos[0].id
      );
    }

    this.changeGroupSolicitud("", true, false);
  }

  addDemandasNoUsadas() {
    let tempArray: Solicitud[] = [];
    let finalArray: Solicitud[] = [];
    let modo =
      this.seguimientoForm.controls["selectedSolicitud"].value == 1
        ? false
        : true;
    this.demandasNoUsadas.forEach((element) => {
      if (element.id_producto === this.filtro.id_producto.toString()) {
        let newSolicitud = new Solicitud();
        newSolicitud.cuitDestinatario =
          element.destinatario != null ? element.destinatario : "";
        newSolicitud.nombreDestinatario =
          element.destinatario != null
            ? this.seguimientoApi.receptores[element.destinatario].razon_social
            : "";
        newSolicitud.id_destino = "";
        newSolicitud.nombreDestino = "";
        newSolicitud.idProducto = parseInt(element.id_producto);
        let isCorredor =
          this.seguimientoApi.receptores[element.cuit].esCorredor == "0"
            ? false
            : true;
        newSolicitud.corredor = isCorredor
          ? this.seguimientoApi.receptores[element.cuit].razon_social
          : this.lbCorredor;
        newSolicitud.contrato = element.contrato;
        newSolicitud.conAsignacion = false;
        newSolicitud.contraparte = isCorredor
          ? element.contraparte != null
            ? this.seguimientoApi.receptores[element.contraparte].razon_social
            : ""
          : this.seguimientoApi.receptores[element.cuit].razon_social;
        newSolicitud.solicitud =
          element.fechaCupo + " - ID" + element.id_demanda_cupo.toString();
        newSolicitud.solicitado = parseInt(element.cantidad);
        newSolicitud.rechazado =
          element.estado == "1" ? parseInt(element.cantidad) : 0;
        newSolicitud.devuelto = 0;
        newSolicitud.noAsignado =
          parseInt(element.cantidad) -
          parseInt(element.asignado) -
          newSolicitud.devuelto -
          newSolicitud.rechazado;
        newSolicitud.asignado = parseInt(element.asignado);
        newSolicitud.cumplido = parseInt(element.asignado);
        newSolicitud.porciento =
          newSolicitud.asignado > 0
            ? Math.round((newSolicitud.cumplido / newSolicitud.asignado) * 100)
            : 100;
        newSolicitud.observaciones = element.observaciones
          ? element.observaciones
          : "";
        tempArray.push(newSolicitud);
      }
    });
    if (modo) {
      tempArray.forEach((element) => {
        let itemTemp = finalArray.find(
          (item) =>
            item.corredor === element.corredor &&
            item.contraparte === element.contraparte &&
            item.contrato === element.contrato
        );
        if (itemTemp === undefined) {
          finalArray.push(element);
        } else {
          itemTemp.solicitado = itemTemp.solicitado + element.solicitado;
          itemTemp.rechazado = itemTemp.rechazado + element.rechazado;
          itemTemp.devuelto = itemTemp.devuelto + element.devuelto;
          itemTemp.noAsignado = itemTemp.noAsignado + element.noAsignado;
          itemTemp.asignado = itemTemp.asignado + element.asignado;
          itemTemp.cumplido = itemTemp.cumplido + element.cumplido;
          itemTemp.porciento =
            itemTemp.asignado > 0
              ? Math.round((itemTemp.cumplido / itemTemp.asignado) * 100)
              : 100;
        }
      });
      tempArray = finalArray;
    }
    return tempArray;
  }

  changeGroupSolicitud(value, initial: boolean, chanceSelect: boolean) {
    //modo true es por total 1-por solicitud 2- por totales
    let modo = initial
      ? true
      : chanceSelect
        ? value.value === 2
          ? true
          : false
        : this.seguimientoForm.controls["selectedSolicitud"].value == 1
          ? false
          : true;

    this.dataSource.data = [];
    let filteredSolicitudes: Solicitud[] = [];
    let cumplenFiltro: Solicitud[] = [];
    let inicialArray: Solicitud[] = [];
    for (let index = 0; index < this.dataset.length; index++) {
      const element = this.dataset[index];
      inicialArray.push(element);
    }

    if (!this.filtro.conAsignacion) {
      let demandasNoUsadas = this.addDemandasNoUsadas();
      demandasNoUsadas.forEach((element) => {
        inicialArray.push(element);
      });
    }
    for (let index = 0; index < inicialArray.length; index++) {
      const element = inicialArray[index];
      let cumple = false;
      if (
        element.idProducto == this.filtro.id_producto &&
        element.conAsignacion == this.filtro.conAsignacion
      ) {
        cumple = true;
      }
      if (cumple && this.filtro.idCuitDestinatario !== "-1") {
        cumple = false;
        if (
          element.cuitDestinatario == this.filtro.idCuitDestinatario &&
          element.id_destino === this.filtro.id_destino
        ) {
          cumple = true;
        } else if (
          this.filtro.idCuitDestinatario == "0" &&
          (!element.cuitDestinatario || element.cuitDestinatario == "")
        ) { 
          cumple = true;
        }
      }
      if (cumple && this.filtro.corredor !== "") {
        cumple = false;
        if (element.corredor == this.filtro.corredor) {
          cumple = true;
        } else if (
          this.filtro.corredor == "Sin nominar" &&
          (!element.corredor || element.corredor == "")
        ) {
          cumple = true;
        }
      }
      if (cumple && this.filtro.contraparte !== "") {
        cumple = false;
        if (element.contraparte == this.filtro.contraparte) {
          cumple = true;
        } else if (
          this.filtro.contraparte == "Sin nominar" &&
          (!element.contraparte || element.contraparte == "")
        ) {
          cumple = true;
        }
      }
      if (cumple && this.filtro.contrato !== "") {
        cumple = false;
        if (element.contrato == this.filtro.contrato) {
          cumple = true;
        } else if (
          this.filtro.contrato == "Sin nominar" &&
          (!element.contrato || element.contrato == "")
        ) {
          cumple = true;
        }
      }

      if (cumple) {
        cumplenFiltro.push(element);
      }
    }

    filteredSolicitudes = [];
    
    for (let index = 0; index < cumplenFiltro.length; index++) {
      const element = cumplenFiltro[index];
      let ind = -1;
      for (let index1 = 0; index1 < filteredSolicitudes.length; index1++) {
        const filteredElement = filteredSolicitudes[index1];
        if (
          filteredElement.corredor === element.corredor &&
          filteredElement.contraparte === element.contraparte &&
          filteredElement.solicitud === element.solicitud &&
          filteredElement.contrato === element.contrato
        ) {
          ind = index1;
          continue;
        }
      }
      if (ind === -1) {
        filteredSolicitudes.push(element);
      } else {
        let temp = [];
        for (let index1 = 0; index1 < filteredSolicitudes.length; index1++) {
          const filteredElement = filteredSolicitudes[index1];
          if (index1 !== ind) {
            temp.push(filteredElement);
          } else {
            let te = new Solicitud();
            te.idProducto = element.idProducto;
            te.cuitDestinatario = element.cuitDestinatario;
            te.nombreDestinatario = element.nombreDestinatario;
            te.id_destino = element.id_destino;
            te.nombreDestino = element.nombreDestino;
            te.conAsignacion = element.conAsignacion;
            te.corredor = element.corredor;
            te.contraparte = element.contraparte;
            te.contrato = element.contrato;
            te.solicitud = element.solicitud;
            te.solicitado = filteredSolicitudes[ind].solicitado;
            te.derivaciones = element.derivaciones;
            te.rechazado =
              element.rechazado + filteredSolicitudes[ind].rechazado;
            te.devuelto = element.devuelto + filteredSolicitudes[ind].devuelto;
            te.choferes_vinculados = element.choferes_vinculados + filteredSolicitudes[ind].choferes_vinculados;
            te.noAsignado = filteredSolicitudes[ind].noAsignado;
            te.asignado = element.asignado + filteredSolicitudes[ind].asignado;
            te.cumplido = element.cumplido + filteredSolicitudes[ind].cumplido;
            te.porciento =
              te.asignado > 0
                ? Math.round((te.cumplido / te.asignado) * 100)
                : 100;
            temp.push(te);
          }
        }
        filteredSolicitudes = temp;
      }
    }
    if (modo) {
      this.isTotales = true;
      let filteredSolicitudesTotal = [];
      for (let index = 0; index < filteredSolicitudes.length; index++) {
        const element = filteredSolicitudes[index];
        let ind = -1;
        for (
          let index1 = 0;
          index1 < filteredSolicitudesTotal.length;
          index1++
        ) {
          const filteredElement = filteredSolicitudesTotal[index1];
          if (
            filteredElement.corredor === element.corredor &&
            filteredElement.contraparte === element.contraparte &&
            filteredElement.contrato === element.contrato
          ) {
            ind = index1;
            continue;
          }
        }
        if (ind === -1) {
          filteredSolicitudesTotal.push(element);
        } else {
          let temp = [];
          for (
            let index1 = 0;
            index1 < filteredSolicitudesTotal.length;
            index1++
          ) {
            const filteredElement = filteredSolicitudesTotal[index1];
            if (index1 !== ind) {
              temp.push(filteredElement);
            } else {
              let te = new Solicitud();
              te.idProducto = element.idProducto;
              te.cuitDestinatario = element.cuitDestinatario;
              te.nombreDestinatario = element.nombreDestinatario;
              te.id_destino = element.id_destino;
              te.nombreDestino = element.nombreDestino;
              te.conAsignacion = element.conAsignacion;
              te.corredor = element.corredor;
              te.contraparte = element.contraparte;
              te.contrato = element.contrato;
              te.solicitud = element.solicitud;
              te.solicitado = element.solicitado + filteredElement.solicitado;
              te.rechazado = element.rechazado + filteredElement.rechazado;
              te.devuelto = element.devuelto + filteredElement.devuelto;
              te.choferes_vinculados = element.choferes_vinculados + filteredElement.choferes_vinculados;
              te.noAsignado = element.noAsignado + filteredElement.noAsignado;
              te.asignado = element.asignado + filteredElement.asignado;
              te.cumplido = element.cumplido + filteredElement.cumplido;
              te.porciento =
                te.asignado > 0
                  ? Math.round((te.cumplido / te.asignado) * 100)
                  : 100;
              temp.push(te);
            }
          }
          filteredSolicitudesTotal = temp;
        }
      }
      filteredSolicitudes = [];
      filteredSolicitudes = filteredSolicitudesTotal;
    } else {
      this.isTotales = false;
    }

    this.inicializarDestinatarios();
    this.inicializarCorredor();
    this.inicializarContraparte();
    this.inicializarContratos();

    filteredSolicitudes.forEach((element) => {
      /* let tempDestinatario = this.destinatariosApi.find(item => item.cuit === element.cuitDestinatario);
      if (tempDestinatario){
        let destinatarioparams = {
          cuit: tempDestinatario.cuit,
          razon_social: tempDestinatario.razon_social
        }
        this.addDestinatario(destinatarioparams);
        let tempDestino = tempDestinatario.destinos.find(item => item.cuit === element.cuitDestino);
        if (tempDestino) {
          let destinoparams = {
            cuit:tempDestino.cuit,
            descripcion: tempDestino.descripcion
          }
          this.addDestino(destinatarioparams.cuit, destinoparams);
        }
      } */
      if (element.corredor) {
        let corredoroparams = {
          descripcion: element.corredor,
        };
        this.addCorredor2(corredoroparams);
      }

      if (element.contraparte) {
        let contraparteparams = {
          descripcion: element.contraparte,
        };
        this.addContraparte(contraparteparams);
      }
      let contratoparams = {
        descripcion:
          !element.contrato || element.contrato == ""
            ? "Sin nominar"
            : element.contrato,
      };
      this.addContrato(contratoparams);
    });
    if (this.contratos.length > 0) {
      this.ordenarContratos();
    }
    if (filteredSolicitudes.length > 0) {
      this.disabledCorredor = false;
      this.disabledContraparte = false;
      this.disabledContrato = false;
    } else {
      this.disabledCorredor = true;
      this.disabledContraparte = true;
      this.disabledContrato = true;
    }
    if (this.filtro.conAsignacion) {
      this.destinatariosCon.forEach((element) => {
        this.destinatarios.push(element);
      });
    } else {
      this.destinatariosSin.forEach((element) => {
        this.destinatarios.push(element);
      });
    }
    if (this.filtro.idCuitDestinatario !== "") {
      if (this.destinatarios.length > 0) {
        let tempDestinatario = this.destinatarios.find(
          (item) => item.cuit === this.filtro.idCuitDestinatario
        );
        if (tempDestinatario != undefined) {
          this.seguimientoForm.controls["selectedDestinatario"].setValue(
            tempDestinatario.id
          );
        }
      }
    } else {
      if (this.destinatarios.length > 0) {
        this.seguimientoForm.controls["selectedDestinatario"].setValue(
          this.destinatarios[0].id
        );
      }
    }
    if (this.filtro.corredor !== "") {
      if (this.corredores.length > 0) {
        let tempCorredor = this.corredores.find(
          (item) => item.descripcion === this.filtro.corredor
        );
        this.seguimientoForm.controls["selectedCorredor"].setValue(
          tempCorredor.id
        );
      }
    } else {
      if (this.corredores.length > 0) {
        this.seguimientoForm.controls["selectedCorredor"].setValue(
          this.corredores[0].id
        );
      }
    }
    if (this.filtro.contraparte !== "") {
      if (this.contrapartes.length > 0) {
        let tempContraparte = this.contrapartes.find(
          (item) => item.descripcion === this.filtro.contraparte
        );
        this.seguimientoForm.controls["selectedContraparte"].setValue(
          tempContraparte.id
        );
      }
    } else {
      if (this.contrapartes.length > 0) {
        this.seguimientoForm.controls["selectedContraparte"].setValue(
          this.contrapartes[0].id
        );
      }
    }
    if (this.filtro.contrato !== "") {
      if (this.contratos.length > 0) {
        let tempContrato = this.contratos.find(
          (item) => item.descripcion === this.filtro.contrato
        );
        this.seguimientoForm.controls["selectedContrato"].setValue(
          tempContrato.id
        );
      }
    } else {
      if (this.contratos.length > 0) {
        this.seguimientoForm.controls["selectedContrato"].setValue(
          this.contratos[0].id
        );
      }
    }
    this.dataSource.data = filteredSolicitudes;
    this.pageEvent.length = filteredSolicitudes.length;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageIndex = 0;
    this.dataSource.sort = this.sort;
  }

  inicializarDestinatarios() {
    this.destinatarios = [];
    this.destinatarios.push({
      id: "-1",
      cuit: "-1",
      razon_social: "Todos",
      destinos: [],
      ccpp: [],
      rte: [],
      corredores: [],
      contrapartes: [],
    });
  }

  inicializarDestinos() { }

  inicializarCorredor() {
    this.corredores = [];
    this.corredores.push({
      id: 0,
      descripcion: "Todos",
    });
  }

  inicializarContraparte() {
    this.contrapartes = [];
    this.contrapartes.push({
      id: 0,
      descripcion: "Todas",
    });
  }

  inicializarContratos() {
    this.contratos = [];
    // this.contratos.push({
    //   id: 0,
    //   descripcion: 'Todos',
    // });
  }

  ordenarContratos() {
    let isSinNominar = false;
    let temp = [];
    for (let i = 0; i < this.contratos.length; i++) {
      let element = this.contratos[i];
      if (element.descripcion === "Sin nominar") {
        isSinNominar = true;
      } else {
        temp.push(element);
      }
    }
    this.contratos = temp;
    this.contratos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    if (isSinNominar) {
      this.contratos.unshift({
        id: 0,
        descripcion: "Sin nominar",
      });
    }
    this.contratos.unshift({
      id: -1,
      descripcion: "Todos",
    });
  }

  inicializarProductos() {
    this.productos = [];
    this.productos.push({
      id: 1,
      descripcion: "Soja",
    });
  }

  addProducto(prod) {
    let encontrado = false;
    for (let i = 0; i < this.productos.length; i++) {
      if (this.productos[i].id === prod.id) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      this.productos.push(prod);
    }
  }

  getDestinatarios() {
    this.cupoService.getV3Destinatarios().subscribe((res) => {
      res.data.forEach((element) => {
        this.destinatarios.push(element);
      });
    });
  }
  addDestinatario(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinatarios.length; i++) {
      if (this.destinatarios[i].cuit === dest.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newDestinatario = new DestinatarioV3();
      newDestinatario.id = this.destinatarios.length.toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatarios.push(newDestinatario);
    }
  }
  addDestinatarioCon(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinatariosCon.length; i++) {
      if (this.destinatariosCon[i].cuit === dest.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newDestinatario = new DestinatarioV3();
      newDestinatario.id = (this.destinatariosCon.length + 1).toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatariosCon.push(newDestinatario);
    }
  }
  addDestinatarioSin(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinatariosSin.length; i++) {
      if (this.destinatariosSin[i].cuit === dest.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newDestinatario = new DestinatarioV3();
      newDestinatario.id = (this.destinatariosSin.length + 1).toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatariosSin.push(newDestinatario);
    }
  }
  addDestinatarioApi(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinatariosApi.length; i++) {
      if (this.destinatariosApi[i].cuit === dest.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newDestinatario = new DestinatarioV3();
      newDestinatario.id = this.destinatariosApi.length.toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatariosApi.push(newDestinatario);
      this.destinatariosApi.sort((a, b) =>
        a.razon_social.localeCompare(b.razon_social)
      );
    }
  }
  addDestinoApi(idCuitDestinatario, dest) {
    if (idCuitDestinatario !== "") {
      let tempDestinatario = this.destinatariosApi.find(
        (item) => item.cuit === idCuitDestinatario
      );
      let encontrado = false;
      for (let i = 0; i < tempDestinatario.destinos.length; i++) {
        if (tempDestinatario.destinos[i].cuit === dest.cuit) {
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        let newDestino = new ItemsCuit();
        newDestino.id = tempDestinatario.destinos.length;
        newDestino.descripcion = dest.descripcion;
        newDestino.cuit = dest.cuit;
        tempDestinatario.destinos.push(newDestino);
      }
      tempDestinatario.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
  }
  addDestinoCon(idCuitDestinatario, dest) {
    if (idCuitDestinatario !== "") {
      let tempDestinatario = this.destinatariosCon.find(
        (item) => item.cuit === idCuitDestinatario
      );
      let encontrado = false;
      for (let i = 0; i < tempDestinatario.destinos.length; i++) {
        if (tempDestinatario.destinos[i].cuit === dest.cuit) {
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        let newDestino = new ItemsCuit();
        newDestino.id = tempDestinatario.destinos.length;
        newDestino.descripcion = dest.descripcion;
        newDestino.cuit = dest.cuit;
        tempDestinatario.destinos.push(newDestino);
      }
      tempDestinatario.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
  }
  addDestinoSin(idCuitDestinatario, dest) {
    if (idCuitDestinatario !== "") {
      let tempDestinatario = this.destinatariosSin.find(
        (item) => item.cuit === idCuitDestinatario
      );
      let encontrado = false;
      for (let i = 0; i < tempDestinatario.destinos.length; i++) {
        if (tempDestinatario.destinos[i].cuit === dest.cuit) {
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        let newDestino = new ItemsCuit();
        newDestino.id = tempDestinatario.destinos.length;
        newDestino.descripcion = dest.descripcion;
        newDestino.cuit = dest.cuit;
        tempDestinatario.destinos.push(newDestino);
      }
      tempDestinatario.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
  }

  /* addCorredor(idCuitDestinatario, corr) {
    if (idCuitDestinatario !== '') {
      let tempDestinatario = this.destinatarios.find(item => item.cuit === idCuitDestinatario);
      let tempCorredor = tempDestinatario.corredores.find(item => item.descripcion === corr.descripcion);
      if (tempCorredor == undefined) {
        let newCorredor = new CorredorV3();
        newCorredor.id = tempDestinatario.corredores.length + 1;
        newCorredor.descripcion = corr.descripcion;
        newCorredor.cuit = corr.cuit;
        newCorredor.contrapartes = [];
        if (corr.contraparte !== '') {
          let contra = new ItemsBasico();
          contra.id = 1;
          contra.descripcion = corr.contraparte;
          newCorredor.contrapartes.push(contra);
        }
        tempDestinatario.corredores.push(newCorredor);
      } else {
        // El corredor ya existe y tengo que analizar la contraparte
        let tempContra = tempCorredor.contrapartes.find(item => item.descripcion === corr.contraparte);
        if (tempContra === undefined) {
          let contra = new ItemsBasico();
          contra.id = tempCorredor.contrapartes ? tempCorredor.contrapartes.length + 1 : 1;
          contra.descripcion = corr.contraparte;
          tempCorredor.contrapartes.push(contra);
        }
      }
    }
  } */
  addCorredor2(corr) {
    let tempCorredor = this.corredores.find(
      (item) => item.descripcion === corr.descripcion
    );
    if (tempCorredor == undefined) {
      let newCorredor = new ItemsBasico();
      newCorredor.id = this.corredores.length + 1;
      newCorredor.descripcion = corr.descripcion;
      this.corredores.push(newCorredor);
    }
    this.corredores.shift();
    this.corredores.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    this.corredores.unshift({
      id: 0,
      descripcion: "Todos",
    });
  }

  addContraparte(dest) {
    let encontrado = false;
    for (let i = 0; i < this.contrapartes.length; i++) {
      if (this.contrapartes[i].descripcion === dest.descripcion) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newContraparte = new ItemsBasico();
      newContraparte.id = this.contrapartes.length + 1;
      newContraparte.descripcion = dest.descripcion;
      this.contrapartes.push(newContraparte);
    }
    this.contrapartes.shift();
    this.contrapartes.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    this.contrapartes.unshift({
      id: 0,
      descripcion: "Todas",
    });
  }

  addContrato(data) {
    let encontrado = false;
    for (let i = 0; i < this.contratos.length; i++) {
      if (this.contratos[i].descripcion === data.descripcion) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newContrato = new ItemsBasico();
      newContrato.id =
        data.descripcion == "Sin nominar" ? 0 : this.contratos.length;
      newContrato.descripcion = data.descripcion;
      this.contratos.push(newContrato);
    }
  }

  cambioRangoFecha(ref) {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
    const daterange = { start: start, end: end };
    const dif = moment(new Date(end)).diff(new Date(start), "days");
    if (dif > 30) {
      this.seguimientoForm.controls["selectedFecha"].setErrors({
        rango: true,
      });
    } else {
      let newprimerDia = this.homeService.formatoFecha(start, "amd", "-");
      let newultimoDia = this.homeService.formatoFecha(end, "amd", "-");
      let cambioPrimerDia = newprimerDia !== this.primerDia ? true : false;
      let cambioUltimoDia = newultimoDia !== this.ultimoDia ? true : false;
      if (cambioPrimerDia || cambioUltimoDia) {
        this.chancedDate = true;
        this.primerDia = newprimerDia;
        this.ultimoDia = newultimoDia;
      } else {
        this.chancedDate = false;
      }
    }
  }

  aplicarFiltroDestino(cmd) {
    let tempDestinatario = this.destinatarios.find(
      (item) => item.cuit === this.filtro.idCuitDestinatario
    );
    let tempDestino = tempDestinatario.destinos.find(
      (item) => item.id === cmd.value
    );
    this.filtro.id_destino = tempDestino.cuit;
  }

  aplicarFiltroDestinatario(cmd) {
    let tempDestinatario = this.destinatarios.find(
      (item) => item.id === cmd.value
    );
    this.filtro.idCuitDestinatario = tempDestinatario.cuit;
    this.destinos = tempDestinatario.destinos;
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino = cmd.value == "-1" ? true : false;
    this.seguimientoForm.controls["selectedDestino"].setValue(
      this.destinos[0].id
    );
    this.filtro.id_destino = this.destinos[0].cuit;
  }

  aplicarFiltroProducto(valor) {
    let tempProducto = this.productos.find((item) => item.id === valor.value);
    this.filtro.id_producto = tempProducto.id;
    this.loadData(this.primerDia, this.ultimoDia);
    this.inicializarDestinatarios();
    this.seguimientoForm.controls["selectedDestinatario"].setValue("-1");
    this.filtro.idCuitDestinatario = "-1";
    this.destinos = [];
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino = true;
    this.seguimientoForm.controls["selectedDestino"].setValue(
      this.destinos[0].id
    );
    this.filtro.id_destino = this.destinos[0].cuit;
  }

  aplicarFiltroTipo(valor) {
    this.seguimientoForm.controls["selectedTipo"].setValue(
      parseInt(valor)
    );
    this.filtro.conAsignacion = valor == 1 ? true : false;
    this.inicializarDestinatarios();
    this.seguimientoForm.controls["selectedDestinatario"].setValue("-1");
    this.filtro.idCuitDestinatario = "-1";
    this.destinos = [];
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino = true;
    this.seguimientoForm.controls["selectedDestino"].setValue(
      this.destinos[0].id
    );
    this.filtro.id_destino = this.destinos[0].cuit;
    this.inicializarCorredor();
    this.filtro.corredor = "";
    this.inicializarContraparte();
    this.filtro.contraparte = "";
    this.inicializarContratos();
    this.filtro.contrato = "";
  }

  aplicarFiltroCorredor(valor) {
    let tempCorredor = this.corredores.find((item) => item.id === valor.value);
    if (valor.value === 0) {
      this.filtro.corredor = "";
    } else {
      this.filtro.corredor = tempCorredor.descripcion;
    }
  }

  aplicarFiltroCorredor2(valor) {
    if (valor.value === 0) {
      this.filtro.corredor = "";
    } else {
      let tempCorredor = this.corredores.find(
        (item) => item.id === valor.value
      );
      this.filtro.corredor = tempCorredor.descripcion;
    }
  }

  aplicarFiltroContraparte(valor) {
    if (valor.value === 0) {
      this.filtro.contraparte = "";
    } else {
      let tempContraparte = this.contrapartes.find(
        (item) => item.id === valor.value
      );
      this.filtro.contraparte = tempContraparte.descripcion;
    }
  }

  aplicarFiltroContrato(valor) {
    if (valor.value === -1) {
      this.filtro.contrato = "";
    } else {
      let tempContratos = this.contratos.find(
        (item) => item.id === valor.value
      );
      this.filtro.contrato = tempContratos.descripcion;
    }
  }

  buscar() {
    if (this.chancedDate) {
      this.loadData(this.primerDia, this.ultimoDia);
    } else {
      if (this.seguimientoForm.controls["selectedDestinatario"].value == 0) {
        this.disabledDestino = true;
      }
      this.changeGroupSolicitud("", false, false);
    }
  }

  exportAsXLSX(): void {
    let array_exp = [];
    let datos: any[] = [];
    datos = this.dataSource.data;
    if (datos.length > 0) {
      for (let i = 0; i < datos.length; i++) {
        const element = datos[i];
        let tempProducto = this.productos.find(
          (item) => item.id === element.idProducto
        );
        let exportar = {
          "Cuit Destinatario": element.cuitDestinatario,
          Destinatario: element.nombreDestinatario,
          "Cuit Destino": element.cuitDestino,
          Destino: element.nombreDestino,
          Corredor: element.corredor,
          Contraparte: element.contraparte,
          Contrato: element.contrato,
          Producto: tempProducto.descripcion,
          Solicitud: element.solicitud,
          Solicitado: element.solicitado,
          Rechazado: element.rechazado,
          Recuperado: element.devuelto,
          NoAsignado: element.noAsignado,
          Asignado: element.asignado,
          Cumplido: element.cumplido,
          Porciento: element.porciento,
          Observaciones: element.observaciones,
        };
        array_exp.push(exportar);
      }
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      let nombre = year + "_" + month + "_" + day + "_JAKUE_SEGUIMIENTO";
      this.excelService.exportAsExcelFile(array_exp, nombre);
    }
  }

  addCupoSolicitados(tipo: number) {
    let title = "";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddSolicitudesC3Component,
      {
        width: "70vw",
        height: "67vh",
        disableClose: true,
        data: {
          title: title,
          tipo: tipo,
          redirigir: false,
          productos: this.productos,
          filtros: null,

        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      return;
    });
  }

  getItemsProductos() {
    //this.productos = [];
    this.cupoService.getProductosCentro().subscribe((data) => {
      data.data.forEach((element) => {
        if (element.id !== 1) {
          this.productos.push(element);
        }
      });
    });
  }
}
