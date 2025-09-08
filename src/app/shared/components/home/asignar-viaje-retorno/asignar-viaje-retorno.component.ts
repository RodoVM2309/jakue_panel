import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { egretAnimations } from '../../../animations/egret-animations';
import {
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MatSidenav
} from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { NomencladoresService } from '../../../services/nomencladores.service';
import { CentrosService } from '../../../services/centros.service';
import { Pedido } from '../../../models/pedido';
import { PedidoModel } from '../../../models/pedidoModel';
import { ChoferPremium } from '../../../models/chofer-premium';
import { Chofer } from '../../../models/chofer';
import { Viaje } from '../../../models/viaje';
import { Destino } from '../../../models/destino';
import { Entregador } from '../../../models/entregador';
import { TipoCamion } from '../../../models/tipo-camion';
import { ZonaDestino } from '../../../models/zona-destino';
import { Centro, CentroTransporte, CentroIntermediario,
  TransportistaPostulado } from './../../../models/centro';
import { Notificacion } from "../../../models/notificacion";
import { SendsmsService } from '../../../services/sendsms.service';
import { ZonasService } from '../../../services/zonas.service';
import { AddSmsRetornoComponent } from '../asignar-viaje-retorno/add-sms-retorno/add-sms-retorno.component';
import { ZonasDestino } from '../../../../views/admin/destinos/add-destino/add-destino.component';

import { AppErrorService } from '../../../services/app-error/app-error.service';
import { AppAtencionService } from '../../../services/app-atencion/app-atencion.service';

import * as hopscotch from 'hopscotch';
import { isUndefined } from 'util';
import { UserService } from 'app/shared/services/user.service';
import { AsignarReservaComponent } from './asignar-reserva/asignar-reserva.component';
import { ReservasService } from 'app/shared/services/reservas.service';

export interface MostrarPostulados {
  value: number;
  viewValue: string;
}
export interface MostrarDisponiblesPremium {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-asignar-viaje-retorno',
  templateUrl: './asignar-viaje-retorno.component.html',
  styleUrls: ['./asignar-viaje-retorno.component.scss'],
  animations: egretAnimations
})


export class AsignarViajeRetornoComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  isSidenavOpen: Boolean = true;
  @ViewChild(MatSidenav) public sideNav: MatSidenav;
  addViajeForm: FormGroup;
  idParam: string = '';
  tipoForm: string = '';
  pedido: Pedido;
  public pedido2: PedidoModel;
  public choferesDisponibles: Chofer[];
  public camionesPremium: ChoferPremium[];
  public tempChoferesDisponibles: Chofer[];
  public tempChoferesDisponiblesFiltrado: Chofer[];
  public tempCamionesPremiumDisponibles: ChoferPremium[];
  public choferesViajes: Viaje[];
  public tempChoferesViajes: Viaje[];
  public tempViajes = [];
  public destinos: Destino[];
  public entregadores: Entregador[];
  public tiposCamiones: TipoCamion[];
  public centrosTrans: CentroTransporte[];
  public transportistasPostulados: TransportistaPostulado[];
  public centrosIntermediario: CentroIntermediario[];
  public zonas: ZonasDestino[];
  public getItemSub: Subscription;
  cantidadAsignados = 0;
  cantidadAsignadosPropios = 0;
  cantidadAsignadosTemp = 0;
  pedidoId = 0;
  pedidoOrigen: string = '';
  pedidoZona: string = '';
  pedidoDestino: string = '';
  pedidoDador: string = '';
  pedidoProducto: string = '';
  pedidoDestinatario = '';
  pedidoFechaDesde: string = '';
  pedidoFechaHasta: string = '';
  cantidad = 0;
  showMap = true;
  selected = 0;
  //Map
  zoom = 7;
  mapCenter = {
    lng: 0,
    lat: 0
  };
  previous;
  seleccionados = [];
  llamar = false;
  circleMapRadius = 50000;
  rows = [];
  columns = [];
  temp = [];
  tempCamionesPremium = [];
  showMarketDisponible = true;
  showMarketAsignados = false;
  showAllMarket = false;
  showNewDatos = false;
  showFilter = false;
  public iconUrlGreen = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png";
  public iconUrlGreenPremium = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenP.png";
  public iconUrlYellow = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
  public iconUrlYellowPremium = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellowP.png";
  public iconUrlBlue = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png";
  public iconUrlRed = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";

  public iconUrlcarga =
    "http://maps.google.com/mapfiles/ms/micons/ylw-pushpin.png";
  selectedFilterTipoCamion: any;
  selectedFilterZona: any;
  selectedFilterEmpTrans: any;
  selectedFilterEmpTransPostulados: any;
  selectedFilterIntermediario: any;
  selectedFilterPostulados: any;
  selectFilterDisponiblesPremium: any;
  selectedFilterInteresados: any;
  selectedFilterkm = 100;
  selectedChoferesApp: any;
  inicializadorvacio = {
    value: 'NO'
  };
  inicializadorvacioKm = {
    value: 0
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Choferes Disponibles que cumplan los filtros</span>
      </div>
    `
  };
  starList: boolean[] = [true, true, true, true, true];
  rating: number;
  color = 'accent';
  checkedPostulados = false;
  disabled = false;
  configCentro = {
    horas: 0,
    km: 0,
    condicionesViaje: 0
  };
  condicionesViajePedido = 0;
  mostrarPostulados: MostrarPostulados[] = [
    { value: -1, viewValue: 'Todos' },
    { value: 0, viewValue: 'Si' },
    { value: 1, viewValue: 'No' }
  ];
  mostrarDisponiblesPremium: MostrarDisponiblesPremium[] = [
    { value: -1, viewValue: 'Todos' },
    { value: 0, viewValue: 'Choferes centro' },
    { value: 1, viewValue: 'Choferes premium' },
    { value: 2, viewValue: 'Choferes libres' }
  ];
  mostrarInteresados: MostrarPostulados[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Si" },
    { value: 1, viewValue: "No" },
    { value: 2, viewValue: "Sin responder" }
  ];
  mostrarChoferesApp: MostrarPostulados[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Sin App" },
    { value: 1, viewValue: "Con App" }
  ];
  etiquetaTable = 'Choferes Disponibles';
  isBusqueda = false;
  isFiltrado = false;
  tipocentro: any;
  filtroReserva = new Array();
  idPedido: number;
  m:string = '';
  idCentro: string = '';
  rolDador = false;
  constructor(private router: Router, private route: ActivatedRoute,
    private nomecladoresServices: NomencladoresService,
    private snack: MatSnackBar, private centroService: CentrosService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private confirmService: AppConfirmService, private alertService: AppAlertService,
    public zonasService: ZonasService, private loader: AppLoaderService,
    private dialog: MatDialog,
    private smsService: SendsmsService,
    private userService: UserService,private reservasService:ReservasService) { }

  ngOnInit() {

    this.idPedido = this.route.snapshot.params['id'];
    this.m        = this.route.snapshot.params['m'];

    this.tipocentro = localStorage.getItem('clienteMuvin');
    this.addViajeForm = new FormGroup({
      selectedDestino: new FormControl('', [Validators.required]),
      selectedEntregador: new FormControl('', [Validators.required])
    });
    this.idParam = this.route.snapshot.params['id'];
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => {

      this.idCentro = data.data;
    });
    let rol: string = localStorage.getItem('rol');
    if (rol == '5') {
      this.rolDador = true;
    }
    this.columns = this.getDataConf();
    this.getItemPedido();
    this.getChoferesDisponibles();
    this.getChoferesAsignados();
    this.getItemsTiposCamion();
    this.getItemsEmpresasTrans();
    this.getItemsTransPostulados();
    this.getItemsZonas();
    this.getItemsIntemediarios();
    if (this.tipocentro == "2") {
      this.selectedFilterPostulados=0;
      this.chanceSelectTipo(this.selectedFilterkm);
    }
    this.selectedChoferesApp = -1;


  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    hopscotch.endTour(true);
  }

  clickedMarker(infowindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;
 }

 openPopupAsignarReserva(data:any = null) {
  this.loader.open();
  let detalleReserva = {
    "id_cuenta_cliente": this.pedido['id_centro'],
    "id_pedido"        : this.pedido['id'],
    "id_origen"        : this.pedido['id_origen'],
    "fecha"            : '',
    "estado"           : 0
  };
  this.reservasService.detalleReservas(detalleReserva).subscribe( resp => {
    let dialogRef: MatDialogRef<any> = this.dialog.open(AsignarReservaComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { title: 'title', payload: resp, isNew: 'isNew', filtroReserva: this.filtroReserva }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.filtroReserva.push(res);
        data.reserva    = res;
        data.id_reserva = res['id_reserva_real'];
        data.id_pedido  = this.pedido['id'];
      });
      this.loader.close();
  });





}
  total() {
    let contador = 0;
    contador = this.cantidadAsignadosTemp + this.cantidadAsignadosPropios;
    return contador;
  }

  tourSteps(): any {
    const self = this;
    return {
      id: 'demo-tour',
      showPrevButton: true,
      onEnd: function () {
        this.self.snack.open('Listo! Ahora puedes asignar Viajes', 'Ok', { duration: 3000 });
      },
      onClose: function () {
        this.self.snack.open('Se ha Cancelado el Tutorial!', 'Ok', { duration: 3000 });
      },
      i18n: {
        nextBtn: 'Siguiente',
        prevBtn: 'Anterior',
        doneBtn: 'Listo Comenzar!!'
      },
      steps: [
        {
          title: 'Información del Pedido',
          content: 'Se puede ver toda la información del pedido al que se le va a asignar viajes.',
          target: 'infoviaje', // Element ID
          placement: 'left',
          xOffset: 10
        },
        {
          title: 'Filtros de choferes disponibles',
          content: 'Podes combinar varios filtros y se verán reflejados en el mapa y en el listado de Choferes Disponibles.',
          target: 'filtros', // Element ID
          placement: 'right',
          xOffset: 10
        },
        {
          title: 'Filtro de KM de choferes disponibles',
          content: 'Se debe desplazar y seleccionar a cuantos KM del Lugar de Carga se quieren ver los choferes disponibles, automaticamente se verá reflejado en el mapa, este filtro puede estar combinado con los filtros principales.',
          target: 'filtroskm', // Element ID
          placement: 'right',
          xOffset: 10
        },
        {
          title: 'Ubicación de Choferes',
          content: 'En el mapa se verán ubicados todos los choferes disponibles que cumplan con los filtros aplicados.',
          target: 'mapa', // Element ID tabladisponibles
          placement: 'right',
          xOffset: 10
        },
        {
          title: 'Listado de Choferes Disponibles',
          content: 'Listado con los datos mas importantes de los choferes disponibles que aplican a los filtros.',
          target: 'tabladisponibles', // Element ID
          placement: 'left',
          xOffset: 10
        },
        {
          title: 'Buscador de Choferes Disponibles',
          content: 'Se puede buscar un chofere disponible particular.',
          target: 'buscador', // Element ID
          placement: 'left',
          xOffset: 10
        },
        {
          title: 'Listado de Choferes Seleccionado',
          content: 'Listado de Choferes seleccionados, una vez asignado se puede desasignar antes de guardar la asignación de viajes.',
          target: 'tablaseleccionados', // Element ID
          placement: 'left',
          xOffset: 10
        }
      ]
    };
  }
  startTour() {
    hopscotch.endTour(true);
    hopscotch.startTour(this.tourSteps());
  }

  onSelect({ selected }) {
    this.seleccionados = [];
    if (selected.length > 0) {
      this.llamar = true;
    } else {
      this.llamar = false;
    }
    this.seleccionados.splice(0, this.seleccionados.length);
    this.seleccionados.push(...selected);
  }

  onActivate(event) {
  }

  add() {
    this.seleccionados.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.seleccionados = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.seleccionados = [];
  }

  openPopUpwhatsapp(data: any = {}, isNew?) {
    let title = 'Mensaje Whatsapp al Chofer';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://web.whatsapp.com/send?phone=+549" + res.celular + "&text=" + newString, "_blank");
      });
  }

  openPopUpsms(data: any = {}, isNew?) {
    const title = 'Mensaje SMS a Choferes';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        return;

      });
  }

  getItemPedido() {
    this.getItemSub = this.nomecladoresServices.getPedido(this.idPedido,this.m)
      .subscribe(data => {
        this.pedido = data.data;
        this.pedidoId = data.data.id;
        this.cantidad = data.data.viajes_mios;
        this.pedidoOrigen = data.data.origen.descripcion;
        this.pedidoZona = 'Sin Zona Destino';
        this.pedidoDador = data.data.nombre_cliente;
        this.pedidoProducto = data.data.producto.descripcion;
        this.pedidoDestino = data.data.destino.descripcion;
        this.pedidoFechaDesde = data.data.fecha_desde;
        this.pedidoFechaHasta = data.data.fecha_hasta;
        this.mapCenter.lat = data.data.origen.latitud;
        this.mapCenter.lng = data.data.origen.longitud;
        this.cantidadAsignados = parseInt(data.data.viajes_asignados);
        this.cantidadAsignadosPropios = parseInt(data.data.viajes_asignados_propios);
        this.condicionesViajePedido = data.data.difundido != undefined ?data.data.difundido:0;
        this.tipoForm = '1';
        if (data.data.bloqueado != 1 &&
          data.data.centro == this.idCentro &&
          data.data.solicitud == 0 &&
          !this.rolDador &&
          data.data.cantidad - data.data.viajes_asignados + data.data.reduccion > 0 &&
          data.data.cant_camiones_disponibles + data.data.cant_camiones_premio > 0
        ) {
          this.tipoForm = '0';
          this.getConfiguracion();
        }
        this.centroService.getBusquedaPedido(this.pedidoId)
          .subscribe(data => {
            if (data.data.length > 0)
              this.isBusqueda = true;
          });
      }), err => {


      };
  }
  getConfiguracion() {
    this.getItemSub = this.nomecladoresServices
      .getConfiguracionCentro()
      .subscribe(data => {
        this.configCentro.horas = data.data.horas;
        this.configCentro.km = data.data.km;
        this.configCentro.condicionesViaje = (data.data.condiciones_viaje === undefined ? 0 : data.data.condiciones_viaje);
        this.selectedFilterkm = data.data.km;
      }), err => {
      };
  }
  getChoferesDisponibles() {
    const camiones = [];
    this.choferesDisponibles = [];
    var choferTemp: Chofer;
    this.getItemSub = this.nomecladoresServices
      .getCamionesDisponible(this.idPedido,this.m) //Envio la bandera Fertilizantes
      .subscribe(data => {

        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id_equipo !== null) {
            const starListIni: boolean[] = [false, false, false, false, false];
            choferTemp = data.data[i];
            for (let index = 0; index < 4; index++) {
              if (index < data.data[i].evaluacion) {
                starListIni[index] = true;
              }
            }
            choferTemp.starList = starListIni;
            choferTemp.esPremium = 0;
            choferTemp.appInstalada = data.data[i].latitud == 0 && data.data[i].longitud == 0 ? 0 : 1;
            if (choferTemp.postulado === 1) {
              this.choferesDisponibles.push(choferTemp);
              if (this.condicionesViajePedido > 0)
              this.selectedFilterPostulados = 0;
            }
            else {
              if (this.tipocentro !== "2") {
                this.choferesDisponibles.push(choferTemp);
              }
            }
          }
        }
        this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
        this.tempChoferesDisponibles = [...this.tempChoferesDisponibles];
        this.choferesDisponibles = [...this.choferesDisponibles];
        this.getItemSub = this.nomecladoresServices
          .getCamionesPremios(this.route.snapshot.params["id"])
          .subscribe(data => {
            if (data.data.choferes_postulados.length > 0) {
              for (let i = 0; i < data.data.choferes_postulados.length; i++) {
                choferTemp = new Chofer();
                choferTemp = data.data.choferes_postulados[i];
                choferTemp.nombre_persona =
                  data.data.choferes_postulados[i].nombre_persona;
                choferTemp.longitud = data.data.choferes_postulados[i].longitud;
                choferTemp.latitud = data.data.choferes_postulados[i].latitud;
                choferTemp.appInstalada = data.data.choferes_postulados[i].latitud == 0 && data.data.choferes_postulados[i].longitud == 0 ? 0 : 1;
                choferTemp.id_chofer_equipo =
                  data.data.choferes_postulados[i].id_chofer_equipo;
                choferTemp.patente = data.data.choferes_postulados[i].patente;
                choferTemp.distancia =
                  parseFloat(data.data.choferes_postulados[i].distancia) > 0
                    ? parseFloat(data.data.choferes_postulados[i].distancia)
                    : 0;
                choferTemp.id_transportista =
                  data.data.choferes_postulados[i].id_transportista;
                choferTemp.nombre_transportista =
                  data.data.choferes_postulados[i].nombre_transportista;
                choferTemp.intermediario_transportista =
                  data.data.choferes_postulados[i].nombre_intermediario;
                choferTemp.celular = data.data.choferes_postulados[i].celular;
                choferTemp.evaluacion =
                  data.data.choferes_postulados[i].evaluacion != null
                    ? parseFloat(data.data.choferes_postulados[i].evaluacion)
                    : 0;
                choferTemp.porciento_cumplimiento = parseFloat(
                  data.data.choferes_postulados[i].porciento_cumplimiento
                );
                choferTemp.tipo_acoplado =
                  data.data.choferes_postulados[i].tipo_acoplado;
                choferTemp.id_tipo_acoplado =
                  data.data.choferes_postulados[i].id_tipo_acoplado;
                choferTemp.patente_acoplado =
                  data.data.choferes_postulados[i].patente_acoplado;
                choferTemp.por_inteligencia =
                  data.data.choferes_postulados[i].por_inteligencia;
                choferTemp.id_usuario =
                  data.data.choferes_postulados[i].id_usuario;
                choferTemp.postulado =
                  data.data.choferes_postulados[i].postulado;
                choferTemp.interesado =
                  data.data.choferes_postulados[i].interesado;
                choferTemp.time_last_update =
                  data.data.choferes_postulados[i].time_last_update;
                choferTemp.vencimiento_licencia =
                  data.data.choferes_postulados[i].vencimiento_licencia;
                choferTemp.movil_key =
                  data.data.choferes_postulados[i].movil_key;
                choferTemp.esPremium = 1;
                choferTemp.verificado = parseInt(
                  data.data.choferes_postulados[i].verificado
                );
                choferTemp.chofer_equipo_bloqueado = parseInt(
                  data.data.choferes_postulados[i].chofer_equipo_bloqueado
                );
                if (this.condicionesViajePedido > 0)
                    this.selectedFilterPostulados = 0;
                this.choferesDisponibles.push(choferTemp);
              }
            }
            for (let i = 0; i < data.data.camiones_premio.length; i++) {
              if (data.data.camiones_premio[i].id_chofer !== null) {
                choferTemp = new Chofer();
                choferTemp.nombre_persona =
                  data.data.camiones_premio[i].nombre_persona;
                choferTemp.longitud = data.data.camiones_premio[i].longitud;
                choferTemp.latitud = data.data.camiones_premio[i].latitud;
                choferTemp.appInstalada = data.data.camiones_premio[i].latitud == 0 && data.data.camiones_premio[i].longitud == 0 ? 0 : 1;
                choferTemp.id_chofer_equipo =
                  data.data.camiones_premio[i].id_chofer_equipo;
                choferTemp.patente = data.data.camiones_premio[i].patente;
                choferTemp.distancia = data.data.camiones_premio[i].distancia;
                choferTemp.id_transportista =
                  data.data.camiones_premio[i].id_transporte;
                choferTemp.nombre_transportista =
                  data.data.camiones_premio[i].nombre_transportista;
                choferTemp.intermediario_transportista =
                  data.data.camiones_premio[i].nombre_intermediario;
                choferTemp.celular = data.data.camiones_premio[i].celular;
                choferTemp.evaluacion =
                  data.data.camiones_premio[i].evaluacion != null
                    ? parseFloat(data.data.camiones_premio[i].evaluacion)
                    : 0;
                choferTemp.porciento_cumplimiento = parseFloat(
                  data.data.camiones_premio[i].porciento_cumplimiento
                );
                choferTemp.tipo_acoplado =
                  data.data.camiones_premio[i].tipo_acoplado;
                choferTemp.id_tipo_acoplado =
                  data.data.camiones_premio[i].id_tipo_acoplado;
                choferTemp.patente_acoplado =
                  data.data.camiones_premio[i].patente_acoplado;
                choferTemp.por_inteligencia =
                  data.data.camiones_premio[i].por_inteligencia;
                choferTemp.id_usuario = data.data.camiones_premio[i].id_chofer;
                choferTemp.postulado = data.data.camiones_premio[i].postulado;
                choferTemp.interesado = data.data.camiones_premio[i].interesado;
                choferTemp.time_last_update =
                  data.data.camiones_premio[i].time_last_update;
                choferTemp.vencimiento_licencia =
                  data.data.camiones_premio[i].vencimiento_licencia;
                choferTemp.movil_key = data.data.camiones_premio[i].movil_key;
                choferTemp.esPremium = 1;
                choferTemp.verificado = parseInt(
                  data.data.camiones_premio[i].verificado
                );
                choferTemp.chofer_equipo_bloqueado = parseInt(
                  data.data.camiones_premio[i].chofer_equipo_bloqueado
                );
                if (choferTemp.postulado === 1) {
                  this.choferesDisponibles.push(choferTemp);
                  if (this.condicionesViajePedido > 0)
                    this.selectedFilterPostulados = 0;
                } else {
                  if (choferTemp.time_last_update < this.configCentro.horas)
                    this.choferesDisponibles.push(choferTemp);
                }

                //camiones.push(choferTemp);
              }
              for (let i = 0; i < data.data.choferes_buscados.length; i++) {
                if (data.data.choferes_buscados[i].id_chofer !== null) {
                  choferTemp = new Chofer();
                  choferTemp.nombre_persona =
                    data.data.choferes_buscados[i].nombre_persona;
                  choferTemp.longitud = data.data.choferes_buscados[i].longitud;
                  choferTemp.latitud = data.data.choferes_buscados[i].latitud;
                  choferTemp.appInstalada = data.data.choferes_buscados[i].latitud == 0 && data.data.choferes_buscados[i].longitud == 0 ? 0 : 1;
                  choferTemp.id_chofer_equipo =
                    data.data.choferes_buscados[i].id_chofer_equipo;
                  choferTemp.patente = data.data.choferes_buscados[i].patente;
                  choferTemp.distancia = data.data.choferes_buscados[i].distancia != undefined ? data.data.choferes_buscados[i].distancia : 10;
                  choferTemp.id_transportista =
                    data.data.choferes_buscados[i].id_transporte;
                  choferTemp.nombre_transportista =
                    data.data.choferes_buscados[i].nombre_transportista;
                  choferTemp.intermediario_transportista =
                    data.data.choferes_buscados[i].nombre_intermediario;
                  choferTemp.celular = data.data.choferes_buscados[i].celular;
                  choferTemp.evaluacion =
                    data.data.choferes_buscados[i].evaluacion != null
                      ? parseFloat(data.data.choferes_buscados[i].evaluacion)
                      : 0;
                  choferTemp.porciento_cumplimiento = parseFloat(
                    data.data.choferes_buscados[i].porciento_cumplimiento
                  );
                  choferTemp.tipo_acoplado =
                    data.data.choferes_buscados[i].tipo_acoplado;
                  choferTemp.id_tipo_acoplado =
                    data.data.choferes_buscados[i].id_tipo_acoplado;
                  choferTemp.patente_acoplado =
                    data.data.choferes_buscados[i].patente_acoplado;
                  choferTemp.por_inteligencia =
                    data.data.choferes_buscados[i].por_inteligencia;
                  choferTemp.id_usuario = data.data.choferes_buscados[i].id_chofer;
                  choferTemp.postulado = data.data.choferes_buscados[i].postulado;
                  if (choferTemp.postulado === 1) {
                    if (this.condicionesViajePedido > 0)
                      this.selectedFilterPostulados = 0;
                  }
                  choferTemp.interesado = data.data.choferes_buscados[i].interesado;
                  choferTemp.time_last_update =
                    data.data.choferes_buscados[i].time_last_update;
                  choferTemp.vencimiento_licencia =
                    data.data.choferes_buscados[i].vencimiento_licencia;
                  choferTemp.movil_key = data.data.choferes_buscados[i].movil_key;
                  choferTemp.esPremium = 1;
                  choferTemp.verificado = parseInt(
                    data.data.choferes_buscados[i].verificado
                  );
                  choferTemp.chofer_equipo_bloqueado = parseInt(
                    data.data.choferes_buscados[i].chofer_equipo_bloqueado
                  );
                  this.choferesDisponibles.push(choferTemp);
                  }
                }

            }

            this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
            //this.camionesPremium = this.tempCamionesPremium = this.tempCamionesPremiumDisponibles = camiones;
            // this.chanceSelectTipo(this.selectedFilterkm);
            this.loader.close();
            this.chanceSelectTipo(this.selectedFilterkm);
          });
      }), err => {
      };

  }
  getChoferesAsignados() {
    this.getItemSub = this.nomecladoresServices.getCamionesViaje(this.idPedido)
      .subscribe(data => {

        var tempViaje: Viaje;
        this.choferesViajes = [];
        for (let i = 0; i < data.data.length; i++) {
          tempViaje = new Viaje();
          tempViaje = data.data[i];
          if (tempViaje.bloqueado != 1)
            this.choferesViajes.push(tempViaje);

        }

        this.tempChoferesViajes = this.choferesViajes;
      }), err => {
      };
  }
  getCamionesPremios() {
    const camiones = [];
    this.getItemSub = this.nomecladoresServices.getCamionesPremios(this.route.snapshot.params['id'])
      .subscribe(data => {
        for (let i = 0; i < data.data.camiones_premio.length; i++) {
          if (data.data.camiones_premio[i].id_chofer !== null) {
            camiones.push(data.data.camiones_premio[i]);
          }
        }
        for (let i = 0; i < data.data.choferes_postulados.length; i++) {
          if (data.data.choferes_postulados[i].id_chofer !== null) {
            let choferTemp = new Chofer();
            choferTemp.nombre_persona =
              data.data.choferes_postulados[i].nombre_persona;
            choferTemp.longitud = data.data.choferes_postulados[i].longitud;
            choferTemp.latitud = data.data.choferes_postulados[i].latitud;
            choferTemp.id_chofer_equipo =
              data.data.choferes_postulados[i].id_chofer_equipo;
            choferTemp.patente = data.data.camiones_premio[i].patente;
            choferTemp.distancia = data.data.camiones_premio[i].distancia;
            choferTemp.id_transportista =
              data.data.camiones_premio[i].id_transporte;
            choferTemp.nombre_transportista =
              data.data.camiones_premio[i].nombre_transportista;
            choferTemp.intermediario_transportista =
              data.data.camiones_premio[i].nombre_intermediario;
            choferTemp.celular = data.data.camiones_premio[i].celular;
            choferTemp.evaluacion =
              data.data.camiones_premio[i].evaluacion != null
                ? parseFloat(data.data.camiones_premio[i].evaluacion)
                : 0;
            choferTemp.porciento_cumplimiento = parseFloat(
              data.data.camiones_premio[i].porciento_cumplimiento
            );
            choferTemp.tipo_acoplado =
              data.data.camiones_premio[i].tipo_acoplado;
            choferTemp.id_tipo_acoplado =
              data.data.camiones_premio[i].id_tipo_acoplado;
            choferTemp.patente_acoplado =
              data.data.camiones_premio[i].patente_acoplado;
            choferTemp.por_inteligencia =
              data.data.camiones_premio[i].por_inteligencia;
            choferTemp.id_usuario = data.data.camiones_premio[i].id_chofer;
            choferTemp.postulado = data.data.camiones_premio[i].postulado;
            choferTemp.time_last_update =
              data.data.camiones_premio[i].time_last_update;
            choferTemp.vencimiento_licencia =
              data.data.camiones_premio[i].vencimiento_licencia;
            choferTemp.movil_key =
              data.data.camiones_premio[i].movil_key;
           choferTemp.esPremium = 1;
            choferTemp.verificado = parseInt(
              data.data.camiones_premio[i].verificado
            );
            if (choferTemp.time_last_update < this.configCentro.horas)
              this.choferesDisponibles.push(choferTemp);
            camiones.push(data.data.camiones_premio[i]);
          }
        }
        this.camionesPremium = this.tempCamionesPremium = this.tempCamionesPremiumDisponibles = camiones;
        // this.chanceSelectTipo(this.selectedFilterkm);
      });
  }
  getItemsDestinos() {
    this.getItemSub = this.nomecladoresServices.getAllDestinos()
      .subscribe(data => {
        this.destinos = data.data;
      }), err => {
      };
  }
  getItemsEntregadores() {
    this.getItemSub = this.nomecladoresServices.getAllEntregador()
      .subscribe(data => {
        this.entregadores = data.data;
      }), err => {
      };
  }
  getItemsTiposCamion() {
    this.tiposCamiones = [];
    this.getItemSub = this.nomecladoresServices.getAllTipoAcopladosSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        };
        this.tiposCamiones.push(tipoInicial);
        data.data.tipoAcoplado.forEach(element => {
          this.tiposCamiones.push(element)
        });
      }), err => {
      };
  }
  getItemsZonas() {
    this.zonas = [];
    this.getItemSub = this.zonasService.getAllZonas()
      .subscribe(data => {
        const tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        };
        this.zonas.push(tipoInicial);
        data.data.forEach(element => {
          this.zonas.push(element)
        });
      }), err => {
      };
  }
  getItemsEmpresasTrans() {
    this.centrosTrans = [];
    this.getItemSub = this.centroService.getTransporteByIdCentroSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0,
          id_centro: 0,
          id_transporte: 0,
          cantidad_choferes: 0,
          id_intermediario: 0,
          bloqueado: 0,
          nombre_transporte: 'Sin Filtro',
          nombre_intermediario: '',
          nombre_centro: '',
          desc_bloqueado: ''
        };
        this.centrosTrans.push(tipoInicial);

        data.data.forEach(element => {
          this.centrosTrans.push(element);
        });
      }), err => {
      };
  }
  getItemsTransPostulados() {
    this.transportistasPostulados = [];
    this.getItemSub = this.centroService
      .getTransportistaPostuladoByPedido(this.idPedido,this.m)
      .subscribe(data => {
        const tipoInicial: TransportistaPostulado = {
          id: 0,
          id_rol: 0,
          id_usuario: 0,
          activo: 0,
          nombre_persona: "Sin Filtro",
          direccion_persona: " ",
          localidad_persona: " ",
          nombre_rol: "Transportista",
          cuit_persona: "",
          kmetros: null,
          horas: null
        };
        this.transportistasPostulados.push(tipoInicial);

        data.data.forEach(element => {
          this.transportistasPostulados.push(element);
        });
      }), err => {
      };
  }
  getItemsIntemediarios() {
    this.centrosIntermediario = [];
    this.getItemSub = this.centroService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0,
          id_centro: 0,
          id_transporte: 0,
          id_intermediario: 0,
          bloqueado: 0,
          nombre_transporte: '',
          nombre_intermediario: 'Sin Filtro',
          nombre_centro: '',
          desc_bloqueado: ''
        }
        this.centrosIntermediario.push(tipoInicial);
        data.data.forEach(element => {
          this.centrosIntermediario.push(element)
        });
      }), err => {
      };
  }

  chanceSelectTipo(km: any) {
    if (km.value !== undefined && km.value !== 'NO') {
      this.selectedFilterkm = km.value;
      const radio = km.value * 1000;
      this.circleMapRadius = radio;
    }
    let codcondiciones = '';
    let valorescondiciones = '';
    if (this.selectedFilterTipoCamion !== 0 && this.selectedFilterTipoCamion !== undefined) {
      codcondiciones = '1';
      valorescondiciones = this.selectedFilterTipoCamion.toString();
    }
    if (this.selectedFilterZona !== 0 && this.selectedFilterZona !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',2' : '2';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterZona.toString() : this.selectedFilterZona.toString();
    }
    if (this.selectedFilterEmpTrans !== 0 && this.selectedFilterEmpTrans !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',3' : '3';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterEmpTrans.toString() : this.selectedFilterEmpTrans.toString();
    }
    if (this.selectedFilterIntermediario !== 0 && this.selectedFilterIntermediario !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',4' : '4';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterIntermediario.toString() : this.selectedFilterIntermediario.toString();
    }
    if (this.selectedFilterPostulados !== -2 && this.selectedFilterPostulados !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',5' : '5';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterPostulados.toString() : this.selectedFilterPostulados.toString();
    }
    if (this.selectFilterDisponiblesPremium !== -2 && this.selectFilterDisponiblesPremium !== undefined) {
      switch (this.selectFilterDisponiblesPremium) {
        case -1:
          this.etiquetaTable = 'Choferes Disponibles'
          break;
        case 0:
          this.etiquetaTable = 'Choferes Disponibles'
          break;
        case 1:
          this.etiquetaTable = 'Choferes Premium'
          break;
        case 2:
          this.etiquetaTable = 'Choferes Libres'
          break;
        default:
          this.etiquetaTable = 'Choferes Disponibles'
          break;
      }
      if (this.selectFilterDisponiblesPremium !== -1) {
        codcondiciones += (codcondiciones !== '') ? ',6' : '6';
        valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectFilterDisponiblesPremium.toString() : this.selectFilterDisponiblesPremium.toString();
      }
    }
    if (this.selectedFilterInteresados !== -2 && this.selectedFilterInteresados !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',8' : '8';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterPostulados.toString() : this.selectedFilterInteresados.toString();
    }
    if (
      this.selectedFilterEmpTransPostulados !== 0 &&
      this.selectedFilterEmpTransPostulados !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",9" : "9";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterEmpTransPostulados.toString()
          : this.selectedFilterEmpTransPostulados.toString();
    }
    if (
      this.selectedChoferesApp !== -2 &&
      this.selectedChoferesApp !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",10" : "10";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedChoferesApp.toString()
          : this.selectedChoferesApp.toString();
    }
    if (codcondiciones === '') {
      codcondiciones += (codcondiciones !== '') ? ',7' : '7';
      this.choferesDisponibles = this.modificarArray(this.tempChoferesDisponibles, codcondiciones, valorescondiciones);
      this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
      //this.choferesViajes = this.modificarArray(this.choferesViajes, codcondiciones, valorescondiciones);
    } else {
      switch (this.selected) {
        case 0:
          {//analizar ambos (disponibles y asignados)
            this.choferesDisponibles = this.modificarArray(this.tempChoferesDisponibles, codcondiciones, valorescondiciones);
            /* this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
            this.choferesViajes = this.modificarArray(this.choferesViajes, codcondiciones, valorescondiciones); */
            break;
          }
        case 1: {//analizar  (disponibles)
          this.choferesDisponibles = this.modificarArray(this.tempChoferesDisponibles, codcondiciones, valorescondiciones);
          this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
        }
        case 2: {//analizar  (asignados)
          this.choferesViajes = this.modificarArray(this.choferesViajes, codcondiciones, valorescondiciones);
          break;
        }
        default:
          this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
          break;
      }
    }
  }

  modificarArray(arrayvalue, codcondiciones, valorescondiciones) {
    const arraytemp = [];
    const cod_condiciones = codcondiciones.split(',');
    const valores_condiciones = valorescondiciones.split(',');
    let cont = 0;
    let cont2;
    if (!isUndefined(arrayvalue)) {
      for (let i = 0; i < arrayvalue.length; i++) {
        cont = 0;
        cont2 = -1;
        for (let j = 0; j < cod_condiciones.length; j++) {
          cont2++;
          switch (cod_condiciones[j]) {
            case '1':
              if (arrayvalue[i].id_tipo_acoplado !== null) {
                if (arrayvalue[i].id_tipo_acoplado.toString() === valores_condiciones[cont2] && arrayvalue[i].distancia < this.selectedFilterkm)
                  cont++;
              }
              break;
            case '2':
              if (arrayvalue[i].zona_activa !== null) {
                if (arrayvalue[i].zona_activa.id.toString() === valores_condiciones[cont2] && arrayvalue[i].distancia < this.selectedFilterkm)
                  cont++;
              }
              break;
            case '3':
              if (arrayvalue[i].id_transportista !== null) {
                if (arrayvalue[i].id_transportista.toString() === valores_condiciones[cont2] && arrayvalue[i].distancia < this.selectedFilterkm)
                  cont++;
              }
              break;
            case '5':
              switch (valores_condiciones[cont2]) {
                case '0':
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].postulado === 1 )
                      cont++;
                  }
                  break;
                case '1':
                  if (arrayvalue[i].postulado !== null) {
                    if (arrayvalue[i].postulado === 0 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                default:
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].distancia < this.selectedFilterkm ||arrayvalue[i].postulado === 1)
                      cont++;
                  }
                  break;
              }
              break;
            case '6':
              switch (valores_condiciones[cont2]) {
                case '0':
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].esPremium === 0 && arrayvalue[i].verificado === 0 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                case '1':
                  if (arrayvalue[i].esPremium !== null) {
                    if (arrayvalue[i].esPremium === 1 && arrayvalue[i].verificado === 1 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                case '2':
                  if (arrayvalue[i].esPremium !== null) {
                    if (arrayvalue[i].esPremium === 1 && arrayvalue[i].verificado === 0 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                default:
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
              }
              break;
            case '7':
              if (arrayvalue[i].distancia !== null) {
                if (arrayvalue[i].distancia < this.selectedFilterkm)
                  cont++;
              }
              break;
            case '8':
              switch (valores_condiciones[cont2]) {
                case '0':
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].interesado === 1 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                case '1':
                  if (arrayvalue[i].postulado !== null) {
                    if (arrayvalue[i].interesado === 0 && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                case '2':
                  if (arrayvalue[i].postulado !== null) {
                    if (arrayvalue[i].interesado === null && arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
                default:
                  if (arrayvalue[i].distancia !== null) {
                    if (arrayvalue[i].distancia < this.selectedFilterkm)
                      cont++;
                  }
                  break;
              }
              break;
            case "9":
              if (arrayvalue[i].id_transportista !== null) {
                if (
                  arrayvalue[i].id_transportista.toString() ===
                  valores_condiciones[cont2] &&
                  arrayvalue[i].distancia < this.selectedFilterkm
                )
                  cont++;
              }
              break;
              case "10":
              switch (valores_condiciones[cont2]) {
                case "0":
                  if (
                    arrayvalue[i].appInstalada.toString() ===
                    valores_condiciones[cont2]
                  )
                    cont++;
                  break;
                case "1":
                  if (
                    arrayvalue[i].appInstalada.toString() ===
                    valores_condiciones[cont2]
                  )
                    cont++;
                  break;
                default:
                  cont++;
                  break;
              }

              break;
           default:
              if (arrayvalue[i].id_intermediario !== null) {
                if (
                  arrayvalue[i].id_intermediario.toString() ===
                  valores_condiciones[cont2] &&
                  arrayvalue[i].distancia < this.selectedFilterkm
                )
                  cont++;
              }
              break;
          }
        }
        if (cont === cod_condiciones.length)
          arraytemp.push(arrayvalue[i]);
      }
    }
    arrayvalue = arraytemp;
    this.tempChoferesDisponiblesFiltrado = arrayvalue;
    return arrayvalue;
  }


  getDataConf() {
    return [
      {
        prop: 'id'
      },
      {
        prop: 'camion',
        name: 'Camion'
      },
      {
        prop: 'tipo',
        name: 'Tipo'
      },
      {
        prop: 'distancia',
        name: 'Distancia'
      },
      {
        prop: 'zona',
        name: 'Zona'
      },
      {
        prop: 'empresa',
        name: 'Empresa'
      }
    ];
  }

  onChangePostulados() {
    this.chanceSelectTipo(this.selectedFilterkm);
  }

  closeMap() {
    this.showMap = false;
  }

  openMap() {
    this.showMap = true;
  }

  /* loadComponent() {
    this.getItemPedido();
  } */
  circleMapRadiusChange(radius) {
    this.circleMapRadius = radius;
  }
  sliderMapRadiusChange(radius) {
    const radio = radius.value * 1000;
    this.circleMapRadius = radio;
  }
  asignarCamiones() {
    for (let i = 0; i < this.seleccionados.length; i++) {
      if (this.seleccionados[i].chofer_equipo_bloqueado===0) {
        this.asignarCamion(this.seleccionados[i]);
      }
    }
    this.seleccionados=[];
  }
  asignarCamion(camion) {
    let fecha_hoy = new Date();
    let fechserv = new Date(camion.vencimiento_licencia);
    if (camion.esPremium === 1 && camion.verificado === 0)
      this.atencionService.confirm({
        message:
          "El chofer no esta verificado y por ende no se emitirá la póliza de seguro de carga correspondiente, es su responsabilidad verificar la documentación del chofer y asegurar la carga"
      });
    if (camion.verificado === 1) {
      if (fechserv < fecha_hoy) {
        this.atencionService.confirm({
          message:
            "El chofer no esta verificado y por ende no se emitirá la póliza de seguro de carga correspondiente, es su responsabilidad verificar la documentación del chofer y asegurar la carga"
        });
      } else {
        this.atencionService.confirm({
          message:
            "La carga estará asegurada a partir de que el chofer informe y escanee la carta de porte, asegúrese de que el chofer realice el proceso antes de iniciar el viaje"
        });
      }
    }
    if (this.cantidadAsignadosTemp + this.cantidadAsignadosPropios < this.cantidad) {
      this.tempViajes.push(camion);


      this.showNewDatos = true;
      this.cantidadAsignadosTemp++;
      const index = this.choferesDisponibles.indexOf(camion);

      if (index > -1) {
        this.choferesDisponibles.splice(index, 1);
        const index1 = this.temp.indexOf(camion);
        this.temp.splice(index1, 1);
        const index2 = this.tempChoferesDisponiblesFiltrado.indexOf(camion);
        this.tempChoferesDisponiblesFiltrado.splice(index2,1);

      }
      this.choferesDisponibles = [...this.choferesDisponibles];
      this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
    } else {
      this.atencionService.confirm({ message: 'Imposible Asignar Viajes. Ha llegado a su cantidad limite.' });
    }
  }
  asignarCamionCondiciones(camion) {
    let fecha_hoy = new Date();
    let fechserv = new Date(camion.vencimiento_licencia);
    if (camion.esPremium === 1 && camion.verificado === 0)
      this.atencionService.confirm({
        message:
          "El chofer no esta verificado y por ende no se emitirá la póliza de seguro de carga correspondiente, es su responsabilidad verificar la documentación del chofer y asegurar la carga"
      });
    if (camion.verificado === 1) {
      if (fechserv < fecha_hoy) {
        this.atencionService.confirm({
          message:
            "El chofer no esta verificado y por ende no se emitirá la póliza de seguro de carga correspondiente, es su responsabilidad verificar la documentación del chofer y asegurar la carga"
        });
      } else {
        this.atencionService.confirm({
          message:
            "La carga estará asegurada a partir de que el chofer informe y escanee la carta de porte, asegúrese de que el chofer realice el proceso antes de iniciar el viaje"
        });
      }
    }
    let camion2 = camion;
    if (this.cantidadAsignadosTemp + this.cantidadAsignadosPropios < this.cantidad) {
      if (camion.postulado === 1) camion.confirmado = 0;
      else camion.confirmado = 0;
      this.tempViajes.push(camion);
      this.showNewDatos = true;
      this.cantidadAsignadosTemp++;
      const index = this.choferesDisponibles.indexOf(camion);
      if (index > -1) {
        this.choferesDisponibles.splice(index, 1);
        const index1 = this.temp.indexOf(camion);
        this.temp.splice(index1, 1);
        const index2 = this.tempChoferesDisponiblesFiltrado.indexOf(camion2);
        this.tempChoferesDisponiblesFiltrado.splice(index2, 1);
      }
      this.choferesDisponibles = [...this.choferesDisponibles];
      this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
    } else {
      this.atencionService.confirm({ message: 'Imposible Asignar Viajes. Ha llegado a su cantidad límite.' });
    }
  }
  setStart(datos: any) {
    this.rating = datos + 1;
    for (var i = 0; i <= 4; i++) {
      if (i <= datos) {
        this.starList[i] = true;
      } else {
        this.starList[i] = false;
      }
    }
  }
  asignarCamionPremium(camion) {
    if (this.cantidadAsignadosTemp + this.cantidadAsignadosPropios < this.cantidad) {
      this.tempViajes.push(camion);
      this.showNewDatos = true;
      this.cantidadAsignadosTemp++;
      const index = this.camionesPremium.indexOf(camion);
      if (index > -1) {
        this.camionesPremium.splice(index, 1);
        const index1 = this.temp.indexOf(camion);
        this.temp.splice(index1, 1);
        const index2 = this.tempChoferesDisponiblesFiltrado.indexOf(camion);
        this.tempChoferesDisponiblesFiltrado.splice(index2,1);
      }
      this.camionesPremium = [...this.camionesPremium];
      this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
    } else {
      this.atencionService.confirm({ message: 'Imposible Asignar Viajes. Ha llegado a su cantidad límite.' });
    }
  }
  quitarCamion(camion) {
    let i = this.filtroReserva.findIndex(reserva => reserva['id_reserva_real'] === camion['id_reserva']);
    if (i != -1) {
      this.filtroReserva.splice(i, 1);
    }

    const element = this.choferesDisponibles.find(cam => cam.id === camion.id);
    const ind = this.choferesDisponibles.indexOf(element);
    if (ind > -1) {
      this.choferesDisponibles[ind] = camion;
    } else {
      /*  Agregar el final del array */
      this.choferesDisponibles.push(camion);
    }
    //this.temp.push(camion);
    this.tempChoferesDisponiblesFiltrado.push(camion);
    this.choferesDisponibles = [...this.choferesDisponibles];
    this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
    this.cantidadAsignadosTemp--;
    const index = this.tempViajes.indexOf(camion);
    if (index > -1) {
      this.tempViajes.splice(index, 1);
    };
    if (this.tempViajes.length === 0)
      this.showNewDatos = false;
  }
  quitarCamionPremium(camion) {
    const element = this.camionesPremium.find(cam => cam.id_chofer === camion.id);
    const ind = this.camionesPremium.indexOf(element);
    if (ind > -1) {
      this.camionesPremium[ind] = camion;
    } else {
      /*  Agregar el final del array */
      this.camionesPremium.push(camion);
    }
    this.temp.push(camion);
    this.camionesPremium = [...this.camionesPremium];
    this.cantidadAsignadosTemp--;
    const index = this.tempViajes.indexOf(camion);
    if (index > -1) {
      this.tempViajes.splice(index, 1);
    };
    if (this.tempViajes.length === 0)
      this.showNewDatos = false;
  }

  updateFilter(event) {
    let tempo = [];
    if (this.tempChoferesDisponiblesFiltrado.length>0) {
      tempo = this.tempChoferesDisponiblesFiltrado;
      const val = event.target.value.toLowerCase();
      const columns = Object.keys(tempo[0]);
      // Removes last "$$index" from "column"
      columns.splice(columns.length - 1);

        if (!columns.length)
          return;

        const rows = tempo.filter(function (d) {
          for (let i = 0; i <= columns.length; i++) {
            let column = columns[i];
            if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
              return true;
            }
          }
        });
        if (val != "") {
          this.isFiltrado = true;
          this.choferesDisponibles = rows;
        } else {
          this.isFiltrado = false;
          this.choferesDisponibles = this.tempChoferesDisponiblesFiltrado;
        }
    }
  }
  updateFilter1(event) {
    const val = event.target.value.toLowerCase();
    const columns = Object.keys(this.tempCamionesPremium[0]);
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.tempCamionesPremium.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.camionesPremium = rows;

  }
  get f() { return this.addViajeForm.controls; }

  guardarViajes() {

    this.loader.open();
    this.tempViajes.forEach(element => {
      let message = "";
      if (element.confirmado === 0)
        message = "Tenes las condiciones del viaje. Visualízalo en MuvinAPP.";
      else message = "Tenes asignado un nuevo viaje. Visualízalo en MuvinAPP.";
      if (element.movil_key != null) {
        const para = element.movil_key;
        const contenido   =   new Notificacion();
        contenido.para    = para;
        contenido.message = message;
        contenido.data = 'viaje';
        this.smsService.postNotificacion(contenido).subscribe(
          data => {
            return;
          },
          err => {
            this.atencionService
              .confirm({
                message: "No se pudo avisar al chofer por Notificación"
              })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      }
      const newViaje = new Viaje();
      newViaje.id_pedido = this.pedidoId;
      newViaje.id_chofer_equipo = element.id_chofer_equipo;
      newViaje.cupo = '';
      newViaje.carta_porte = '';
      newViaje.id_estado = 1;
      newViaje.nombre_chofer = element.nombre_persona;
      if (this.tipoForm === '0' && element.esPremium) {
        newViaje.por_inteligencia = 1;
      } else
      newViaje.por_inteligencia = 0;
      newViaje.confirmado = element.confirmado;
      this.nomecladoresServices.postViajeCamion(newViaje)
        .subscribe(data => {
        });
    });
    this.loader.close();
    this.alertService.confirm({ message: '¡Viajes Asignados Correctamente!', tipo: 'exito' }).subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/panel-pedido/pedido');
      }
    });
  }
  eliminarViaje(row) {
    this.loader.open();
    row.bloqueado = 1;
    this.nomecladoresServices.putViajeCamion(row)
      .subscribe(data => {
        this.loader.close();
        this.getChoferesDisponibles();
        this.getChoferesAsignados();
        this.alertService.confirm({ message: '¡Chofer Eliminado del Viaje!', tipo: 'exito' }).subscribe(res => {
        });
      }, err => {
        this.loader.close();
        this.atencionService.confirm({ message: 'No se pudo eliminar el Chofer del Viaje' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
  }

  getRowClass = (row) => {
    if (row.chofer_equipo_bloqueado!==0) {
      return {
        'row-color': true
      };
    }
    return {
      'row-color': false
    };
 }
  gotoHome() {
    this.router.navigateByUrl('/panel-pedido/pedido');
  }
}

