import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatSnackBar,
  MatSidenav
} from "@angular/material";

import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { GlobalService } from "../../../shared/models/global.service";

import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../shared/services/app-atencion/app-atencion.service";
import "rxjs/add/observable/of";
import {  Subscription} from "rxjs";
import { DestinatarioService } from "../../../shared/services/destinatario.service";


declare var google: any;
declare var MarkerClusterer;

export class Resumen {
  "nombre_destino": string;
  "id_destino": number;
  "nombre_producto": string;
  "id_producto": number;
  "cantidad": number;
  "latitud": number;
  "longitud": number;
}
export class Location {
  page: number;
  scroll_location: number;
  up: number;
}
export class Destino {
  id: number;
  id_localidad: number;
  descripcion: string;
  direccion: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  bloqueado: number;
  id_persona_rol: number;
  longitud: number;
  latitud: number;
  id_zona_destino: number;
  domicilio: string;
  id_tipo_destino: number;
  id_situacion_puerto: number;
  horas_atraso: number;
  CodigoPlantaOncca: number;
}
export class Chofer {
  razon_social: string;
  cuit: string;
  telefono: string;
  camion_patente: string;
  latitud: number;
  longitud: number;
}
export class MapaChoferes {
  id: number;
  producto: number;
  chofer: Chofer;
}
export class ViajeDestinatario {
  id: number;
  id_pedido: number;
  fecha: string;
  carta_porte: string;
  seguro: number;
  id_chofer: number;
  destino: Destino;
  chofer: Chofer;
  nombreEstado: string;
  nombreCentro: string;
  nombreProducto: string;
  color_estado: string;
  calada_rechazada?: any;
  bloqueado?: number;
  id_estado?: number;
  latitudOrigen?: number;
  longitudOrigen?: number;
  nombreOrigen?: string;
}
export class Clasificador {
  id: number;
  descripcion: string;
}

@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"],
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
    ]),
    egretAnimations
  ],
  providers: [DestinatarioService]
})
export class PanelComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("input") input: ElementRef;
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  resumenDestinatario: Resumen[];
  allResumenDestinatarioOnInit: Resumen[];
  resumen: Resumen;
  destinos: Clasificador[] = [];
  productos: Clasificador[] = [];
  public position: Location[] = [];
  todosChoferes: MapaChoferes[] = [];
  map: google.maps.Map;
  marcadores: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];
  destinoDetalle: Destino;
  circleMapRadius = 50000;
  zoom = 5;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  };
  public getItemSub: Subscription;
  public iconUrlGreen =
    "https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2";
  public iconUrlYellow = "http://www.google.com/mapfiles/marker_yellow.png";
  public iconUrlBlue =
    "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png";
  public iconUrlcargaYellow =
    "http://maps.google.com/mapfiles/ms/micons/ylw-pushpin.png";

  public iconUrlRed =
    "http://maps.google.com/mapfiles/ms/micons/red-pushpin.png";

  rol = localStorage.getItem("rol");

  clusterStyles = [
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50
    },
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50
    },
    {
      textColor: "black",
      url: "assets/images/muvin/marker_cluster.png",
      height: 50,
      width: 50
    }
  ];
  showAllChoferes: boolean; //Indicará si el cliente escoge mostrar todos los choferes
  showChoferes: boolean; //Indicará que cuando se escoja un pedido se muestren los choferes de este.
  showDetalles = false;
  id_destino: number = 0;
  viajesDestinatario: ViajeDestinatario[];
  activoDestino: any;
  filtro = {
    destino: 0,
    producto: 0
  };
  isSidenavOpen = true;
  isCustomizerOpen: boolean = false;
  previous;
  timerAllChoferes: any;
  timerChoferesViaje: any;
  sinpedido: boolean= false;

  constructor(
    private destinatarioService: DestinatarioService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.showAllChoferes = true;
    this.showChoferes = false;
    this.resumenDestinatario = [];
    this.todosChoferes = [];
    this.allResumenDestinatarioOnInit = [];
    this.destinoDetalle=new Destino();
    this.carga_inicial();
  }
  ngAfterViewInit() {
    //this.cargarMapa();
  }
  ngOnDestroy() {
    this.getItemSub.unsubscribe();
    clearInterval(this.timerAllChoferes);
    clearInterval(this.timerChoferesViaje);
  }
  carga_inicial() {
    //this.datostemp=[];
    this.resumenDestinatario = [];
    this.getItems(1);
    this.getAllChoferes();
    //this.FlotaCompleta()
  }
  gotoRefresh() {
    this.carga_inicial();
    //this.cargarMapa();
  }
  refreshDetalle() {
    this.cargar_viajes(this.activoDestino);
  }
  getItems(page) {
    this.getItemSub = this.destinatarioService.getResumen().subscribe(
      data => {
        this.resumenDestinatario = data.data;        
        if (this.resumenDestinatario.length === 0) {
          this.sinpedido = true;
        } else {
          this.sinpedido = false;
        }
        this.allResumenDestinatarioOnInit = this.resumenDestinatario;
        let existProducto: boolean = false;
        let existDestino: boolean = false;
        this.resumenDestinatario.forEach(element => {
          existProducto = false;
          existDestino = false;
          for (let index = 0; index < this.destinos.length; index++) {
            if (element.id_destino == this.destinos[index].id)
              existDestino = true;
          }
          for (let index = 0; index < this.productos.length; index++) {
            if (element.id_producto == this.productos[index].id)
              existProducto = true;
          }
          if (!existDestino) {
            let temp = new Clasificador();
            temp.id = element.id_destino;
            temp.descripcion = element.nombre_destino;
            this.destinos.push(temp);
          }
          if (!existProducto) {
            let temp = new Clasificador();
            temp.id = element.id_producto;
            temp.descripcion = element.nombre_producto;
            this.productos.push(temp);
          }
        });
      },
      err => {
      }
    );
  }

  getAllChoferes() {
    clearInterval(this.timerChoferesViaje);
    this.todosChoferes = [];
    this.getItemSub = this.destinatarioService.getAllChoferes().subscribe(
      data => {        
        this.todosChoferes = data.data;
        this.actualizaPosicionAllChoferes();     
      },
      err => {
      }
    );

  }


  showDetalle(row) {    
    this.showAllChoferes = false;
    this.showChoferes = true;
    this.resumen = row;
    this.showDetalles = true;
    this.cargar_viajes(row);
    this.activoDestino = row;
  }
  hideDetalle() {
    this.showAllChoferes = true;
    this.showDetalles = false;
    this.getAllChoferes();
    //this.FlotaCompleta();
  }
  public cargar_viajes(row: any): void {    
    clearInterval(this.timerAllChoferes);
    this.id_destino = row.id_destino;
    this.viajesDestinatario = [];
    let viajes = [];
    let viajes_proceso: ViajeDestinatario[] = [];
    this.destinatarioService
      .getViajes(row.id_destino, row.id_producto)
      .subscribe(
        data => {          
          viajes = data.data;
          if (viajes.length > 0) {
            this.destinoDetalle = viajes[0].destino;
            for (let k = 0; k < viajes.length; k++) {
              const tempViaje = new ViajeDestinatario();
              tempViaje.id = viajes[k].id;
              tempViaje.id_pedido = viajes[k].id_pedido;
              tempViaje.fecha = viajes[k].fecha;
              tempViaje.carta_porte = viajes[k].carta_porte;
              tempViaje.seguro = viajes[k].seguro;
              tempViaje.id_chofer = viajes[k].id_chofer;
              tempViaje.destino = viajes[k].destino;
              tempViaje.chofer = viajes[k].chofer;
              tempViaje.nombreEstado = viajes[k].nombreEstado;
              tempViaje.nombreCentro = viajes[k].nombreCentro;
              tempViaje.nombreProducto = viajes[k].nombreProducto;
              tempViaje.longitudOrigen = viajes[k].longitudOrigen;
              tempViaje.latitudOrigen = viajes[k].latitudOrigen;
              tempViaje.nombreOrigen = viajes[k].nombreOrigen;

              tempViaje.chofer.latitud = viajes[k].chofer.latitud;
              tempViaje.chofer.longitud = viajes[k].chofer.longitud;
              tempViaje.chofer.camion_patente = viajes[k].chofer.camion_patente;
              tempViaje.chofer.razon_social = viajes[k].chofer.razon_social;
              tempViaje.chofer.telefono = viajes[k].chofer.telefono;

              tempViaje.calada_rechazada = [];
              switch (viajes[k].id_estado) {
                case 1:
                  tempViaje.color_estado = "#615c59";
                  break;
                case 2:
                  tempViaje.color_estado = "#86888B";
                  break;
                case 3:
                  tempViaje.color_estado = "#C9CACC";
                  break;
                case 4:
                  tempViaje.color_estado = "A6D277";
                  break;
                case 5:
                  tempViaje.color_estado = "rgba(111, 190, 68, 0.74)";
                  break;
                case 6:
                  tempViaje.color_estado = "rgb(96, 165, 59)";
                  break;
                case 7:
                  tempViaje.color_estado = "rgb(211, 45, 38)";
                  break;
                case 8:
                  tempViaje.color_estado = "#2FB34A";
                  break;
                case 9:
                  tempViaje.color_estado = "#2FB34A";
                  break;
                case 10:
                  tempViaje.color_estado = "#2FB34A";
                  break;
                default:
                  tempViaje.color_estado = "";
                  break;
              }
              viajes_proceso.push(tempViaje);

              /* if (data.data[k].id_estado < 9 && data.data[k].bloqueado == 0) {
              viajes_proceso.push(viajes[k]);
            }; */
            }
          }

          this.viajesDestinatario = viajes_proceso;
          this.actualizaPosicionChoferesViaje(row);
          //this.agregarMarcadoresDetalles();
        },
        err => {
        }
      );
  }
  public actualizaPosicionChoferesViaje(row: any): void {
    clearInterval(this.timerAllChoferes);
    this.timerChoferesViaje = setInterval(() => {
      this.destinatarioService
        .getViajes(row.id_destino, row.id_producto)
        .subscribe(
          data => {
            if (data.data.length > 0) {
              this.destinoDetalle = data.data[0].destino;
              const choferes = data.data;
              choferes.forEach(chofer => {
                const element = this.viajesDestinatario.find(chof => chof.id === chofer.id);
                const index = this.viajesDestinatario.indexOf(element);
                if ( index > -1 ) {
                  this.viajesDestinatario[index].chofer.latitud = chofer.chofer.latitud;
                  this.viajesDestinatario[index].chofer.longitud = chofer.chofer.longitud;
                } else {
                  this.viajesDestinatario.push(chofer);
                }
              });
            }
          },
          err => {
          }
        );
    }, 15000);
  }

  public actualizaPosicionAllChoferes() {
    clearInterval(this.timerChoferesViaje);
    this.timerAllChoferes = setInterval(() => {
      this.getItemSub = this.destinatarioService.getAllChoferes()
        .subscribe(
          data => {
            if (data.data.length > 0) {
              const choferes = data.data;
              choferes.forEach(chofer => {
                const element = this.todosChoferes.find(chof => chof.id === chofer.id);
                const index = this.todosChoferes.indexOf(element);
                if ( index > -1 ) {
                  this.todosChoferes[index].chofer.latitud = chofer.chofer.latitud;
                  this.todosChoferes[index].chofer.longitud = chofer.chofer.longitud;
                } else {
                  this.todosChoferes.push(chofer);
                }
              });
            }
          },
          err => {
          }
        );
    }, 15000);
  }


  limpiarFiltros() {
    this.filtro = {
      destino: 0,
      producto: 0
    };
    this.resumenDestinatario = this.filtrar();
  }
  updateFilter(event, param) {
    let val;
    val = parseInt(event.value);
    switch (param) {
      case "destino":
        this.filtro.destino = val;
        break;
      case "producto":
        this.filtro.producto = val;
        break;
      default:
        break;
    }
    this.resumenDestinatario = this.filtrar();
  }

  filtrar() {
    let datostemp = this.allResumenDestinatarioOnInit;
    if (this.filtro.destino != 0) {
      let tempData = [];
      datostemp.forEach(element => {
        if (element.id_destino == this.filtro.destino) tempData.push(element);
      });
      datostemp = tempData;
    }
    if (this.filtro.producto != 0) {
      let tempData = [];
      datostemp.forEach(element => {
        if (element.id_producto == this.filtro.producto) tempData.push(element);
      });
      datostemp = tempData;
    }
    return datostemp;
  }

  cargarMapa() {
    const latLng = new google.maps.LatLng(-33.954506, -59.681654);
    const mapaOpciones: google.maps.MapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapaOpciones);
  }

  agregarMarcadoresDetalles() {
    this.borrarMarcadores();
    this.marcadores = [];
    for (const viaje of this.viajesDestinatario) {
      const latLng = new google.maps.LatLng(
        viaje.chofer.latitud,
        viaje.chofer.longitud
      );
      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: this.iconUrlRed
      });
      this.marcadores.push(marker);
      const contenido = `<p>
                        <strong>Patente:</strong>
                        {{ viaje.chofer.patente_camion }}
                      </p>   
                      <p>
                        <strong>Chofer:</strong>
                        {{ viaje.chofer.razon_social }}
                      </p>
                      
                      <p>
                        <strong>Celular:</strong> {{ viaje.chofer.telefono }}
                      </p>
                      `;
      const infoWindow = new google.maps.InfoWindow({
        content: contenido
      });
      this.infoWindows.push(infoWindow);
      google.maps.event.addDomListener(marker, "click", () => {
        this.infoWindows.forEach(infow => infow.close());
        infoWindow.open(this.map, marker);
      });
    }
    var mcOptions = {
      gridSize: 60,
      minZoom: 4,
      maxZoom: 12,
      styles: this.clusterStyles,
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    };
    var markerCluster = new MarkerClusterer(
      this.map,
      this.marcadores,
      mcOptions
    );
  }
  agregarMarcadoresTodosChoferes() {
    this.borrarMarcadores();
    this.marcadores = [];
    for (const viaje of this.todosChoferes) {
      const latLng = new google.maps.LatLng(
        viaje.chofer.latitud,
        viaje.chofer.longitud
      );
      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: this.iconUrlRed
      });
      this.marcadores.push(marker);
      const contenido = `<p>
                        <strong>Patente:</strong>
                        {{ viaje.chofer.patente_camion }}
                      </p>   
                      <p>
                        <strong>Chofer:</strong>
                        {{ viaje.chofer.razon_social }}
                      </p>
                      
                      <p>
                        <strong>Celular:</strong> {{ viaje.chofer.telefono }}
                      </p>
                      `;
      const infoWindow = new google.maps.InfoWindow({
        content: contenido
      });
      this.infoWindows.push(infoWindow);
      google.maps.event.addDomListener(marker, "click", () => {
        this.infoWindows.forEach(infow => infow.close());
        infoWindow.open(this.map, marker);
      });
    }
  }

  borrarMarcadores() {
    for (const marcador of this.marcadores) {
      marcador.setMap(null);
    }
  }

  removeExistingMarkersFromMap() {
    if (!MarkerClusterer) return;
    MarkerClusterer.clearMarkers();
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  openPopUpInfoPersona(data: any = {}) {
    
  }
  showMapaDestino() {

  }
  showMapaPedido() {}
}
