import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import {
  MatProgressBar,
  MatButton,
  MatSidenav
} from "@angular/material";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { Subscription } from "rxjs";
import { NomencladoresService } from "../../../../shared/services/nomencladores.service";
import { CentrosService } from "../../../../shared/services/centros.service";
import { ZonasService } from "../../../../shared/services/zonas.service";
import { ChoferPremium } from "../../../../shared/models/chofer-premium";
import { Chofer } from "../../../../shared/models/chofer";
import { Busqueda } from "../../../../shared/models/busqueda";
import { Page } from "../../../../shared/models/page";
import { ChoferZona } from "../../../../shared/models/chofer-zona";
import { TipoCamion } from "../../../../shared/models/tipo-camion";
import { Viaje } from "../../../../shared/models/viaje";
import {
  CentroTransporte,
  CentroIntermediario
} from "../../../../shared/models/centro";
import { ZonasDestino } from "../../../../views/admin/destinos/add-destino/add-destino.component";
import { AppAtencionService } from "../../../../shared/services/app-atencion/app-atencion.service";

import * as hopscotch from "hopscotch";
import { isUndefined } from "util";

export interface MostrarPostulados {
  value: number;
  viewValue: string;
}
export interface MostrarDisponiblesPremium {
  value: number;
  viewValue: string;
}

@Component({
  selector: "app-gestionar-busqueda",
  templateUrl: "./gestionar-busqueda.component.html",
  styleUrls: ["./gestionar-busqueda.component.scss"],
  animations: egretAnimations
})
export class GestionarBusquedaComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  isSidenavOpen: Boolean = true;
  @ViewChild(MatSidenav) public sideNav: MatSidenav;
  public getItemSub: Subscription;
  public choferes: ChoferZona[];
  public choferesDisponibles: Chofer[];
  public camionesPremium: ChoferPremium[];
  public tempChoferesDisponibles: Chofer[];
  public tempChoferesDisponiblesFiltrado: Chofer[];
  public choferesViajes: Viaje[];
  public tempChoferesViajes: Viaje[];

  public tempCamionesPremiumDisponibles: ChoferPremium[];
  public tiposCamiones: TipoCamion[];
  public centrosTrans: CentroTransporte[];
  public centrosIntermediario: CentroIntermediario[];
  public zonas: ZonasDestino[];

  busqueda = new Busqueda();
  cantidadAsignados = 0;
  cantidadAsignadosFiltrado = 0;
  cantidadAsignadosTemp = 0;
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
  public tempViajes = [];
  tempCamionesPremium = [];
  showMarketDisponible = true;
  showMarketAsignados = false;
  showAllMarket = false;
  showNewDatos = false;
  public iconUrlGreen = "http://www.google.com/mapfiles/marker_green.png";
  public iconUrlYellow = "http://www.google.com/mapfiles/marker_yellow.png";
  public iconUrlBlue = "http://maps.google.com/mapfiles/ms/micons/blue.png";
  public iconUrlcarga =
    "http://maps.google.com/mapfiles/ms/micons/ylw-pushpin.png";
  selectedFilterTipoCamion: any;
  selectedFilterZona: any;
  selectedFilterEmpTrans: any;
  selectedFilterIntermediario: any;
  selectedFilterPostulados: any;
  selectFilterDisponiblesPremium: any;
  selectedFilterInteresados: any;
  selectedFilterkm = 1500;
  inicializadorvacio = {
    value: "NO"
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
  condicionesViajePedido = 0;
  mostrarPostulados: MostrarPostulados[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Si" },
    { value: 1, viewValue: "No" }
  ];
  mostrarDisponiblesPremium: MostrarDisponiblesPremium[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Choferes Flota Centro" },
    { value: 1, viewValue: "Choferes Centro Muvin AISA Verificado" },
    { value: 2, viewValue: "Choferes Centro Muvin AISA NO Verificado" },
    { value: 3, viewValue: "Choferes libres" }
  ];
  mostrarInteresados: MostrarPostulados[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Si" },
    { value: 1, viewValue: "No" },
    { value: 2, viewValue: "Sin responder" }
  ];
  etiquetaTable = "Choferes Disponibles";
  filtro = {
    id: 0
  };
  filtro1 = {
    patente: "",
    cuit: "",
    transportista: "",
    nombre: ""
  };
  datosEnTexto = {
    daGasolina: "",
    daEfectivo: ""
  };
  id_busqueda = 0;
  tipoForm: string = "0";
  page = new Page();
  idCentro = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nomecladoresServices: NomencladoresService,
    private centroService: CentrosService,
    private atencionService: AppAtencionService,
    private alertService: AppAlertService,
    public zonasService: ZonasService,
    private loader: AppLoaderService,
  ) { }

  circleMapRadiusChange(radius) {
    this.circleMapRadius = radius;
  }
  ngOnInit() {
    this.id_busqueda = this.route.snapshot.params["id"];
    this.filtro = {
      id: this.id_busqueda
    };
    this.setPageBusquedaIni();
    this.getChoferesDisponibles();
    this.getChoferesAsignados();
    this.getItemsTiposCamion();
    this.getItemsEmpresasTrans();
    this.getItemsZonas();
    this.getItemsIntemediarios();
  }

  setPageBusquedaIni() {
    this.centroService.getBusqueda(0, this.filtro.id).subscribe(pagedData => {
      this.busqueda = pagedData.data[0];
      this.busqueda.da_efectivo_txt =
        this.busqueda.da_efectivo === 1 ? "Sí" : "No";
      this.busqueda.da_gasoil_txt = this.busqueda.da_gasoil === 1 ? "Sí" : "No";
      this.busqueda.carga_peligrosa_txt =
        this.busqueda.carga_peligrosa === 1 ? "Sí" : "No";
      this.busqueda.precio_viaje =
        this.busqueda.precio_viaje == null ? 0 : this.busqueda.precio_viaje;
    });
  }


  updateFilter(event) {
    let tempo = [];
    tempo = this.tempChoferesDisponiblesFiltrado;
    const val = event.target.value.toLowerCase();
    const columns = Object.keys(tempo[0]);
    columns.splice(columns.length - 1);

    if (!columns.length) return;

    const rows = tempo.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (
          d[column] &&
          d[column]
            .toString()
            .toLowerCase()
            .indexOf(val) > -1
        ) {
          return true;
        }
      }
    });
    if (val != "") this.choferesDisponibles = rows;
    else this.choferesDisponibles = this.tempChoferesDisponiblesFiltrado;
    // this.chanceSelectTipo(this.selectedFilterkm);
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  onActivate(event: any) {

  }

  onSelect(event: any) {

  }

  getChoferesDisponibles() {
    const camiones = [];
    this.choferesDisponibles = [];
    var choferTemp: Chofer;
    this.loader.open();
    this.getItemSub = this.centroService
      .getBusquedaChoferesDisponibles(this.id_busqueda)
      .subscribe(data => {
        if (data.data.mis_choferes != undefined) {
          let mis_choferes = data.data.mis_choferes;
          for (let i = 0; i < mis_choferes.length; i++) {
            if (mis_choferes[i].id_equipo !== null) {
              const starListIni: boolean[] = [false, false, false, false, false];
              choferTemp = mis_choferes[i];
              for (let index = 0; index < 4; index++) {
                if (index < mis_choferes[i].evaluacion) {
                  starListIni[index] = true;
                }
              }
              choferTemp.starList = starListIni;
              choferTemp.esPremium = 0;
              choferTemp.esCentro = 1;
              choferTemp.esLibre = 0;
              this.choferesDisponibles.push(choferTemp);
            }
          }
        }
        if (data.data.aisa_choferes_no_verificados != undefined) {
          let aisa_choferes_no_verificados =
            data.data.aisa_choferes_no_verificados;
          for (let i = 0; i < aisa_choferes_no_verificados.length; i++) {
            if (aisa_choferes_no_verificados[i].id_equipo !== null) {
              const starListIni: boolean[] = [false, false, false, false, false];
              choferTemp = aisa_choferes_no_verificados[i];
              for (let index = 0; index < 4; index++) {
                if (index < aisa_choferes_no_verificados[i].evaluacion) {
                  starListIni[index] = true;
                }
              }
              choferTemp.starList = starListIni;
              choferTemp.esPremium = 1;
              choferTemp.esCentro = 0;
              choferTemp.esLibre = 0;
              choferTemp.verificado = 0;
              this.choferesDisponibles.push(choferTemp);
            }
          }
        }
        if (data.data.aisa_choferes_verificados != undefined) {
          let aisa_choferes_verificados = data.data.aisa_choferes_verificados;
          for (let i = 0; i < aisa_choferes_verificados.length; i++) {
            if (aisa_choferes_verificados[i].id_equipo !== null) {
              const starListIni: boolean[] = [false, false, false, false, false];
              choferTemp = aisa_choferes_verificados[i];
              for (let index = 0; index < 4; index++) {
                if (index < aisa_choferes_verificados[i].evaluacion) {
                  starListIni[index] = true;
                }
              }
              choferTemp.starList = starListIni;
              choferTemp.esPremium = 1;
              choferTemp.esCentro = 0;
              choferTemp.esLibre = 0;
              choferTemp.verificado = 1;
              this.choferesDisponibles.push(choferTemp);
            }
          }
        }
        if (data.data.choferes_huerfano != undefined) {
          let choferes_huerfano = data.data.choferes_huerfano;
          for (let i = 0; i < choferes_huerfano.length; i++) {
            const starListIni: boolean[] = [false, false, false, false, false];
            choferTemp = choferes_huerfano[i];
            for (let index = 0; index < 4; index++) {
              if (index < choferes_huerfano[i].evaluacion) {
                starListIni[index] = true;
              }
            }
            choferTemp.nombre_persona =
              choferes_huerfano[i].nombre + " " + choferes_huerfano[i].apellidos;
            choferTemp.celular = choferes_huerfano[i].telefono;
            choferTemp.patente = choferes_huerfano[i].patente_camion;
            choferTemp.patente_acoplado = choferes_huerfano[i].patente_acoplado;
            choferTemp.zona_activa = choferes_huerfano[i].zona;
            choferTemp.starList = starListIni;
            choferTemp.esPremium = 0;
            choferTemp.esCentro = 0;
            choferTemp.esLibre = 1;
            this.choferesDisponibles.push(choferTemp);
          }
        }
        this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
        this.chanceSelectTipo(this.selectedFilterkm);
      });
    this.loader.close();

  }
  getChoferesAsignados() {
    this.loader.open();
    this.getItemSub = this.centroService
      .getBusquedaChoferesAsignados(this.id_busqueda)
      .subscribe(data => {
        var tempViaje: Viaje;
        this.choferesViajes = [];
        let choferesAsignados = data.data;
        for (let i = 0; i < choferesAsignados.length; i++) {
          const starListIni: boolean[] = [false, false, false, false, false];
          tempViaje = new Viaje();
          tempViaje.interesado = choferesAsignados[i].interesado;
          tempViaje.nombre_chofer = choferesAsignados[i].chofer.nombre_persona;
          tempViaje.telefono = choferesAsignados[i].chofer.celular;
          tempViaje.patente_camion = choferesAsignados[i].chofer.patente;
          tempViaje.patente_acoplado = choferesAsignados[i].chofer.patente_acoplado;
          this.choferesViajes.push(tempViaje);
        }
        this.cantidadAsignados = choferesAsignados.length;
        this.tempChoferesViajes = this.choferesViajes;
        this.cantidadAsignadosFiltrado = this.choferesViajes.length;
      });
    this.loader.close();
  }
  chanceSelectInteresados() {
    const arraytemp = [];
    let arrayvalue = this.tempChoferesViajes;
    if (!isUndefined(arrayvalue)) {
      for (let i = 0; i < arrayvalue.length; i++) {
        switch (this.selectedFilterInteresados) {
          case 0:
            if (arrayvalue[i].interesado === 1)
              arraytemp.push(arrayvalue[i])
            break;
          case 1:
            if (arrayvalue[i].interesado === 0)
              arraytemp.push(arrayvalue[i])
            break;
          case 2:
            if (arrayvalue[i].interesado === null)
              arraytemp.push(arrayvalue[i])
            break;
          default:
            arraytemp.push(arrayvalue[i])
            break;
        }
      }
      arrayvalue = arraytemp;
      this.choferesViajes = arrayvalue;
      this.cantidadAsignadosFiltrado = this.choferesViajes.length;
      return arrayvalue;
    }

  }
  chanceSelectTipo(km: any) {
    if (km.value !== undefined && km.value !== "NO") {
      this.selectedFilterkm = km.value;
      const radio = km.value * 1000;
      this.circleMapRadius = radio;
    }
    let codcondiciones = "";
    let valorescondiciones = "";
    if (
      this.selectedFilterTipoCamion !== 0 &&
      this.selectedFilterTipoCamion !== undefined
    ) {
      codcondiciones = "1";
      valorescondiciones = this.selectedFilterTipoCamion.toString();
    }
    if (
      this.selectedFilterZona !== 0 &&
      this.selectedFilterZona !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",2" : "2";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterZona.toString()
          : this.selectedFilterZona.toString();
    }
    if (
      this.selectedFilterEmpTrans !== 0 &&
      this.selectedFilterEmpTrans !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",3" : "3";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterEmpTrans.toString()
          : this.selectedFilterEmpTrans.toString();
    }
    if (
      this.selectedFilterIntermediario !== 0 &&
      this.selectedFilterIntermediario !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",4" : "4";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterIntermediario.toString()
          : this.selectedFilterIntermediario.toString();
    }
    if (
      this.selectedFilterPostulados !== -2 &&
      this.selectedFilterPostulados !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",5" : "5";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterPostulados.toString()
          : this.selectedFilterPostulados.toString();
    }
    if (
      this.selectFilterDisponiblesPremium !== -2 &&
      this.selectFilterDisponiblesPremium !== undefined
    ) {
      switch (this.selectFilterDisponiblesPremium) {
        case -1:
          this.etiquetaTable = "Choferes Disponibles";
          break;
        case 0:
          this.etiquetaTable = "Choferes Flota Centro";
          break;
        case 1:
          this.etiquetaTable = "Choferes Centro Muvin AISA Verificado";
          break;
        case 2:
          this.etiquetaTable = "Choferes Centro Muvin AISA NO Verificado";
          break;
        case 3:
          this.etiquetaTable = "Choferes Libres";
          break;
        default:
          this.etiquetaTable = "Choferes Disponibles";
          break;
      }
      if (this.selectFilterDisponiblesPremium !== -1) {
        codcondiciones += codcondiciones !== "" ? ",6" : "6";
        valorescondiciones +=
          valorescondiciones !== ""
            ? "," + this.selectFilterDisponiblesPremium.toString()
            : this.selectFilterDisponiblesPremium.toString();
      }
    }
    if (codcondiciones === "") {
      codcondiciones += codcondiciones !== "" ? ",7" : "7";
      this.choferesDisponibles = this.modificarArray(
        this.tempChoferesDisponibles,
        codcondiciones,
        valorescondiciones
      );
      this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
      //this.choferesViajes = this.modificarArray(this.choferesViajes, codcondiciones, valorescondiciones);
    } else {
      switch (this.selected) {
        case 0: {
          //analizar ambos (disponibles y asignados)
          this.choferesDisponibles = this.modificarArray(
            this.tempChoferesDisponibles,
            codcondiciones,
            valorescondiciones
          );
          this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
          //this.choferesViajes = this.modificarArray(this.choferesViajes, codcondiciones, valorescondiciones);
          break;
        }
        case 1: {
          //analizar  (disponibles)
          this.choferesDisponibles = this.modificarArray(
            this.tempChoferesDisponibles,
            codcondiciones,
            valorescondiciones
          );
          this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
        }
        default:
          this.tempChoferesDisponiblesFiltrado = this.choferesDisponibles;
          break;
      }
    }
  }

  modificarArray(arrayvalue, codcondiciones, valorescondiciones) {
    const arraytemp = [];
    const cod_condiciones = codcondiciones.split(",");
    const valores_condiciones = valorescondiciones.split(",");
    let cont = 0;
    let cont2;
    if (!isUndefined(arrayvalue)) {
      for (let i = 0; i < arrayvalue.length; i++) {
        cont = 0;
        cont2 = -1;
        for (let j = 0; j < cod_condiciones.length; j++) {
          cont2++;
          switch (cod_condiciones[j]) {
            case "1":
              if (
                arrayvalue[i].id_tipo_acoplado !== null &&
                arrayvalue[i].id_tipo_acoplado.toString() ===
                valores_condiciones[cont2]
              )
                cont++;
              break;
            case "2":
              if (
                arrayvalue[i].zona_activa !== null &&
                arrayvalue[i].zona_activa.id.toString() ===
                valores_condiciones[cont2]
              )
                cont++;
              break;
            case "3":
              if (
                arrayvalue[i].id_transportista !== null &&
                arrayvalue[i].id_transportista.toString() ===
                valores_condiciones[cont2]
              )
                cont++;
              break;
            case "5":
              switch (valores_condiciones[cont2]) {
                case "0":
                  if (arrayvalue[i].postulado === 1) cont++;
                  break;
                case "1":
                  if (
                    arrayvalue[i].postulado !== null &&
                    arrayvalue[i].postulado === 0
                  )
                    cont++;
                  break;
                default:
                  cont++;
                  break;
              }
              break;
            case "6":
              switch (valores_condiciones[cont2]) {
                case "0":
                  if (arrayvalue[i].esCentro === 1) cont++;
                  break;
                case "1":
                  if (
                    arrayvalue[i].esPremium === 1 &&
                    arrayvalue[i].verificado === 1
                  )
                    cont++;
                  break;
                case "2":
                  if (
                    arrayvalue[i].esPremium === 1 &&
                    arrayvalue[i].verificado === 0
                  )
                    cont++;
                  break;
                case "3":
                  if (arrayvalue[i].esLibre === 1) cont++;
                  break;
                default:
                  cont++;
                  break;
              }
              break;
            case "7":
              cont++;
              break;
            default:
              if (
                arrayvalue[i].id_intermediario !== null &&
                arrayvalue[i].id_intermediario.toString() ===
                valores_condiciones[cont2]
              )
                cont++;
              break;
          }
        }
        if (cont === cod_condiciones.length) arraytemp.push(arrayvalue[i]);
      }
    }
    arrayvalue = arraytemp;
    this.tempChoferesDisponiblesFiltrado = arrayvalue;
    return arrayvalue;
  }
  getItemsTiposCamion() {
    this.tiposCamiones = [];
    this.getItemSub = this.nomecladoresServices
      .getAllTipoCamionesSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0,
          descripcion: "Sin filtro"
        };
        this.tiposCamiones.push(tipoInicial);
        data.data.tipoCamion.forEach(element => {
          this.tiposCamiones.push(element);
        });
      });
  }
  getItemsZonas() {
    this.zonas = [];
    this.getItemSub = this.zonasService.getAllZonas().subscribe(data => {
      const tipoInicial = {
        id: 0,
        descripcion: "Sin filtro"
      };
      this.zonas.push(tipoInicial);
      data.data.forEach(element => {
        this.zonas.push(element);
      });
    });
  }
  getItemsEmpresasTrans() {
    this.centrosTrans = [];
    this.getItemSub = this.centroService
      .getTransporteByIdCentroSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0,
          id_centro: 0,
          id_transporte: 0,
          cantidad_choferes: 0,
          id_intermediario: 0,
          bloqueado: 0,
          nombre_transporte: "Sin Filtro",
          nombre_intermediario: "",
          nombre_centro: "",
          desc_bloqueado: ""
        };
        this.centrosTrans.push(tipoInicial);

        data.data.forEach(element => {
          this.centrosTrans.push(element);
        });
      });
  }
  getItemsIntemediarios() {
    this.centrosIntermediario = [];
    this.getItemSub = this.centroService
      .getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        const tipoInicial = {
          id: 0,
          id_centro: 0,
          id_transporte: 0,
          id_intermediario: 0,
          bloqueado: 0,
          nombre_transporte: "",
          nombre_intermediario: "Sin Filtro",
          nombre_centro: "",
          desc_bloqueado: ""
        };
        this.centrosIntermediario.push(tipoInicial);
        data.data.forEach(element => {
          this.centrosIntermediario.push(element);
        });
      });
  }

  asignarCamion(camion) {
    this.tempViajes.push(camion);
    this.showNewDatos = true;
    this.cantidadAsignadosTemp++;
    const index = this.choferesDisponibles.indexOf(camion);
    if (index > -1) {
      this.choferesDisponibles.splice(index, 1);
      const index1 = this.temp.indexOf(camion);
      const index2 = this.tempChoferesDisponiblesFiltrado.indexOf(camion);
      this.tempChoferesDisponiblesFiltrado.splice(index2, 1);
      this.temp.splice(index1, 1);
    }
    this.choferesDisponibles = [...this.choferesDisponibles];
    this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
  }
  quitarCamion(camion) {
    this.choferesDisponibles.push(camion);
    this.tempChoferesDisponiblesFiltrado.push(camion);
    this.choferesDisponibles = [...this.choferesDisponibles];
    this.tempChoferesDisponiblesFiltrado = [...this.tempChoferesDisponiblesFiltrado];
    this.cantidadAsignadosTemp--;
    const index = this.tempViajes.indexOf(camion);
    if (index > -1) {
      this.tempViajes.splice(index, 1);
    }
    if (this.tempViajes.length === 0) this.showNewDatos = false;
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    hopscotch.endTour(true);
  }

  goToBusqueda() {
    this.router.navigateByUrl("/centro/busqueda-flota");
  }

  guardarViajes() {
    this.loader.open();
    let isError = false;
    this.tempViajes.forEach(element => {
      if (element.esCentro === 1 || element.esPremium === 1) {
        this.centroService
          .postBusquedaChofer(this.busqueda.id, element.id)
          .subscribe(
            data => {
              isError = false;
            },
            err => {
              isError = true;
            }
          );
      } else {
        this.centroService
          .postBusquedaChoferHuerfano(this.busqueda.id, element.id)
          .subscribe(
            data => {
              isError = false;
            },
            err => {
              isError = true;
            }
          );
      }
    });
    if (!isError) {
      this.loader.close();
      this.alertService
        .confirm({
          message: "¡Choferes propuestos en la búsqueda Correctamente!",
          tipo: "exito"
        })
        .subscribe(res => {
          if (res) {
            this.router.navigateByUrl("/centro/busqueda-flota");
          }
        });
    } else {
      this.loader.close();
      this.atencionService
        .confirm({ message: "No se pudo guardar los choferes" })
        .subscribe(res => {
          if (res) {
            return;
          }
        });
    }

  }
}
