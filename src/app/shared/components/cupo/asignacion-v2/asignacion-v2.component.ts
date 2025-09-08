import {
  ChangeDetectorRef, Component, ElementRef, EventEmitter,
  Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  DateAdapter,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { CentrosService } from "@app/shared/services";
import { HotTableComponent } from "@handsontable-pro/angular";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { Cabecera } from "app/shared/models/cabecera";
import {
  DestinatarioV3, ItemsCuit, ItemsRazonSocial
} from "app/shared/models/v2-demandados";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { CcppService } from "app/shared/services/ccpp.service";
import { MessageService } from "app/shared/services/message.service";
import { NomencladoresService } from "app/shared/services/nomencladores.service";
import * as Handsontable from "handsontable-pro";
import * as moment from "moment";
import { Observable, Subscription, timer } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged, map
} from "rxjs/operators";
import { HomeService } from "../../home/home.service";
import { AddCuposDisponiblesComponent } from "../add-cupos-disponibles/add-cupos-disponibles.component";
import { AppCaratulasDiferentesComponent } from "../asignar-solicitud/asignar-solicitud.component";
import { AddSolicitudesC3Component } from "../cupera3/add-solicitudes-c3/add-solicitudes-c3.component";
import { CupoService } from "../cupo.service";
import { CentroSinEMail, DiaSemana } from "../cuponera/cuponera.component";
import { InformacionCupoV2Component } from "../informacion-cupo-v2/informacion-cupo-v2.component";
import { RechazarSolicitudComponent } from "../rechazar-solicitud/rechazar-solicitud.component";
import {
  UsuarioSinEmailComponent
} from "../usuario-sin-email/usuario-sin-email.component";
import { createForm, createGestionForm, FunctionCreate, initProductos } from "./functions";
import { loadProductos } from "./functions/load-productos";
import { Asignacion, Cupo, DetallesDestinatario, Dia, Filtro, ItemsEnable, ListadoAsignacion, ListadoSolicitud, Seleccion, Solicitud } from "./models";


@Component({
  selector: "app-asignacion-v2",
  templateUrl: "./asignacion-v2.component.html",
  styleUrls: ["./asignacion-v2.component.scss"],
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
export class AsignacionV2Component implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fecha: string;
  @Input() cupos;
  @Input() detalles;
  @Input() solicitudes;
  @Input() productos;
  @Input() myData;
  @Input() cantNotificaciones;
  @Input() listSinEmail: CentroSinEMail[] = [];
  @Input() dias: DiaSemana[] = [];
  @Output() cambiarFecha = new EventEmitter();
  @Output() chanceProductos = new EventEmitter();
  @Output() loadRecuperarEvent = new EventEmitter();
  @Output() loadNotificacionesEvent = new EventEmitter();
  @ViewChild("tablaSolicitudes") tablaSolicitudes: ElementRef;
  @ViewChild("tablaFiltros") tablaFiltros: ElementRef;
  @ViewChild("hot") hot: HotTableComponent;
  //@ViewChild("cuposModulos") cuposModulos: ElementRef;

  public getItemSub: Subscription;
  filtrarForm: FormGroup;
  gestionForm: FormGroup;
  destinatarios: DestinatarioV3[] = [];
  seleccionados: Seleccion[] = [];

  minDate = new Date();
  hoyString = moment().format("YYYY-MM-DD");
  hoyMoment: moment.Moment = moment();
  dia5Moment: moment.Moment = moment();
  validFecha = true;

  visible = true;

  destinos: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];

  clientes: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];
  dadores: ItemsRazonSocial[] = [
    {
      id: '0',
      cuit: "",
      razon_social: "Todos",
    },
  ];

  acciones: ItemsEnable[] = [
    {
      id: 0,
      descripcion: "Asignar",
      enable: true,
    },
    {
      id: 1,
      descripcion: "Asignar todos",
      enable: true,
    },
    {
      id: 2,
      descripcion: "Rechazar",
      enable: true,
    },
  ];
  instance: Handsontable;
  filtro: Filtro = {
    id_producto: "1",
    idCuitDestinatario: "-1",
    idDestino: "",
    idCcpp: "",
    idRte: "",
    destSolic: "",
    zona: "",
    corredor: "",
    contraparte: "",
    producto: "",
    contrato: "",
    caratula: "",
    isCliente: "",
    cliente: "",
    dador: ""
  };
  isInMobile = false;
  selectedOtroProducto = "";

  //analizar para cambiar
  cuposDisponiblesApi: any[] = [];
  solicitudesApi: any[] = [];
  detallesDisponiblesApi: any;
  otrosproductos = [];
  listadoAsignacion: ListadoAsignacion[] = [];
  listadoSolicitudes: ListadoSolicitud[] = [];
  listadoClientes: ListadoSolicitud[] = [];
  listadoSolicitudesPropia: ListadoSolicitud[] = [];
  selectedItemAsignacion: ListadoAsignacion;
  dataSource = new MatTableDataSource();
  dataSourceSelectedCupo = new MatTableDataSource();
  dataSourceDetalleDestinatario = new MatTableDataSource();
  dataSourceSolicitudes = new MatTableDataSource<ListadoSolicitud>();
  message: any;
  displayedColumns: string[] = [
    "destinatario",
    "dia1",
    "dia2",
    "dia3",
    "dia4",
    "dia5",
    "dia6",
    "dia7",
  ];
  displayedColumnsDestino: string[] = [
    "destino",
    "dia1",
    "dia2",
    "dia3",
    "dia4",
    "dia5",
    "dia6",
    "dia7",
  ];
  displayedColumnSolicitudes: string[] = [
    "contraparte",
    "dia1_s",
    "dia2_s",
    "dia3_s",
    "dia4_s",
    "dia5_s",
    "dia6_s",
    "dia7_s",
  ];

  height = 400;
  height1 = 100;
  height2 = 100;
  y = 346;
  oldY = 0;
  grabber = false;

  topaddSolicitad = 469;
  leftaddSolicitad = 50;
  topaddSolicitadbootom = 75;

  disabledDestino = true;
  disabledCcpp = true;
  disabledcliente = true;
  disabledDador = true;
  disabledRte = true;
  disabledCorredor = true;
  disabledContraparte = true;
  disabledDestSolicitud = true;
  disabledContrato = true;
  disabledCuposXModulos = true;
  disabledAcciones = true;
  disabledZona = true;
  disabledCaratula = true;

  placeholderAccion = "  asignar/asignar todos/rechazar";
  placeholderCabecera = "  3 > Seleccionar cabecera";
  validatedForm = false;

  preAsignacion: Asignacion[] = [];

  isSelectedDestinatario: boolean = false;
  isDetallesDestinos: boolean = false;
  cambiofecha = true;
  colHeaders: string[] = [];
  rowHeaders: string[] = [];

  agregarsolicitud = false;

  headerTitle: string = "CLIENTE";

  tableSettings: any = {
    stretchH: "all",
    colWidths: [50, 10, 10, 10, 10, 10, 10, 9],
    // colWidths: 128,
    maxRows: 300,
    manualRowResize: false,
    manualColumnResize: false,
    className: "htCenter",
    manualRowMove: false,
    manualColumnMove: false,
    filters: false,
    // dropdownMenu: true,
    // autoWrapRow: false,
    minSpareRows: false,
    columnSorting: false,
    fillHandle: false,
    currentRowClassName: "currentRow",
    currentColClassName: "currentCol",
    rowHeaderWidth: 30,
    rowHeights: "44px",
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 370,
    disableVisualSelection: ["header"],
    //beforeRefreshDimensions: false,
    allowInsertRow: true,
    contextMenu: false,
    // rowHeaders: [],
    rowHeaders: false,
    columns: [
      {
        data: "contraparte",
        type: "text",
        readOnly: true,
      },
      {
        data: "dia0_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia1_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia2_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia3_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia4_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia5_solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia6_solicitados",
        type: "numeric",
        readOnly: true,
      }
    ],
    colHeaders: [
      this.headerTitle,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    afterValidate: function (isValid, value, row, prop) {
      if (value == false) {
        alert("Invalid");
        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      }
    },
    cells: function (row, col) {
      return true;
    },
  };

  interval: any;
  selectedDestino = "";
  selectedCcpp = "";
  selectedRte = "";
  selectedDador = "";
  is_logistica_propia: string;

  renderButtons(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = "<button onclick='alert()' type='button'>press</button>";
  }

  disabledSelectCabecera = true;
  selectedCabecera: Cabecera;
  valorValidInput = 0;
  chanceData = false;
  showHandsonTable = false;
  toolTipModulo = "";
  subscription: Subscription;

  fechaHoraUltimaActualizacion: string = "";
  InitialDate: moment.Moment;
  remainingTime: number;
  horas: number = 0;
  minutes: number;
  seconds: number;
  everySecond: Observable<number> = timer(0, 1000);
  InitialTime: number = 0;
  SearchDate: moment.Moment = moment();
  searchEndDate: moment.Moment;
  proximaActualizacion = "";

  ElapsTime: number = 30;

  First: boolean = true;

  TimerExpired: EventEmitter<any> = new EventEmitter<any>();
  usaMTR: boolean = false;
  posee_terminal: boolean;

  totalListadoAsignaciones = 0;
  totalListadoSolicitudes = 0;
  mostrarSolicitudes = false;
  mostrarAreaSinCupo = false;

  filtroClientes = {
    nombre_interno: '',
    cuit_interno: '',
  };
  filtroDador = {
    nombre_interno: '',
    cuit_interno: '',
  };

  lista_empresa: any[];

  constructor(
    private dialog: MatDialog,
    private homeService: HomeService,
    private messageService: MessageService,
    private cupoService: CupoService,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    private nomencladoresService: NomencladoresService,
    private ccppService: CcppService,
    private changeDetectorRefs: ChangeDetectorRef,
    private centrosService: CentrosService,
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "AsignacionV3":
            this.dias = this.message.data.dias;
            this.listadoSolicitudesPropia = [];
            this.getDataAPI(this.message.data);
            break;
          case "productos":
            loadProductos(this.productos, this.filtrarForm, this.filtro);
            //this.loadProductos();
            break;
          case "CentroSinEmail":
            this.loadCentrosSinEmail(this.message.data);
            break;
          default:
            break;
        }
      });
    this.isInMobile = window.screen.width > 991 ? false : true;
    this.posee_terminal = localStorage.getItem("posee_terminal") == "1" ? true : false;
    this.is_logistica_propia = localStorage.getItem("logistica_propia") == "1" ? "PLANTA/ORIGEN" : "CLIENTE";
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;


  }

  ngOnInit() {
    this.listadoSolicitudesPropia = [];
    console.log('Fecha Inicial', this.fecha);
    this.filtrarForm = createForm(this.fecha, this.filtro);
    this.gestionForm = createGestionForm();
    this.gestionForm.controls["cuposxModulos"].valueChanges
      .pipe(
        map((text) => {
          return text;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text) => {
        if (text != "" && text > 0) {
          this.validarInput2(text);
        }
      });

    if (this.productos.length > 0) {
      initProductos(this.productos, this.filtrarForm, this.filtro)
    } else {
      this.chanceProductos.emit();
    }

    if (this.cupos.length > 0) {
      const dat = {
        cupos: this.cupos,
        detalles: this.detalles,
        solicitudes: this.solicitudes,
      };
      this.getDataAPI(dat);
    }
    this.getConfigCentro();
    this.interval = setInterval(() => {
      if (this.tablaSolicitudes) {
        let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
        this.topaddSolicitad = value.top;
        this.leftaddSolicitad = value.left;
      }
      if (this.tablaFiltros) {
        let value = this.tablaFiltros.nativeElement.getBoundingClientRect();
        this.topaddSolicitadbootom = value.top;
        this.leftaddSolicitad = value.left;
      }
    }, 100);
  }


  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }



  getDataAPI(data) {
    this.cuposDisponiblesApi = [];
    this.listadoAsignacion = [];
    this.cuposDisponiblesApi = data.cupos;
    this.solicitudesApi = data.solicitudes;
    this.detallesDisponiblesApi = data.detalles;
    this.dataSource.data = [];
    this.dataSourceSelectedCupo.data = [];
    this.dataSourceSolicitudes.data = [];
    this.totalListadoAsignaciones = 0;
    this.totalListadoSolicitudes = 0;
    this.getData();
  }

  getData() {
    let indice = 0;
    // this.inicializarColHeader();
    let cumplenFiltroCupos: Cupo[] = [];
    let inicialArrayCupos: Cupo[] = [];
    let cumplenFiltroSolicitudes: Solicitud[] = [];
    let inicialArraySolicitudes: Solicitud[] = [];
    this.dataSourceSelectedCupo.data = inicialArrayCupos;
    this.changeDetectorRefs.detectChanges();
    this.listadoAsignacion = [];
    this.listadoSolicitudes = [];
    console.log('Fecha buscada', this.fecha);
    let selectedFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );
    console.log('Fecha del Control', selectedFecha);
    if (this.cambiofecha) {
      console.log('Cambio de fecha');
      this.inicializarDestinatarios();
      this.dadores = [
        {
          id: '0',
          cuit: "",
          razon_social: "Todos",
        },
      ];
      for (let key in this.detallesDisponiblesApi.dadores) {
        let innerObj = this.detallesDisponiblesApi.dadores[key];
        this.dadores.push(innerObj);

      }
      this.filtrarForm.controls["selectedDador"].setValue(this.dadores[0].id);
      this.filtro.dador = this.dadores[0].id;
    }
    this.dataSourceSelectedCupo.data = [];
    //array de Cupos
    for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
      const element = this.cuposDisponiblesApi[index];
      cumplenFiltroCupos.push(element);
    }

    for (let index = 0; index < cumplenFiltroCupos.length; index++) {
      const element = cumplenFiltroCupos[index];
      let cumple = false;
      if (element.id_producto == this.filtro.id_producto) {
        cumple = true;
      }
      if (cumple && this.filtro.dador !== "0") {
        cumple =
          element.soyReceptor && element.soyReceptor.dadorId === this.filtro.dador
            ? true
            : false;
      }
      if (cumple) {
        let destinatarioparams = {
          cuit: element.idCuitDestinatario,
          razon_social:
            this.detallesDisponiblesApi.destinatarios[
              element.idCuitDestinatario
            ].razon_social,
        };
        this.addDestinatario(destinatarioparams);
        if (element.id_destino) {
          let destinoparams = {
            id: element.id_destino,
            cuit: element.idCuitDestino,
            descripcion:
              this.detallesDisponiblesApi.destino[element.id_destino]
                .nombreDestino,
          };
          this.addDestinoCon(element.idCuitDestinatario, destinoparams);
        }


      }
      if (cumple && this.filtro.idCuitDestinatario !== "-1") {
        cumple =
          element.idCuitDestinatario === this.filtro.idCuitDestinatario &&
            element.id_destino === this.filtro.idDestino
            ? true
            : false;

      }
      if (cumple) {
        inicialArrayCupos.push(element);
      }
    }

    for (let index = 0; index < inicialArrayCupos.length; index++) {
      const element = inicialArrayCupos[index];
      let tempDia = this.dias.find((item) => item.fecha === element.fecha);
      let indexEnc = -1;
      for (let i = 0; i < this.listadoAsignacion.length; i++) {
        const item = this.listadoAsignacion[i];
        if (item.idCuitDestinatario === element.idCuitDestinatario) {
          indexEnc = i;
          continue;
        }
      }
      if (indexEnc === -1) {
        const newElement = FunctionCreate.listadoAsignacion(element, this.detallesDisponiblesApi, tempDia);
        this.listadoAsignacion.push(newElement);
      } else {
        switch (tempDia.id) {
          case 0:
            let ant0 = this.listadoAsignacion[indexEnc].dia0;
            let antAsignados0 =
              this.listadoAsignacion[indexEnc].dia0.asignados + 1;
            this.listadoAsignacion[indexEnc].dia0 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia0.asignados = antAsignados0;
            this.listadoAsignacion[indexEnc].dia0.cupos = ant0.cupos;
            this.listadoAsignacion[indexEnc].dia0.cupos.push(element);
            break;
          case 1:
            let ant1 = this.listadoAsignacion[indexEnc].dia1;
            let antAsignados1 =
              this.listadoAsignacion[indexEnc].dia1.asignados + 1;
            this.listadoAsignacion[indexEnc].dia1 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia1.asignados = antAsignados1;
            this.listadoAsignacion[indexEnc].dia1.cupos = ant1.cupos;
            this.listadoAsignacion[indexEnc].dia1.cupos.push(element);
            break;
          case 2:
            let ant2 = this.listadoAsignacion[indexEnc].dia2;
            let antAsignados2 =
              this.listadoAsignacion[indexEnc].dia2.asignados + 1;
            this.listadoAsignacion[indexEnc].dia2 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia2.asignados = antAsignados2;
            this.listadoAsignacion[indexEnc].dia2.cupos = ant2.cupos;
            this.listadoAsignacion[indexEnc].dia2.cupos.push(element);
            break;
          case 3:
            let ant3 = this.listadoAsignacion[indexEnc].dia3;
            let antAsignados3 =
              this.listadoAsignacion[indexEnc].dia3.asignados + 1;
            this.listadoAsignacion[indexEnc].dia3 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia3.asignados = antAsignados3;
            this.listadoAsignacion[indexEnc].dia3.cupos = ant3.cupos;
            this.listadoAsignacion[indexEnc].dia3.cupos.push(element);
            break;
          case 4:
            let ant4 = this.listadoAsignacion[indexEnc].dia4;
            let antAsignados4 =
              this.listadoAsignacion[indexEnc].dia4.asignados + 1;
            this.listadoAsignacion[indexEnc].dia4 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia4.asignados = antAsignados4;
            this.listadoAsignacion[indexEnc].dia4.cupos = ant4.cupos;
            this.listadoAsignacion[indexEnc].dia4.cupos.push(element);
            break;
          case 5:
            const ant5 = this.listadoAsignacion[indexEnc].dia5;
            const antAsignados5 =
              this.listadoAsignacion[indexEnc].dia5.asignados + 1;
            this.listadoAsignacion[indexEnc].dia5 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia5.asignados = antAsignados5;
            this.listadoAsignacion[indexEnc].dia5.cupos = ant5.cupos;
            this.listadoAsignacion[indexEnc].dia5.cupos.push(element);
            break;
          case 6:
            const ant6 = this.listadoAsignacion[indexEnc].dia6;
            const antAsignados6 =
              this.listadoAsignacion[indexEnc].dia6.asignados + 1;
            this.listadoAsignacion[indexEnc].dia6 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia6.asignados = antAsignados6;
            this.listadoAsignacion[indexEnc].dia6.cupos = ant6.cupos;
            this.listadoAsignacion[indexEnc].dia6.cupos.push(element);
            break;

          default:
            break;
        }
      }
    }

    for (let index = 0; index < this.solicitudesApi.length; index++) {
      const element = this.solicitudesApi[index];
      cumplenFiltroSolicitudes.push(element);
    }

    for (let index = 0; index < cumplenFiltroSolicitudes.length; index++) {
      const element = cumplenFiltroSolicitudes[index];
      let cumple = false;
      if (element.id_producto == this.filtro.id_producto) {
        cumple = true;
      }
      if (cumple) {
        inicialArraySolicitudes.push(element);
      }
    }

    for (let index = 0; index < inicialArraySolicitudes.length; index++) {
      const element = inicialArraySolicitudes[index];

      let tempDia = this.dias.find((item) => item.fecha === element.fecha);
      let indexEnc = -1;
      let indexEncSol = -1;
      let isCorredor =
        this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
          .esCorredor == "0"
          ? false
          : true;
      let cuitCorredor = isCorredor ? element.corredor : "00000000000";
      let corredor = isCorredor
        ? this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
          .razon_social
        : this.myData.lbCorredor;
      let contraparte = isCorredor
        ? element.contraparte
          ? this.detallesDisponiblesApi.corredor_contraparte[
            element.contraparte
          ].razon_social
          : ""
        : this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
          .razon_social;
      let cuitContraparte = isCorredor ? element.contraparte : element.corredor;
      let destinatarioCuit = element.destinatario;
      let destinatario =
        !element.destinatario || element.destinatario == ""
          ? ""
          : this.detallesDisponiblesApi.destinatarios[element.destinatario]
            .razon_social;
      let contrato = element.contrato;
      let zona =
        !element.id_zona_solicitud || element.id_zona_solicitud == ""
          ? ""
          : this.detallesDisponiblesApi.zonas.length > 0 && this.detallesDisponiblesApi.zonas[element.id_zona_solicitud] !== undefined
            ? this.detallesDisponiblesApi.zonas[element.id_zona_solicitud].nombreZona
            : "";

      for (let i = 0; i < this.listadoAsignacion.length; i++) {
        const item = this.listadoAsignacion[i];
        if (item.idCuitDestinatario === destinatarioCuit) {
          indexEnc = i;
          continue;
        }
      }

      if (indexEnc !== -1) {
        switch (tempDia.id) {
          case 0:
            let ant0 = this.listadoAsignacion[indexEnc].dia0;
            let antAsignados0 = this.listadoAsignacion[indexEnc].dia0.asignados;
            let antSolicitados0 =
              this.listadoAsignacion[indexEnc].dia0.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia0 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia0.asignados = antAsignados0;
            this.listadoAsignacion[indexEnc].dia0.cupos = ant0.cupos;
            this.listadoAsignacion[indexEnc].dia0.solicitados = antSolicitados0;
            this.listadoAsignacion[indexEnc].dia0.solicitudes =
              ant0.solicitudes;

            break;
          case 1:
            let ant1 = this.listadoAsignacion[indexEnc].dia1;
            let antAsignados1 = this.listadoAsignacion[indexEnc].dia1.asignados;
            let antSolicitados1 =
              this.listadoAsignacion[indexEnc].dia1.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia1 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia1.asignados = antAsignados1;
            this.listadoAsignacion[indexEnc].dia1.cupos = ant1.cupos;
            this.listadoAsignacion[indexEnc].dia1.solicitados = antSolicitados1;
            this.listadoAsignacion[indexEnc].dia1.solicitudes =
              ant1.solicitudes;

            break;
          case 2:
            let ant2 = this.listadoAsignacion[indexEnc].dia2;
            let antAsignados2 = this.listadoAsignacion[indexEnc].dia2.asignados;
            let antSolicitados2 =
              this.listadoAsignacion[indexEnc].dia2.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia2 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia2.asignados = antAsignados2;
            this.listadoAsignacion[indexEnc].dia2.cupos = ant2.cupos;
            this.listadoAsignacion[indexEnc].dia2.solicitados = antSolicitados2;
            this.listadoAsignacion[indexEnc].dia2.solicitudes =
              ant2.solicitudes;

            break;
          case 3:
            let ant3 = this.listadoAsignacion[indexEnc].dia3;
            let antAsignados3 = this.listadoAsignacion[indexEnc].dia3.asignados;
            let antSolicitados3 =
              this.listadoAsignacion[indexEnc].dia3.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia3 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia3.asignados = antAsignados3;
            this.listadoAsignacion[indexEnc].dia3.cupos = ant3.cupos;
            this.listadoAsignacion[indexEnc].dia3.solicitados = antSolicitados3;
            this.listadoAsignacion[indexEnc].dia3.solicitudes =
              ant3.solicitudes;

            break;
          case 4:
            let ant4 = this.listadoAsignacion[indexEnc].dia4;
            let antAsignados4 = this.listadoAsignacion[indexEnc].dia4.asignados;
            let antSolicitados4 =
              this.listadoAsignacion[indexEnc].dia4.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia4 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia4.asignados = antAsignados4;
            this.listadoAsignacion[indexEnc].dia4.cupos = ant4.cupos;
            this.listadoAsignacion[indexEnc].dia4.solicitados = antSolicitados4;
            this.listadoAsignacion[indexEnc].dia4.solicitudes =
              ant4.solicitudes;

            break;
          case 5:
            let ant5 = this.listadoAsignacion[indexEnc].dia5;
            let antAsignados5 = this.listadoAsignacion[indexEnc].dia5.asignados;
            let antSolicitados5 =
              this.listadoAsignacion[indexEnc].dia5.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia5 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia5.asignados = antAsignados5;
            this.listadoAsignacion[indexEnc].dia5.cupos = ant5.cupos;
            this.listadoAsignacion[indexEnc].dia5.solicitados = antSolicitados5;
            this.listadoAsignacion[indexEnc].dia5.solicitudes =
              ant5.solicitudes;

            break;
          case 6:
            let ant6 = this.listadoAsignacion[indexEnc].dia6;
            let antAsignados6 = this.listadoAsignacion[indexEnc].dia6.asignados;
            let antSolicitados6 =
              this.listadoAsignacion[indexEnc].dia6.solicitados +
              parseInt(element.cantidad);
            this.listadoAsignacion[indexEnc].dia6 = FunctionCreate.newItemDia();
            this.listadoAsignacion[indexEnc].dia6.asignados = antAsignados6;
            this.listadoAsignacion[indexEnc].dia6.cupos = ant6.cupos;
            this.listadoAsignacion[indexEnc].dia6.solicitados = antSolicitados6;
            this.listadoAsignacion[indexEnc].dia6.solicitudes =
              ant6.solicitudes;

            break;

          default:
            break;
        }
      }
      // Incorporando las solicitudes
      for (let j = 0; j < this.listadoSolicitudes.length; j++) {
        const item = this.listadoSolicitudes[j];
        if (
          item.corredor === corredor &&
          item.contraparte === contraparte &&
          item.destinatario === destinatario &&
          item.contrato === contrato &&
          item.zona === zona
        ) {
          indexEncSol = j;
        }
      }
      if (indexEncSol == -1) {
        let newSolicitud = new ListadoSolicitud();
        newSolicitud.demandanteCuit = element.demandanteCuit;
        newSolicitud.corredor = corredor;
        newSolicitud.corredorCuit = cuitCorredor;
        newSolicitud.contraparte = contraparte;
        newSolicitud.contraparteCuit = cuitContraparte;
        newSolicitud.destinatario = destinatario;
        newSolicitud.contrato = contrato;
        newSolicitud.zona = zona;
        newSolicitud.saldo = 0;
        newSolicitud.dia0_solicitados = 0;
        newSolicitud.dia1_solicitados = 0;
        newSolicitud.dia2_solicitados = 0;
        newSolicitud.dia3_solicitados = 0;
        newSolicitud.dia4_solicitados = 0;
        newSolicitud.total_solicitados = 0;
        newSolicitud.dia0_solicitudes = [];
        newSolicitud.dia1_solicitudes = [];
        newSolicitud.dia2_solicitudes = [];
        newSolicitud.dia3_solicitudes = [];
        newSolicitud.dia4_solicitudes = [];
        newSolicitud.observaciones = [];
        newSolicitud.isSelected = [0, 0, 0, 0, 0];
        newSolicitud.propia = false;
        let obs = element.observaciones
          ? element.observaciones == ""
            ? "SIN OBSERVACIONES"
            : element.observaciones.length > 250
              ? element.observaciones.substring(0, 250)
              : element.observaciones
          : "";
        if (tempDia) {
          switch (tempDia.id) {
            case 0:
              newSolicitud.dia0_solicitados = parseInt(element.disponibles);
              newSolicitud.dia0_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia0_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 1:
              newSolicitud.dia1_solicitados = parseInt(element.disponibles);
              newSolicitud.dia1_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia1_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 2:
              newSolicitud.dia2_solicitados = parseInt(element.disponibles);
              newSolicitud.dia2_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia2_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 3:
              newSolicitud.dia3_solicitados = parseInt(element.disponibles);
              newSolicitud.dia3_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia3_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 4:
              newSolicitud.dia4_solicitados = parseInt(element.disponibles);
              newSolicitud.dia4_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia4_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 5:
              newSolicitud.dia5_solicitados = parseInt(element.disponibles);
              newSolicitud.dia5_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia5_solicitados.toString() +
                "C: " +
                obs
              );
              break;
            case 6:
              newSolicitud.dia6_solicitados = parseInt(element.disponibles);
              newSolicitud.dia6_solicitudes = [element];
              newSolicitud.observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                newSolicitud.dia6_solicitados.toString() +
                "C: " +
                obs
              );
              break;

            default:
              break;
          }
        }
        this.listadoSolicitudes.push(newSolicitud);
      } else {
        if (tempDia) {
          let obs = element.observaciones
            ? element.observaciones == ""
              ? "SIN OBSERVACIONES"
              : element.observaciones.length > 250
                ? element.observaciones.substring(0, 250)
                : element.observaciones
            : "";
          switch (tempDia.id) {
            case 0:
              let ant0 = this.listadoSolicitudes[indexEncSol].dia0_solicitados;
              this.listadoSolicitudes[indexEncSol].dia0_solicitados =
                ant0 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia0_solicitudes = [element];
              break;
            case 1:
              let ant1 = this.listadoSolicitudes[indexEncSol].dia1_solicitados;
              this.listadoSolicitudes[indexEncSol].dia1_solicitados =
                ant1 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia1_solicitudes = [element];
              break;
            case 2:
              let ant2 = this.listadoSolicitudes[indexEncSol].dia2_solicitados;
              this.listadoSolicitudes[indexEncSol].dia2_solicitados =
                ant2 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia2_solicitudes = [element];
              break;
            case 3:
              let ant3 = this.listadoSolicitudes[indexEncSol].dia3_solicitados;
              this.listadoSolicitudes[indexEncSol].dia3_solicitados =
                ant3 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia3_solicitudes = [element];
              break;
            case 4:
              let ant4 = this.listadoSolicitudes[indexEncSol].dia4_solicitados;
              this.listadoSolicitudes[indexEncSol].dia4_solicitados =
                ant4 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia4_solicitudes = [element];
              break;
            case 5:
              let ant5 = this.listadoSolicitudes[indexEncSol].dia5_solicitados;
              this.listadoSolicitudes[indexEncSol].dia5_solicitados =
                ant5 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia5_solicitudes = [element];
              break;
            case 6:
              let ant6 = this.listadoSolicitudes[indexEncSol].dia6_solicitados;
              this.listadoSolicitudes[indexEncSol].dia6_solicitados =
                ant6 + parseInt(element.disponibles);
              this.listadoSolicitudes[indexEncSol].observaciones.push(
                tempDia.dia +
                "/" +
                tempDia.mes +
                "-" +
                element.disponibles.toString() +
                "C: " +
                obs
              );
              this.listadoSolicitudes[indexEncSol].dia6_solicitudes = [element];
              break;
            default:
              break;
          }
        }
      }

      this.listadoSolicitudes.forEach((element) => {
        let obs = "";
        if (element.observaciones.length == 0) {
          obs = "Sin Observaciones";
        } else {
          obs = "Observaciones:";
          element.observaciones.forEach((elem) => {
            obs = obs + "\n " + elem;
          });
        }
        element.obser = obs;
      });
      this.dataSourceSolicitudes.data = this.listadoSolicitudes;
    }

    for (let index = 0; index < this.listadoAsignacion.length; index++) {
      const element = this.listadoAsignacion[index];
      element.total_asignados =
        element.dia0.asignados +
        element.dia1.asignados +
        element.dia2.asignados +
        element.dia3.asignados +
        element.dia4.asignados +
        element.dia5.asignados +
        element.dia6.asignados;
      element.total_solicitados =
        element.dia0.solicitados +
        element.dia1.solicitados +
        element.dia2.solicitados +
        element.dia3.solicitados +
        element.dia4.solicitados +
        element.dia5.solicitados +
        element.dia6.solicitados;
      if (
        this.filtro.idCuitDestinatario !== "-1" &&
        element.idCuitDestinatario === this.filtro.idCuitDestinatario
      ) {
        this.dataSourceSelectedCupo.data = [];
        this.selectedItemAsignacion = element;
        this.dataSourceSelectedCupo.data = [this.selectedItemAsignacion];
        //this.isSelectedDestinatario = true;
        let tempDestinatario = this.destinatarios.find(
          (item) => item.cuit === this.filtro.idCuitDestinatario
        );
        let temporalDestino = tempDestinatario.destinos.find(
          (item) => item.id === parseInt(this.filtro.idDestino)
        );
        this.destinos = tempDestinatario.destinos;
        if (temporalDestino) {
          this.selectedDestino = temporalDestino.descripcion;
        }
      }
    }
    for (let index = 0; index < this.listadoSolicitudes.length; index++) {
      const element = this.listadoSolicitudes[index];
      element.total_solicitados =
        element.dia0_solicitados +
        element.dia1_solicitados +
        element.dia2_solicitados +
        element.dia3_solicitados +
        element.dia4_solicitados +
        element.dia5_solicitados +
        element.dia6_solicitados;
    }

    this.listadoAsignacion.sort((a, b) =>
      a.nombreDestinatario.localeCompare(b.nombreDestinatario)
    );
    this.dataSource.data = this.listadoAsignacion;
    this.totalListadoAsignaciones = this.listadoAsignacion.length;
    if (this.totalListadoAsignaciones === 0) {
      this.mostrarAreaSinCupo = true;
      this.isSelectedDestinatario = false;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges();
    //}



    /* if (this.destinatarios.length > 0) {
      this.ordenarDestinatarios();
    } */

    //Mover los Select
    if (this.filtro.idCuitDestinatario !== "-1") {
      let tempDestinatario = this.destinatarios.find(
        (item) => item.cuit === this.filtro.idCuitDestinatario
      );
      if (tempDestinatario) {
        this.filtrarForm.controls["selectedDestinatario"].setValue(
          tempDestinatario.id
        );
        let temporalDestino = tempDestinatario.destinos.find(
          (item) => item.id === parseInt(this.filtro.idDestino)
        );
        this.destinos = tempDestinatario.destinos;
        if (temporalDestino) {
          this.selectedDestino = temporalDestino.descripcion;
          this.filtrarForm.controls["selectedDestino"].setValue(
            temporalDestino.id
          );
        }

      }
    } else {
      this.filtrarForm.controls["selectedDestinatario"].setValue(
        this.destinatarios[0].id
      );
    }

    if (this.isSelectedDestinatario) {
      this.agregarsolicitud = true;
      setTimeout(() => {
        let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
        this.topaddSolicitad = value.top;
        this.leftaddSolicitad = value.left;
        this.agregarsolicitud = true;
      }, 500);
    }
    this.chanceData = false;
    this.showHandsonTable = true;
    if (this.instance) {
      let settings = {
        maxRows: this.listadoSolicitudes.length,
      };

      let data = this.listadoSolicitudes;
      this.inicializarColHeader();

      // Actualizo los datos de configuracion de la tabla
      if (this.mostrarSolicitudes) {
        this.instance.updateSettings(settings);
        this.instance.loadData(data);
        this.instance.render();
      }

      // cargo la data de la tabla clientes
      this.buscarClientes();
    }
  }


  buscarClientes() {
    this.filtrarForm.controls["selectedCliente"].setValue(0);
    this.listadoSolicitudes = [];

    this.getItemSub = this.centrosService.getCentroEmpresaTotal(this.filtroClientes)
      .subscribe(res => {
        this.lista_empresa = res.data;
        this.lista_empresa.forEach(cliente => {
          let newsolicitud: ListadoSolicitud = FunctionCreate.listadoSolicitud(cliente);

          // Inserto el nuevo registro a la tabla
          const verf1 = this.listadoSolicitudes.findIndex(item => {
            if (item.contraparteCuit === newsolicitud.contraparteCuit) {
              return true;
            } else {
              return false;
            }
          });

          if (verf1 == -1) {
            this.listadoSolicitudes.push(newsolicitud);
          }

          this.listadoSolicitudesPropia.push(newsolicitud);

          const cliente_temp = {
            id: cliente.id_interno,
            cuit: cliente.cuit_interno,
            descripcion: cliente.nombre_interno.toUpperCase(),
          };

          const verf = this.clientes.findIndex(item => {
            if (item.cuit === cliente.cuit_interno) {
              return true;
            } else {
              return false;
            }
          });

          if (verf == -1) {
            this.clientes.push(cliente_temp);
          }

        });

        if (this.instance) {
          // Preparo la nueva configuracion de la tabla
          this.colHeaders.push(this.is_logistica_propia);

          this.dias.forEach((element) => {
            this.colHeaders.push(
              element.dia_semana_string + "." + element.dia + "/" + element.mes
            );
          });

          let settings = {
            colHeaders: this.colHeaders,
            maxRows: this.lista_empresa.length,
          };

          this.listadoClientes = [...this.listadoSolicitudes];

          // Actualizo los datos de configuracion de la tabla
          this.instance.updateSettings(settings);

          // cargo la data de la tabla
          this.instance.loadData(this.listadoClientes);

          this.disabledcliente = false;
        }
      },
        err => {
          console.log(err);
        });
  }

  aplicarFiltroCliente(event) {
    let tempCliente = this.listadoSolicitudes.filter(
      (item) => item.id_centro === event.value
    );

    if (event.value == 0) {
      this.listadoClientes = [...this.listadoSolicitudes];
    } else {
      this.listadoClientes = [...tempCliente];
    }

    this.filtro.cliente = event.value;

    if (this.instance) {
      // Preparo la nueva configuracion de la tabla
      this.colHeaders.push(this.is_logistica_propia);

      this.dias.forEach((element) => {
        this.colHeaders.push(
          element.dia_semana_string + "." + element.dia + "/" + element.mes
        );
      });

      let settings = {
        colHeaders: this.colHeaders,
        maxRows: this.listadoClientes.length,
      };

      // Actualizo los datos de configuracion de la tabla
      this.instance.updateSettings(settings);

      // cargo la data de la tabla
      this.instance.loadData(this.listadoClientes);

      this.disabledcliente = false;
    }
  }

  addCupoSolicitados(tipo: number) {
    const title = "Agregar Pedido Cargador";

    const caratula = {
      id: this.filtrarForm.controls["selectedCaratula"].value,
      descripcion: this.filtro.caratula,
    };
    //const usaCupera = localStorage.getItem("usaCupera");
    let dialogRef3: MatDialogRef<any> = this.dialog.open(
      AddSolicitudesC3Component,
      {
        width: "70vw",
        height: "95vh",
        disableClose: true,
        data: {
          title: title,
          tipo: tipo,
          productos: this.productos,
          cupera: 2,
          filtros: this.filtro,
          fechaSelected: this.filtrarForm.controls["selectedFecha"].value,
          caratula: caratula,
        },
      }
    );
    dialogRef3.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let newFecha = this.homeService.formatoFecha(
        this.filtrarForm.controls["selectedFecha"].value,
        "amd",
        "-"
      );
      this.validatedForm = false;
      this.inicializarOpciones();
      this.aplicarFiltro(true, newFecha);
      this.loadRecuperarEvent.emit();
      this.loadNotificacionesEvent.emit();
      return;
    });

  }

  buscar() {
    this.agregarsolicitud = false;
    let newFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );
    let otraFecha = moment(newFecha);
    let hoyIniDia = moment(this.hoyString + " 00:00:00");

    if (this.chanceData || newFecha != this.fecha) {
      this.loadNotificacionesEvent.emit();
      this.showHandsonTable = false;
      this.aplicarFiltro(!this.chanceData, newFecha);
      if (otraFecha >= hoyIniDia) {
        this.validFecha = true;
      } else {
        this.validFecha = false;
      }
    } else {
      this.aplicarFiltro(false, "");
    }
  }

  aplicarFiltro(chanceFecha: boolean, newFecha: string) {
    if (chanceFecha) {
      this.cambiofecha = true;
      this.cambiarFecha.emit({ fecha: newFecha });
      this.mostrarAreaSinCupo = false;
    } else {
      this.cambiofecha = false;
      this.getData();
    }
  }

  aplicarFiltroDadores(cmd) {
    this.cambiofecha = false;
    this.filtro.dador = cmd.value;
    this.aplicarFiltro(false, "");
  }

  getItemsProductos() {
    this.cupoService.getProductosCentro().subscribe((data) => {
      this.productos = data.data;
    });
  }

  inicializarFiltros() {
    this.filtro.idCuitDestinatario = "-1";
    this.filtro.idDestino = "";
    this.filtro.idCcpp = "";
    this.filtro.idRte = "";
    this.filtro.destSolic = "";
    this.filtro.zona = "";
    this.filtro.corredor = "";
    this.filtro.contraparte = "";
    this.filtro.producto = "";
    this.filtro.contrato = "";
  }

  inicializarProductos() {
    this.productos = [];
    this.productos.push({
      id: 1,
      descripcion: "Soja",
    });
  }

  inicializarDestinatarios() {
    this.destinatarios = [];
    this.destinatarios.push({
      id: "-1",
      cuit: "-1",
      razon_social: "Todos",
      destinos: [],
      contrapartes: [],
    });
    this.destinos = [];
    this.destinos.push({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });

  }


  inicializarDadores2() {
    this.dadores = [];
  }
  inicializarDadores() {
    this.dadores = [];
    this.dadores.push({
      id: '0',
      cuit: "",
      razon_social: "Todos",
    });
  }

  inicializarColHeader() {
    this.colHeaders = [];
    this.colHeaders.push(this.is_logistica_propia);
    this.dias.forEach((element) => {
      this.colHeaders.push(
        element.dia_semana_string + "." + element.dia + "/" + element.mes
      );
    });
  }

  aplicarFiltroProducto(cmd) {
    this.filtro.id_producto = cmd.value.toString();
    this.filtro.producto = this.productos.find(
      (item) => item.id === cmd.value
    ).descripcion;

    this.inicializarDestinatarios();
    this.filtro.idCuitDestinatario = "-1";
    this.filtrarForm.controls["selectedDestinatario"].setValue(
      this.destinatarios[0].id
    );
    this.isSelectedDestinatario = false;
    this.aplicarFiltroDestinatario({ value: "-1" });
    this.chanceData = false;
    this.buscar();
  }

  aplicarFiltroDestinatario(cmd) {
    this.chanceData = false;
    let tempDestinatario = this.destinatarios.find(
      (item) => item.id === cmd.value
    );
    this.filtro.idCuitDestinatario = tempDestinatario.cuit;
    this.destinos = tempDestinatario.destinos;
    this.ordenarDestinos();
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino = cmd.value == "-1" ? true : false;
    this.disabledcliente = cmd.value == "-1" ? true : false;

    if (cmd.value == "-1") {
      this.isSelectedDestinatario = false;
    }
    this.filtrarForm.controls["selectedDestino"].setValue(this.destinos[0].id);
    this.filtro.idDestino = this.destinos[0].id.toString();
    this.aplicarFiltro(false, "");
  }

  aplicarFiltroDestino(cmd) {
    this.chanceData = false;
    let otroDestinatario = this.destinatarios.find(
      (item) => item.cuit === this.filtro.idCuitDestinatario
    );
    let temporalDestino = otroDestinatario.destinos.find(
      (item) => item.id === cmd.value
    );
    this.filtro.idDestino = temporalDestino.id.toString();
    this.aplicarFiltro(false, "");
  }



  validarInput(cmd) {
    if (cmd.target.value != "" && parseInt(cmd.target.value) > 0) {
      this.validatedForm = true;
      let valida = true;
      let error2 = false; // suma de las solicitudes por día sea menor que los disponibles
      let msg2 = "";
      if (valida) {
        let validacion = this.sumaColumn(parseInt(cmd.target.value), "1");
        error2 = validacion.value;
        msg2 = validacion.dias;
        valida = !error2;
      }
      if (valida) {
        this.validatedForm = true;
      } else {
        this.validatedForm = false;
        if (error2) {
          this.atencionService.confirm({
            message:
              "La cantidad de cupos por módulos que está intentando asignar excede la cantidad de cupos disponibles ",
          });
          this.gestionForm.controls["cuposxModulos"].setValue(
            this.valorValidInput
          );
          return false;
        }
      }
    } else {
      this.validatedForm = false;
    }
    let minData = moment();
    this.hoyMoment = moment(this.hoyString);

    this.preAsignacion.forEach((element) => {
      let di = element.dia;
      let fec = this.dias[di].fecha;
      let otrFecha = moment(fec);
      if (otrFecha < minData) {
        minData = otrFecha;
      }
    });
    if (minData >= this.hoyMoment) {
      this.validFecha = true;
      this.valorValidInput = parseInt(cmd.target.value);
    } else {
      this.validFecha = false;
    }
  }

  validarInput2(cmd: number) {
    this.validatedForm = true;
    let valida = true;
    let error2 = false; // suma de las solicitudes por día sea menor que los disponibles
    let msg2 = "";

    if (valida) {
      let validacion = this.sumaColumn(cmd, "1");
      error2 = validacion.value;
      msg2 = validacion.dias;
      valida = !error2;
    }
    if (valida) {
      this.validatedForm = true;
    } else {
      this.validatedForm = false;

      if (error2) {
        this.atencionService.confirm({
          message:
            "¡La cantidad de cupos por módulos que está intentando asignar excede la cantidad de cupos disponibles! ",
        });
        this.gestionForm.controls["cuposxModulos"].setValue(
          this.valorValidInput
        );
        return false;
      }
    }
    let minData = moment();
    this.hoyMoment = moment(this.hoyString);

    this.preAsignacion.forEach((element) => {
      let di = element.dia;
      let fec = this.dias[di].fecha;
      let otrFecha = moment(fec);
      if (otrFecha < minData) {
        minData = otrFecha;
      }
    });
    if (minData >= this.hoyMoment) {
      this.validFecha = true;
      this.valorValidInput = cmd;
    } else {
      this.validFecha = false;
    }
  }

  selectAccion(cmd) {
    this.placeholderAccion = "";
    let error = true;
    switch (cmd.value) {
      case 0:
        this.disabledCuposXModulos = false;
        this.gestionForm.controls["cuposxModulos"].setValue(0);
        this.validatedForm = false;
        this.disabledSelectCabecera = false;
        this.toolTipModulo = "Cupos por Módulos";
        break;
      case 1:
        this.disabledCuposXModulos = true;
        this.gestionForm.controls["cuposxModulos"].setValue("");
        this.disabledSelectCabecera = false;
        let msg = "";
        let validacion = this.sumaColumn(0, "0");
        error = validacion.value;
        msg = validacion.dias;
        this.toolTipModulo =
          "Este campo no es editable debido a que seleccionó la opción ASIGNAR TODOS";
        this.validatedForm = true;

        break;
      case 2:
        this.toolTipModulo =
          "Este campo no es editable debido a que seleccionó la opción RECHAZAR";
        this.disabledCuposXModulos = true;
        this.disabledSelectCabecera = true;
        this.gestionForm.controls["selectedCabecera"].setValue("");
        this.gestionForm.controls["cuposxModulos"].setValue("");
        this.validatedForm = true;
        break;
      default:
        break;
    }
  }

  sumaColumn(value: number, tipo: string): { value: boolean; dias: string } {
    let error = false;
    let dias: string = "";
    let dia0_suma = 0;
    let dia1_suma = 0;
    let dia2_suma = 0;
    let dia3_suma = 0;
    let dia4_suma = 0;
    let dia5_suma = 0;
    let dia6_suma = 0;
    this.preAsignacion.forEach((element) => {
      let valor = tipo === "1" ? value : element.cantidad;
      switch (element.dia) {
        case "0":
          dia0_suma = dia0_suma + valor;
          break;
        case "1":
          dia1_suma = dia1_suma + valor;
          break;
        case "2":
          dia2_suma = dia2_suma + valor;
          break;
        case "3":
          dia3_suma = dia3_suma + valor;
          break;
        case "4":
          dia4_suma = dia4_suma + valor;
          break;
        case "5":
          dia5_suma = dia5_suma + valor;
          break;
        case "6":
          dia6_suma = dia6_suma + valor;
          break;

        default:
          break;
      }
    });
    if (dia0_suma > 0) {
      if (dia0_suma > this.selectedItemAsignacion.dia0.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[0].dia_semana_string +
            "." +
            this.dias[0].dia +
            "/" +
            this.dias[0].mes
            : this.dias[0].dia_semana_string +
            "." +
            this.dias[0].dia +
            "/" +
            this.dias[0].mes;
      }
    }
    if (dia1_suma > 0) {
      if (dia1_suma > this.selectedItemAsignacion.dia1.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[1].dia_semana_string +
            "." +
            this.dias[1].dia +
            "/" +
            this.dias[1].mes
            : this.dias[1].dia_semana_string +
            "." +
            this.dias[1].dia +
            "/" +
            this.dias[1].mes;
      }
    }
    if (dia2_suma > 0) {
      if (dia2_suma > this.selectedItemAsignacion.dia2.asignados) {
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[2].dia_semana_string +
            "." +
            this.dias[2].dia +
            "/" +
            this.dias[2].mes
            : this.dias[2].dia_semana_string +
            "." +
            this.dias[2].dia +
            "/" +
            this.dias[2].mes;
        error = true;
      }
    }
    if (dia3_suma > 0) {
      if (dia3_suma > this.selectedItemAsignacion.dia3.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[3].dia_semana_string +
            "." +
            this.dias[3].dia +
            "/" +
            this.dias[3].mes
            : this.dias[3].dia_semana_string +
            "." +
            this.dias[3].dia +
            "/" +
            this.dias[3].mes;
      }
    }
    if (dia4_suma > 0) {
      if (dia4_suma > this.selectedItemAsignacion.dia4.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[4].dia_semana_string +
            "." +
            this.dias[4].dia +
            "/" +
            this.dias[4].mes
            : this.dias[4].dia_semana_string +
            "." +
            this.dias[4].dia +
            "/" +
            this.dias[4].mes;
      }
    }
    if (dia5_suma > 0) {
      if (dia5_suma > this.selectedItemAsignacion.dia5.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[5].dia_semana_string +
            "." +
            this.dias[5].dia +
            "/" +
            this.dias[5].mes
            : this.dias[5].dia_semana_string +
            "." +
            this.dias[5].dia +
            "/" +
            this.dias[5].mes;
      }
    }
    if (dia6_suma > 0) {
      if (dia6_suma > this.selectedItemAsignacion.dia6.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
            ", " +
            this.dias[6].dia_semana_string +
            "." +
            this.dias[6].dia +
            "/" +
            this.dias[6].mes
            : this.dias[6].dia_semana_string +
            "." +
            this.dias[6].dia +
            "/" +
            this.dias[6].mes;
      }
    }
    return { value: error, dias: dias };
  }

  selectCupo(cupo) {
    this.isSelectedDestinatario = true;
    let tempDestinatario = this.destinatarios.find(
      (item) => item.cuit === cupo.idCuitDestinatario
    );
    this.filtro.idCuitDestinatario = tempDestinatario.cuit;
    this.destinos = tempDestinatario.destinos;
    this.ordenarDestinos();
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino =
      this.filtro.idCuitDestinatario == "-1" ? true : false;


    this.filtrarForm.controls["selectedDestinatario"].setValue(
      tempDestinatario.id
    );
    this.filtrarForm.controls["selectedDestino"].setValue(this.destinos[0].id);
    this.filtro.idDestino = this.destinos[0].id.toString();
    this.selectedDestino = this.destinos[0].descripcion.toString();


    let newFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );
    this.isDetallesDestinos = false;
    this.dataSourceDetalleDestinatario.data = [];
    if (newFecha != this.fecha) {
      this.aplicarFiltro(true, newFecha);
    } else {
      this.aplicarFiltro(false, "");
    }
    this.agregarsolicitud = false;
    setTimeout(() => {
      let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
      this.topaddSolicitad = value.top;
      this.leftaddSolicitad = value.left;
      this.agregarsolicitud = true;
    }, 500);
  }

  selectDestino(cupo) {
    let tempDestino = this.destinos.find(
      (item) => item.id.toString() === cupo.idDestino
    );

    this.filtrarForm.controls["selectedDestino"].setValue(tempDestino.id);
    this.filtro.idDestino = cupo.idDestino.toString();

    this.selectedDestino = tempDestino.descripcion.toString();
    let newFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );

    if (newFecha != this.fecha) {
      this.aplicarFiltro(true, newFecha);
    } else {
      this.aplicarFiltro(false, "");
    }

    if (this.agregarsolicitud) {
      setTimeout(() => {
        let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
        this.topaddSolicitad = value.top;
        this.leftaddSolicitad = value.left;
        this.agregarsolicitud = true;
      }, 500);
    }
  }

  mostrarDetallesDestinos() {
    this.isDetallesDestinos = !this.isDetallesDestinos;
    if (this.isDetallesDestinos) {
      let detallesDestinatario: DetallesDestinatario[] = [];
      let cumplenFiltroCupos: Cupo[] = [];
      let inicialArrayCupos: Cupo[] = [];

      // Destinatario filtrado  this.selectedItemAsignacion.idCuitDestinatario
      for (let index = 0; index < this.cuposDisponiblesApi.length; index++) {
        const element = this.cuposDisponiblesApi[index];
        cumplenFiltroCupos.push(element);
      }
      for (let index = 0; index < cumplenFiltroCupos.length; index++) {
        const element = cumplenFiltroCupos[index];
        let cumple = false;
        if (element.id_producto == this.filtro.id_producto) {
          cumple = true;
        }
        if (
          cumple &&
          element.idCuitDestinatario !==
          this.selectedItemAsignacion.idCuitDestinatario
        ) {
          cumple = false;
        }
        if (cumple) {
          inicialArrayCupos.push(element);
        }
      }
      for (let index = 0; index < inicialArrayCupos.length; index++) {
        const element = inicialArrayCupos[index];
        let tempDia = this.dias.find((item) => item.fecha === element.fecha);
        let indexEnc = -1;
        for (let i = 0; i < detallesDestinatario.length; i++) {
          const item = detallesDestinatario[i];
          if (item.idDestino === element.id_destino) {
            indexEnc = i;
            continue;
          }
        }
        if (indexEnc === -1) {
          let newElement = new DetallesDestinatario();
          newElement.idDestino = element.id_destino;
          newElement.nombreDestino =
            this.detallesDisponiblesApi.destino[
              element.id_destino
            ].nombreDestino;
          let dia = new Dia();
          dia.asignados = 0;
          dia.solicitados = 0;
          dia.solicitudes = [];
          dia.cupos = [];
          newElement.dia0 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia1 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia2 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia3 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia4 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia5 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.dia6 = {
            asignados: 0,
            solicitados: 0,
            cupos: [],
            solicitudes: [],
          };
          newElement.total_asignados = 1;
          newElement.total_solicitados = 0;
          if (tempDia) {
            switch (tempDia.id) {
              case 0:
                newElement.dia0.asignados = 1;
                newElement.dia0.cupos.push(element);
                break;
              case 1:
                newElement.dia1.asignados = 1;
                newElement.dia1.cupos.push(element);
                break;
              case 2:
                newElement.dia2.asignados = 1;
                newElement.dia2.cupos.push(element);
                break;
              case 3:
                newElement.dia3.asignados = 1;
                newElement.dia3.cupos.push(element);
                break;
              case 4:
                newElement.dia4.asignados = 1;
                newElement.dia4.cupos.push(element);
                break;
              case 5:
                newElement.dia5.asignados = 1;
                newElement.dia5.cupos.push(element);
                break;
              case 6:
                newElement.dia6.asignados = 1;
                newElement.dia6.cupos.push(element);
                break;

              default:
                break;
            }
          }
          detallesDestinatario.push(newElement);
        } else {
          switch (tempDia.id) {
            case 0:
              let ant0 = detallesDestinatario[indexEnc].dia0;
              let antAsignados0 =
                detallesDestinatario[indexEnc].dia0.asignados + 1;
              detallesDestinatario[indexEnc].dia0 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia0.asignados = antAsignados0;
              detallesDestinatario[indexEnc].dia0.cupos = ant0.cupos;
              detallesDestinatario[indexEnc].dia0.cupos.push(element);
              break;
            case 1:
              let ant1 = detallesDestinatario[indexEnc].dia1;
              let antAsignados1 =
                detallesDestinatario[indexEnc].dia1.asignados + 1;
              detallesDestinatario[indexEnc].dia1 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia1.asignados = antAsignados1;
              detallesDestinatario[indexEnc].dia1.cupos = ant1.cupos;
              detallesDestinatario[indexEnc].dia1.cupos.push(element);
              break;
            case 2:
              let ant2 = detallesDestinatario[indexEnc].dia2;
              let antAsignados2 =
                detallesDestinatario[indexEnc].dia2.asignados + 1;
              detallesDestinatario[indexEnc].dia2 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia2.asignados = antAsignados2;
              detallesDestinatario[indexEnc].dia2.cupos = ant2.cupos;
              detallesDestinatario[indexEnc].dia2.cupos.push(element);
              break;
            case 3:
              let ant3 = detallesDestinatario[indexEnc].dia3;
              let antAsignados3 =
                detallesDestinatario[indexEnc].dia3.asignados + 1;
              detallesDestinatario[indexEnc].dia3 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia3.asignados = antAsignados3;
              detallesDestinatario[indexEnc].dia3.cupos = ant3.cupos;
              detallesDestinatario[indexEnc].dia3.cupos.push(element);
              break;
            case 4:
              let ant4 = detallesDestinatario[indexEnc].dia4;
              let antAsignados4 =
                detallesDestinatario[indexEnc].dia4.asignados + 1;
              detallesDestinatario[indexEnc].dia4 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia4.asignados = antAsignados4;
              detallesDestinatario[indexEnc].dia4.cupos = ant4.cupos;
              detallesDestinatario[indexEnc].dia4.cupos.push(element);
              break;
            case 5:
              let ant5 = detallesDestinatario[indexEnc].dia5;
              let antAsignados5 =
                detallesDestinatario[indexEnc].dia5.asignados + 1;
              detallesDestinatario[indexEnc].dia5 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia5.asignados = antAsignados5;
              detallesDestinatario[indexEnc].dia5.cupos = ant5.cupos;
              detallesDestinatario[indexEnc].dia5.cupos.push(element);
              break;
            case 6:
              let ant6 = detallesDestinatario[indexEnc].dia6;
              let antAsignados6 =
                detallesDestinatario[indexEnc].dia6.asignados + 1;
              detallesDestinatario[indexEnc].dia6 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
                solicitudes: [],
              };
              detallesDestinatario[indexEnc].dia6.asignados = antAsignados6;
              detallesDestinatario[indexEnc].dia6.cupos = ant6.cupos;
              detallesDestinatario[indexEnc].dia6.cupos.push(element);
              break;

            default:
              break;
          }
        }
      }
      for (let index = 0; index < detallesDestinatario.length; index++) {
        const element = detallesDestinatario[index];
        element.total_asignados =
          element.dia0.asignados +
          element.dia1.asignados +
          element.dia2.asignados +
          element.dia3.asignados +
          element.dia4.asignados +
          element.dia5.asignados +
          element.dia6.asignados;
        element.total_solicitados =
          element.dia0.solicitados +
          element.dia1.solicitados +
          element.dia2.solicitados +
          element.dia3.solicitados +
          element.dia4.solicitados +
          element.dia5.solicitados +
          element.dia6.solicitados;
      }
      this.dataSourceDetalleDestinatario.data = [];
      detallesDestinatario.sort((a, b) =>
        a.nombreDestino.localeCompare(b.nombreDestino)
      );
      this.dataSourceDetalleDestinatario.data = detallesDestinatario;

      this.height1 = 100 + 50 * detallesDestinatario.length;
    } else {
      this.height1 = 100;
    }
    this.agregarsolicitud = false;
    setTimeout(() => {
      let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
      this.topaddSolicitad = value.top;
      this.leftaddSolicitad = value.left;
      this.agregarsolicitud = true;
    }, 500);
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
      newDestinatario.id = (this.destinatarios.length + 1).toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.ccpp = [];
      newDestinatario.rte = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatarios.push(newDestinatario);
    }
  }



  addDestino(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinos.length; i++) {
      if (this.destinos[i].id === dest.id) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      this.destinos.push(dest);
    }
  }

  addDestinoCon(idCuitDestinatario, dest) {
    if (idCuitDestinatario !== "") {
      let tempDestinatario = this.destinatarios.find(
        (item) => item.cuit === idCuitDestinatario
      );
      let encontrado = false;
      if (tempDestinatario) {
        for (let i = 0; i < tempDestinatario.destinos.length; i++) {
          if (tempDestinatario.destinos[i].id === parseInt(dest.id)) {
            encontrado = true;
            break;
          }
        }
      }
      if (!encontrado) {
        let newDestino = new ItemsCuit();
        newDestino.id = parseInt(dest.id);
        newDestino.descripcion = dest.descripcion;
        newDestino.cuit = dest.cuit;
        tempDestinatario.destinos.push(newDestino);
      }
      tempDestinatario.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
  }



  ordenarDestinatarios() {
    this.destinatarios.shift();
    this.destinatarios.sort((a, b) =>
      a.razon_social.localeCompare(b.razon_social)
    );
    this.destinatarios.unshift({
      id: "-1",
      cuit: "-1",
      razon_social: "Todos",
      destinos: [],
    });
  }

  ordenarDestinos() {
    this.destinos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
  }


  confirmar_notificar() {
    //let valid = this.validarSendNotificacion();
    let valid = this.listSinEmail.length > 0 ? false : true;

    if (valid) {
      if (this.gestionForm.controls["selectedAccion"].value == 2) {
        this.rechazar(true);
      } else {
        this.asignarCupo(
          this.gestionForm.controls["selectedAccion"].value,
          true
        );
      }
    } else {
      this.listSinEmail.forEach((element) => {
        this.openPopUpSinEmail(element, "CONFIRMAR-NOTIFICAR");
        /* if (element.email.length == 0) {
        } */
      });
    }
  }

  confirmar() {
    if (this.gestionForm.controls["selectedAccion"].value == 2) {
      this.rechazar(false);
    } else {
      this.asignarCupo(
        this.gestionForm.controls["selectedAccion"].value,
        false
      );
    }
  }

  notificar() {
    //let valid = this.validarSendNotificacion();
    let valid = this.listSinEmail.length > 0 ? false : true;
    if (valid) {
      this.loader.open("Por favor espere..");
      let data = {};
      let sinEmail = [];
      data = {
        sinEmail: sinEmail,
      };
      this.cupoService.postEnviarNotificacion(data).subscribe(
        (res) => {
          this.loader.close();
          this.loadNotificacionesEvent.emit();
          if (res.status === 280) {
            this.atencionService.confirm({
              message: res.data + " !",
              tipo: "exito",
            });
          } else {
            this.alertService.confirm({
              message: res.data + " !",
              tipo: "exito",
            });
          }
        },
        (err) => {
          this.loader.close();
          this.atencionService.confirm({
            message: "Las notificaciones no pudieron ser enviadas ",
          });
        }
      );
    } else {
      this.listSinEmail.forEach((element) => {
        this.openPopUpSinEmail(element, "NOTIFICAR");
      });
    }
  }

  asignarCupo(tipo: number, notifica: boolean) {
    //entro con tipo==0 o tipo==1
    this.loader.open("Por favor espere..");

    let dia0_array_cupos = [];
    let dia1_array_cupos = [];
    let dia2_array_cupos = [];
    let dia3_array_cupos = [];
    let dia4_array_cupos = [];
    let dia5_array_cupos = [];
    let dia6_array_cupos = [];
    let caratulasCupos = [];
    let caratulasDemandas = [];

    this.selectedItemAsignacion.dia0.cupos.forEach((element) => {
      dia0_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia1.cupos.forEach((element) => {
      dia1_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia2.cupos.forEach((element) => {
      dia2_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia3.cupos.forEach((element) => {
      dia3_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia4.cupos.forEach((element) => {
      dia4_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia5.cupos.forEach((element) => {
      dia5_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia6.cupos.forEach((element) => {
      dia6_array_cupos.push(element);
    });

    let arrayAsignacion = [];
    this.preAsignacion.sort((a, b) => (a.cantidad < b.cantidad ? 1 : -1));
    for (let index = 0; index < this.preAsignacion.length; index++) {
      const element = this.preAsignacion[index];
      let data = {};
      let cupos: string[] = [];
      let count = 0;
      let contador = 0;

      if (element.cantidad == 0) {
        // asignacion sin solicitud
        let caratula = "";
        if (this.usaMTR == true) {
          if (element.demandas) {
            caratula =
              !element.demandas[0].caratula ||
                element.demandas[0].caratula == ""
                ? ""
                : element.demandas[0].caratula;
            if (caratula != "") {
              caratulasDemandas.push(caratula);
            }
          }
        }

        switch (element.dia) {
          case "0":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia0_array_cupos.length
                  : 0;
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia0_array_cupos.length > 0) {
                cupos.push(dia0_array_cupos[0].id);
                caratulasCupos.push(dia0_array_cupos[0].caratula);
                dia0_array_cupos.shift();
              }
            }
            break;
          case "1":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia1_array_cupos.length
                  : 0;
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia1_array_cupos.length > 0) {
                cupos.push(dia1_array_cupos[0].id);
                caratulasCupos.push(dia1_array_cupos[0].caratula);
                dia1_array_cupos.shift();
              }
            }
            break;
          case "2":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia2_array_cupos.length
                  : 0;
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia2_array_cupos.length > 0) {
                cupos.push(dia2_array_cupos[0].id);
                caratulasCupos.push(dia2_array_cupos[0].caratula);
                dia2_array_cupos.shift();
              }
            }
            break;
          case "3":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia3_array_cupos.length
                  : 0;
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia3_array_cupos.length > 0) {
                cupos.push(dia3_array_cupos[0].id);
                caratulasCupos.push(dia3_array_cupos[0].caratula);
                dia3_array_cupos.shift();
              }
            }
            break;
          case "4":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia4_array_cupos.length
                  : 0;
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia4_array_cupos.length > 0) {
                cupos.push(dia4_array_cupos[0].id);
                caratulasCupos.push(dia4_array_cupos[0].caratula);
                dia4_array_cupos.shift();
              }
            }
            break;
          case "5":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia5_array_cupos.length
                  : 0;
            contador =
              dia5_array_cupos.length < count ? dia5_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia5_array_cupos.length > 0) {
                cupos.push(dia5_array_cupos[0].id);
                caratulasCupos.push(dia5_array_cupos[0].caratula);
                dia5_array_cupos.shift();
              }
            }
            break;
          case "6":
            count =
              this.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
                : this.gestionForm.controls["selectedAccion"].value == 1
                  ? dia6_array_cupos.length
                  : 0;
            contador =
              dia6_array_cupos.length < count ? dia6_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia6_array_cupos.length > 0) {
                cupos.push(dia6_array_cupos[0].id);
                caratulasCupos.push(dia6_array_cupos[0].caratula);
                dia6_array_cupos.shift();
              }
            }
            break;

          default:
            break;
        }

        data = {
          receptorCuit:
            element.receptorCuit == "00000000000"
              ? element.contraparte
              : element.receptorCuit,
          contraparte:
            element.receptorCuit == "00000000000" ? null : element.contraparte,
          nroContrato: element.contrato,
          caratula: caratula,
          id_demanda: null,
          cupos: cupos,
        };
        arrayAsignacion.push(data);
      } else {
        // asignacion con solicitud
        count =
          tipo == 0
            ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
            : element.cantidad;
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia0_array_cupos.length > 0) {
                    cupos.push(dia0_array_cupos[0].id);
                    caratulasCupos.push(dia0_array_cupos[0].caratula);
                    dia0_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: '',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia0_array_cupos.length > 0) {
                  cupos.push(dia0_array_cupos[0].id);
                  caratulasCupos.push(dia0_array_cupos[0].caratula);
                  dia0_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: '',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia1_array_cupos.length > 0) {
                    cupos.push(dia1_array_cupos[0].id);
                    caratulasCupos.push(dia1_array_cupos[0].caratula);
                    dia1_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: '',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia1_array_cupos.length > 0) {
                  cupos.push(dia1_array_cupos[0].id);
                  caratulasCupos.push(dia1_array_cupos[0].caratula);
                  dia1_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: '',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia2_array_cupos.length > 0) {
                    cupos.push(dia2_array_cupos[0].id);
                    caratulasCupos.push(dia2_array_cupos[0].caratula);
                    dia2_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: '',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia2_array_cupos.length > 0) {
                  cupos.push(dia2_array_cupos[0].id);
                  caratulasCupos.push(dia2_array_cupos[0].caratula);
                  dia2_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: ' ',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia3_array_cupos.length > 0) {
                    cupos.push(dia3_array_cupos[0].id);
                    caratulasCupos.push(dia3_array_cupos[0].caratula);
                    dia3_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: ' ',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia3_array_cupos.length > 0) {
                  cupos.push(dia3_array_cupos[0].id);
                  caratulasCupos.push(dia3_array_cupos[0].caratula);
                  dia3_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: ' ',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia4_array_cupos.length > 0) {
                    cupos.push(dia4_array_cupos[0].id);
                    caratulasCupos.push(dia4_array_cupos[0].caratula);
                    dia4_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: ' ',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia4_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  caratulasCupos.push(dia4_array_cupos[0].caratula);
                  dia4_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: ' ',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "5":
            contador =
              dia5_array_cupos.length < count ? dia5_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia5_array_cupos.length > 0) {
                    cupos.push(dia5_array_cupos[0].id);
                    caratulasCupos.push(dia5_array_cupos[0].caratula);
                    dia5_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: ' ',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia5_array_cupos.length > 0) {
                  cupos.push(dia5_array_cupos[0].id);
                  caratulasCupos.push(dia5_array_cupos[0].caratula);
                  dia5_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: ' ',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "6":
            contador =
              dia6_array_cupos.length < count ? dia6_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia6_array_cupos.length > 0) {
                    cupos.push(dia6_array_cupos[0].id);
                    caratulasCupos.push(dia6_array_cupos[0].caratula);
                    dia6_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: ' ',
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia6_array_cupos.length > 0) {
                  cupos.push(dia6_array_cupos[0].id);
                  caratulasCupos.push(dia6_array_cupos[0].caratula);
                  dia6_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: ' ',
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;

          default:
            break;
        }
      }
    }
    let sinEmail = [];
    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        let emails = "";
        for (let index = 0; index < element.email.length; index++) {
          const email = element.email[index];
          if (emails == "") {
            emails += email;
          } else {
            emails += ";" + email;
          }
        }
        sinEmail.push({
          id: element.id,
          email: emails,
        });
      });
    }
    if (arrayAsignacion.length > 0) {
      let data = {
        asignaciones: arrayAsignacion,
        id_cabecera:
          this.gestionForm.controls["selectedCabecera"].value != -1
            ? this.gestionForm.controls["selectedCabecera"].value
            : "",
        notificacion: notifica ? 1 : 0,
        sinEmail: sinEmail,
        canal: "WEB",
      };

      let verificador: boolean = true;

      if (this.usaMTR == true) {
        let cartCupo = caratulasCupos[0];
        let cartDemanda = caratulasDemandas
          ? caratulasDemandas.length > 0
            ? caratulasDemandas[0]
            : ""
          : "";

        const isSameCupo = (currentValue) => currentValue == cartCupo;
        const isSameDemanda = (currentValue) => currentValue == cartDemanda;

        if (
          caratulasCupos.every(isSameCupo) &&
          caratulasDemandas.every(isSameDemanda)
        ) {
          if (cartCupo !== cartDemanda) {
            verificador = false;
            if (cartCupo.length > 0 && cartDemanda.length === 0) {
              verificador = true;
            } else if (cartCupo.length === 0 && cartDemanda.length > 0) {
              verificador = false;
            }
          } else {
            verificador = true;
          }
        } else {
          verificador = false;
        }
      }

      if (verificador) {
        this.cupoService.postAsignarCuposV32(data).subscribe(
          (res) => {
            this.loader.close();
            this.alertService
              .confirm({
                message: "Cupos Asignados correctamente!",
                tipo: "exito",
              })
              .subscribe((res1) => {
                if (res1) {
                  let newFecha = this.homeService.formatoFecha(
                    this.filtrarForm.controls["selectedFecha"].value,
                    "amd",
                    "-"
                  );
                  this.validatedForm = false;
                  this.inicializarOpciones();
                  this.aplicarFiltro(true, newFecha);
                  this.loadRecuperarEvent.emit();
                  this.loadNotificacionesEvent.emit();
                  //
                  return;
                }
              });
          },
          (err) => {
            this.loader.close();
            if (err.status === 422) {
              this.atencionService.confirm({
                message: err.message,
              });
            } else {
              this.errorService.confirm({ message: err }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            }
          }
        );
      } else {
        this.loader.close();
        let dialogRef: MatDialogRef<AppCaratulasDiferentesComponent>;
        dialogRef = this.dialog.open(AppCaratulasDiferentesComponent, {
          width: "60vw",
          disableClose: true,
          data: {},
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.loader.open("Por favor espere..");
            let continuar = {
              proceso: res,
            };
            const returnedData = Object.assign(data, continuar);
            this.cupoService.postAsignarCuposV32(returnedData).subscribe(
              (res) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Cupos Asignados Correctamente!",
                    tipo: "exito",
                  })
                  .subscribe((res1) => {
                    if (res1) {
                      let newFecha = this.homeService.formatoFecha(
                        this.filtrarForm.controls["selectedFecha"].value,
                        "amd",
                        "-"
                      );
                      this.validatedForm = false;
                      this.inicializarOpciones();
                      this.aplicarFiltro(true, newFecha);
                      this.loadRecuperarEvent.emit();
                      this.loadNotificacionesEvent.emit();
                      //
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                if (err.status === 422) {
                  this.atencionService.confirm({
                    message: err.message,
                  });
                } else {
                  this.errorService
                    .confirm({ message: err })
                    .subscribe((res) => {
                      if (res) {
                        return;
                      }
                    });
                }
              }
            );
          } else {
            return;
          }
        });
      }
    } else {
      this.loader.close();
      this.atencionService.confirm({
        message: "No es posible asignar",
      });
    }
  }

  listCuposAsignar(tipo: number) {
    let dia0_array_cupos = [];
    let dia1_array_cupos = [];
    let dia2_array_cupos = [];
    let dia3_array_cupos = [];
    let dia4_array_cupos = [];
    let dia5_array_cupos = [];
    let dia6_array_cupos = [];

    this.selectedItemAsignacion.dia0.cupos.forEach((element) => {
      dia0_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia1.cupos.forEach((element) => {
      dia1_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia2.cupos.forEach((element) => {
      dia2_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia3.cupos.forEach((element) => {
      dia3_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia4.cupos.forEach((element) => {
      dia4_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia5.cupos.forEach((element) => {
      dia5_array_cupos.push(element);
    });
    this.selectedItemAsignacion.dia6.cupos.forEach((element) => {
      dia6_array_cupos.push(element);
    });

    let arrayAsignacion = [];
    let asignaciones = [];
    let cuposCompleto: Cupo[] = [];

    for (let index = 0; index < this.preAsignacion.length; index++) {
      const element = this.preAsignacion[index];

      let data = {};
      let cupos: string[] = [];

      let demanda: number;
      //demanda = element.demanda;
      let count = 0;

      let contador = 0;
      if (element.cantidad == 0 && tipo == 1) {
        continue;
      }
      if (element.cantidad == 0) {
        // asignacion sin solicitud
        count = parseInt(this.gestionForm.controls["cuposxModulos"].value);
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia0_array_cupos.length > 0) {
                cupos.push(dia0_array_cupos[0].id);
                cuposCompleto.push(dia0_array_cupos[0]);
                dia0_array_cupos.shift();
              }
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia1_array_cupos.length > 0) {
                cupos.push(dia1_array_cupos[0].id);
                cuposCompleto.push(dia1_array_cupos[0]);
                dia1_array_cupos.shift();
              }
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia2_array_cupos.length > 0) {
                cupos.push(dia2_array_cupos[0].id);
                cuposCompleto.push(dia2_array_cupos[0]);
                dia2_array_cupos.shift();
              }
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia3_array_cupos.length > 0) {
                cupos.push(dia3_array_cupos[0].id);
                cuposCompleto.push(dia3_array_cupos[0]);
                dia3_array_cupos.shift();
              }
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia4_array_cupos.length > 0) {
                cupos.push(dia4_array_cupos[0].id);
                cuposCompleto.push(dia4_array_cupos[0]);
                dia4_array_cupos.shift();
              }
            }
            break;
          case "5":
            contador =
              dia5_array_cupos.length < count ? dia5_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia5_array_cupos.length > 0) {
                cupos.push(dia5_array_cupos[0].id);
                cuposCompleto.push(dia5_array_cupos[0]);
                dia5_array_cupos.shift();
              }
            }
            break;
          case "6":
            contador =
              dia6_array_cupos.length < count ? dia6_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia6_array_cupos.length > 0) {
                cupos.push(dia6_array_cupos[0].id);
                cuposCompleto.push(dia6_array_cupos[0]);
                dia6_array_cupos.shift();
              }
            }
            break;

          default:
            break;
        }
      } else {
        // asignacion con solicitud
        count =
          tipo == 0
            ? parseInt(this.gestionForm.controls["cuposxModulos"].value)
            : element.cantidad;
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia0_array_cupos.length > 0) {
                  cupos.push(dia0_array_cupos[0].id);
                  cuposCompleto.push(dia0_array_cupos[0]);
                  dia0_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia1_array_cupos.length > 0) {
                  cupos.push(dia1_array_cupos[0].id);
                  cuposCompleto.push(dia1_array_cupos[0]);
                  dia1_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia2_array_cupos.length > 0) {
                  cupos.push(dia2_array_cupos[0].id);
                  cuposCompleto.push(dia2_array_cupos[0]);
                  dia2_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia3_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  cuposCompleto.push(dia3_array_cupos[0]);
                  dia3_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia4_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  cuposCompleto.push(dia4_array_cupos[0]);
                  dia4_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "5":
            contador =
              dia5_array_cupos.length < count ? dia5_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia5_array_cupos.length > 0) {
                  cupos.push(dia5_array_cupos[0].id);
                  cuposCompleto.push(dia5_array_cupos[0]);
                  dia5_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "6":
            contador =
              dia6_array_cupos.length < count ? dia6_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia6_array_cupos.length > 0) {
                  cupos.push(dia6_array_cupos[0].id);
                  cuposCompleto.push(dia6_array_cupos[0]);
                  dia6_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;

          default:
            break;
        }
      }
    }
    return cuposCompleto;
  }

  rechazar(notifica: boolean) {
    let isValid = true;
    for (let index = 0; index < this.preAsignacion.length; index++) {
      const element = this.preAsignacion[index];
      if (element.cantidad == 0) {
        isValid = false;
      }
    }
    if (isValid) {
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        RechazarSolicitudComponent,
        {
          width: "50vw",
          disableClose: true,
          data: {},
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.loader.open("Por favor espere..");
        let arrayAsignacion = [];
        let lastIndex = this.preAsignacion.length - 1;
        for (let i = 0; i < this.preAsignacion.length; i++) {
          const element = this.preAsignacion[i];

          let demanda: number;
          for (let index = 0; index < element.demandas.length; index++) {
            const demanda = element.demandas[index];
            arrayAsignacion.push(demanda.id_demanda_cupo);
          }

          if (arrayAsignacion.length > 0) {
            let sinEmail = [];
            if (this.listSinEmail.length > 0) {
              this.listSinEmail.forEach((element) => {
                let emails = "";
                for (let index = 0; index < element.email.length; index++) {
                  const email = element.email[index];
                  if (emails == "") {
                    emails += email;
                  } else {
                    emails += ";" + email;
                  }
                }
                sinEmail.push({
                  id: element.id,
                  email: emails,
                });
              });
            }
            let data = {
              solicitudes: arrayAsignacion,
              id_motivo_rechazo: res.id,
              comentario: res.comentario,
              notificacion: notifica ? 1 : 0,
              sinEmail: sinEmail,
            };
            //llamada al método de rechazar

            this.cupoService.postRechazarCuposV3(data).subscribe(
              (res) => {
                if (i == lastIndex) {
                  this.loader.close();
                  this.inicializarOpciones();
                  this.loadNotificacionesEvent.emit();
                  this.validatedForm = false;
                  let newFecha = this.homeService.formatoFecha(
                    this.filtrarForm.controls["selectedFecha"].value,
                    "amd",
                    "-"
                  );
                  this.aplicarFiltro(true, newFecha);
                  this.alertService
                    .confirm({
                      message: "Solicitudes rechazadas correctamente!",
                      tipo: "exito",
                    })
                    .subscribe((res1) => {
                      if (res1) {
                        this.loadRecuperarEvent.emit();
                        this.loadNotificacionesEvent.emit();
                        return;
                      }
                    });
                }
              },
              (err) => {
                this.loader.close();
                this.validatedForm = false;
                if (err.status === 422) {
                  this.atencionService.confirm({
                    message: err.message,
                  });
                } else {
                  this.errorService
                    .confirm({
                      message: "Error al rechazar la solicitud.",
                    })
                    .subscribe((res) => {
                      if (res) {
                        return;
                      }
                    });
                }
              }
            );
          }
        }
      });
    } else {
      this.atencionService.confirm({
        message: "No es posible rechazar",
      });
    }
  }

  // Detecto las celdas seleccionas para marcar el color y guardar seleccion
  detectChanges = (hotInstance, changes, source) => {
    // Asocio la instancia general con la variable de instacia preparada, pudiendo luego acceder a la misma instancia
    this.instance = hotInstance;

    //  Inicializo el array de seleccionados
    this.seleccionados = [];
    this.preAsignacion = [];
    this.validatedForm = false;

    this.disabledSelectCabecera = true;

    // Me traigo el array completo de todas las celdas. Y por cada celda pinto el fondo de blanco.
    var todos = hotInstance.getData();
    for (let fila = 0; fila < todos.length; fila++) {
      for (let columna = 0; columna < 8; columna++) {
        hotInstance.setCellMeta(fila, columna, "className", "un_selecionadas");
      }
    }

    // A los seleccionados le agrego la clase que pinta el fondo verde.
    var selected = hotInstance.getSelected();
    for (var index = 0; index < selected.length; index += 1) {
      var item = selected[index];
      var startRow = Math.min(item[0], item[2]);
      var endRow = Math.max(item[0], item[2]);
      var startCol = Math.min(item[1], item[3]);
      var endCol = Math.max(item[1], item[3]);
      for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (
          var columnIndex = startCol;
          columnIndex <= endCol;
          columnIndex += 1
        ) {
          let minData = moment();
          this.hoyMoment = moment(this.hoyString);
          let fec = this.dias[(columnIndex - 1).toString()].fecha;
          let otrFecha = moment(fec);
          if (otrFecha < minData) {
            minData = otrFecha;
          }
          if (minData >= this.hoyMoment) {
            hotInstance.setCellMeta(
              rowIndex,
              columnIndex,
              "className",
              "seleccionDemanda"
            );
            let seleccion: Seleccion = {
              fila_solicitud: rowIndex,
              col_dia: columnIndex,
            };
            this.seleccionados.push(seleccion);
          } else {
            this.disabledAcciones = true;
          }
        }
      }
    }

    // Trabajo con los seleccionados
    let diferentDestinatario = false;
    this.seleccionados.forEach((element) => {
      let columSolicitados =
        "dia" + (element.col_dia - 1).toString() + "_solicitados";
      let columSolicitudes =
        "dia" + (element.col_dia - 1).toString() + "_solicitudes";
      let columSelected = "dia" + (element.col_dia - 1).toString();

      const valorListadoSolicitudes =
        this.listadoClientes[element.fila_solicitud];

      let valorCellListadoSolicitudes = 0;
      let demandasListadoSolicitudes: Solicitud[] = [];
      let valorCellSelectedItemAsignacion = 0;
      let cuposCellSelectedItemAsignacion = [];

      for (let key in valorListadoSolicitudes) {
        if (key === columSolicitados) {
          valorCellListadoSolicitudes = valorListadoSolicitudes[key];
        }
        if (key === columSolicitudes) {
          demandasListadoSolicitudes = valorListadoSolicitudes[key];
        }
      }
      for (let key in this.selectedItemAsignacion) {
        if (key === columSelected) {
          valorCellSelectedItemAsignacion =
            this.selectedItemAsignacion[key].asignados;
          /* cuposCellSelectedItemAsignacion = this.selectedItemAsignacion[key]
            .cupos; */
          continue;
        }
      }
      if (
        this.selectedItemAsignacion &&
        !valorListadoSolicitudes.propia &&
        valorListadoSolicitudes.destinatario.length > 0 &&
        valorListadoSolicitudes.destinatario !==
        this.selectedItemAsignacion.nombreDestinatario
      ) {
        diferentDestinatario = true;
      }

      let buscarSiTieneEmail =
        valorListadoSolicitudes.corredorCuit == "00000000000"
          ? valorListadoSolicitudes.contraparteCuit
          : valorListadoSolicitudes.corredorCuit;

      this.cupoService.getTieneEmailCuit(buscarSiTieneEmail).subscribe(
        (res) => {
          if (res.data.tiene_email_notificacion == "NO") {
            let temp = this.listSinEmail.find(
              (item) => item.cuit == buscarSiTieneEmail
            );
            if (temp == undefined) {
              let item = new CentroSinEMail();
              item.cuit = buscarSiTieneEmail;
              item.razon_social = res.data.razon_social;
              item.email = [];
              item.id = parseInt(res.data.id_usuario);

              this.listSinEmail.push(item);
            }
          }
        },
        (error) => {
          this.loader.close();
        }
      );

      this.preAsignacion.push({
        dia: (element.col_dia - 1).toString(),
        receptorCuit: valorListadoSolicitudes.corredorCuit,
        contraparte: valorListadoSolicitudes.contraparteCuit,
        contrato: valorListadoSolicitudes.contrato,
        destinatario: valorListadoSolicitudes.destinatario,
        demandas:
          demandasListadoSolicitudes.length > 0
            ? demandasListadoSolicitudes
            : null,
        cantidad: valorCellListadoSolicitudes,
        disponibles: valorCellSelectedItemAsignacion,
      });
    });

    if (this.preAsignacion.length > 0) {
      this.disabledAcciones = false;
      this.inicializarOpciones();
      if (diferentDestinatario) {
        this.atencionService.confirm({
          message:
            "El DESTINATARIO indicado en la solicitud no coincide con el de los cupos por asignar ",
        });
      }
    } else {
      this.disabledAcciones = true;
    }

    // Vuelvo a redenrizar toda la tabla para que salgan los cambios
    hotInstance.render();

    this.disabledCuposXModulos = false;
    this.gestionForm.controls["cuposxModulos"].setValue(0);
    this.validatedForm = false;
    this.disabledSelectCabecera = false;
    this.toolTipModulo = "Cupos por Módulos";
  };

  // Apenas termine de cargar toda la instancia de la tabla
  afterInit = (hotInstance) => {
    this.instance = hotInstance;

    this.colHeaders.push(this.is_logistica_propia);

    this.dias.forEach((element) => {
      this.colHeaders.push(
        element.dia_semana_string + "." + element.dia + "/" + element.mes
      );
    });

    let settings = {
      colHeaders: this.colHeaders,
      maxRows: this.listadoSolicitudes.length,
    };

    let data = this.listadoSolicitudes;

    hotInstance.updateSettings(settings);

    // cargo la data de la tabla
    hotInstance.loadData(data);

    this.buscarClientes();
  };

  // Pintar la ultima columna de total de solicitados
  pintarSolicitado = (hotInstance, column, TH) => {
    if (column == 11) {
      Handsontable.dom.addClass(TH, "totalsolicitados");
    }
  };

  // Renderizar cada celda de la tabla en el momento que se crea
  renderRow = (hotInstance, td, row, col, prop, value, cellProperties) => {
    // Poner color a la columna de total solicitados
    // if (col == 11) {
    //   td.style.background = "#FFF5CC";
    // }

    // Aumentar tamaño de texto y color
    if (col > 0) {
      td.style.fontSize = "17px";
      td.style.color = "#fff";
    }
    if (col == 0) {
      td.style.fontSize = "12px";
      td.style.color = "#101010";
    }
  };

  limitarSeleccion = (hotInstance, event, TD, controller) => {
    if (TD.col == 0) {
      event.stopImmediatePropagation();
    }
  };

  limitarSeleccion2 = (hotInstance, event, TD, blockCalculations) => {
    if (TD.col == 0) {
      event.stopImmediatePropagation();
    }
  };


  addCupoDisponibles() {
    let title = "Agregar Cupos Disponibles";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddCuposDisponiblesComponent,
      {
        width: "45vw",
        // height: "79vh",
        disableClose: true,
        data: {
          title: title,
          cupera: 2,
          filtros: this.filtro,
          destinatario: this.selectedItemAsignacion
            ? this.selectedItemAsignacion.nombreDestinatario
            : "",
          fechaSelected: this.filtrarForm.controls["selectedFecha"].value,
          productos: this.productos,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.agregarsolicitud = false;
      let newFecha = this.homeService.formatoFecha(
        this.filtrarForm.controls["selectedFecha"].value,
        "amd",
        "-"
      );
      this.aplicarFiltro(true, newFecha);
      this.mostrarAreaSinCupo = false;
      return;
    });
  }

  inicializarOpciones() {
    if (this.listadoAsignacion.length === 0) {
      this.acciones[0].enable = false;
      this.acciones[1].enable = false;
      this.gestionForm.controls["selectedAccion"].setValue(2);
      this.placeholderAccion = "";
      this.toolTipModulo =
        "Este campo no es editable debido a que seleccionó la opción RECHAZAR";
      this.disabledCuposXModulos = true;
      this.disabledSelectCabecera = true;
      this.validatedForm = true;
    } else {
      this.gestionForm.controls["selectedAccion"].setValue("");
      this.placeholderAccion = "  asignar/asignar todos/rechazar";
      this.placeholderCabecera = "  3 > Seleccionar cabecera";
    }
    this.gestionForm.controls["cuposxModulos"].setValue("");
    this.gestionForm.controls["selectedCabecera"].setValue("");
  }

  openPopUpInfoCupo(cupos, nombreDestinatario, idCuitDestinatario, idDestino) {
    let total = cupos.length;
    let heightPop: number = 40 + total * 10;
    let heightPopUp: string = "40vh";
    if (heightPop > 80) heightPopUp = "80vh";
    else heightPopUp = heightPop.toString();
    let title = "INFORMACIÓN DE CUPOS";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InformacionCupoV2Component,
      {
        width: "55vw",
        height: heightPopUp,
        disableClose: false,
        panelClass: "no-padding-dialog",
        data: {
          title: title,
          payload: {
            cupos: cupos,
            nombre_destinatario: nombreDestinatario,
            idCuitDestinatario: idCuitDestinatario,
            idDestino: idDestino,
            fecha: cupos[0].fecha,
            id_producto: this.filtro.id_producto,
            producto: this.filtro.producto,
          },
        },
      }
    );
  }

  getMoreInformation(): string {
    return "Address : Home \n  Tel : Number";
  }

  dataFromService = "VER DETALLE DE CUPOS";

  openPopUpSinEmail(dato: CentroSinEMail, opcion: string) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      UsuarioSinEmailComponent,
      {
        width: "50vw",
        disableClose: false,
        data: {
          title: " asignando cupos",
          payload: {
            cuit: dato.cuit,
            razon: dato.razon_social,
            emails: dato.email,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let temp = this.listSinEmail.find((item) => item.cuit === res.cuit);
        temp.email = res.email;
        let valido = this.validarSendNotificacion();
        //let valido = this.listSinEmail.length > 0 ? false : true;
        if (valido) {
          switch (opcion) {
            case "CONFIRMAR":
              break;
            case "CONFIRMAR-NOTIFICAR":
              if (this.gestionForm.controls["selectedAccion"].value == 2) {
                this.rechazar(true);
              } else {
                this.asignarCupo(
                  this.gestionForm.controls["selectedAccion"].value,
                  true
                );
              }
              break;

            case "NOTIFICAR":
              let sinEmail = [];
              let data = {};
              if (this.listSinEmail.length > 0) {
                this.listSinEmail.forEach((element) => {
                  let emails = "";
                  for (let index = 0; index < element.email.length; index++) {
                    const email = element.email[index];
                    if (emails == "") {
                      emails += email;
                    } else {
                      emails += ";" + email;
                    }
                  }
                  sinEmail.push({
                    id: element.id,
                    email: emails,
                  });
                });
              }
              if (sinEmail.length > 0) {
                data = {
                  sinEmail: sinEmail,
                };
              }
              this.loader.open("Por favor espere..");
              this.cupoService.postEnviarNotificacion(data).subscribe(
                (res) => {
                  this.loader.close();
                  this.loadNotificacionesEvent.emit();
                  if (res.status === 280) {
                    this.atencionService.confirm({
                      message: res.data + " !",
                      tipo: "exito",
                    });
                  } else {
                    this.alertService.confirm({
                      message: res.data + " !",
                      tipo: "exito",
                    });
                  }
                },
                (err) => {
                  this.loader.close();
                  this.atencionService.confirm({
                    message: "Las notificaciones no pudieron ser enviadas ",
                  });
                }
              );
              break;

            default:
              break;
          }
        }
      }

      return;
    });
  }

  loadCentrosSinEmail(data) {
    data.forEach((element) => {
      let temp = this.listSinEmail.find((item) => item.cuit === element.cuit);
      if (temp == undefined) {
        let item = new CentroSinEMail();
        item.cuit = element.cuit;
        item.razon_social = element.razon_social;
        item.email = [];
        item.id = parseInt(element.id);
        this.listSinEmail.push(item);
      }
    });
  }

  validarSendNotificacion(): boolean {
    let cant = 0;
    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        if (element.email.length > 0) {
          cant++;
        }
      });
      if (cant === this.listSinEmail.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  toggleSelected(
    obj: ListadoSolicitud,
    event,
    indice: number,
    column: string,
    value: number
  ) {
    if (event.shiftKey) {
      let columSolicitados = "dia" + column + "_solicitados";
      let columSolicitudes = "dia" + column + "_solicitudes";
      let demandasListadoSolicitudes: Solicitud[] = [];
      const valorListadoSolicitudes = this.listadoSolicitudes[indice];
      let columSelected = "dia" + column;
      let valorCellListadoSolicitudes = 0;
      let valorCellSelectedItemAsignacion = 0;

      for (let key in valorListadoSolicitudes) {
        if (key === columSolicitados) {
          valorCellListadoSolicitudes = valorListadoSolicitudes[key];
        }
        if (key === columSolicitudes) {
          demandasListadoSolicitudes = valorListadoSolicitudes[key];
        }
      }
      for (let key in this.selectedItemAsignacion) {
        if (key === columSelected) {
          valorCellSelectedItemAsignacion =
            this.selectedItemAsignacion[key].asignados;
          /* cuposCellSelectedItemAsignacion = this.selectedItemAsignacion[key]
            .cupos; */
          continue;
        }
      }
      let tempPreAsignacion = this.preAsignacion.findIndex(
        (item) =>
          item.dia === column &&
          item.receptorCuit === obj.corredorCuit &&
          item.contraparte === obj.contraparteCuit &&
          item.destinatario === obj.destinatario &&
          item.contrato === obj.contrato
      );
      if (tempPreAsignacion === -1) {
        this.listadoSolicitudes[indice].isSelected[column] = 1;

        this.preAsignacion.push({
          dia: column,
          receptorCuit: obj.corredorCuit,
          contraparte: obj.contraparteCuit,
          contrato: obj.contrato,
          destinatario: obj.destinatario,
          demandas:
            demandasListadoSolicitudes.length > 0
              ? demandasListadoSolicitudes
              : null,
          cantidad: value,
          disponibles: valorCellSelectedItemAsignacion,
        });
        let diferentDestinatario = false;
        if (
          obj.destinatario != "" &&
          obj.destinatario !== this.selectedItemAsignacion.nombreDestinatario
        ) {
          diferentDestinatario = true;
        }
        if (diferentDestinatario) {
          this.atencionService.confirm({
            message:
              "El DESTINATARIO indicado en la solicitud no coincide con el de los cupos por asignar ",
          });
        }
        let buscarSiTieneEmail =
          valorListadoSolicitudes.corredorCuit == "00000000000"
            ? valorListadoSolicitudes.contraparteCuit
            : valorListadoSolicitudes.corredorCuit;
        this.cupoService.getTieneEmailCuit(buscarSiTieneEmail).subscribe(
          (res) => {
            if (res.data.tiene_email_notificacion == "NO") {
              let temp = this.listSinEmail.find(
                (item) => item.cuit == buscarSiTieneEmail
              );
              if (temp == undefined) {
                let item = new CentroSinEMail();
                item.cuit = buscarSiTieneEmail;
                item.razon_social = res.data.razon_social;
                item.email = [];
                item.id = parseInt(res.data.id_usuario);

                this.listSinEmail.push(item);
              }
            }
          },
          (error) => {
            this.loader.close();
          }
        );
      } else {
        this.listadoSolicitudes[indice].isSelected[column] = 0;

        this.preAsignacion.splice(tempPreAsignacion, 1);
      }

      this.dataSourceSolicitudes.data = this.listadoSolicitudes;
      //** here */
    } else if (event.ctrlKey) {
      let columSolicitados = "dia" + column + "_solicitados";
      let columSolicitudes = "dia" + column + "_solicitudes";
      let demandasListadoSolicitudes: Solicitud[] = [];
      const valorListadoSolicitudes = this.listadoSolicitudes[indice];
      let columSelected = "dia" + column;
      let valorCellListadoSolicitudes = 0;
      let valorCellSelectedItemAsignacion = 0;

      for (let key in valorListadoSolicitudes) {
        if (key === columSolicitados) {
          valorCellListadoSolicitudes = valorListadoSolicitudes[key];
        }
        if (key === columSolicitudes) {
          demandasListadoSolicitudes = valorListadoSolicitudes[key];
        }
      }
      for (let key in this.selectedItemAsignacion) {
        if (key === columSelected) {
          valorCellSelectedItemAsignacion =
            this.selectedItemAsignacion[key].asignados;
          /* cuposCellSelectedItemAsignacion = this.selectedItemAsignacion[key]
            .cupos; */
          continue;
        }
      }
      let tempPreAsignacion = this.preAsignacion.findIndex(
        (item) =>
          item.dia === column &&
          item.receptorCuit === obj.corredorCuit &&
          item.contraparte === obj.contraparteCuit &&
          item.destinatario === obj.destinatario &&
          item.contrato === obj.contrato
      );
      if (tempPreAsignacion === -1) {
        this.listadoSolicitudes[indice].isSelected[column] = 1;

        this.preAsignacion.push({
          dia: column,
          receptorCuit: obj.corredorCuit,
          contraparte: obj.contraparteCuit,
          contrato: obj.contrato,
          destinatario: obj.destinatario,
          demandas:
            demandasListadoSolicitudes.length > 0
              ? demandasListadoSolicitudes
              : null,
          cantidad: value,
          disponibles: valorCellSelectedItemAsignacion,
        });
        let diferentDestinatario = false;
        if (
          obj.destinatario != "" &&
          obj.destinatario !== this.selectedItemAsignacion.nombreDestinatario
        ) {
          diferentDestinatario = true;
        }
        if (diferentDestinatario) {
          this.atencionService.confirm({
            message:
              "El DESTINATARIO indicado en la solicitud no coincide con el de los cupos por asignar ",
          });
        }
        let buscarSiTieneEmail =
          valorListadoSolicitudes.corredorCuit == "00000000000"
            ? valorListadoSolicitudes.contraparteCuit
            : valorListadoSolicitudes.corredorCuit;
        this.cupoService.getTieneEmailCuit(buscarSiTieneEmail).subscribe(
          (res) => {
            if (res.data.tiene_email_notificacion == "NO") {
              let temp = this.listSinEmail.find(
                (item) => item.cuit == buscarSiTieneEmail
              );
              if (temp == undefined) {
                let item = new CentroSinEMail();
                item.cuit = buscarSiTieneEmail;
                item.razon_social = res.data.razon_social;
                item.email = [];
                item.id = parseInt(res.data.id_usuario);

                this.listSinEmail.push(item);
              }
            }
          },
          (error) => {
            this.loader.close();
          }
        );
      } else {
        this.listadoSolicitudes[indice].isSelected[column] = 0;
        this.preAsignacion.splice(tempPreAsignacion, 1);
      }

      this.dataSourceSolicitudes.data = this.listadoSolicitudes;

      //this.previousSelected = obj;
    } else {
      this.inicializarOpciones();
      this.disabledSelectCabecera = true;
      this.validatedForm = false;
      for (let index = 0; index < this.listadoSolicitudes.length; index++) {
        const element = this.listadoSolicitudes[index];
        if (index == indice) {
          element.isSelected = [0, 0, 0, 0, 0];
          element.isSelected[column] = 1;
        } else {
          element.isSelected = [0, 0, 0, 0, 0];
        }
      }

      this.dataSourceSolicitudes.data = this.listadoSolicitudes;
      this.preAsignacion = [];
      let columSolicitados = "dia" + column + "_solicitados";
      let columSolicitudes = "dia" + column + "_solicitudes";
      let demandasListadoSolicitudes: Solicitud[] = [];
      const valorListadoSolicitudes = this.listadoSolicitudes[indice];
      let columSelected = "dia" + column;
      let valorCellListadoSolicitudes = 0;
      let valorCellSelectedItemAsignacion = 0;

      for (let key in valorListadoSolicitudes) {
        if (key === columSolicitados) {
          valorCellListadoSolicitudes = valorListadoSolicitudes[key];
        }
        if (key === columSolicitudes) {
          demandasListadoSolicitudes = valorListadoSolicitudes[key];
        }
      }
      for (let key in this.selectedItemAsignacion) {
        if (key === columSelected) {
          valorCellSelectedItemAsignacion =
            this.selectedItemAsignacion[key].asignados;
          /* cuposCellSelectedItemAsignacion = this.selectedItemAsignacion[key]
            .cupos; */
          continue;
        }
      }

      this.preAsignacion.push({
        dia: column,
        receptorCuit: obj.corredorCuit,
        contraparte: obj.contraparteCuit,
        contrato: obj.contrato,
        destinatario: obj.destinatario,
        demandas:
          demandasListadoSolicitudes.length > 0
            ? demandasListadoSolicitudes
            : null,
        cantidad: value,
        disponibles: valorCellSelectedItemAsignacion,
      });
      let diferentDestinatario = false;
      if (
        obj.destinatario != "" &&
        obj.destinatario !== this.selectedItemAsignacion.nombreDestinatario
      ) {
        diferentDestinatario = true;
      }
      if (diferentDestinatario) {
        this.atencionService.confirm({
          message:
            "El DESTINATARIO indicado en la solicitud no coincide con el de los cupos por asignar ",
        });
      }
      let buscarSiTieneEmail =
        valorListadoSolicitudes.corredorCuit == "00000000000"
          ? valorListadoSolicitudes.contraparteCuit
          : valorListadoSolicitudes.corredorCuit;
      this.cupoService.getTieneEmailCuit(buscarSiTieneEmail).subscribe(
        (res) => {
          if (res.data.tiene_email_notificacion == "NO") {
            let temp = this.listSinEmail.find(
              (item) => item.cuit == buscarSiTieneEmail
            );
            if (temp == undefined) {
              let item = new CentroSinEMail();
              item.cuit = buscarSiTieneEmail;
              item.razon_social = res.data.razon_social;
              item.email = [];
              item.id = parseInt(res.data.id_usuario);

              this.listSinEmail.push(item);
            }
          }
        },
        (error) => {
          this.loader.close();
        }
      );
    }
    this.disabledAcciones = this.preAsignacion.length > 0 ? false : true;
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
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
        this.proximaActualizacion = this.homeService.formatoHora(
          this.searchEndDate
        );
        this.minutes = this.InitialTime;
        this.seconds = Math.floor(this.remainingTime * 60);
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
        this.getConfigCentro();
        this.loadNotificacionesEvent.emit();
        //  this.renderDataTable(this.fechaBuscada);
      } else {
        this.minutes = Math.floor(this.remainingTime / 60);
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
      }
    });
  }

  verSolicitudes() {
    this.mostrarSolicitudes = true;
    this.mostrarAreaSinCupo = false;
  }

  totalAsignaciones(): number {
    return this.listadoAsignacion.length;
  }

  totalSolicitudes(): number {
    return this.listadoSolicitudes.length;
  }
}
