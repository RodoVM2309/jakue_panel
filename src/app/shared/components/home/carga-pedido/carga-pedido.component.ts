import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
} from "@angular/core";
import { egretAnimations } from "../../../animations/egret-animations";
import {
  MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar, MatSidenav, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE, DateAdapter
} from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { HomeService } from '../home.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { PedidoDataSource } from '../../../services/pedido.datasource';
import 'rxjs/add/observable/of';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { CdkDetailRowDirective } from '../../../directives/cdk-detail-row.directive';
import { Pedido, PedidoAsignar } from '../../../models/pedido';
import { ReducirComponent } from '../reducir/reducir.component';
import { ExtenderFechaComponent } from '../extender-fecha/extender-fecha.component';
import { EditViajeComponent } from '../edit-viaje/edit-viaje.component';
import { EstadoViajeComponent } from '../estado-viaje/estado-viaje.component';
import { EstadoDescargaComponent } from '../estado-descarga/estado-descarga.component';
import { DesvioComponent } from '../desvio/desvio.component';
import { DesvioRetornoComponent } from '../desvio-retorno/desvio-retorno.component';
import { ConfirmCargaDestinoComponent } from '../confirm-carga-destino/confirm-carga-destino.component';
import { ConfirmCargaComponent } from '../confirm-carga/confirm-carga.component';
import { ConfirmCargaParametrosComponent } from '../confirm-carga-parametros/confirm-carga-parametros.component';
import { WhatsappComponent } from '../whatsapp/whatsapp.component';

import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { map } from '@progress/kendo-data-query/dist/npm/transducers';
import { InfoViajeComponent } from '../info-viaje/info-viaje.component';
import { ExelService } from '../../../../shared/services/exel.service';
import { AddEstadoDescargaComponent } from '../estado-descarga/add-estado-descarga/add-estado-descarga.component';
import { AddEstadoDescargaRetornoComponent } from '../estado-descarga/add-estado-descarga-retorno/add-estado-descarga-retorno.component';
import { AddRechazoCaladaComponent } from '../estado-descarga/add-rechazo-calada/add-rechazo-calada.component';
import { AddRechazoCaladaRetornoComponent } from '../estado-descarga/add-rechazo-calada-retorno/add-rechazo-calada-retorno.component';
import { getYear, getMonth, getDay } from 'date-fns';
import { ConfirmCargaRetornoComponent } from '../confirm-carga-retorno/confirm-carga-retorno.component';
import { ConfirmarPedidoComponent } from '../confirmar-pedido/confirmar-pedido.component';
import { ConfirmarPedidoRetornoComponent } from '../confirmar-pedido-retorno/confirmar-pedido-retorno.component';
import { AddSmsComponent } from '../../home/asignar-viaje/add-sms/add-sms.component';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { SendsmsService } from '../../../services/sendsms.service';
import { Viaje } from '../../../models/viaje';
import { Chofer } from '../../../models/chofer';
import { InfoSubpedidoComponent } from '../info-subpedido/info-subpedido.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { dateFieldName } from '@telerik/kendo-intl';
import { HttpClient } from '@angular/common/http';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { GlobalService } from '../../../../shared/models/global.service';
import { PedidoObservacionesComponent } from '../pedido-observaciones/pedido-observaciones.component';
import { CondicionesViajeComponent } from '../condiciones-viaje/condiciones-viaje.component';
import { CondicionesViaje2Component } from '../condiciones-viaje2/condiciones-viaje2.component';
import { InfoPersonaComponent } from 'app/views/admin/personas/info-persona/info-persona.component';
import { SiniestroComponent } from '../siniestro/siniestro.component';
import { AddPedidoComponent } from '../add-pedido/add-pedido.component';
import { AddPedidoRetornoComponent } from '../add-pedido-retorno/add-pedido-retorno.component';
import { AddPedidoDadorRetornoComponent } from '../add-pedido-dador-retorno/add-pedido-dador-retorno.component';
import { AddPedidoDadorComponent } from '../add-pedido-dador/add-pedido-dador.component';
import { AddPedidoDadorCortoComponent } from '../add-pedido-dador-corto/add-pedido-dador-corto.component';
import { AddPedidoCortoComponent } from '../add-pedido-corto/add-pedido-corto.component';
import { SeleccionarPedidoComponent } from '../seleccionar-pedido/seleccionar-pedido.component';
import { CupoPedidoComponent } from '../cupo-pedido/cupo-pedido.component';
import { ListaChoferesComponent } from '../lista-choferes/lista-choferes.component';
import { MessageService } from 'app/shared/services/message.service';

import { ListarListaComponent } from '../../turneada/listar-lista/listar-lista.component';
import { UserService } from 'app/shared/services/user.service';
import { AddRechazoViajeComponent } from '../edit-viaje/add-rechazo-viaje/add-rechazo-viaje.component';
import { CentrosService } from 'app/shared/services/centros.service';
//import { AppDateAdapter, APP_DATE_FORMATS } from '../../home/add-pedido/date.adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { AddPedidoFertilizantesComponent } from '../add-pedido-fertilizantes/add-pedido-fertilizantes.component';
import { AsignarDirectoComponent } from '../asignar-directo/asignar-directo.component';
import { ReservasService } from 'app/shared/services/reservas.service';
import { ReservasDB } from 'app/shared/inmemory-db/reservas-db';
import { animate, state, style, transition, trigger } from "@angular/animations";
import * as moment from "moment";
import { MarcadorMapaPedido } from "@app/shared/models";
import { EditPedidoFertilizantesComponent } from "app/shared/components/home/edit-pedido-fertilizantes/edit-pedido-fertilizantes.component";
export class PedidoFiltro {
  id: number;
  descripcion: string;
}

export class Location {
  page: number;
  scroll_location: number;
  up: number;
}

@Component({
  selector: "app-carga-pedido",
  templateUrl: "./carga-pedido.component.html",
  styleUrls: ["./carga-pedido.component.scss"],
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
    egretAnimations,
  ],
  providers: [
    HomeService,
    NomencladoresService,
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
export class CargaPedidoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  interval: any;
  columnsToDisplay = [
    "color",
    "tipo_pedido",
    "nombre_centro",
    "origen",
    "zonaDestino",
    "producto",
    "nombre_cliente",
    "fecha_desde",
    "fecha_hasta",
    "total",
    "xasignar",
    "viajes_asignados",
    "pendiente",
    "akmCarga",
    "cargado",
    "menos50",
    "endestino",
    "calada",
    "rechazados",
    "vacio",
    "mapa",
    "asignar",
    "acciones",
  ];
  columnsExtended = ["expandedDetail"];
  public tipoTurneada = parseInt(localStorage.getItem("tipo_turneada"));
  pedido: PedidoAsignar;
  choferes: Chofer[];
  choferesDisponibles = [];
  choferesDisponiblesReloj = [];
  public tempChoferesDisponibles: Chofer[];
  public pedidos: PedidoFiltro[];
  public position: Location[] = [];
  choferesAsignados = [];
  choferesAsignadosReloj = [];
  cantidadchoferesActivos = 0;
  public generadores = [];
  temp = [];
  public choferesViajes: Chofer[];
  public choferesViajesReloj: Chofer[];
  public tempChoferesViajes: Chofer[];
  valor_antiguo = 0;

  pedido2: Pedido;
  circleMapRadius = 50000;
  dataSource: any;
  dataSource_salva: PedidoDataSource;
  expandedElement: Pedido;
  //condicion = true;
  showMap = false;
  showPedid = true;
  color = true;
  isSidenavOpen = true;
  countPedido: number;
  countPedidoPage: number;
  timerchoferes_pedido: any;
  timerchoferes: any;
  id_pedido_temp: any;
  showAllChoferes: boolean; //Indicará si el cliente escoge mostrar todos los choferes
  showChoferesPedido: boolean; //Indicará que cuando se escoja un pedido se muestren los choferes de este.
  sinpedido = false;
  //Map
  zoom = 5;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654,
  };
  polylinePoints = [
    { lat: -34.580445, lng: -58.493264, label: "Buenos Aires" },
    { lat: -32.954506, lng: -60.681654, label: "Rosario" },
    { lat: -38.023604, lng: -57.578841, label: "Mar del Plata" },
  ];
  tipos_pedido = [
    { id: 1, tipo: 'Largo' },
    { id: 2, tipo: 'Fertilizantes' },
    { id: 3, tipo: 'Corto' }
  ];

  filtros_especiales = [
    { id: 1, tipo: "Pendientes por asignar" },
    { id: 2, tipo: "Pedidos en rojo" },
    { id: 3, tipo: "En tiempo" },
    { id: 4, tipo: "Fuera de tiempo" },
    { id: 5, tipo: "Pedidos bloqueados" },
    { id: 6, tipo: "Pedidos en difusión" },
    { id: 7, tipo: "Pedidos cerrados" },
  ];

  public getItemSub: Subscription;
  subscription: Subscription;
  cantidadPedidos = 0;
  cantidadChoferesOcupados = 0;
  cantidadChoferes = 0;

  public iconUrlGreen =
    "https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2";

  public iconUrlYellow = "http://www.google.com/mapfiles/marker_yellow.png";

  public iconUrlBlue =
    "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png";

  public iconUrlcargaYellow =
    "http://maps.google.com/mapfiles/ms/micons/ylw-pushpin.png";
  public iconUrlcargaRed =
    "http://maps.google.com/mapfiles/ms/micons/red-pushpin.png";
  public iconUrlcargaBlue =
    "http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png";
  public iconUrlGreenReloj =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenX.png";
  public iconUrlBlueReloj =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueX.png";
  public iconUrlRed = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";

  previous;

  showCentro = false;
  rolAdminMuvin = false;
  idCentro = null;
  rolDador = false;
  roloperador = false;
  showUrl = "";
  showUrlSeguro = "";
  now: any;

  rol = localStorage.getItem("rol");
  todoOk = true;
  filtro = {
    origen: "",
    generador: "",
    zonadestino: "",
    producto: "",
    dador: "",
    dadorCuit: localStorage.getItem("dador_seleccionado"),
    contrato: "",
    fechadesde: "",
    fechahasta: "",
    tipo: null,
    pendientes_asignar: null,
    en_tiempo: null,
    fuera_tiempo: null,
    pedidos_rojos: null,
    pedidos_cerrados: null,
    pedidos_difusion: null,
    pedidos_ocultos: null,
  };
  minDate: any;
  maxDate: any;
  public viajes: Viaje[];
  public viajesPedido: Viaje[];
  filtroespeciales = [];
  datostemp: PedidoAsignar[] = [];
  miStep: any;
  tipocentro: any;
  showDetallePedido = false;
  pagina: number = 1;
  cantPaginas: number = 0;
  mostrardifusion: boolean;
  colorToggle = "tabscarga";
  backgroundColorToggle = "tabscarga";
  public origin: any;
  public destination: any;

  showDador = false;
  escliente = false;
  esOperador = false;

  dador_seleccionado: any;
  refer: any;

  clusterStyles = [
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50,
    },
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50,
    },
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50,
    },
  ];
  message: any;
  marcadores: MarcadorMapaPedido[] = [];
  marcadoresViaje: MarcadorMapaPedido[] = [];
  constructor(
    private homeService: HomeService,
    private service: HomeService,
    private reservasService: ReservasService,
    private dialog: MatDialog,
    private nomencladoresService: NomencladoresService,
    public router: Router,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private globalService: GlobalService,
    private http: HttpClient,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private excelService: ExelService,
    private smsService: SendsmsService,
    private messageService: MessageService,
    private userService: UserService,
    private centrosServices: CentrosService
  ) {
    this.mostrardifusion = false;
    this.miStep = null;
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "Nuevo Pedido":
            this.gotoRefresh();
            break;
          case "CambioDadorSeleccionado":
            this.updateFilter(
              localStorage.getItem("dador_seleccionado"),
              "dadorCuit"
            );
            break;

          default:
            break;
        }
      });
  }



  ngOnInit() {
    this.showAllChoferes = true;
    this.showChoferesPedido = false;
    this.tipocentro = localStorage.getItem("clienteMuvin");
    this.showUrl = this.globalService.apiHost + "viaje/pdf-down?id=";
    this.showUrlSeguro =
      this.globalService.apiHost + "viaje/pdf-seguro-down?id=";
    let rol: string = localStorage.getItem("rol");
    this.userService
      .getIdPersonaRol(rol)
      .subscribe((data) => (this.idCentro = data.data));
    this.filtroespeciales = [3];
    this.filtro.en_tiempo = 1;
    if (rol == "5") {
      this.rolDador = true;
    }
    if (rol == "1") {
      this.showCentro = true;
      this.rolAdminMuvin = true;
      this.columnsToDisplay = [
        "color",
        "tipo_pedido",
        "id",
        "nombre_centro",
        "nombre_cliente",
        "producto",
        "origen",
        "zonaDestino",
        "fecha_desde",
        "fecha_hasta",
        "total",
        "xasignar",
        "viajes_asignados",
        "pendiente",
        "akmCarga",
        "cargado",
        "menos50",
        "endestino",
        "calada",
        "rechazados",
        "vacio",
        "mapa",
      ];
    } else {
      if (rol == "11") {
        this.roloperador = true;
      }
      this.columnsToDisplay = [
        "color",
        "tipo_pedido",
        "id",
        "nombre_centro",
        "nombre_cliente",
        "producto",
        "origen",
        "zonaDestino",
        "fecha_desde",
        "fecha_hasta",
        "total",
        "xasignar",
        "viajes_asignados",
        "pendiente",
        "akmCarga",
        "cargado",
        "menos50",
        "endestino",
        "calada",
        "rechazados",
        "vacio",
        "mapa",
        "asignar",
        "ilicon",
        "acciones",
      ];
    }
    let esDadorCupo =
      localStorage.getItem("esDadorCupo") === "1" ? true : false;
    let esClienteFinal =
      localStorage.getItem("esClienteFinal") === "1" ? true : false;
    let esClienteMuvin =
      localStorage.getItem("clienteMuvin") === "1" ? true : false;
    if (esDadorCupo || esClienteFinal) {
      if (!esClienteMuvin && esClienteFinal) {
        let limitadoDador = localStorage.getItem("limitado_dador");
        if (limitadoDador === null) {
          this.filtro.dadorCuit = "XXXXXXXXXXX";
          localStorage.setItem("dador_seleccionado", "XXXXXXXXXXX");
        } else {
          this.filtro.dadorCuit = localStorage.getItem("dador_seleccionado");
        }
      } else {
        this.filtro.dadorCuit = "";
        localStorage.setItem("dador_seleccionado", "");
      }
    }
    this.carga_inicial();
    this.getConfigCentro();
    //this.getAds();
    this.origin = { lat: 24.799448, lng: 120.979021 };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  }

  getConfigCentro() {
    this.nomencladoresService.getConfiguracionCentro().subscribe((data) => {
      this.mostrardifusion = data.data.condiciones_viaje === 1 ? true : false;
      this.tipoTurneada = data.data.id_tipo_turneada;
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timerchoferes_pedido);
    clearInterval(this.timerchoferes);
    this.subscription.unsubscribe();
    this.getItemSub.unsubscribe();
  }

  public groups: GroupDescriptor[];

  public gridView: DataResult;

  public groupChange(groups: GroupDescriptor[], data: any): void {
    this.groups = groups;
    this.loadProducts(data);
  }

  private loadProducts(data: any): void {
    this.gridView = process(data, { group: this.groups });
  }

  carga_inicial() {
    this.getItems(1);
    this.flotaCompleta();
  }

  rezize() {
    this.zoom = 6;
  }

  flotaCompleta() {
    this.showAllChoferes = true;
    this.showChoferesPedido = false;
    if (this.rolAdminMuvin) {
      this.getAllChoferesAdmin();
    } else if (!this.rolDador) {
      this.getAllChoferes();
    } else {
      this.getMisChoferes();
    }
  }

  actualizarPosicionChoferes_pedido() {
    this.homeService.getAllViajesPedido(this.id_pedido_temp).subscribe(
      (data) => {
        const viaj = data.data;
        viaj.forEach((viajechofer) => {
          const element = this.viajes.find(
            (chof) => chof.id === viajechofer.id
          );
          const index = this.viajes.indexOf(element);
          if (index > -1) {
            //this.Viajes[index].latitud = (Number(viajechofer.latitud) + (Math.random() -.5) / 1500) ;
            //this.Viajes[index].longitud =  (Number(viajechofer.longitud) + (Math.random() -.5) / 1500) ;
            this.viajes[index].latitud = viajechofer.latitud;
            this.viajes[index].longitud = viajechofer.longitud;
            this.viajes[index].update_at = viajechofer.update_at
              .toString()
              .substring(0, 16);
          }
        });
      },
      (err) => { }
    );

    /* this.timerchoferes_pedido = setInterval(() => {
      if (this.gridView !== undefined) {

    }, 15000); }*/
  }

  public cargar_viajes(pedido: any): void {
    this.id_pedido_temp = pedido;
    this.viajesPedido = [];
    this.viajes = [];
    this.marcadoresViaje = [];
    if (this.tipocentro !== "2") {
      this.gridView = null;
      let viajes_proceso = [];
      var currentTime: moment.Moment = moment();
      //this.loader.open();
      this.homeService.getAllViajesPedido(pedido).subscribe(
        (data) => {
          this.gridView = data.data;
          //this.viajesPedido = data.data;
          if (data.data.length > 0) {
            for (let k = 0; k < data.data.length; k++) {
              let viaje = new Viaje();
              viaje = { ...data.data[k] };
              let initialDate = moment(viaje.update_at == null ? null : viaje.update_at);
              let duration = moment.duration(currentTime.diff(initialDate));
              let hours = duration.asHours();
              if (hours >= 12) {
                viaje.icon = this.iconUrlRed;
              } else {
                viaje.icon = this.iconUrlBlue;
              }
              switch (viaje.id_estado) {
                case 1:
                  viaje.color_estado = "#615c59";
                  break;
                case 2:
                  viaje.color_estado = "#86888B";
                  break;
                case 3:
                  viaje.color_estado = "#C9CACC";
                  break;
                case 4:
                  viaje.color_estado = "A6D277";
                  break;
                case 5:
                  viaje.color_estado =
                    "rgba(111, 190, 68, 0.74)";
                  break;
                case 6:
                  viaje.color_estado = "rgb(96, 165, 59)";
                  break;
                case 7:
                  viaje.color_estado = "rgb(211, 45, 38)";
                  break;
                case 8:
                  viaje.color_estado = "#2FB34A";
                  break;
                case 9:
                  viaje.color_estado = "#2FB34A";
                  break;
                case 10:
                  viaje.color_estado = "#2FB34A";
                  break;
                default:
                  viaje.color_estado = "";
                  break;
              }
              let marcador = new MarcadorMapaPedido();
              marcador.nombreChofer = viaje.nombre_chofer;
              marcador.patente = viaje.patente_camion;
              marcador.telefono = viaje.telefono;
              marcador.latitud = viaje.latitud;
              marcador.longitud = viaje.longitud;
              marcador.nombreTransportista = viaje.nombre_transportista;
              marcador.updateAt = viaje.update_at;
              marcador.icon = viaje.icon;
              marcador.estado = 0;
              if (marcador.latitud !== 0 && marcador.longitud != 0 && viaje.id_estado < 9 && viaje.bloqueado == 0) {
                this.marcadoresViaje.push(marcador);
              }
              if (viaje.id_estado < 9 && viaje.bloqueado == 0) {
                viajes_proceso.push(data.data[k]);
              }
              if (viaje.id_estado < 3) {
                viaje.l_carga = {
                  lat: viaje.latitud,
                  lng: viaje.longitud,
                };
                viaje.l_destino = {
                  lat: viaje.latitud_origen,
                  lng: viaje.longitud_origen,
                };
              } else {
                viaje.l_carga = {
                  lat: viaje.latitud,
                  lng: viaje.longitud,
                };
                viaje.l_destino = {
                  lat: viaje.latitud_destino,
                  lng: viaje.longitud_destino,
                };
              }
              const color = Math.floor(0x1000000 * Math.random()).toString(16);
              const hex = "#" + ("000000" + color).slice(-6);
              this.viajesPedido.push(viaje);
              this.viajesPedido[k].renderOptions = {
                suppressMarkers: true,
                polylineOptions: { strokeColor: hex },
              };
            }
          }
          if (this.loader !== null) {
            this.loader.close();
          }
          this.viajes = viajes_proceso;
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
        }
      );
    }
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  downReducir(pedido: Pedido) {
    this.showMap = false;
  }
  showMapa(pedidos: Pedido) {
    // this.condicion = false;
    this.showMap = true;
  }
  hideMapa(pedidos: Pedido) {
    // this.condicion = false;
    this.showMap = false;
  }

  showPedido(pedido) {
    this.showMap = false;
    if (this.expandedElement === null || this.expandedElement === undefined) {
      this.showPedid = true;
    } else {
      this.showPedid = false;
    }
  }

  openModulePanel(c: any) {
    if (c === this.miStep) {
      this.miStep = null;
    } else {
      this.miStep = c;
    }
  }

  circleMapRadiusChange(radius) {
    this.circleMapRadius = radius;
  }
  loadComponent(page) {
    this.dataSource = new MatTableDataSource<any>();
    if (this.tipocentro !== "2") {
      if (this.miStep !== null) {
        this.cargar_viajes(this.miStep);
      }
    }
  }
  getItems(page) {
    this.getItemSub = this.homeService.getAllPedidos(page, this.filtro)
      .subscribe(data => {
        console.log(data);

        if (page === 1)
          this.datostemp = [];
        const listpedidostemp = data.data;
        if (listpedidostemp.length === 0) {
          this.sinpedido = true;
        } else {
          this.sinpedido = false;
        }

        listpedidostemp.forEach((pedido) => {
          let temp = new PedidoAsignar();
          temp = pedido;
          let tempTooltip = " ";
          temp.background = "#2BC4F3";
          temp.tooltip = tempTooltip + "";

          // Cargar tooltip en dependencia del tipo de Pedido
          let tooltip = this.tipos_pedido.find(tooltip => tooltip.id === pedido.tipo);
          temp.tooltip = tempTooltip + `Flete ${tooltip.tipo}`;

          temp.editable = (pedido.posee_cupo_fer < pedido.cantidad) ? true : false;

          if (pedido.desvios > 0) {
            temp.background = "#D32D26";
            temp.tooltip = temp.tooltip + ", Tiene Desvíos";
          }
          if (pedido.estados.Rechazado > 0) {
            temp.background = "#D32D26";
            temp.tooltip = temp.tooltip + ", Tiene Viajes Rechazados";
          }
          if (pedido.viajes_bloqueados > 0) {
            temp.background = "#D32D26";
            temp.tooltip = tempTooltip + ", Tiene Viajes Rechazados";
          }
          if (pedido.bloqueado == 1) {
            temp.background = "#1E1E21";
            temp.tooltip = temp.tooltip + ", Está Bloqueado el Pedido";
          }

          if (pedido.reduccion > 0 && pedido.bloqueado == 0) {
            temp.background = "rgb(255, 102, 0)";
            temp.tooltip =
              tempTooltip + " Fue modificada la cantidad de este Pedido";
          }

          if (pedido.calesita == 1) {
            temp.background = "#9aba0f";
            temp.tooltip = temp.tooltip + "Pedido con marca calesita.";
          }

          if (pedido.zonaDestino === undefined || pedido.zonaDestino === null) {
            temp.zonaDestino = {
              id: 0,
              descripcion: "Lo define el cupo",
              latitud: "",
              longitud: "",
            };
          }

          const element = this.datostemp.find((ped) => ped.id === pedido.id);
          const index = this.datostemp.indexOf(element);
          if (index > -1) {
            this.datostemp[index] = temp;
          } else {
            this.datostemp.push(temp);
          }
        });

        this.cantPaginas = data._meta.pageCount;
        this.pagina = data._meta.currentPage;
      })
  }
  compararMinutos(ultima_actualizacion) {
    let ahora = new Date();
    let ultima = new Date(ultima_actualizacion);
    let ultima_fecha = ultima.setMinutes(ultima.getMinutes());
    let hace_10min = ahora.setMinutes(ahora.getMinutes() - 10);
    if (ultima_fecha - hace_10min > 0) {
      return true;
    }
    return false;
  }
  getAllChoferes() {
    this.pedidos = [];
    this.marcadores = [];

    this.getItemSub = this.nomencladoresService.getStatusMap().subscribe(
      (data) => {
        this.choferes = [];
        data.data.forEach(element => {
          let tempChofer = this.choferes.find((item) => item.id_chofer === element.id_chofer);
          if (tempChofer === undefined) {
            this.choferes.push(element);
          }
        });
        //this.choferes = data.data;
        const arraydisponibles: any[] = [];
        const arrayocupados: any[] = [];
        var currentTime: moment.Moment = moment();
        if (this.choferes.length > 0)
          this.choferes.forEach((chofer) => {
            if (
              chofer.estado === "Disponible" &&
              chofer.latitud !== 0 &&
              chofer.longitud !== 0
            ) {
              chofer.icon = '';
              let initialDate = moment(chofer.update_at == null ? null : chofer.update_at);
              let duration = moment.duration(currentTime.diff(initialDate));
              let hours = duration.asHours();
              let minutes = duration.asMinutes();
              if (hours >= 12) {
                chofer.icon = this.iconUrlRed;
              } else if (minutes >= 10) {
                chofer.icon = this.iconUrlGreenReloj;
              } else if (minutes > 0) {
                chofer.icon = this.iconUrlGreen;
              }
              arraydisponibles.push(chofer);
              if (this.compararMinutos(chofer.update_at)) {
                const element = this.choferesDisponibles.find(
                  (chof) => chof.id_chofer === chofer.id_chofer
                );
                const index = this.choferesDisponibles.indexOf(element);
                if (index > -1) {
                  this.choferesDisponibles[index].latitud = chofer.latitud;
                  this.choferesDisponibles[index].longitud = chofer.longitud;
                  this.choferesDisponibles[index].update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesDisponibles.push(chofer);
                }
              } else {
                const element = this.choferesDisponiblesReloj.find(
                  (chof) => chof.id_chofer === chofer.id_chofer
                );
                const index = this.choferesDisponiblesReloj.indexOf(element);
                if (index > -1) {
                  this.choferesDisponiblesReloj[index].latitud = chofer.latitud;
                  this.choferesDisponiblesReloj[index].longitud =
                    chofer.longitud;
                  this.choferesDisponiblesReloj[index].update_at =
                    chofer.update_at.toString().substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesDisponiblesReloj.push(chofer);
                }
              }
            }
            if (chofer.estado === "Ocupado") {
              chofer.icon = '';
              let initialDate = moment(chofer.update_at == null ? null : chofer.update_at);
              let duration = moment.duration(currentTime.diff(initialDate));
              let hours = duration.asHours();
              let minutes = duration.asMinutes();
              if (hours >= 12) {
                chofer.icon = this.iconUrlRed;
              } else if (minutes >= 10) {
                chofer.icon = this.iconUrlBlueReloj;
              } else if (minutes > 0) {
                chofer.icon = this.iconUrlBlue;
              }
              arrayocupados.push(chofer);
              if (this.compararMinutos(chofer.update_at)) {
                const element1 = this.choferesAsignados.find(
                  (chof1) => chof1.id_chofer === chofer.id_chofer
                );
                const index1 = this.choferesAsignados.indexOf(element1);
                if (index1 > -1) {
                  this.choferesAsignados[index1].latitud = chofer.latitud;
                  this.choferesAsignados[index1].longitud = chofer.longitud;
                  this.choferesAsignados[index1].update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesAsignados.push(chofer);
                  let encont = false;
                  for (let i = 0; i < this.pedidos.length; i++) {
                    if (this.pedidos[i].id === chofer.id_pedido) {
                      encont = true;
                      break;
                    }
                  }
                  if (!encont) {
                    this.pedidos.push({
                      id: chofer.id_pedido,
                      descripcion: chofer.id_pedido.toString(),
                    });
                  }
                  this.cantidadchoferesActivos++;
                  let encontrado = false;
                  this.generadores.forEach((generador) => {
                    if (generador.descripcion === chofer.nombre_generador) {
                      encontrado = true;
                    }
                  });
                  if (!encontrado) {
                    this.generadores.push({
                      descripcion: chofer.nombre_generador,
                    });
                  }
                }
              } else {
                const element1 = this.choferesAsignadosReloj.find(
                  (chof1) => chof1.id_chofer === chofer.id_chofer
                );
                const index1 = this.choferesAsignadosReloj.indexOf(element1);
                if (index1 > -1) {
                  this.choferesAsignadosReloj[index1].latitud = chofer.latitud;
                  this.choferesAsignadosReloj[index1].longitud =
                    chofer.longitud;
                  this.choferesAsignadosReloj[index1].update_at =
                    chofer.update_at.toString().substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesAsignadosReloj.push(chofer);
                  let encont = false;
                  for (let i = 0; i < this.pedidos.length; i++) {
                    if (this.pedidos[i].id === chofer.id_pedido) {
                      encont = true;
                      break;
                    }
                  }
                  if (!encont) {
                    this.pedidos.push({
                      id: chofer.id_pedido,
                      descripcion: chofer.id_pedido.toString(),
                    });
                  }
                  this.cantidadchoferesActivos++;
                  let encontrado = false;
                  this.generadores.forEach((generador) => {
                    if (generador.descripcion === chofer.nombre_generador) {
                      encontrado = true;
                    }
                  });
                  if (!encontrado) {
                    this.generadores.push({
                      descripcion: chofer.nombre_generador,
                    });
                  }
                }
              }
            }
          });
        this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
        this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados;
        this.choferesViajesReloj = this.choferesAsignadosReloj;
        arraydisponibles.forEach(element => {
          let marcador = new MarcadorMapaPedido();
          marcador.nombreChofer = element.nombre_chofer;
          marcador.patente = element.patente;
          marcador.telefono = element.telefono;
          marcador.latitud = element.latitud;
          marcador.longitud = element.longitud;
          marcador.nombreTransportista = element.nombre_transportista;
          marcador.updateAt = element.update_at;
          marcador.icon = element.icon;
          marcador.estado = 0;
          if (marcador.latitud !== 0 && marcador.longitud != 0) {
            this.marcadores.push(marcador);
          }
        });
        arrayocupados.forEach(element => {
          let marcador = new MarcadorMapaPedido();
          marcador.nombreChofer = element.nombre_chofer;
          marcador.patente = element.patente;
          marcador.telefono = element.telefono;
          marcador.latitud = element.latitud;
          marcador.longitud = element.longitud;
          marcador.nombreTransportista = element.nombre_transportista;
          marcador.updateAt = element.update_at;
          marcador.icon = element.icon;
          marcador.estado = 0;
          if (marcador.latitud !== 0 && marcador.longitud != 0) {
            this.marcadores.push(marcador);
          }
        });
        setTimeout(() => {
          this.rezize();
        }, 2000);
      },
      (err) => { }
    );
    if (this.loader !== null) {
      this.loader.close();
    }
  }
  getAllChoferesAdmin() {
    this.pedidos = [];
    var currentTime: moment.Moment = moment();
    this.getItemSub = this.nomencladoresService.getStatusMapAdmin().subscribe(
      (data) => {
        this.choferes = [];
        data.data.forEach(element => {
          let tempChofer = this.choferes.find((item) => item.id_chofer === element.id_chofer);
          if (tempChofer === undefined) {
            this.choferes.push(element);
          }
        });
        //this.choferes = data.data;
        const arraydisponibles: any[] = [];
        const arrayocupados: any[] = [];
        if (this.choferes.length > 0)
          this.choferes.forEach((chofer) => {
            if (
              chofer.estado === "Disponible" &&
              chofer.latitud !== 0 &&
              chofer.longitud !== 0
            ) {
              chofer.icon = '';
              let initialDate = moment(chofer.update_at == null ? null : chofer.update_at);
              let duration = moment.duration(currentTime.diff(initialDate));
              let hours = duration.asHours();
              let minutes = duration.asMinutes();
              if (hours >= 12) {
                chofer.icon = this.iconUrlRed;
              } else if (minutes >= 10) {
                chofer.icon = this.iconUrlGreenReloj;
              } else if (minutes > 0) {
                chofer.icon = this.iconUrlGreen;
              }
              arraydisponibles.push(chofer);
              if (this.compararMinutos(chofer.update_at)) {
                const element = this.choferesDisponibles.find(
                  (chof) => chof.id_chofer === chofer.id_chofer
                );
                const index = this.choferesDisponibles.indexOf(element);
                if (index > -1) {
                  this.choferesDisponibles[index].latitud = chofer.latitud;
                  this.choferesDisponibles[index].longitud = chofer.longitud;
                  this.choferesDisponibles[index].update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesDisponibles.push(chofer);
                }
              } else {
                const element = this.choferesDisponiblesReloj.find(
                  (chof) => chof.id_chofer === chofer.id_chofer
                );
                const index = this.choferesDisponiblesReloj.indexOf(element);
                if (index > -1) {
                  this.choferesDisponiblesReloj[index].latitud = chofer.latitud;
                  this.choferesDisponiblesReloj[index].longitud =
                    chofer.longitud;
                  this.choferesDisponiblesReloj[index].update_at =
                    chofer.update_at.toString().substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesDisponiblesReloj.push(chofer);
                }
              }
            }
            if (chofer.estado === "Ocupado") {
              arrayocupados.push(chofer);
              if (this.compararMinutos(chofer.update_at)) {
                const element1 = this.choferesAsignados.find(
                  (chof1) => chof1.id_chofer === chofer.id_chofer
                );
                const index1 = this.choferesAsignados.indexOf(element1);
                if (index1 > -1) {
                  this.choferesAsignados[index1].latitud = chofer.latitud;
                  this.choferesAsignados[index1].longitud = chofer.longitud;
                  this.choferesAsignados[index1].update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesAsignados.push(chofer);
                  let encont = false;
                  for (let i = 0; i < this.pedidos.length; i++) {
                    if (this.pedidos[i].id === chofer.id_pedido) {
                      encont = true;
                      break;
                    }
                  }
                  if (!encont) {
                    this.pedidos.push({
                      id: chofer.id_pedido,
                      descripcion: chofer.id_pedido.toString(),
                    });
                  }
                  this.cantidadchoferesActivos++;
                  let encontrado = false;
                  this.generadores.forEach((generador) => {
                    if (generador.descripcion === chofer.nombre_generador) {
                      encontrado = true;
                    }
                  });
                  if (!encontrado) {
                    this.generadores.push({
                      descripcion: chofer.nombre_generador,
                    });
                  }
                }
              } else {
                const element1 = this.choferesAsignadosReloj.find(
                  (chof1) => chof1.id_chofer === chofer.id_chofer
                );
                const index1 = this.choferesAsignadosReloj.indexOf(element1);
                if (index1 > -1) {
                  this.choferesAsignadosReloj[index1].latitud = chofer.latitud;
                  this.choferesAsignadosReloj[index1].longitud =
                    chofer.longitud;
                  this.choferesAsignadosReloj[index1].update_at =
                    chofer.update_at.toString().substring(0, 16);
                } else {
                  chofer.update_at = chofer.update_at
                    .toString()
                    .substring(0, 16);
                  this.choferesAsignadosReloj.push(chofer);
                  let encont = false;
                  for (let i = 0; i < this.pedidos.length; i++) {
                    if (this.pedidos[i].id === chofer.id_pedido) {
                      encont = true;
                      break;
                    }
                  }
                  if (!encont) {
                    this.pedidos.push({
                      id: chofer.id_pedido,
                      descripcion: chofer.id_pedido.toString(),
                    });
                  }
                  this.cantidadchoferesActivos++;
                  let encontrado = false;
                  this.generadores.forEach((generador) => {
                    if (generador.descripcion === chofer.nombre_generador) {
                      encontrado = true;
                    }
                  });
                  if (!encontrado) {
                    this.generadores.push({
                      descripcion: chofer.nombre_generador,
                    });
                  }
                }
              }
            }
          });
        this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
        this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados;
        this.choferesViajesReloj = this.choferesAsignadosReloj;
        setTimeout(() => {
          this.rezize();
        }, 2000);
      },
      (err) => { }
    );
    if (this.loader !== null) {
      this.loader.close();
    }
  }
  getMisChoferes() {
    this.choferesViajes =
      this.tempChoferesViajes =
      this.choferesAsignados =
      this.choferesAsignadosReloj =
      [];
    var currentTime: moment.Moment = moment();
    this.getItemSub = this.nomencladoresService.getMisChoferes().subscribe(
      (data) => {
        data.data.forEach((element) => {
          const cho = {
            nombre_chofer: element.nombre_chofer,
            nombre_centro: element.nombre_centro,
            id_cliente: element.id_cliente,
            id_centro: element.id_centro,
            id_producto: element.id_producto,
            id_origen: element.id_origen,
            id_viaje: element.id_viaje,
            longitud: element.longitud,
            latitud: element.latitud,
            update_at: element.update_at.toString().substring(0, 16),
            patente: element.patente_acoplado,
            nombre_transportista: element.nombre_transportista,
            telefono: element.telefono,
            id_chofer: element.id_chofer,
            icon: '',
          };
          let initialDate = moment(element.update_at == null ? null : element.update_at);
          let duration = moment.duration(currentTime.diff(initialDate));
          let hours = duration.asHours();
          let minutes = duration.asMinutes();
          if (hours >= 12) {
            cho.icon = this.iconUrlRed;
            let tempChofer = this.choferesAsignados.find((item) => item.id_chofer === cho.id_chofer);
            if (tempChofer === undefined) {
              this.choferesAsignados.push(cho);
            }
          } else if (minutes >= 10) {
            cho.icon = this.iconUrlcargaBlue;
            let tempChofer = this.choferesAsignados.find((item) => item.id_chofer === cho.id_chofer);
            if (tempChofer === undefined) {
              this.choferesAsignados.push(cho);
            }
            this.choferesAsignados.push(cho);
          } else if (minutes > 0) {
            cho.icon = this.iconUrlBlue;
            let tempChofer = this.choferesAsignadosReloj.find((item) => item.id_chofer === cho.id_chofer);
            if (tempChofer === undefined) {
              this.choferesAsignadosReloj.push(cho);
            }
          }
          /* if (this.compararMinutos(element.update_at)) {
            this.choferesAsignados.push(cho);
          } else {
            this.choferesAsignadosReloj.push(cho);
          } */
          this.cantidadchoferesActivos++;
        });
        this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados;
        this.choferesViajesReloj = this.choferesAsignadosReloj;
      },
      (err) => { }
    );
  }
  ngAfterViewInit() { }

  loadPedidoPage() {
    this.getItems(this.paginator.pageIndex);
  }

  exportAsXLSX(xpedido: any): void {
    let viaj = [];
    let array_exp = [];
    this.homeService.getAllViajesPedido(xpedido.id).subscribe((data) => {
      viaj = data.data;
      for (let i = 0; i < viaj.length; i++) {
        let exportar = {
          Dador_Carga: xpedido.nombre_cliente,
          Luagar_de_Carga: xpedido.origen.descripcion,
          Producto: xpedido.producto.descripcion,
          Fecha_Desde: xpedido.fecha_desde,
          Fecha_Hasta: xpedido.fecha_hasta,
          Zona_Destino_Pedido: xpedido.zonaDestino.descripcion,
          Separador: " ",
          Chofer: viaj[i].nombre_chofer,
          CUIT_Chofer: viaj[i].cuit_chofer,
          Patente_Camion: viaj[i].patente_camion,
          Patente_Acoplado: viaj[i].patente_acoplado,
          Empresa_Transportista: viaj[i].nombre_transportista,
          CUIT_Empresa_Transportista: viaj[i].cuit_transportista,
          Intermediario_Fletes: viaj[i].nombre_intermediario,
          CUIT_Intermediario: viaj[i].cuit_intermediario,
        };
        array_exp.push(exportar);
      }
      this.excelService.exportAsExcelFile(array_exp, "Orden de Carga");
    });
  }
  descargarCartaPorte(viaje) {
    this.http
      .get(this.globalService.apiHost + "viaje/pdf-down?id=" + viaje.id)
      .subscribe((res) => {
        return;
      });
  }

  getAds() {
    this.interval = setInterval(() => {
      this.getItems(this.pagina);
    }, 1000000);
  }
  goAsignarViaje(pedido, m = '') {
    //console.log("tipo_pedido",pedido.tipo_pedido);
    switch (pedido.tipo_pedido) {
      case 'Cereal':
        if (pedido.camiones_premio) localStorage.setItem('camiones_premio', pedido.camiones_premio);
        this.router.navigateByUrl('/panel-pedido/asignarViaje/' + pedido.id);
        break;

      case 'Retorno':  //Retorno Fertilizante
        this.router.navigateByUrl(`/home/asignarViajeFertilizantes/${pedido.id}/${m}`);
        break;

      case 'Corto':
        this.router.navigateByUrl(`/home/asignarViajeRetorno/${pedido.id}`);
        break;

      default:
        this.router.navigateByUrl(`/home/asignarViajeRetorno/${pedido.id}`);
        break;
    }

  }

  gotoRefresh() {
    this.userService
      .getIdPersonaRol(localStorage.getItem("rol"))
      .subscribe((data) => (this.idCentro = data.data));
    this.carga_inicial();
  }



  openPopReduccion(data: Pedido) {
    if (data.tiene_cupo == 0) {
      let title = "Modificar ";
      let dialogRef: MatDialogRef<any> = this.dialog.open(ReducirComponent, {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        this.nomencladoresService.postReducir(res).subscribe(
          (data) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.alertService
              .confirm({ message: "¡Modificación Realizada!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  this.carga_inicial();
                  return;
                }
              });
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService
              .confirm({
                message: "¡Error! No se puede modificar esa cantidad",
              })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          }
        );
        if (this.loader !== null) {
          this.loader.close();
        }
      });
    } else {
      let title = "Modificar ";
      let dialogRef: MatDialogRef<any> = this.dialog.open(CupoPedidoComponent, {
        width: "80vw",
        height: "95vh",
        disableClose: true,
        data: { title: title, payload: data },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.carga_inicial();
          return;
        }
        this.loader.open();

        if (this.loader !== null) {
          this.loader.close();
        }
      });
    }
  }

  openPopFecha(data: Pedido) {
    let title = "Modificar ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ExtenderFechaComponent,
      {
        width: "20vw",
        height: "35vh",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.carga_inicial();
        return;
      }
      this.loader.open();

      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }
  openPopDevolverCupos(data: any = {}) {
    let title = "Modificar ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(CupoPedidoComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();

      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  confirmViaje(data) {
    let title = "Confirmar Carga ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ConfirmCargaComponent, {
      width: "1024px",
      disableClose: true,
      data: { title: title, payload: data },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      this.nomencladoresService.postConfirmViaje(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.refreshDetalle();
          this.alertService
            .confirm({ message: "¡Confirmado el Viaje!", tipo: "exito" })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({ message: err.error.data.message + " !" });
        }
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }
  confirmViajeDestino(data, tipopedido) {
    if (tipopedido === "Cereal") {
      let title = "Confirmar Carga ";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        ConfirmCargaDestinoComponent,
        {
          width: "1024px",
          disableClose: true,
          data: { title: title, payload: data },
        }
      );

      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }

        this.loader.open();
        let datosdestino = {
          id: res.id,
          id_destino: res.id_destino.id,
        };
        this.nomencladoresService.postConfirmViaje(datosdestino).subscribe(
          (data) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.refreshDetalle();
            this.alertService
              .confirm({ message: "¡Destino actualizado!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({
              message: "¡Error, no se pudo actualizar el destino! ",
            });
          }
        );
        if (this.loader !== null) {
          this.loader.close();
        }
      });
    } else {
      let title = "Confirmar Carga Retorno";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        ConfirmCargaRetornoComponent,
        {
          width: "1024px",
          disableClose: true,
          data: { title: title, payload: data },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }

        this.loader.open();
        this.nomencladoresService.postConfirmViaje(res).subscribe(
          (data) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.refreshDetalle();
            this.alertService
              .confirm({ message: "¡Confirmado el Viaje!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({
              message: "¡Error, no se pudo confirmar el Viaje! ",
            });
          }
        );
        if (this.loader !== null) {
          this.loader.close();
        }
      });
    }
  }
  confirmViajeParametros(data) {
    let title = "Parámetros Comerciales ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ConfirmCargaParametrosComponent,
      {
        width: "1024px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      this.nomencladoresService.postConfirmViaje(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.refreshDetalle();
          this.alertService
            .confirm({
              message: "¡Actualizados Parámetros Comerciales!",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({
            message:
              "¡Error, no se pudo actualizar los Parámetros Comerciales! ",
          });
        }
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  bloquearViaje(row) {
    this.confirmService
      .confirm({
        message:
          "Está seguro de Cancelar el Viaje del chofer: " +
          row.nombre_chofer +
          "?",
      })
      .subscribe((res) => {
        if (res) {
          if (row.turneada != 0) {
            this.motivoRechazoViaje(row);
          } else {
            this.loader.open("Cancelando Viaje");
            this.nomencladoresService.updateBloquearViaje(row).subscribe(
              (data) => {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.refreshDetalle();
                this.alertService
                  .confirm({ message: "¡Viaje Cancelado!", tipo: "exito" })
                  .subscribe((res) => {
                    if (res) {
                      return;
                    }
                  });
              },
              (err) => {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.errorService.confirm({
                  message: "¡Error ocurrido al Cancelar el Viaje " + err,
                });
              }
            );
          }
        }
      });
  }

  bloquearPedido(row) {
    this.confirmService
      .confirm({
        message:
          "¡Confirmar el Bloqueo del pedido del Cargador: " +
          row.nombre_cliente +
          " con el Producto: " +
          row.producto.descripcion +
          ".",
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();
          this.nomencladoresService.postBloquearPedido(row).subscribe(
            (data) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.hideDetalle();
              this.alertService
                .confirm({ message: "¡Pedido Bloqueado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            },
            (err) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({
                message: "¡Error ocurrido al bloquear el pedido " + err,
              });
            }
          );
        }
      });
  }
  eliminarPedido(row) {
    this.nomencladoresService.evaluarCupos(row.id).subscribe(data => {
      if (data.poseeCupo) {
        this.atencionService.confirm({
          title: 'ATENCIÓN',
          class: true,
          message: 'Su solicitud ya tiene al menos un cupo asignado.<br>  Para poder eliminar la solicitud, la misma no debe poseer cupos asignados',
          label_button: 'ENTENDIDO'
        });
      } else {
        this.confirmService.confirm({ message: '¿Desea eliminar la solicitud en su totalidad? ' })
          .subscribe(res => {
            if (res) {
              this.nomencladoresService.borrarPedido(row.id)
                .subscribe(data => {
                  console.log(data);
                  this.alertService.confirm({ message: data.message, tipo: 'exito' }).subscribe(res => {
                    if (res) {
                      this.carga_inicial();
                      return;
                    }
                  });
                });
            }
          });
      }
    });

  }

  ocultarPedido(row) {
    this.confirmService
      .confirm({
        message:
          "Confirmar Ocultar el Pedido del Cargador: " +
          row.nombre_cliente +
          " con el Producto: " +
          row.producto.descripcion +
          ".",
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();
          this.nomencladoresService.postOcultarPedido(row).subscribe(
            (data) => {
              this.loader.close();
              this.hideDetalle();
              this.alertService
                .confirm({ message: "¡Pedido Ocultado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            },
            (err) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({
                message: "¡Error ocurrido al ocultado el pedido " + err,
              });
            }
          );
        }
      });
  }
  desBloquearPedido(row) {
    this.confirmService
      .confirm({
        message:
          "Confirmar el Desbloqueo del pedido del Cargador: " +
          row.nombre_cliente +
          " con el Producto: " +
          row.producto.descripcion +
          ".",
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();
          this.nomencladoresService.postDesBloquearPedido(row).subscribe(
            (data) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.refreshDetalle();
              this.alertService
                .confirm({ message: "¡Pedido Desbloqueado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            },
            (err) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({
                message: "¡Error ocurrido al desbloquear el pedido " + err,
              });
            }
          );
        }
      });
  }
  descargarViaje(row, tipopedido) {
    this.confirmService
      .confirm({
        message:
          "Confirmar que el Viaje del chofer: " +
          row.nombre_chofer +
          " está Descargado.",
      })
      .subscribe(
        (res) => {
          if (res) {
            this.loader.open();
            const datos = {
              id_viaje: row.id,
              id_estado: 9,
              id_destino: row.id_destino,
              descripcion: "Viaje descargado por panel",
            };
            this.nomencladoresService.postEstadoDescargaViaje(datos).subscribe(
              (data) => {
                let datosEstado = data.data;
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.refreshDetalle();
                this.alertService
                  .confirm({ message: "¡Viaje descargado!", tipo: "exito" })
                  .subscribe((res) => {
                    if (res) {
                      return;
                    }
                  });
                return;
              },
              (err) => {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.errorService.confirm({ message: "¡Error!:" + err });
                return;
              }
            );
            /*  this.loader.close();
           this.alertService.confirm({ message: '¡Viaje Descargado!', tipo: 'exito' }).subscribe(res => {
             if (res) {
               return;
             }
           }); */
          }
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({
            message: "¡Error ocurrido al descargar el viaje " + err,
          });
        }
      );
  }

  estadoViaje(data) {
    let title = "Actualizar Estado del Viaje ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(EstadoViajeComponent, {
      width: "1024px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      this.nomencladoresService.postConfirmViaje(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.refreshDetalle();
          this.snack.open("¡Actualizado el Viaje!", "OK", { duration: 4000 });
          return;
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService.confirm({ message: "¡Error! " + err });
        }
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }
  motivoRechazoViaje(row) {
    let title = "Actualizar Estado de Rechazo Viaje ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddRechazoViajeComponent,
      {
        width: "30vw",
        disableClose: true,
        data: { title: title, payload: row },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open("Actualizando Motivo Rechazo");
      this.nomencladoresService.updateViajeMotivoRechazo(res).subscribe(
        (response) => {
          this.loader.close();
          this.loader.open("Cancelando Viaje");
          let dat = {
            id: row.id,
            bloqueado: 1,
          };
          this.nomencladoresService.updateBloquearViaje(dat).subscribe(
            (data) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.refreshDetalle();
              this.alertService
                .confirm({ message: "¡Viaje Cancelado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            },
            (err) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({
                message: "¡Error ocurrido al Cancelar el Viaje " + err,
              });
            }
          );
        },
        (err) => {
          this.loader.close();
        }
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  desvioViaje(data, tipopedido) {
    if (tipopedido === "Cereal") {
      let title = "Desvio del Viaje ";
      let dialogRef: MatDialogRef<any> = this.dialog.open(DesvioComponent, {
        width: "1024px",
        disableClose: true,
        data: { title: title, payload: data },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.loader.open();

        this.nomencladoresService.postDesviarViaje(res).subscribe(
          (data) => {
            let conf = {
              id: res.id,
              id_estado_viaje: 3,
            };

            if (this.loader !== null) {
              this.loader.close();
            }
            this.refreshDetalle();
            this.alertService
              .confirm({ message: "¡Viaje Desviado!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
            return;
          },
          (err) => {
            if (this.loader !== null) {
              if (this.loader !== null) {
                this.loader.close();
              }
            }
            this.errorService.confirm({
              message: "¡Error! a guardar el desvio ",
            });
          }
        );
        if (this.loader !== null) {
          if (this.loader !== null) {
            this.loader.close();
          }
        }
      });
    } else {
      let title = "Desvio del Viaje de retorno ";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        DesvioRetornoComponent,
        {
          width: "1024px",
          disableClose: true,
          data: { title: title, payload: data },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        this.nomencladoresService.postDesviarViaje(res).subscribe(
          (data) => {
            let conf = {
              id: res.id,
              id_estado_viaje: 3,
            };
            if (this.loader !== null) {
              this.loader.close();
            }
            this.refreshDetalle();
            this.alertService
              .confirm({ message: "¡Viaje Desviado!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
            return;
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({
              message: "¡Error! al guardar el desvio de retorno ",
            });
          }
        );
        if (this.loader !== null) {
          this.loader.close();
        }
      });
    }
  }

  whatsapp(data) {
    let title = "Mensaje Whatsapp ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(WhatsappComponent, {
      width: "1024px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (!res) {
          return;
        }
        const newString = res.mensaje.replace("", "%20");
        window.open(
          "https://web.whatsapp.com/send?phone=+549" +
          res.telefono +
          "&text=" +
          newString,
          "_blank"
        );
        return;
      },
      (err) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService.confirm({ message: "¡Error! " + err });
      }
    );
  }

  gotoEstadoDescarga(data) {
    let title = "Resultado de la Calada del Viaje";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddEstadoDescargaComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data, isNew: true, id_viaje: data.id },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      const datos = {
        id_viaje: res.id_viaje,
        id_estado: res.id_estado_descarga,
        fecha: res.fecha,
        descripcion: res.descripcion,
        id_destino: res.id_destino,
      };
      this.nomencladoresService.postEstadoDescargaViaje(datos).subscribe(
        (data) => {
          let datosEstado = data.data;
          if (this.loader !== null) {
            this.loader.close();
          }
          if (datosEstado.id_estado === 7) {
            let dialogRef2: MatDialogRef<any> = this.dialog.open(
              AddRechazoCaladaComponent,
              {
                width: "720px",
                disableClose: true,
                data: {
                  title: "Motivo de rechazo de la calada",
                  payload: datosEstado,
                },
              }
            );
            dialogRef2.afterClosed().subscribe((res) => {
              if (!res) {
                return;
              }
              this.loader.open();
              this.nomencladoresService.postCaladaRechazada(res).subscribe(
                (data) => {
                  if (this.loader !== null) {
                    this.loader.close();
                  }
                  this.atencionService
                    .confirm({ message: "¡Viaje Rechazado!", tipo: "exito" })
                    .subscribe((res) => {
                      if (res) {
                        return;
                      }
                    });
                },
                (err) => {
                  if (this.loader !== null) {
                    this.loader.close();
                  }
                  this.errorService.confirm({ message: "¡Error! " + err });
                }
              );
            });
          } else {
            this.alertService
              .confirm({ message: "¡Calada Confirmada!", tipo: "exito" })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          }
          return;
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({ message: "¡Error!:" + err });
          return;
        }
      );
    });
  }
  goConfirmarPedido(data) {
    let idpedidoparam = data.id;
    let title = "Confirmar Pedido";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ConfirmarPedidoComponent,
      {
        width: "720px",
        height: "auto",
        disableClose: true,
        data: { title: title, payload: data, isNew: false, id_pedido: data.id },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      let datos;
      if (res.ckIntermediario) {
        if (res.selectedIntermediario > 0) {
          let datadesglose = {
            id_centro: res.id_centro,
            id_pedido: idpedidoparam,
            intermediarios: res.intermediarios,
          };
          //
          this.nomencladoresService
            .desglosarPedido(datadesglose)
            .subscribe((data) => {
              if (data.success) {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.alertService
                  .confirm({
                    message: "¡Subpedidos confirmados!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      return;
                    }
                  });
              } else {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.errorService.confirm({ message: "¡Error!:" + data.data });
              }
            });
        } else {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.atencionService.confirm({
            message: "No ha seleccionado un Intermediario",
          });
          return;
        }
      } else {
        let valoroperador = "";
        if (res.selectedOperador !== "") {
          valoroperador = res.selectedOperador;
        }
        datos = {
          id: res.id,
          solicitud: 0,
          id_operador: valoroperador,
        };
        this.nomencladoresService.postConfirmarPedido(datos).subscribe(
          (data) => {
            if (data.success) {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService
                .confirm({ message: "¡Pedido confirmado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    this.carga_inicial();
                    return;
                  }
                });
            } else {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({ message: "¡Error!:" + data.data });
            }
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({ message: "¡Error!:" + err });
            return;
          }
        );
      }
    });
  }
  mostrarInfo(data) {
    let title = "Información";
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoViajeComponent, {
      width: "350px",
      disableClose: true,
      data: { title: title, payload: data },
    });
  }

  isCustomizerOpen: boolean = false;

  updateFilter(event, param) {
    let val;
    if (param === "tipo") {
      val = event.value.toString().toLowerCase();
    } else {
      if (param === "fechadesde") {
        this.minDate = event.value;
        val = event.target.value.toString().toLowerCase();
      } else {
        if (param === "fechahasta") {
          this.maxDate = event.value;
          val = event.target.value.toString().toLowerCase();
        }
      }
    }
    if (param === "dadorCuit") {
      this.filtro.dadorCuit = event;
    } else {
      if (param === "tipo") {
        this.filtro.tipo = event.value;
      } else {
        val = event.target.value;
        eval("this.filtro." + param + " = val");
      }
    }

    this.datostemp = [];
    this.getItems(1);
  }

  mostrarInfoSubPedido(data) {
    let title = "Información Subpedidos";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InfoSubpedidoComponent,
      {
        width: "950px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.gotoRefresh();
    });
  }

  openPopUpsms(pedido: any = {}, isNew?) {
    this.gridView = null;
    let viajes_proceso = [];

    this.homeService.getAllViajesPedido(pedido.id).subscribe((data) => {
      this.gridView = data.data;
      if (data.data.length > 0) {
        for (let k = 0; k < data.data.length; k++) {
          if (data.data[k].id_estado < 9 && data.data[k].bloqueado == 0) {
            viajes_proceso.push(data.data[k]);
          }
        }
      }
      this.viajes = viajes_proceso;

      let title = "Mensaje SMS a Choferes";
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: "", isNew: isNew },
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        return;
      });
    });
  }

  limpiarFiltros() {
    this.filtro.origen = "";
    this.filtro.generador = "";
    this.filtro.zonadestino = "";
    this.filtro.producto = "";
    this.filtro.dador = "";
    this.filtro.contrato = "";
    this.filtro.fechadesde = "";
    this.filtro.fechahasta = "";
    this.filtro.tipo = null;
    this.filtro.pendientes_asignar = null;
    this.filtro.en_tiempo = 1;
    this.filtro.fuera_tiempo = null;
    this.filtro.pedidos_rojos = null;
    this.filtro.pedidos_cerrados = null;
    this.filtro.pedidos_difusion = null;
    this.filtro.pedidos_ocultos = null;
    this.filtroespeciales = [3];
    this.datostemp = [];
    this.getItems(1);
    /*  this.dataSource.loadPedidos(0, this.filtro);
     this.dataSource_salva = this.dataSource; */
  }

  updateFilter2(event) {
    const valores = event.value;
    //let arraytemp = [];
    //arraytemp = this.dataSource.pedidoSubject.value;
    this.filtro.pendientes_asignar = null;
    this.filtro.pedidos_rojos = null;
    this.filtro.en_tiempo = null;
    this.filtro.fuera_tiempo = null;
    this.filtro.pedidos_cerrados = null;
    this.filtro.pedidos_difusion = null;
    this.filtro.pedidos_ocultos = null;
    //this.filtroespeciales = valores;
    let arreglo = [];
    let flag = false;
    for (let i = 0; i < valores.length; i++) {
      switch (valores[i]) {
        case 1: // Pendientes por asignar
          this.filtro.pendientes_asignar = 1;
          arreglo.push(1);
          // arraytemp = this.conocerPendientesAsignar(arraytemp);
          break;
        case 2: // Pedidos en rojo
          this.filtro.pedidos_rojos = 1;
          arreglo.push(2);
          //  arraytemp = this.conocerPedidosEnRojo(arraytemp);
          break;
        case 3: // En tiempo
          if (this.valor_antiguo === 2 || this.valor_antiguo == 0) {
            this.valor_antiguo = 1;
            arreglo.push(3);
            flag = true;
            this.filtro.en_tiempo = 1;
            this.filtro.fuera_tiempo = null;
          } else {
            flag = false;
          }

          //  arraytemp = this.conocerPedidosEnTiempo(arraytemp);
          break;
        case 4: // Fuera de tiempo
          if (this.valor_antiguo === 1 && flag == false) {
            this.valor_antiguo = 2;
            arreglo.push(4);
            this.filtro.fuera_tiempo = 1;
            this.filtro.en_tiempo = null;
          }

          //  arraytemp = this.conocerPedidosFueraTiempo(arraytemp);
          break;
        case 5: // Pedidos cerrados
          arreglo.push(5);
          this.filtro.pedidos_cerrados = 1;
          break;
        case 6: // Pedidos en difusion
          arreglo.push(6);
          this.filtro.pedidos_difusion = 1;
          break;
        case 7: // Pedidos ocultos
          arreglo.push(7);
          this.filtro.pedidos_ocultos = 1;
          break;
      }
    }
    this.filtroespeciales = arreglo;
    this.datostemp = [];
    this.getItems(1);
    /*  this.dataSource.loadPedidos(0, this.filtro);
     this.dataSource_salva = this.dataSource; */
  }

  openPopUpObservaciones(pedido: any = {}) {
    let title = "Observaciones";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      PedidoObservacionesComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: pedido },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loader.open();
      this.nomencladoresService.putPedido(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.atencionService
            .confirm({ message: "¡Observaciones actualizada!", tipo: "exito" })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        },
        (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({
            message: "¡Error al actualizar las observaciones! " + err,
          });
        }
      );
    });
  }

  openPopCondicionesViaje(pedido) {
    let title = "Condiciones del viaje";
    let tipopedido = "largo";
    if (pedido.tipo === 2) {
      tipopedido = "retorno";
    } else {
      if (pedido.tipo === 3) {
        tipopedido = "corto";
      }
    }
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      CondicionesViajeComponent,
      {
        width: "720px",
        height: "95vh",
        disableClose: true,
        data: { title: title, payload: { tipopedido: tipopedido } },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.nomencladoresService
        .putPedido({
          id: pedido.id,
          difundido:
            res.selectedTipoDifusion === undefined
              ? null
              : res.selectedTipoDifusion,
        })
        .subscribe(
          (data) => {
            let condicionesviaje = res;
            condicionesviaje.id_pedido = pedido.id;
            this.nomencladoresService
              .postPedidoCondiciones(condicionesviaje)
              .subscribe(
                (data) => {
                  const vpedidoacoplados = [];
                  for (
                    let i = 0;
                    i < condicionesviaje.tipo_acoplado.length;
                    i++
                  ) {
                    vpedidoacoplados.push({
                      id_pedido: pedido.id,
                      id_tipo_acoplado: condicionesviaje.tipo_acoplado[i],
                    });
                    this.nomencladoresService
                      .postPedidoTipoAcoplado({
                        id_pedido: pedido.id,
                        id_tipo_acoplado: condicionesviaje.tipo_acoplado[i],
                      })
                      .subscribe(
                        (data1) => { },
                        (err) => { }
                      );
                  }
                  for (let i = 0; i < condicionesviaje.zona_ideal.length; i++) {
                    this.nomencladoresService
                      .postPedidoZonaIdeal({
                        id_pedido: pedido.id,
                        id_zona_ideal: condicionesviaje.zona_ideal[i],
                      })
                      .subscribe(
                        (data1) => { },
                        (err) => { }
                      );
                  }
                  this.dataSource.loadPedidos(0, this.filtro);
                },
                (err) => {
                  this.errorService
                    .confirm({
                      message:
                        "¡Las condiciones del pedido no se pudo agregar, intentelo nuevamente.",
                    })
                    .subscribe((res) => {
                      if (res) {
                        return;
                      }
                    });
                }
              );
          },
          (err) => { }
        );
    });
  }

  openPopUpCondiciones(pedido) {
    let title = "Condiciones del viaje";
    let tipopedido = "largo";
    if (pedido.tipo === 2) {
      tipopedido = "retorno";
    } else {
      if (pedido.tipo === 3) {
        tipopedido = "corto";
      }
    }
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      CondicionesViaje2Component,
      {
        width: "720px",
        height: "87vh",
        disableClose: true,
        data: {
          title: title,
          payload: {
            tipopedido: tipopedido,
            id_pedido: pedido.id,
            difundido: pedido.difundido,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }
  openPopUpTurneada(pedido) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListarListaComponent, {
      width: "420px",
      height: "27vh",
      disableClose: true,
      data: {
        title: "Seleccionar lista",
        payload: { id_tipo_turneada: this.tipoTurneada, id_pedido: pedido.id },
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        this.gotoRefresh();
        return;
      }
    });
  }


  openPopupAsignarDirecto(data: any = null, asignaCamion: number) {
    this.loader.open();
    let detalleReserva = {
      "id_cuenta_cliente": data['id_centro'],
      "id_pedido": data['id'],
      "id_origen": data['id_origen'],
      "fecha": '',
      "estado": 0
    };

    this.reservasService.detalleReservas(detalleReserva).subscribe(resp => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(AsignarDirectoComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: { title: 'title', payload: resp, isNew: 'isNew', asignaCamion, viajeConfirmado: data.viaje_confirmado }
      });
      this.loader.close();
      dialogRef.afterClosed().subscribe(res => {
        this.carga_inicial();
      });

    });
  }

  showMapaPedido(pedido) {
    this.showAllChoferes = false;
    this.showChoferesPedido = true;
    this.pedido = pedido;
    this.cargar_viajes(pedido.id);
    this.actualizarPosicionChoferes_pedido();
    if (this.timerchoferes !== undefined) {
      clearInterval(this.timerchoferes);
    }
  }

  showDetalle(pedido) {
    this.showDetallePedido = true;
    this.showMapaPedido(pedido);
  }

  hideDetalle() {
    clearInterval(this.timerchoferes_pedido);
    clearInterval(this.timerchoferes);
    this.showAllChoferes = true;
    this.showDetallePedido = false;
    this.getItems(1);
    this.flotaCompleta();
  }

  refreshDetalle() {
    this.homeService.getPedido(this.pedido.id).subscribe(
      (data) => {
        if (data.data.length == 0) {
          this.snack.open("Pedido completado", "Ok", {
            duration: 2000,
          });
          this.hideDetalle();
        } else {
          this.pedido = data.data[0];
          this.pedido.title_background = '';
          this.pedido.background = "#9aba0f";
          this.pedido.title_background = "#555658";
          this.pedido.tooltip = this.pedido.tooltip + '';

          if (this.pedido.desvios > 0) {
            this.pedido.background = "#D32D26";
            this.pedido.tooltip = this.pedido.tooltip + '. Tiene Desvíos.';
          };
          if (this.pedido.estados.Rechazado > 0) {
            this.pedido.background = "#D32D26";
            this.pedido.tooltip = this.pedido.tooltip + '. Tiene Viajes Rechazados.';
          };
          if (this.pedido.viajes_bloqueados > 0) {
            this.pedido.background = "#D32D26";
            this.pedido.tooltip = this.pedido.tooltip + '. Tiene Viajes Rechazados.';
          }
          if (this.pedido.bloqueado == 1) {
            this.pedido.background = "#1E1E21";
            this.pedido.tooltip = this.pedido.tooltip + '. Está Bloqueado el Pedido.';
          };
          if (this.pedido.calesita == 1) {
            this.pedido.background = "#9aba0f";
            this.pedido.tooltip = this.pedido.tooltip + '. Pedido con marca calesita.';
          }

          if (this.pedido.reduccion != 0 && this.pedido.bloqueado == 0) {
            this.pedido.background = "rgb(36,177,220)";
            this.pedido.tooltip = this.pedido.tooltip + '. Fue modificada la cantidad de este Pedido.';
          }
          this.showDetalle(this.pedido);
        }
      },
      (err) => {
        this.hideDetalle();
      }
    );
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = "Información de la Persona";
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: "720px",
      height: "73vh",
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario_chofer } },
    });

    dialogRef.afterClosed().subscribe((res) => {
      return;
    });
  }
  openPopUpSiniestro(data: any = {}) {
    let das = data;
    let title = "Siniestros";
    let dialogRef: MatDialogRef<any> = this.dialog.open(SiniestroComponent, {
      width: "90vw",
      height: "93vh",
      disableClose: false,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => { });
  }

  descargarArchivo(tipoArchivo, id) {
    switch (tipoArchivo) {
      case 1:
        this.getItemSub = this.nomencladoresService
          .getCheckCartaPorte(id)
          .subscribe(
            (res) => {
              window.open(this.showUrl + id, "_blank");
            },
            (err) => {
              this.errorService.confirm({
                message:
                  "¡Error, el archivo de la carta porte, no existe o presenta problemas.! ",
              });
            }
          );
        break;
      case 2:
        this.getItemSub = this.nomencladoresService
          .getCheckSeguro(id)
          .subscribe(
            (res) => {
              window.open(this.showUrlSeguro + id, "_blank");
            },
            (err) => {
              this.errorService.confirm({
                message:
                  "¡Error, el archivo del seguro, no existe o presenta problemas! ",
              });
            }
          );
        break;
      default:
        break;
    }
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight; // espacio que se ha hecho scroll
    const tableScrollHeight = e.target.scrollHeight; // tamaño total de la capa para hacer scroll
    const scrollLocation = e.target.scrollTop; // tope del scroll de la capa

    const buffer = 2;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    this.position.forEach((array_pos) => {
      if (scrollLocation < array_pos.scroll_location && array_pos.up === 0) {
        const element = this.position.find(
          (pos) => pos.scroll_location === array_pos.scroll_location
        );
        const index = this.position.indexOf(element);
        if (index > -1) {
          this.position[index].up = 1;
        }
        this.getItems(array_pos.page);
      }

      if (scrollLocation > array_pos.scroll_location && array_pos.up === 1) {
        const element = this.position.find(
          (pos) => pos.scroll_location === array_pos.scroll_location
        );
        const index = this.position.indexOf(element);
        if (index > -1) {
          this.position[index].up = 0;
        }
        this.getItems(array_pos.page);
      }
    });

    if (scrollLocation > limit) {
      if (this.pagina + 1 <= this.cantPaginas) {
        this.pagina++;
        this.getItems(this.pagina);

        const position = {
          page: this.pagina,
          scroll_location: limit,
          up: 0,
        };
        this.position.push(position);
      } else {
      }
    }
  }

  openPopUpSeleccionarPedido(data: any = {}) {
    let title = "Seleccionar ";
    let tipoPedido = 0;
    //this.busqueda=data;
    let dialogRef: MatDialogRef<any> = this.dialog.open(SeleccionarPedidoComponent, {
      width: '500px',
      height: '350px',
      disableClose: false,
      data: { title: title, payload: data, tipoPedido: tipoPedido }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      // this.loader.open();
      let rol: string = localStorage.getItem("rol");
      let cliente: string = localStorage.getItem("clienteMuvin");
      if (rol === "1") {
        this.showCentro = true;
        this.rolAdminMuvin = true;
      }
      if (rol === "5") {
        this.showDador = true;
      }
      if (rol === "3" || rol === "11") {
        if (cliente === "0") {
          this.escliente = true;
        }
      }
      if (rol === "11") {
        this.esOperador = true;
      }

      if (res.tipoPedido != undefined) {
        switch (res.tipoPedido) {
          case 1:
            if (this.showDador)
              this.gotoAddPedidoDador()
            else
              this.gotoAddPedido();
            break;
          case 2:
            if (this.showDador)
              this.gotoAddPedidoRetornoDador()
            else
              this.gotoAddPedidoRetorno();
            break;
          case 3:
            this.gotoAddPedidoCorto();
            break;
          /* Fertilizantes */
          case 4:
            this.gotoAddFertilizantes();
            break;
          default:
            this.gotoAddPedido();
            break;
        }
      }
    });
  }


  gotoAddPedido() {
    let title = "Agregar Pedido";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoComponent, {
      width: "720px",
      height: "95vh",
      disableClose: true,
      data: { title: title },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }

  gotoAddFertilizantes() {
    let title = 'GENERA SOLICITUD DE RESERVA';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoFertilizantesComponent, {
      width: '80%',
      height: '90%',
      disableClose: true,
      data: { title: title }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.carga_inicial();
        return;
      });
  }

  editarReserva(data) {
    let detalleReserva = {
      "id_cuenta_cliente": data['id_centro'],
      "id_pedido": data['id'],
      "id_origen": data['id_origen'],
      "fecha": '',
      "estado": 0
    };

    this.reservasService.detalleReservas(detalleReserva).subscribe(resp => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(EditPedidoFertilizantesComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: { payload: resp, editable: data['editable'] }
      });

      dialogRef.afterClosed().subscribe(res => {
        this.carga_inicial();
      });
    });
  }

  gotoAddPedidoRetorno() {
    let title = "Agregar Pedido Retorno";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoRetornoComponent,
      {
        width: "720px",
        height: "95vh",
        disableClose: true,
        data: { title: title },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }
  gotoAddPedidoCorto() {
    let title = "Agregar Pedido Corto";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoCortoComponent,
      {
        width: "720px",
        height: "95vh",
        disableClose: true,
        data: { title: title },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }

  gotoAddPedidoDador() {
    let title = "Agregar Pedido Cargador";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoDadorComponent,
      {
        width: "720px",
        height: "95vh",
        disableClose: true,
        data: { title: title },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }

  gotoAddPedidoRetornoDador() {
    let title = "Agregar Pedido Retorno";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoDadorRetornoComponent,
      {
        width: "720px",
        height: "63vh",
        disableClose: true,
        data: { title: title },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }
  gotoAddPedidoRetornoDadorCorto() {
    let title = "Agregar Pedido Corto";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoDadorCortoComponent,
      {
        width: "720px",
        height: "95vh",
        disableClose: true,
        data: { title: title },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.carga_inicial();
      return;
    });
  }
  addChoferesListaDisponibles(id_pedido) {
    let title = "Seleccionar Choferes en la Lista ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ListaChoferesComponent,
      {
        width: "80vw",
        height: "88vh",
        disableClose: true,
        data: { title: title, payload: { id_pedido: id_pedido } },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }

      return;
    });
  }
}
