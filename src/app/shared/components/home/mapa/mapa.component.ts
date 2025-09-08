import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
} from "@angular/core";
import { egretAnimations } from "../../../animations/egret-animations";
import { MatDialog, MatDialogRef, MatProgressBar, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";
import {
  CentroTransporte,
  CentroIntermediario,
  ChoferCentro,
  TipoCamion,
  MarcadorMapa,
} from "@muvin/models";
import {
  ZonasService,
  CentrosService,
  NomencladoresService,
  AppLoaderService
} from "@muvin/services";
import { FormControl, FormGroup } from "@angular/forms";
import { NotificarTransportistasComponent } from "./notificar-transportistas/notificar-transportistas.component";
import * as moment from "moment";

export class Item {
  id: number;
  descripcion: string;
}


@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.scss"],
  animations: egretAnimations,
})
export class MapaComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  public getItemSub: Subscription;
  choferes: ChoferCentro[] = [];
  choferesDisponibles: ChoferCentro[] = [];
  choferesAsignados: ChoferCentro[] = [];
  marcadores: MarcadorMapa[] = [];

  cantidadchoferesActivos = 0;
  now: any;
  hace_10min: any;

  isCustomizerOpen = false;

  public tempChoferesDisponibles: ChoferCentro[] = [];
  public choferesViajes: ChoferCentro[] = [];

  public tempChoferesViajes: ChoferCentro[] = [];
  public tempViajes = ([] = []);
  public tiposCamiones: TipoCamion[] = [];
  public productos: Item[] = [];
  public generadores: Item[] = [];
  public centrosTrans: CentroTransporte[] = [];
  public centrosIntermediario: CentroIntermediario[] = [];
  public zonas: Item[] = [];
  public estados: Item[] = [];
  public pedidos: Item[] = [];

  cantidadAsignados = 0;
  cantidadAsignadosTemp = 0;
  selectedEstadoCamiones = 0;
  //Map
  zoom = 8;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654,
  };
  polylinePoints = [
    { lat: -34.580445, lng: -58.493264, label: "Buenos Aires" },
    { lat: -32.954506, lng: -60.681654, label: "Rosario" },
    { lat: -38.023604, lng: -57.578841, label: "Mar del Plata" },
  ];
  circleMapRadius = 50000;

  // Chart grid options
  doughnutChartColors1: any[] = [
    {
      backgroundColor: ["#fff", "rgba(0, 0, 0, .24)"],
    },
  ];
  doughnutChartColors2: any[] = [
    {
      backgroundColor: ["green", "gold", "red"],
    },
  ];
  total1: number = 68;
  data1: number = 36;
  doughnutChartData1: number[] = [this.data1, this.total1 - this.data1];
  doughnutLabels1 = ["Ocupados", "Libres"];

  total2: number = 72;
  data2: number = 36;
  data3: number = 16;
  doughnutChartData2: number[] = [
    this.data2,
    this.data3,
    this.total2 - this.data2 - this.data3,
  ];
  doughnutLabels2 = ["Pendientes", "Desviados", "Atrasados"];
  doughnutChartType = "doughnut";
  doughnutOptions: any = {
    cutoutPercentage: 85,
    responsive: true,
    legend: {
      display: true,
      position: "center",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  };
  public iconUrlGreen =
    "https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2";
  public iconUrlGreenReloj =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenR.png";
  public iconUrlYellow = "http://www.google.com/mapfiles/marker_yellow.png";
  public iconUrlBlue =
    "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png";
  public iconUrlBlueReloj =
    "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueR.png";
  public iconUrlRed = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
  public iconUrlGreenX = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenX.png";
  public iconUrlBlueX = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueX.png";
  selectedFilterTipoCamion: any;
  selectedFilterZona: any;
  selectedFilterEmpTrans: any;
  selectedFilterIntermediario: any;
  selectedFilterCentro: any;
  selectedFilterProducto: any;
  selectedFilterOrigen: any;
  selectedFilterGeneradorPedido: any;
  selectedFilterProductoC: any;
  selectedFilterEstadoViaje: any;
  selectedFilterPedido: any;
  selectedFilterEstado: any;
  previous;

  selectedFilterkm = 10;
  temp = [];
  inicializadorvacio = {
    value: "NO",
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Choferes Disponibles que cumplan los filtros</span>
      </div>
    `,
  };
  timerchoferes: any;
  mapaForm: FormGroup;
  filterEstados = [
    {
      id: 0,
      descripcion: "TODOS",
    },
    {
      id: 1,
      descripcion: "EN DESTINO",
    },
  ];

  constructor(
    private dialog: MatDialog,
    private nomencladoresServices: NomencladoresService,
    private loader: AppLoaderService,
    public zonasService: ZonasService,
    private centroService: CentrosService
  ) { }

  ngOnInit() {
    this.mapaForm = new FormGroup({
      selectedPedido: new FormControl(this.selectedFilterPedido),
      selectedEstado: new FormControl(this.selectedFilterEstado),
    });
    this.getItemsProductos();
    this.getItemPedido();
    this.getItemsTiposCamion();
    this.getItemsEmpresasTrans();
    this.getItemsZonas();
    this.getItemsIntemediarios();
    this.getItemsEstadoViaje();

    //this.actualizarPosicionChoferes();
  }

  getItemPedido() {
    this.loader.open();
    //this.generadores.push({ descripcion: 'Sin filtro' });
    this.pedidos = [];
    this.pedidos.push({ id: 0, descripcion: "TODOS" });
    this.getItemSub = this.nomencladoresServices
      .getStatusMap()
      .subscribe((data) => {
        data.data.forEach(chofer => {
          let tempChofer = this.choferes.find((item) => item.id_chofer === chofer.id_chofer);
          if (tempChofer === undefined) {
            this.choferes.push(chofer);
            if (chofer.estado === "Disponible") {
              this.choferesDisponibles.push(chofer);
            }
            if (chofer.estado === "Ocupado") {
              this.choferesAsignados.push(chofer);
            }
            if (chofer.id_pedido) {
              this.addPedido(chofer.id_pedido);
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
                id: this.generadores.length,
                descripcion: chofer.nombre_generador,
              });
            }
          }
        });
        this.mapaForm.controls["selectedPedido"].setValue(0);
        this.mapaForm.controls["selectedEstado"].setValue(0);

        this.temp = this.tempChoferesDisponibles = this.choferesDisponibles;
        this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados;
        this.loader.close();
        this.chanceSelectTipo();
      });
  }

  chanceSelectTipo() {
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
      this.selectedFilterCentro !== 0 &&
      this.selectedFilterCentro !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",5" : "5";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterCentro.toString()
          : this.selectedFilterCentro.toString();
    }
    if (
      this.selectedFilterProducto !== 0 &&
      this.selectedFilterProducto !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",6" : "6";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterProducto.toString()
          : this.selectedFilterProducto.toString();
    }
    if (
      this.selectedFilterOrigen !== 0 &&
      this.selectedFilterOrigen !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",7" : "7";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterOrigen.toString()
          : this.selectedFilterOrigen.toString();
    }
    if (
      this.selectedFilterGeneradorPedido !== "Sin filtro" &&
      this.selectedFilterGeneradorPedido !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",8" : "8";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterGeneradorPedido.toString()
          : this.selectedFilterGeneradorPedido.toString();
    }
    if (
      this.selectedFilterEstadoViaje !== "Sin filtro" &&
      this.selectedFilterEstadoViaje !== undefined
    ) {
      codcondiciones += codcondiciones !== "" ? ",9" : "9";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.selectedFilterEstadoViaje.toString()
          : this.selectedFilterEstadoViaje.toString();
    }
    if (this.mapaForm.controls["selectedEstado"].value !== 0) {
      codcondiciones += codcondiciones !== "" ? ",9" : "9";
      valorescondiciones += valorescondiciones !== "" ? "," + "5" : "5";
    }
    /* if (this.selectedFilterPedido !== 'Sin filtro' && this.selectedFilterPedido !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',10' : '10';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterPedido.toString() : this.selectedFilterPedido.toString();
    } */
    if (this.mapaForm.controls["selectedPedido"].value !== 0) {
      codcondiciones += codcondiciones !== "" ? ",10" : "10";
      valorescondiciones +=
        valorescondiciones !== ""
          ? "," + this.mapaForm.controls["selectedPedido"].value.toString()
          : this.mapaForm.controls["selectedPedido"].value.toString();
    }
    this.marcadores = [];
    switch (this.selectedEstadoCamiones.toString()) {
      case "0": {
        this.choferesDisponibles = this.modificarArray(
          this.tempChoferesDisponibles,
          codcondiciones,
          valorescondiciones
        );
        this.choferesViajes = this.modificarArray(
          this.tempChoferesViajes,
          codcondiciones,
          valorescondiciones
        );
        break;
      }
      case "1": {
        this.choferesDisponibles = this.modificarArray(
          this.tempChoferesDisponibles,
          codcondiciones,
          valorescondiciones
        );
        this.choferesViajes = [];
        break;
      }
      case "2": {
        this.choferesViajes = this.modificarArray(
          this.tempChoferesViajes,
          codcondiciones,
          valorescondiciones
        );
        this.choferesDisponibles = [];
        break;
      }
      default:
        break;
    }
    var currentTime: moment.Moment = moment();
    this.choferesDisponibles.forEach((element) => {
      let marcador = new MarcadorMapa();
      marcador.nombreChofer = element.nombre_chofer;
      marcador.patente = element.patente;
      marcador.telefono = element.telefono;
      marcador.latitud = element.latitud;
      marcador.longitud = element.longitud;
      marcador.nombreTransportista = element.nombre_transportista;
      marcador.updateAt = element.update_at;
      let initialDate = moment(marcador.updateAt == null ? null : marcador.updateAt);
      let duration = moment.duration(currentTime.diff(initialDate));
      let hours = duration.asHours();
      let minutes = duration.asMinutes();
      if (hours >= 12) {
        marcador.icon = this.iconUrlRed;
      } else if (minutes >= 10) {
        marcador.icon = this.iconUrlGreenX;
      } else if (minutes > 0) {
        marcador.icon = this.iconUrlGreen;
      }
      marcador.estado = 0;
      if (marcador.latitud !== 0 && marcador.longitud != 0) {
        this.marcadores.push(marcador);
      }
    });
    this.choferesViajes.forEach((element) => {
      let marcador = new MarcadorMapa();
      marcador.nombreChofer = element.nombre_chofer;
      marcador.patente = element.patente;
      marcador.telefono = element.telefono;
      marcador.latitud = element.latitud;
      marcador.longitud = element.longitud;
      marcador.nombreTransportista = element.nombre_transportista;
      marcador.updateAt = element.update_at;
      marcador.estado = 1;
      let initialDate = moment(marcador.updateAt == null ? null : marcador.updateAt);
      let duration = moment.duration(currentTime.diff(initialDate));
      let hours = duration.asHours();
      let minutes = duration.asMinutes();
      if (hours >= 12) {
        marcador.icon = this.iconUrlRed;
      } else if (minutes >= 10) {
        marcador.icon = this.iconUrlBlueX;
      } else if (minutes > 0) {
        marcador.icon = this.iconUrlBlue;
      }
      if (marcador.latitud !== 0 && marcador.longitud != 0) {
        this.marcadores.push(marcador);
      }
    });
  }
  modificarArray(arrayvalue, codcondiciones, valorescondiciones) {
    const arraytemp = [];
    const cod_condiciones = codcondiciones.split(",");
    const valores_condiciones = valorescondiciones.split(",");
    let cont = 0;
    let cont2;
    if (codcondiciones !== "") {
      for (let i = 0; i < arrayvalue.length; i++) {
        cont = 0;
        cont2 = -1;
        for (let j = 0; j < cod_condiciones.length; j++) {
          cont2++;
          switch (cod_condiciones[j]) {
            case "1":
              if (arrayvalue[i].id_tipo_acoplado !== null) {
                if (
                  arrayvalue[i].id_tipo_acoplado.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "2":
              if (arrayvalue[i].zona_activa !== null) {
                if (
                  arrayvalue[i].zona_activa.id.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "3":
              if (arrayvalue[i].id_transportista !== null) {
                if (
                  arrayvalue[i].id_transportista.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "5":
              if (arrayvalue[i].id_centro !== null) {
                if (
                  arrayvalue[i].id_centro.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "6":
              if (arrayvalue[i].id_producto !== null) {
                if (
                  arrayvalue[i].id_producto.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "7":
              if (arrayvalue[i].id_origen !== null) {
                if (
                  arrayvalue[i].id_origen.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "8":
              if (arrayvalue[i].nombre_generador !== null) {
                if (
                  arrayvalue[i].nombre_generador.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "9":
              if (arrayvalue[i].id_estado !== null) {
                if (
                  arrayvalue[i].id_estado.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            case "10":
              if (arrayvalue[i].id_pedido !== null) {
                if (
                  arrayvalue[i].id_pedido.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
            default:
              if (arrayvalue[i].centro_primario !== null) {
                if (
                  arrayvalue[i].centro_primario.toString() ===
                  valores_condiciones[cont2]
                ) {
                  cont++;
                }
              }
              break;
          }
        }
        if (cont === cod_condiciones.length) {
          arraytemp.push(arrayvalue[i]);
        }
      }
      arrayvalue = arraytemp;
    }

    return arrayvalue;
  }


  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    clearInterval(this.timerchoferes);
  }
  getItemsTiposCamion() {
    this.tiposCamiones = [];
    this.getItemSub = this.nomencladoresServices
      .getAllTipoAcopladosSelect()
      .subscribe((data) => {
        this.tiposCamiones = data.data.tipoAcoplado;
      });
  }
  getItemsZonas() {
    this.zonas = [];
    this.getItemSub = this.zonasService.getAllZonas().subscribe((data) => {
      this.zonas = data.data;
    });
  }
  getItemsEmpresasTrans() {
    this.centrosTrans = [];
    this.getItemSub = this.centroService
      .getTransporteByIdCentroSelect()
      .subscribe((data) => {
        this.centrosTrans = data.data;
      });
  }
  getItemsIntemediarios() {
    this.centrosIntermediario = [];
    this.getItemSub = this.centroService
      .getIntermediarioByIdCentroSelectAreCentro()
      .subscribe((data) => {
        this.centrosIntermediario = data.data;
      });
  }
  getItemsEstadoViaje() {
    this.estados = [];
    this.getItemSub = this.nomencladoresServices
      .getAllEstado()
      .subscribe((data) => {
        this.estados = data.data;
      });
  }

  getItemsProductos() {
    this.productos = [];
    this.getItemSub = this.nomencladoresServices
      .getAllProductosSelect()
      .subscribe((data) => {
        this.productos = data.data;
      });
  }

  limpiarFiltros() {
    this.selectedFilterTipoCamion = undefined;
    this.selectedFilterZona = undefined;
    this.selectedFilterEmpTrans = undefined;
    this.selectedFilterIntermediario = undefined;
    this.selectedFilterCentro = undefined;
    this.selectedFilterProducto = undefined;
    this.selectedFilterOrigen = undefined;
    this.selectedEstadoCamiones = 0;
    this.selectedFilterProducto = undefined;
    this.selectedFilterProductoC = undefined;
    this.selectedFilterEstadoViaje = undefined;
    this.selectedFilterPedido = undefined;
    this.chanceSelectTipo();
  }

  actualizarPosicionChoferes() {
    this.timerchoferes = setInterval(() => {
      this.now = new Date();
      this.update_mapa();
    }, 15000);
  }

  update_mapa() {
    this.getItemSub = this.nomencladoresServices
      .getStatusMap()
      .subscribe((data) => {
        this.choferes = [];
        data.data.forEach(element => {
          let tempChofer = this.choferes.find((item) => item.id_chofer === element.id_chofer);
          if (tempChofer === undefined) {
            this.choferes.push(element);
          }
        });
        //this.choferes = data.data;
        const arraydisponibles: ChoferCentro[] = [];
        const arrayocupados: ChoferCentro[] = [];
        this.choferes.forEach((chofer) => {
          if (chofer.estado === "Disponible") {
            arraydisponibles.push(chofer);
            const element = this.choferesDisponibles.find(
              (chof) => chof.id_chofer === chofer.id_chofer
            );
            const index = this.choferesDisponibles.indexOf(element);
            if (index > -1) {
              this.choferesDisponibles[index].latitud = chofer.latitud;
              this.choferesDisponibles[index].longitud = chofer.longitud;
              this.choferesDisponibles[index].update_at = chofer.update_at;
            } else {
              this.choferesDisponibles.push(chofer);
            }
          }
          if (chofer.estado === "Ocupado") {
            arrayocupados.push(chofer);
            const element1 = this.choferesAsignados.find(
              (chof1) => chof1.id_chofer === chofer.id_chofer
            );
            const index1 = this.choferesAsignados.indexOf(element1);
            if (index1 > -1) {
              this.choferesAsignados[index1].latitud = chofer.latitud;
              this.choferesAsignados[index1].longitud = chofer.longitud;
              this.choferesAsignados[index1].update_at = chofer.update_at;
            } else {
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
              this.addGenerador(chofer.nombre_generador);
            }
          }
        });

        const uniqueArrayasignados = this.choferesAsignados.filter((value) =>
          arrayocupados.find((chof) => chof.id_chofer === value.id_chofer)
        );
        const uniqueArraydisponibles = this.choferesDisponibles.filter(
          (value) =>
            arraydisponibles.find((chof) => chof.id_chofer === value.id_chofer)
        );

        this.choferesDisponibles = this.temp = this.tempChoferesDisponibles = uniqueArraydisponibles;
        this.choferesViajes = this.tempChoferesViajes = uniqueArrayasignados;
        this.chanceSelectTipo();
      });
  }

  addPedido(id_pedido: number) {
    let tempPedido = this.pedidos.find((item) => item.id === id_pedido);
    if (tempPedido === undefined) {
      this.pedidos.push({
        id: id_pedido,
        descripcion: id_pedido.toString(),
      });
    }
  }

  addGenerador(generador: string) {
    let tempPedido = this.generadores.find(
      (item) => item.descripcion === generador
    );
    if (tempPedido === undefined) {
      this.generadores.push({
        id: this.generadores.length,
        descripcion: generador,
      });
    }
  }
  notificar() {
    let total = this.choferesViajes.length;
    let heightPop: number = 40 + total * 10;
    let heightPopUp: string = "40vh";
    if (heightPop > 85) heightPopUp = "85vh";
    else heightPopUp = heightPop.toString();
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      NotificarTransportistasComponent,
      {
        width: "55vw",
        height: heightPopUp,
        disableClose: false,
        data: {
          payload: {
            choferes: this.choferesViajes,
          },
        },
      }
    )
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  limpiarinfowind() {
    if (this.previous) {
      this.previous.close();
      this.previous = undefined;
    }
  }
}
