import {  Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar,  MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { TipoCamion } from '../../../models/tipo-camion';
import {  CentroTransporte, CentroIntermediario } from './../../../models/centro';
import { ZonasService } from '../../../services/zonas.service';
import { CentrosService } from '../../../services/centros.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';


export class ZonasDestino {
  id: number;
  descripcion: string;
};

export class Destinos {
  id: number;
  descripcion: string;
};

export class Dador {
  id: number;
  descripcion: string;
};

export class Estado {
  id: number;
  descripcion: string;
};

export class ParamCom {
  id: number;
  descripcion: string;
};

export class Chofer {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  id_cliente: number;
  id_estado_viaje: number;
  id_corredor: number;
  id_entregador: number;
  distancia: number;
  longitud: number;
  latitud: number;
  patente: string;
  id_chofer_equipo: number;
  id_equipo: number;
  estado: string;
  id_tipo_camion: number;
  id_transportista: number;
  zona_activa: {
    id: number;
    descripcion: string;
    id_centro: number;
    nombre_centro: string;
  };
};

@Component({
  selector: 'app-mapa-cupos',
  templateUrl: './mapa-cupos.component.html',
  styleUrls: ['./mapa-cupos.component.scss']
})
export class MapaCuposComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  public getItemSub: Subscription;
  choferes: Chofer[];
  choferesDisponibles = [];
  choferesAsignados = [];
  cantidadchoferesActivos = 0;

  public tempChoferesDisponibles: Chofer[];
  public choferesViajes: Chofer[];
  public tempChoferesViajes: Chofer[];
  public tempViajes = [];
  public tiposCamiones: TipoCamion[];
  public productos: ZonasDestino[];
  public destinos: Destinos[];
  public dadores: Dador[];
  public estados: Estado[];
  public corredores: ParamCom[];
  public entregadores: ParamCom[];
  public centros: ZonasDestino[];
  public origenes: ZonasDestino[];
  public centrosTrans: CentroTransporte[];
  public centrosIntermediario: CentroIntermediario[];
  public zonas: ZonasDestino[];
  viaje_cupo = [];
  cantidadAsignados = 0;
  cantidadAsignadosTemp = 0;
  selected = 2;
  //Map
  zoom = 8;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  }
  polylinePoints = [
    { lat: -34.580445, lng: -58.493264, label: 'Buenos Aires' },
    { lat: -32.954506, lng: -60.681654, label: 'Rosario' },
    { lat: -38.023604, lng: -57.578841, label: 'Mar del Plata' }
  ];
  circleMapRadius = 50000;

  // Chart grid options
  doughnutChartColors1: any[] = [{
    backgroundColor: ['#fff', 'rgba(0, 0, 0, .24)',]
  }];
  doughnutChartColors2: any[] = [{
    backgroundColor: ['green', 'gold', 'red']
  }];
  total1: number = 68;
  data1: number = 36;
  doughnutChartData1: number[] = [this.data1, (this.total1 - this.data1)];
  doughnutLabels1 = ['Ocupados', 'Libres']

  total2: number = 72;
  data2: number = 36;
  data3: number = 16;
  doughnutChartData2: number[] = [this.data2, this.data3, (this.total2 - this.data2 - this.data3)];
  doughnutLabels2 = ['Pendientes', 'Desviados', 'Atrasados']
  doughnutChartType = 'doughnut';
  doughnutOptions: any = {
    cutoutPercentage: 85,
    responsive: true,
    legend: {
      display: true,
      position: 'center'
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    tooltips: {
      enabled: true
    }
  };
  public iconUrlGreen = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
  public iconUrlYellow = 'http://www.google.com/mapfiles/marker_yellow.png';
  public iconUrlRed = 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png';
  selectedFilterTipoCamion: any;
  selectedFilterZona: any;
  selectedFilterEmpTrans: any;
  selectedFilterIntermediario: any;
  selectedFilterCentro: any;
  selectedFilterProducto: any;
  selectedFilterOrigen: any;
  selectedFilterDestino: any;
  selectedFilterDador: any;
  selectedFilterEstado: any;
  selectedFilterCorredor: any;
  selectedFilterEntregador: any;
  previous;

  selectedFilterkm = 10;
  temp = [];
  inicializadorvacio = {
    value: 'NO'
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Choferes Disponibles que cumplan los filtros</span>        
      </div>
    `
  };
  rolDador = false;
  rol = localStorage.getItem('rol');

  constructor(
    public zonasService: ZonasService,
    private centroService: CentrosService,
    private nomecladoresServices: NomencladoresService,
    private homeService: HomeService) { }

  ngOnInit() {
    this.cargar_viajes_cupos();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  cargar_viajes_cupos() {
    this.getItemSub = this.homeService.getAllViajes()
      .subscribe(data => {
        this.destinos = [];
        this.productos = [];
        this.dadores = [];
        this.estados = [];
        this.corredores = [];
        this.entregadores = [];
        let productostemp = [];
        let destinostemp = [];
        let dadorestemp = [];
        let estadostemp = [];
        let corredorestemp = [];
        let entregadorestemp = [];
        let arrayviaje;        
        arrayviaje = data;
        if (arrayviaje.length !== 0) {
          for (let a = 0; a < arrayviaje.length; a++) {
            if (arrayviaje[a].bloqueado === 0 && arrayviaje[a].id_estado<9) {
              let cho = {
                'nombre_persona': arrayviaje[a].nombre_chofer,
                'id_producto': arrayviaje[a].id_producto,
                'id_destino': arrayviaje[a].id_destino,
                'longitud': parseFloat(arrayviaje[a].longitud),
                'latitud': parseFloat(arrayviaje[a].latitud),
                'id_cliente': arrayviaje[a].id_cliente,
                'id_estado_viaje': arrayviaje[a].nombre_estado_viaje,
                'id_corredor': arrayviaje[a].nombre_corredor,
                'id_entregador': arrayviaje[a].nombre_entregador,
                'telefono': arrayviaje[a].telefono,
                'patente_acoplado': arrayviaje[a].patente_acoplado,
                'nombre_chofer': arrayviaje[a].nombre_chofer,
                'nombre_transportista': arrayviaje[a].nombre_transportista,
                'update_at': arrayviaje[a].update_at,
              };
              let tipoInicial = {
                id: parseInt(arrayviaje[a].id_producto), descripcion: arrayviaje[a].nombre_producto
              };
              productostemp.push(tipoInicial);
              let ids = {};
              this.productos = productostemp.filter(function (v) {
                let ind = v.descripcion + '_' + v.id;
                if (!ids[ind]) {
                  ids[ind] = true;
                  return true;
                }
                return false;
              });
              // array dadores
              let dadorcarga = {
                id: parseInt(arrayviaje[a].id_cliente), descripcion: arrayviaje[a].nombre_cliente
              };
              dadorestemp.push(dadorcarga);
              let idsdador = {};
              this.dadores = dadorestemp.filter(function (v) {
                let ind = v.descripcion + '_' + v.id;
                if (!idsdador[ind]) {
                  idsdador[ind] = true;
                  return true;
                }
                return false;
              });
              // destinos
              if (arrayviaje[a].id_destino !== null) {
                let destino = {
                  id: parseInt(arrayviaje[a].id_destino), descripcion: arrayviaje[a].nombre_destino
                };
                let idsdestinos = {};
                destinostemp.push(destino);
                this.destinos = destinostemp.filter(function (v) {
                  let ind = v.descripcion + '_' + v.id;
                  if (!idsdestinos[ind]) {
                    idsdestinos[ind] = true;
                    return true;
                  }
                  return false;
                });
              }
              // corredores 
              if (arrayviaje[a].id_corredor !== null) {
                let corredor = {
                  id: parseInt(arrayviaje[a].id_corredor), descripcion: arrayviaje[a].nombre_corredor
                };
                let idscorredor = {};
                corredorestemp.push(corredor);
                this.corredores = corredorestemp.filter(function (v) {
                  let ind = v.descripcion + '_' + v.id;
                  if (!idscorredor[ind]) {
                    idscorredor[ind] = true;
                    return true;
                  }
                  return false;
                });
              }
              // entregadores 
              if (arrayviaje[a].id_entregador !== null) {
                let entregad = {
                  id: parseInt(arrayviaje[a].id_entregador), descripcion: arrayviaje[a].nombre_entregador
                };
                let idsentregador = {};
                entregadorestemp.push(entregad);
                this.entregadores = entregadorestemp.filter(function (v) {
                  let ind = v.descripcion + '_' + v.id;
                  if (!idsentregador[ind]) {
                    idsentregador[ind] = true;
                    return true;
                  }
                  return false;
                });
              }
              // array estados
              let estadoviaje = {
                id: parseInt(arrayviaje[a].id_estado_viaje), descripcion: arrayviaje[a].nombre_estado_viaje
              };
              estadostemp.push(estadoviaje);
              let idsestados = {};
              this.estados = estadostemp.filter(function (v) {
                let ind = v.descripcion + '_' + v.id;
                if (!idsestados[ind]) {
                  idsestados[ind] = true;
                  return true;
                }
                return false;
              });
              this.viaje_cupo.push(cho);
            }
          }
        }

        this.choferesViajes = this.tempChoferesViajes = this.viaje_cupo;
        this.chanceSelectTipo();
      });
  }

  getItemsTiposCamion() {
    this.tiposCamiones = [];
    this.getItemSub = this.nomecladoresServices.getAllTipoAcopladosSelect()
      .subscribe(data => {
        let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        }
        this.tiposCamiones.push(tipoInicial);
        data.data.tipoAcoplado.forEach(element => {
          this.tiposCamiones.push(element)
        });
      })
  }
  getItemsZonas() {
    this.zonas = [];
    this.getItemSub = this.zonasService.getAllZonas()
      .subscribe(data => {
        let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        }
        this.zonas.push(tipoInicial);
        data.data.forEach(element => {
          this.zonas.push(element)
        });
      })
  }
  getItemsEmpresasTrans() {
    this.centrosTrans = [];
    this.getItemSub = this.centroService.getTransporteByIdCentroSelect()
      .subscribe(data => {
        let tipoInicial = {
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
        }
        this.centrosTrans.push(tipoInicial);

        data.data.forEach(element => {
          this.centrosTrans.push(element)
        });
      })
  }
  getItemsIntemediarios() {
    this.centrosIntermediario = [];
    this.getItemSub = this.centroService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        let tipoInicial = {
          id: 0,
          id_centro: 0,
          id_transporte: 0,
          id_intermediario: 0,
          bloqueado: 0,
          nombre_transporte: "",
          nombre_intermediario: "Sin Filtro",
          nombre_centro: "",
          desc_bloqueado: ""
        }
        this.centrosIntermediario.push(tipoInicial);
        data.data.forEach(element => {
          this.centrosIntermediario.push(element)
        });
      })
  }

  getItemChoferes() {
    this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados = [];
    this.getItemSub = this.nomecladoresServices.getMisChoferes()
      .subscribe(data => {
        data.data.forEach(element => {
          let cho = {
            "nombre_chofer": element.nombre_chofer,
            "nombre_centro": element.nombre_centro,
            "id_cliente": element.id_cliente,
            "id_centro": element.id_centro,
            "id_producto": element.id_producto,
            "id_origen": element.id_origen,
            "id_viaje": element.id_viaje,
            "longitud": parseFloat(element.longitud),
            "latitud": parseFloat(element.latitud),
            "update_at": element.update_at
          };
          this.choferesAsignados.push(cho);
          this.cantidadchoferesActivos++;
        });
        this.choferesViajes = this.tempChoferesViajes = this.choferesAsignados;
        this.chanceSelectTipo();
      });
  }

  getItemsCentro() {
    this.centros = [];
    this.getItemSub = this.nomecladoresServices.getMisCentros()
      .subscribe(data => {
        let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        };
        this.centros.push(tipoInicial);
        data.data.forEach(element => {
          tipoInicial = {
            id: element.id_persona_rol, descripcion: element.razon_social
          };
          this.centros.push(tipoInicial)
        });
      });
  }

  getItemsProductos() {
    this.productos = [];
    this.getItemSub = this.nomecladoresServices.getAllProductos()
      .subscribe(data => {
        let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        };
        this.productos.push(tipoInicial);
        data.data.forEach(element => {
          tipoInicial = {
            id: element.id, descripcion: element.descripcion
          };
          this.productos.push(tipoInicial)
        });
      });
  }

  getItemsOrigenes() {
    this.origenes = [];
    this.getItemSub = this.nomecladoresServices.getAllOrigenesDador()
      .subscribe(data => {
        let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        };
        this.origenes.push(tipoInicial);
        data.data.forEach(element => {
          this.origenes.push(element)
        });
      });
  }
  
  chanceSelectTipo() {
   
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
    if (this.selectedFilterCentro !== 0 && this.selectedFilterCentro !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',5' : '5';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterCentro.toString() : this.selectedFilterCentro.toString();
    }
    if (this.selectedFilterProducto !== 0 && this.selectedFilterProducto !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',6' : '6';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterProducto.toString() : this.selectedFilterProducto.toString();
    }
    if (this.selectedFilterOrigen !== 0 && this.selectedFilterOrigen !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',7' : '7';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterOrigen.toString() : this.selectedFilterOrigen.toString();
    }
    if (this.selectedFilterDestino !== 0 && this.selectedFilterDestino !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',8' : '8';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterDestino.toString() : this.selectedFilterDestino.toString();
    }
    if (this.selectedFilterDador !== 0 && this.selectedFilterDador !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',9' : '9';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterDador.toString() : this.selectedFilterDador.toString();
    }
    if (this.selectedFilterEstado !== 0 && this.selectedFilterEstado !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',10' : '10';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterEstado : this.selectedFilterEstado;
    }
    if (this.selectedFilterCorredor !== 0 && this.selectedFilterCorredor !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',11' : '11';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterCorredor : this.selectedFilterCorredor;
    }
    if (this.selectedFilterEntregador !== 0 && this.selectedFilterEntregador !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',12' : '12';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterEntregador : this.selectedFilterEntregador;
    }

    this.choferesViajes = this.modificarArray(this.tempChoferesViajes, codcondiciones, valorescondiciones);
    this.choferesDisponibles = [];

  }
  modificarArray(arrayvalue, codcondiciones, valorescondiciones) {
    let arraytemp = [];
    let cod_condiciones = codcondiciones.split(',');
    let valores_condiciones = valorescondiciones.split(',');
    let cont = 0;
    let cont2;
    if (codcondiciones !== '') {
      for (let i = 0; i < arrayvalue.length; i++) {
        cont = 0;
        cont2 = -1;
        for (let j = 0; j < cod_condiciones.length; j++) {
          cont2++;
          switch (cod_condiciones[j]) {
            case '1':
              if (arrayvalue[i].id_tipo_acoplado !== null) {
                if (arrayvalue[i].id_tipo_acoplado.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '2':
              if (arrayvalue[i].zona_activa !== null) {
                if (arrayvalue[i].zona_activa.id.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '3':
              if (arrayvalue[i].id_transportista !== null) {
                if (arrayvalue[i].id_transportista.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '5':
              if (arrayvalue[i].id_centro !== null) {
                if (arrayvalue[i].id_centro.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '6':
              if (arrayvalue[i].id_producto !== null) {
                if (arrayvalue[i].id_producto.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '7':
              if (arrayvalue[i].id_origen !== null) {
                if (arrayvalue[i].id_origen.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '8':
              if (arrayvalue[i].id_destino !== null) {
                if (arrayvalue[i].id_destino.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '9':
              if (arrayvalue[i].id_cliente !== null) {
                if (arrayvalue[i].id_cliente.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '10':
              if (arrayvalue[i].id_estado_viaje !== null) {
                if (arrayvalue[i].id_estado_viaje === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '11':
              if (arrayvalue[i].id_corredor !== null) {
                if (arrayvalue[i].id_corredor === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '12':
              if (arrayvalue[i].id_entregador !== null) {
                if (arrayvalue[i].id_entregador === valores_condiciones[cont2])
                  cont++;
              }
              break;
            default:
              if (arrayvalue[i].id_intermediario !== null) {
                if (arrayvalue[i].id_intermediario.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
          }
        }
        if (cont === cod_condiciones.length)
          arraytemp.push(arrayvalue[i]);
      }
      arrayvalue = arraytemp;
    }

    return arrayvalue;
  }
}
