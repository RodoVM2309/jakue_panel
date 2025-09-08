import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment";
import { HomeService } from 'app/shared/components/home/home.service';
import { DestinosService } from 'app/shared/services/destinos.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, Observer, Subscription, timer } from 'rxjs';
import { Puerto } from 'app/shared/models/puerto';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { forEach } from '@angular/router/src/utils/collection';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {
  MatDialogRef, MatDialog, MatTabGroup, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';
export interface ExampleTab {
  label: string;
  labelShort: string;
  content: string;
  id_puerto: number;
  isActive: boolean;
}
export class Item {
  id_producto: string;
  producto: string;
  flecha: number;
  horas: string;
  sinTurno: number;
  conTurno: number;
  enTiempo: number;
  indefinido: number;
  tarde: number;
  demorado: number;
  ctg: number;
  gps: number;
  status: number;
  color: string;
  colorString: string;
  isImagen: boolean;
  imagen: string;
  cupos: Cupo[];
  menosKm: number;
  medioKm: number;
  masKm: number;
  promedioDescargaAhora: number;
  promedioDescargaMenos1Hora: number;

}
export class TotalItem {
  cantidad: number;
  sinTurno: number;
  enTiempo: number;
  tarde: number;
  demorado: number;
  status: number;
}
export class TotalItemPendientes {
  conTurnos: number;
  sinTurnos: number;
  conCTG: number;
  conGPS: number;
  menosKm: number;
  medioKm: number;
  masKm: number;
}
export class Cupo {
  id_cupo: number;
  idCupoTerminal: string;
  idCupoEstado: string;
  ctg: string;
  idTurno: number;
  inicio: string;
  fin: string;
  id_estado: string;
  latitud: string;
  longitud: string;
  fechaActivado: string;
  fechaCupo: string;
  fechaArribado: string;
  fechaDescargado: string;
  distancia: number;
  isEnTiempo: boolean;
  isTarde: boolean;
  isDemorado: boolean;
  isIndefinido: boolean;
  conGPS: boolean;
  id_producto: string;

}
export class Productos {
  id_producto: string;
  cupos: Cupo[];
}
export class Destino {
  id_destino: number;
  nombrePuerto: string;
  latitud_destino: string;
  longitud_destino: string;
}
export class Destinos {
  destino: Destino[];
  productos: Productos[];
}

@Component({
  selector: 'app-posicion',
  templateUrl: './posicion.component.html',
  styleUrls: ['./posicion.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})

export class PosicionComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  posicionForm: FormGroup;
  filtro = {
    fecha: "",
    id_puerto: 0
  };
  data: any;
  now = moment(new Date());
  puertos: Puerto[] = [];
  destinos: Destino[] = [];
  destino: any[];
  valores_estadisticos = [];
  playasIntermedias: any[] = [];
  destinos_finales: any[] = [];
  asyncTabs: Observable<ExampleTab[]>;
  esPlaya = false;
  esDestinoConPlaya = false;
  selectedTab = -1;
  selectedTabResumen = 1;
  id_puerto_selected_tab: number = 0;
  public chartType: string = 'line';
  enPlaya: Item[] = [];
  enPlayaAll: Item[] = [];
  pendientes: Item[] = [];
  pendientesAll: Item[] = [];
  totalEnPlaya: TotalItem = {
    cantidad: 0,
    sinTurno: 0,
    enTiempo: 0,
    tarde: 0,
    demorado: 0,
    status: 0,
  };
  totalPendientes: TotalItemPendientes = {
    conTurnos: 0,
    sinTurnos: 0,
    conCTG: 0,
    conGPS: 0,
    menosKm: 0,
    medioKm: 0,
    masKm: 0,
  };;
  indexEnPlaya: number = 0;
  indexPendiente: number = 0;
  detalles: any;
  descargados: Cupo[] = [];
  descargadosAnterior = 0;
  descargadosFecha = 0;
  horas: number = 0;
  minutes: number;
  seconds: number;
  private subscription: Subscription;
  public getItemSub: Subscription;
  fechaHoraUltimaActualizacion: string = '';
  InitialDate: moment.Moment;
  remainingTime: number;
  InitialTimeMinutes: number = 0;
  InitialTimeSeconds: number = 0;
  First: boolean = true;
  searchEndDate: moment.Moment;
  everySecond: Observable<number> = timer(0, 1000);
  SearchDate: moment.Moment = moment();
  promedioEnPlaya: number = 0;
  margenTiempo = 7200;

  lineChart: number[] = [];
  lineChartHoy: number[] = [];
  countConTurno: number[] = [];
  countSinTurno: number[] = [];
  lineChartData: ChartDataSets[] = [{
    data: [],
    label: 'con turno',
    borderWidth: 1
  }, {
    data: [],
    label: 'sin turno',
    borderWidth: 1
  }];
  lineChartLabels: Array<any> = [];
  lineChartDataHoy: ChartDataSets[] = [{
    data: [],
    label: 'con turno',
    borderWidth: 1
  }, {
    data: [],
    label: 'sin turno',
    borderWidth: 1
  }];
  lineChartLabelsHoy: Array<any> = [];

  cantHoras = 6;
  navEnPlaya: number[] = [];
  navPendientes: number[] = [];
  indexNavPendiente: number = 0;
  indexNavPlaya: number = 0;
  resumenEsActivo: boolean = true;
  tabs: ExampleTab[] = [];
  indexTabIni: number = 0;
  indexTabLast: number = 0;
  navTabs: ExampleTab[] = [];
  bottonInTab: number = 3;
  buscarStop: boolean = true;
  hoy = '';
  fechaBuscadaEsHoy = true;
  defaultImagen = 'assets/images/products/icono-gral.png';

  tabindex = 0;

  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private destinosService: DestinosService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private nomencladoresService: NomencladoresService,
    private change: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.lineChartLabelsHoy = [];
    let tempHora = moment(new Date()).get('hours');
    this.cantHoras = tempHora;
    for (let index = 0; index <= tempHora; index++) {
      this.lineChartLabelsHoy.push(index.toString() + ' hs.');
      this.lineChartHoy.push(index * 3600);
    }
    /* for (let index = this.cantHoras; index >= 0; index--) {
      let tempHora = moment(new Date()).add(-index, "hours");
      this.lineChartLabels.push(tempHora.get('hours').toString() + ' hs.');
      this.lineChart.push(tempHora.get('hours') * 3600);
    } */

    this.iniciarCount();
    this.posicionForm = new FormGroup({
      selectedFecha: new FormControl(new Date())
    });
    this.filtro.fecha = this.homeService.formatoFecha(
      this.posicionForm.controls['selectedFecha'].value,
      "amd",
      "-"
    );
    this.hoy = this.filtro.fecha;
    this.activatedRoute.data.subscribe(
      response => {
        this.puertos = response.destinos.data;
      }
    );

    this.selectedTab = -1;
    this.change.markForCheck();
    this.getItems();
  }

  iniciarCount() {
    this.lineChartLabelsHoy = [];
    this.lineChartLabels = [];
    this.lineChart = [];
    if (this.filtro.fecha === this.hoy) {
      this.fechaBuscadaEsHoy = true;
      let tempHora = moment(new Date()).get('hours');
      this.cantHoras = tempHora;
      for (let index = 0; index <= tempHora; index++) {
        this.lineChartLabelsHoy.push(index.toString() + ' hs.');
        this.lineChart.push(index * 3600);
      }
    } else {
      this.fechaBuscadaEsHoy = false;
      this.cantHoras = 24;
      for (let index = 0; index <= 24; index++) {
        this.lineChartLabels.push(index.toString() + ' hs.');
        this.lineChart.push(index * 3600);
      }
    }

    /* for (let index = this.cantHoras; index >= 0; index--) {
      let tempHora = moment(new Date()).add(-index, "hours");
      this.lineChartLabels.push(tempHora.get('hours').toString() + ' hs.');
      this.lineChart.push(tempHora.get('hours') * 3600);
    } */

    this.countConTurno = [];
    this.countSinTurno = [];
    for (let index = 0; index <= this.cantHoras; index++) {
      this.countConTurno.push(0);
      this.countSinTurno.push(0);
    };
  }

  getItems() {
    this.destinosService.getDestinoDashboard(this.filtro).subscribe(data => {
      this.buscarStop = true;
      /* Se organiza la data recibida de la API */
      this.destinos = data.data.destinos;
      this.valores_estadisticos = data.data.valores_estadisticos;
      /* Se crea array para tabs */
      this.tabs = [];
      var resumenTab: ExampleTab = {
        label: '',
        labelShort: 'Resumen General',
        content: '',
        id_puerto: 0,
        isActive: true,
      };
      this.tabs.push(resumenTab);

      for (let id in this.destinos) {
        const shortString = this.destinos[id]['destino'].nombrePuerto.length > 40 ?
          this.destinos[id]['destino'].nombrePuerto.substring(0, 40) : this.destinos[id]['destino'].nombrePuerto;

        this.tabs.push({
          label: this.destinos[id]['destino'].nombrePuerto,
          labelShort: shortString,
          content: this.destinos[id]['destino'].nombrePuerto,
          id_puerto: this.destinos[id]['destino'].id_destino,
          isActive: false
        })
      }

      /*
        Creo que esto sirve para la cuenta regresiva
        de la actualizacion de STOP
      */
      this.fechaHoraUltimaActualizacion = data.data.fecha_ultima_actualizacions;
      var currentTime: moment.Moment = moment();
      this.InitialDate = moment(this.fechaHoraUltimaActualizacion == null ? currentTime : this.fechaHoraUltimaActualizacion);
      let tiempo = moment(this.fechaHoraUltimaActualizacion == null ? currentTime : this.fechaHoraUltimaActualizacion).format('HH:mm:ss');
      let tiempoStri = currentTime.format('HH:mm:ss');
      this.remainingTime = currentTime.diff(this.InitialDate);
      this.remainingTime = this.remainingTime / 1000;
      this.minutes = Math.floor(this.remainingTime / 60) % 30;
      let segundosAhora = tiempoStri.substring(6, 8);
      let sec1 = parseInt(segundosAhora);
      let sec2 = parseInt(tiempo.substring(6, 8));
      if (this.minutes <= 0) {
        this.InitialTimeMinutes = 30 + this.minutes;
      } else {
        this.InitialTimeMinutes = 30 - this.minutes;
      };
      this.InitialTimeMinutes--;
      if (sec2 > sec1) {
        this.seconds = (sec2 - sec1);
      } else {
        this.seconds = sec2 - (sec1 - 60);
      };
      this.SearchDate = moment();
      this.searchEndDate = this.SearchDate.add(this.InitialTimeMinutes, "minutes");
      this.searchEndDate = this.SearchDate.add(this.seconds, "seconds");
      this.runTimer();
      this.filtrar(0);
      this.selectedTab = -1;
      this.tabindex = 0;
    })
  }

  filtrar(id_destino) {
    this.enPlayaAll = [];
    this.pendientesAll = [];

    this.DataDestino(id_destino);
    this.refreschTotalEnPlaya(id_destino);
    this.refreschTotalPendientes(id_destino);
    this.actualizarEnPlaya('init');
    this.actualizarPendiente('init');
    this.actualizarNavTab('init');
    this.crearNavPendientes();
    this.crearNavEnPlaya();
    this.getDescargados(id_destino);
    this.getPromediosDescargados();
    this.graficar(id_destino);
  }

  DataDestino(id_destino) {
    let defaultFecha = moment(Date()).format("YYYY-MM-DD");
    let defautlHora = moment(Date()).format("HH:mm:ss");

    if (id_destino == 0) {
      this.calculosResumenGeneral();
    } else if (!this.esPlaya) {
      (this.esDestinoConPlaya) ? this.calculosDestinoConPlaya(id_destino) : this.calculosDestinoSinPlaya(id_destino);
    } else {
      /* 
        Si es playa , vuelvo a recorrer los destinos 
        para buscar que destino tiene esa playa
      */
      for (let id_destino_final in this.destinos) {
        let id_playa_intermedia = this.destinos[id_destino_final]['destino'].id_playa_intermedia;
        if (id_playa_intermedia != null && id_playa_intermedia == id_destino) {
          this.calculosPlayaIntermedia(id_destino_final);
        }
      }
    }
  }

  calculosResumenGeneral() {
    for (let id_destino in this.destinos) {
      let destino = this.destinos[id_destino]['destino'];
      /* Validacion para que solo recorra los que no son playas */
      if (!destino.es_playa_intermedia) {
        let tiempo_para_demorado = this.dameTiempo(destino.tiempo_para_demorado);
        for (let id_producto in this.destinos[id_destino]['productos']) {
          let producto_destino = this.destinos[id_destino]['productos'][id_producto];
          let tempCupoEnPlaya: Cupo[] = [];
          let tempCupoPendiente: Cupo[] = [];
          /* Recorro cupos por producto */
          for (let key in producto_destino['cupos']) {
            let newCupo = new Cupo();
            let cupo = producto_destino['cupos'][key];
            cupo.isIndefinido = cupo.fechaArribado === undefined || cupo.fechaArribado === null ? true : false;
            cupo.fechaArribado = cupo.fechaArribado;
            cupo.fechaDescargado = cupo.fechaDescargado === undefined || cupo.fechaDescargado === null ? cupo.fechaArribado : cupo.fechaDescargado;
            newCupo = cupo;
            if (cupo.latitud && cupo.longitud)
              newCupo.conGPS = true;
            /* Validacion para cupos en Playa */
            if ((cupo.idCupoEstado == 5 && cupo.ultimo_arribo_intermedio == false) ||
              (cupo.ultimo_arribo_intermedio == true && (
                (cupo.ultimo_arribo_intermedio_estado == 1 || cupo.ultimo_arribo_intermedio_estado == 2 || cupo.ultimo_arribo_intermedio_estado == 3) &&
                (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == 5 || cupo.idCupoEstado == null)
              ))) {
              if (cupo.fechaArribado != null && cupo.inicio && cupo.fin) {
                if (!cupo.indefinido) {
                  let horita = moment(cupo.fechaArribado).format("HH:mm:ss");
                  let horaArribo = this.dameTiempo(horita);
                  let inicio = this.dameTiempo(cupo.inicio);
                  let fin = this.dameTiempo(cupo.fin);
                  if (horaArribo < inicio || horaArribo > fin) {
                    newCupo.isTarde = true;
                  } else {
                    let fechaArribo = moment(cupo.fechaArribado);
                    let now = moment(new Date());
                    if (fechaArribo <= now) {
                      let horaActual = now.hour() * 3600 + now.minute() * 60 + now.second();
                      if (horaActual - horaArribo < tiempo_para_demorado)
                        newCupo.isEnTiempo = true;
                      else
                        newCupo.isDemorado = true;
                    } else {
                      newCupo.isEnTiempo = true;
                    }
                  }
                }
              };
              tempCupoEnPlaya.push(newCupo)
              /* Validacion para cupos Pendientes */
            } else if (cupo.ultimo_arribo_intermedio == false && (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == null)) {
              if (newCupo.conGPS) {
                newCupo.distancia = this.getKilometros(newCupo.latitud, newCupo.longitud, destino.latitud_destino, destino.longitud_destino)
              }
              tempCupoPendiente.push(newCupo);
            }
          }

          if (tempCupoEnPlaya.length > 0) {
            let temp = new Item();
            temp.id_producto = id_producto;
            temp.producto = producto_destino['nombreProducto'];
            temp.isImagen = true;
            (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
              temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
              temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
              temp.imagen = 'assets/images/products/icono-gral.png';
            temp.enTiempo = 0;
            temp.demorado = 0;
            temp.tarde = 0;
            temp.flecha = 1;
            temp.promedioDescargaAhora = 0;
            temp.promedioDescargaMenos1Hora = 0;
            temp.horas = '0 hs';

            let tempSinTurno = 0;
            let tempConTurno = 0;
            let tempTiempo = 0;
            let tempTarde = 0;
            let tempDemorado = 0;
            let tempIndefinido = 0;
            temp.cupos = tempCupoEnPlaya;
            tempCupoEnPlaya.forEach(element => {
              (element.idTurno) ? tempConTurno++ : tempSinTurno++;
              if (element.isEnTiempo)
                tempTiempo++;
              if (element.isTarde)
                tempTarde++;
              if (element.isDemorado)
                tempDemorado++;
              if (element.isIndefinido)
                tempIndefinido++;
            });
            temp.sinTurno = tempSinTurno;
            temp.conTurno = tempConTurno;
            temp.indefinido = tempIndefinido;
            temp.enTiempo = tempTiempo;
            temp.tarde = tempTarde;
            temp.demorado = tempDemorado;
            let tempItem = this.enPlayaAll.find(item => item.id_producto == temp.id_producto);
            if (tempItem == undefined) {
              this.enPlayaAll.push(temp);
            } else {
              tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
              tempItem.conTurno = tempItem.conTurno + temp.conTurno;
              tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
              tempItem.tarde = tempItem.tarde + temp.tarde;
              tempItem.demorado = tempItem.demorado + temp.demorado;
              tempItem.indefinido = tempItem.indefinido + temp.indefinido;
            }
          }

          if (tempCupoPendiente.length > 0) {
            let temp = new Item();
            temp.id_producto = id_producto;
            temp.producto = producto_destino['nombreProducto'];
            temp.isImagen = true;
            (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
              temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
              temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
              temp.imagen = 'assets/images/products/icono-gral.png';
            temp.enTiempo = 0;
            temp.demorado = 0;
            temp.tarde = 0;
            temp.flecha = 1;
            temp.promedioDescargaAhora = 0;
            temp.promedioDescargaMenos1Hora = 0;
            temp.horas = '0 hs';

            let tempConTurno = 0;
            let tempSinTurno = 0;
            let tempConCTG = 0;
            let tempConGPS = 0;
            let tempMenosKm = 0;
            let tempMedioKm = 0;
            let tempmasKm = 0;
            temp.cupos = tempCupoPendiente;
            tempCupoPendiente.forEach(element => {
              (element.idTurno) ? tempConTurno++ : tempSinTurno++;
              if (element.ctg)
                tempConCTG++;
              if (element.conGPS) {
                tempConGPS++;
                if (element.distancia < 50)
                  tempMenosKm++;
                if (element.distancia >= 50 && element.distancia <= 100)
                  tempMedioKm++;
                if (element.distancia > 100)
                  tempmasKm++;
              }
            });
            temp.conTurno = tempConTurno;
            temp.sinTurno = tempSinTurno;
            temp.ctg = tempConCTG;
            temp.gps = tempConGPS;
            temp.menosKm = tempMenosKm;
            temp.medioKm = tempMedioKm;
            temp.masKm = tempmasKm;
            let tempItem = this.pendientesAll.find(item => item.id_producto == temp.id_producto);
            if (tempItem == undefined) {
              this.pendientesAll.push(temp);
            } else {
              /* 
                Este else sirve para que cada vez que cambia de destino 
                no reinicie los valores, y siga contando.
              */
              tempItem.conTurno = tempItem.conTurno + temp.conTurno;
              tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
              tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
              tempItem.tarde = tempItem.tarde + temp.tarde;
              tempItem.demorado = tempItem.demorado + temp.demorado;
              tempItem.ctg = tempItem.ctg + temp.ctg;
              tempItem.gps = tempItem.gps + temp.gps;
              tempItem.menosKm = tempItem.menosKm + temp.menosKm;
              tempItem.medioKm = tempItem.medioKm + temp.medioKm;
              tempItem.masKm = tempItem.masKm + temp.masKm;
            }
          }
        }
      }
    }
  }

  calculosPlayaIntermedia(id_destino) {
    let destino = this.destinos[id_destino]['destino'];
    /* Validacion para que solo recorra los que no son playas */
    if (!destino.es_playa_intermedia) {
      let tiempo_para_demorado = this.dameTiempo(destino.tiempo_para_demorado);
      for (let id_producto in this.destinos[id_destino]['productos']) {
        let producto_destino = this.destinos[id_destino]['productos'][id_producto];
        let tempCupoEnPlaya: Cupo[] = [];
        let tempCupoPendiente: Cupo[] = [];
        for (let key in producto_destino['cupos']) {
          let newCupo = new Cupo();
          let cupo = producto_destino['cupos'][key];
          cupo.isIndefinido = cupo.fechaArribado === undefined || cupo.fechaArribado === null ? true : false;
          cupo.fechaArribado = cupo.fechaArribado;
          cupo.fechaDescargado = cupo.fechaDescargado === undefined || cupo.fechaDescargado === null ? cupo.fechaArribado : cupo.fechaDescargado;
          newCupo = cupo;
          if (cupo.latitud && cupo.longitud)
            newCupo.conGPS = true;
          if ((cupo.idCupoEstado == 5 && cupo.ultimo_arribo_intermedio == false) ||
            (cupo.ultimo_arribo_intermedio == true && (
              (cupo.ultimo_arribo_intermedio_estado == 1 || cupo.ultimo_arribo_intermedio_estado == 2) &&
              (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == 5 || cupo.idCupoEstado == null)
            ))) {
            if (cupo.fechaArribado != null && cupo.inicio && cupo.fin) {
              if (!cupo.isIndefinido) {
                let horita = moment(cupo.fechaArribado).format("HH:mm:ss");
                let horaArribo = this.dameTiempo(horita);
                let inicio = this.dameTiempo(cupo.inicio);
                let fin = this.dameTiempo(cupo.fin);
                if (horaArribo < inicio || horaArribo > fin) {
                  newCupo.isTarde = true;
                } else {
                  let fechaArribo = moment(cupo.fechaArribado);
                  let now = moment(new Date());
                  if (fechaArribo <= now) {
                    let horaActual = now.hour() * 3600 + now.minute() * 60 + now.second();
                    if (horaActual - horaArribo < tiempo_para_demorado)
                      newCupo.isEnTiempo = true;
                    else
                      newCupo.isDemorado = true;
                  } else {
                    newCupo.isEnTiempo = true;
                  }
                }
              }
            };
            tempCupoEnPlaya.push(newCupo)
          } else if (cupo.ultimo_arribo_intermedio == false && (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == null)) {
            if (newCupo.conGPS) {
              newCupo.distancia = this.getKilometros(newCupo.latitud, newCupo.longitud, destino.latitud_destino, destino.longitud_destino)
            }
            tempCupoPendiente.push(newCupo);
          }
        }

        if (tempCupoEnPlaya.length > 0) {
          let temp = new Item();
          temp.id_producto = id_producto;
          temp.producto = producto_destino['nombreProducto'];
          temp.isImagen = true;
          (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
            temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
            temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
            temp.imagen = 'assets/images/products/icono-gral.png';
          temp.enTiempo = 0;
          temp.demorado = 0;
          temp.tarde = 0;
          temp.sinTurno = 0;
          temp.flecha = 1;
          temp.promedioDescargaAhora = 0;
          temp.promedioDescargaMenos1Hora = 0;
          temp.horas = '0 hs';

          let tempsinTurno = 0;
          let tempConTurno = 0;
          let tempTiempo = 0;
          let tempTarde = 0;
          let tempDemorado = 0;
          let tempIndefinido = 0;
          temp.cupos = tempCupoEnPlaya;
          tempCupoEnPlaya.forEach(element => {
            (element.idTurno) ? tempConTurno++ : tempsinTurno++;
            if (element.isEnTiempo)
              tempTiempo++;
            if (element.isTarde)
              tempTarde++;
            if (element.isDemorado)
              tempDemorado++;
            if (element.isIndefinido)
              tempIndefinido++;
          });
          temp.sinTurno = tempsinTurno;
          temp.indefinido = tempIndefinido;
          temp.enTiempo = tempTiempo;
          temp.tarde = tempTarde;
          temp.demorado = tempDemorado;
          temp.conTurno = tempConTurno;
          let tempItem = this.enPlayaAll.find(item => item.id_producto == temp.id_producto);
          if (tempItem == undefined) {
            this.enPlayaAll.push(temp);
          } else {
            tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
            tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
            tempItem.tarde = tempItem.tarde + temp.tarde;
            tempItem.demorado = tempItem.demorado + temp.demorado;
            tempItem.indefinido = tempItem.indefinido + temp.indefinido;
          }
        }

        if (tempCupoPendiente.length > 0) {
          let temp = new Item();
          temp.id_producto = id_producto;
          temp.producto = producto_destino['nombreProducto'];
          temp.isImagen = true;
          (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
            temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
            temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
            temp.imagen = 'assets/images/products/icono-gral.png';
          temp.enTiempo = 0;
          temp.demorado = 0;
          temp.tarde = 0;
          temp.sinTurno = 0;
          temp.flecha = 1;
          temp.promedioDescargaAhora = 0;
          temp.promedioDescargaMenos1Hora = 0;
          temp.horas = '0 hs';

          let tempConTurno = 0;
          let tempsinTurno = 0;
          let tempConCTG = 0;
          let tempConGPS = 0;
          let tempMenosKm = 0;
          let tempMedioKm = 0;
          let tempmasKm = 0;
          temp.cupos = tempCupoPendiente;
          tempCupoPendiente.forEach(element => {
            (element.idTurno) ? tempConTurno++ : tempsinTurno++;
            if (element.ctg)
              tempConCTG++;
            if (element.conGPS) {
              tempConGPS++;
              if (element.distancia < 50)
                tempMenosKm++;
              if (element.distancia >= 50 && element.distancia <= 100)
                tempMedioKm++;
              if (element.distancia > 100)
                tempmasKm++;
            }
          });
          temp.conTurno = tempConTurno;
          temp.sinTurno = tempsinTurno;
          temp.ctg = tempConCTG;
          temp.gps = tempConGPS;
          temp.menosKm = tempMenosKm;
          temp.medioKm = tempMedioKm;
          temp.masKm = tempmasKm;
          let tempItem = this.pendientesAll.find(item => item.id_producto == temp.id_producto);
          if (tempItem == undefined) {
            this.pendientesAll.push(temp);
          } else {
            tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
            tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
            tempItem.tarde = tempItem.tarde + temp.tarde;
            tempItem.demorado = tempItem.demorado + temp.demorado;
          }
        }
      }
    }
  }

  calculosDestinoConPlaya(id_destino) {
    let destino = this.destinos[id_destino]['destino'];
    /* Validacion para que solo recorra los que no son playas */
    if (!destino.es_playa_intermedia) {
      let tiempo_para_demorado = this.dameTiempo(destino.tiempo_para_demorado);
      for (let id_producto in this.destinos[id_destino]['productos']) {
        let producto_destino = this.destinos[id_destino]['productos'][id_producto];
        let tempCupoEnPlaya: Cupo[] = [];
        for (let key in producto_destino['cupos']) {
          let newCupo = new Cupo();
          let cupo = producto_destino['cupos'][key];
          cupo.isIndefinido = cupo.fechaArribado === undefined || cupo.fechaArribado === null ? true : false;
          cupo.fechaArribado = cupo.fechaArribado;
          cupo.fechaDescargado = cupo.fechaDescargado === undefined || cupo.fechaDescargado === null ? cupo.fechaArribado : cupo.fechaDescargado;
          newCupo = cupo;
          if (cupo.latitud && cupo.longitud)
            newCupo.conGPS = true;
          if ((cupo.ultimo_arribo_intermedio == true && ((cupo.ultimo_arribo_intermedio_estado == 3) &&
            (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == 5)
          ))) {
            if (cupo.fechaArribado != null && cupo.inicio && cupo.fin) {
              if (!cupo.isIndefinido) {
                let horita = moment(cupo.fechaArribado).format("HH:mm:ss");
                let horaArribo = this.dameTiempo(horita);
                let inicio = this.dameTiempo(cupo.inicio);
                let fin = this.dameTiempo(cupo.fin);
                if (horaArribo < inicio || horaArribo > fin) {
                  newCupo.isTarde = true;
                } else {
                  let fechaArribo = moment(cupo.fechaArribado);
                  let now = moment(new Date());
                  if (fechaArribo <= now) {
                    let horaActual = now.hour() * 3600 + now.minute() * 60 + now.second();
                    if (horaActual - horaArribo < tiempo_para_demorado)
                      newCupo.isEnTiempo = true;
                    else
                      newCupo.isDemorado = true;
                  } else {
                    newCupo.isEnTiempo = true;
                  }
                }
              }
            };
            tempCupoEnPlaya.push(newCupo)
          }
        }

        if (tempCupoEnPlaya.length > 0) {
          let temp = new Item();
          temp.id_producto = id_producto;
          temp.producto = producto_destino['nombreProducto'];
          temp.isImagen = true;
          (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
            temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
            temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
            temp.imagen = 'assets/images/products/icono-gral.png';
          temp.enTiempo = 0;
          temp.demorado = 0;
          temp.tarde = 0;
          temp.flecha = 1;
          temp.promedioDescargaAhora = 0;
          temp.promedioDescargaMenos1Hora = 0;
          temp.horas = '0 hs';

          let tempsinTurno = 0;
          let tempConTurno = 0;
          let tempTiempo = 0;
          let tempTarde = 0;
          let tempDemorado = 0;
          let tempIndefinido = 0;
          temp.cupos = tempCupoEnPlaya;
          tempCupoEnPlaya.forEach(element => {
            (element.idTurno) ? tempConTurno++ : tempsinTurno++;
            if (element.isEnTiempo)
              tempTiempo++;
            if (element.isTarde)
              tempTarde++;
            if (element.isDemorado)
              tempDemorado++;
            if (element.isIndefinido)
              tempIndefinido++;
          });
          temp.sinTurno = tempsinTurno;
          temp.indefinido = tempIndefinido;
          temp.enTiempo = tempTiempo;
          temp.tarde = tempTarde;
          temp.demorado = tempDemorado;
          temp.conTurno = tempConTurno;
          let tempItem = this.enPlayaAll.find(item => item.id_producto == temp.id_producto);
          if (tempItem == undefined) {
            this.enPlayaAll.push(temp);
          } else {
            tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
            tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
            tempItem.tarde = tempItem.tarde + temp.tarde;
            tempItem.demorado = tempItem.demorado + temp.demorado;
            tempItem.indefinido = tempItem.indefinido + temp.indefinido;
          }
        }
      }
    }
  }

  calculosDestinoSinPlaya(id_destino) {
    let destino = this.destinos[id_destino]['destino'];
    /* Validacion para que solo recorra los que no son playas */
    if (!destino.es_playa_intermedia) {
      let tiempo_para_demorado = this.dameTiempo(destino.tiempo_para_demorado);
      for (let id_producto in this.destinos[id_destino]['productos']) {
        let producto_destino = this.destinos[id_destino]['productos'][id_producto];
        let tempCupoEnPlaya: Cupo[] = [];
        let tempCupoPendiente: Cupo[] = [];
        for (let key in producto_destino['cupos']) {
          let newCupo = new Cupo();
          let cupo = producto_destino['cupos'][key];
          cupo.isIndefinido = cupo.fechaArribado === undefined || cupo.fechaArribado === null ? true : false;
          cupo.fechaArribado = cupo.fechaArribado;
          cupo.fechaDescargado = cupo.fechaDescargado === undefined || cupo.fechaDescargado === null ? cupo.fechaArribado : cupo.fechaDescargado;
          newCupo = cupo;
          if (cupo.latitud && cupo.longitud)
            newCupo.conGPS = true;
          if (cupo.idCupoEstado == 5) {
            if (cupo.fechaArribado != null && cupo.inicio && cupo.fin) {
              if (!cupo.isIndefinido) {
                let horita = moment(cupo.fechaArribado).format("HH:mm:ss");
                let horaArribo = this.dameTiempo(horita);
                let inicio = this.dameTiempo(cupo.inicio);
                let fin = this.dameTiempo(cupo.fin);
                if (horaArribo < inicio || horaArribo > fin) {
                  newCupo.isTarde = true;
                } else {
                  let fechaArribo = moment(cupo.fechaArribado);
                  let now = moment(new Date());
                  if (fechaArribo <= now) {
                    let horaActual = now.hour() * 3600 + now.minute() * 60 + now.second();
                    if (horaActual - horaArribo < tiempo_para_demorado)
                      newCupo.isEnTiempo = true;
                    else
                      newCupo.isDemorado = true;
                  } else {
                    newCupo.isEnTiempo = true;
                  }
                }
              }
            };
            tempCupoEnPlaya.push(newCupo)
          } else if (cupo.ultimo_arribo_intermedio == false && (cupo.idCupoEstado == 1 || cupo.idCupoEstado == 2 || cupo.idCupoEstado == null)) {
            if (newCupo.conGPS) {
              newCupo.distancia = this.getKilometros(newCupo.latitud, newCupo.longitud, destino.latitud_destino, destino.longitud_destino)
            }
            tempCupoPendiente.push(newCupo);
          }
        }

        if (tempCupoEnPlaya.length > 0) {
          let temp = new Item();
          temp.id_producto = id_producto;
          temp.producto = producto_destino['nombreProducto'];
          temp.isImagen = true;
          (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
            temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
            temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
            temp.imagen = 'assets/images/products/icono-gral.png';
          temp.enTiempo = 0;
          temp.demorado = 0;
          temp.tarde = 0;
          temp.flecha = 1;
          temp.promedioDescargaAhora = 0;
          temp.promedioDescargaMenos1Hora = 0;
          temp.horas = '0 hs';

          let tempsinTurno = 0;
          let tempConTurno = 0;
          let tempTiempo = 0;
          let tempTarde = 0;
          let tempDemorado = 0;
          let tempIndefinido = 0;
          temp.cupos = tempCupoEnPlaya;
          tempCupoEnPlaya.forEach(element => {
            (element.idTurno) ? tempConTurno++ : tempsinTurno++;
            if (element.isEnTiempo)
              tempTiempo++;
            if (element.isTarde)
              tempTarde++;
            if (element.isDemorado)
              tempDemorado++;
            if (element.isIndefinido)
              tempIndefinido++;
          });
          temp.sinTurno = tempsinTurno;
          temp.indefinido = tempIndefinido;
          temp.enTiempo = tempTiempo;
          temp.tarde = tempTarde;
          temp.demorado = tempDemorado;
          temp.conTurno = tempConTurno;
          let tempItem = this.enPlayaAll.find(item => item.id_producto == temp.id_producto);
          if (tempItem == undefined) {
            this.enPlayaAll.push(temp);
          } else {
            tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
            tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
            tempItem.tarde = tempItem.tarde + temp.tarde;
            tempItem.demorado = tempItem.demorado + temp.demorado;
            tempItem.indefinido = tempItem.indefinido + temp.indefinido;
          }
        }

        if (tempCupoPendiente.length > 0) {
          let temp = new Item();
          temp.id_producto = id_producto;
          temp.producto = producto_destino['nombreProducto'];
          temp.isImagen = true;
          (temp.producto == 'Soja' || temp.producto == 'Maiz' ||
            temp.producto == 'Girasol' || temp.producto == 'Trigo') ?
            temp.imagen = 'assets/images/products/' + temp.producto + '.png' :
            temp.imagen = 'assets/images/products/icono-gral.png';
          temp.enTiempo = 0;
          temp.demorado = 0;
          temp.tarde = 0;
          temp.sinTurno = 0;
          temp.flecha = 1;
          temp.promedioDescargaAhora = 0;
          temp.promedioDescargaMenos1Hora = 0;
          temp.horas = '0 hs';

          let tempConTurno = 0;
          let tempsinTurno = 0;
          let tempConCTG = 0;
          let tempConGPS = 0;
          let tempMenosKm = 0;
          let tempMedioKm = 0;
          let tempmasKm = 0;
          temp.cupos = tempCupoPendiente;
          tempCupoPendiente.forEach(element => {
            (element.idTurno) ? tempConTurno++ : tempsinTurno++;
            if (element.ctg)
              tempConCTG++;
            if (element.conGPS) {
              tempConGPS++;
              if (element.distancia < 50)
                tempMenosKm++;
              if (element.distancia >= 50 && element.distancia <= 100)
                tempMedioKm++;
              if (element.distancia > 100)
                tempmasKm++;
            }
          });
          temp.conTurno = tempConTurno;
          temp.sinTurno = tempsinTurno;
          temp.ctg = tempConCTG;
          temp.gps = tempConGPS;
          temp.menosKm = tempMenosKm;
          temp.medioKm = tempMedioKm;
          temp.masKm = tempmasKm;
          let tempItem = this.pendientesAll.find(item => item.id_producto == temp.id_producto);
          if (tempItem == undefined) {
            this.pendientesAll.push(temp);
          } else {
            tempItem.sinTurno = tempItem.sinTurno + temp.sinTurno;
            tempItem.enTiempo = tempItem.enTiempo + temp.enTiempo;
            tempItem.tarde = tempItem.tarde + temp.tarde;
            tempItem.demorado = tempItem.demorado + temp.demorado;
          }
        }
      }
    }
  }

  getDescargados(id_puerto) {
    this.descargados = [];
    if (id_puerto == 0) {
      for (let id_destino in this.destinos) {
        let destino = this.destinos[id_destino]['destino'];
        /* Validacion para que solo recorra los que no son playas */
        if (!destino.es_playa_intermedia) {
          for (let id_producto in this.destinos[id_destino]['productos']) {
            let producto_destino = this.destinos[id_destino]['productos'][id_producto];
            for (let key in producto_destino['cupos']) {
              let cupo = producto_destino['cupos'][key];
              cupo.id_producto = id_producto;
              if (cupo.idCupoEstado == '3') {
                this.descargados.push(cupo)
              }
            }
          }
        }
      }
    } else if (!this.esPlaya) {
      for (let id_producto in this.destinos[id_puerto]['productos']) {
        let producto_destino = this.destinos[id_puerto]['productos'][id_producto];
        for (let key in producto_destino['cupos']) {
          let cupo = producto_destino['cupos'][key];
          cupo.id_producto = id_producto;
          if (cupo.idCupoEstado == '3') {
            this.descargados.push(cupo)
          }
        }
      }
    } else {
      /*
        Al ser playa intermedia se cambia el id_puerto para que
        busque los cupos en el respectivo destino y no en la playa intermedia
        y luego recorro los cupos del destino
      */
      for (let id_destino in this.destinos) {
        if (this.destinos[id_destino]['destino'].id_playa_intermedia == id_puerto) {
          id_puerto = this.destinos[id_destino]['destino'].id_destino;
        }
      }
      for (let id_producto in this.destinos[id_puerto]['productos']) {
        let producto_destino = this.destinos[id_puerto]['productos'][id_producto];
        for (let key in producto_destino['cupos']) {
          let cupo = producto_destino['cupos'][key];
          if (cupo.idCupoEstado == '3' || ((cupo.idCupoEstado == '1' || cupo.idCupoEstado == '2' || cupo.idCupoEstado == '5')
            && (cupo.ultimo_arribo_intermedio && cupo.ultimo_arribo_intermedio_estado == 3))) {
            this.descargados.push(cupo)
          }
        }
      }
    }
  }

  getPromediosDescargados() {
    this.descargadosAnterior = 0;
    this.promedioEnPlaya = 0;
    this.descargadosFecha = 0;
    let promedioDescarga = 0;
    let countDescargaHoy = 0;
    let now = moment(new Date());
    let horaActual = now.format('HH:mm:ss');
    let horaActuaMenos1 = now.add(-1, 'hours').format('HH:mm:ss');
    let horaActualNumero = this.dameTiempo(horaActual);
    let horaActualMenos1Numero = this.dameTiempo(horaActuaMenos1);

    this.descargados.forEach(cupo => {
      let fechaArribo = moment(cupo.fechaArribado).format("YYYY-MM-DD");
      let otraHoraArribo = moment(cupo.fechaArribado);
      let fechaCupo = moment(cupo.fechaCupo).format("YYYY-MM-DD");
      let fechaAnterior = moment(cupo.fechaArribado).add(-1, 'days').format("YYYY-MM-DD");
      let otraHoraDescarga = moment(cupo.fechaDescargado);
      if (fechaAnterior == fechaCupo && fechaArribo == this.filtro.fecha) {
        this.descargadosAnterior++;
      }
      else {
        this.descargadosFecha = this.descargadosFecha + 1;
      }
      if (cupo.fechaDescargado) {
        let diferencia = otraHoraDescarga.diff(otraHoraArribo, 'minutes');
        if (diferencia > 0) {
          promedioDescarga += (diferencia);
        }
      }
      countDescargaHoy++;
    });

    if (this.descargados.length > 0 && (!this.esPlaya || this.id_puerto_selected_tab == 0)) {
      this.promedioEnPlaya = this.descargados.length == 0 ? 0 : countDescargaHoy == 0 ? 0 : Math.floor(promedioDescarga / countDescargaHoy / 60);
      let valor = Math.floor((promedioDescarga - (this.promedioEnPlaya * countDescargaHoy * 60)) / countDescargaHoy);
    }

    this.enPlayaAll.forEach(item => {
      let promedioDescargaItemAhora = 0;
      let promedioDescargaItemMenos1Hora = 0;
      let countDescargaItemAhora = 0;
      let countDescargaItemMenos1Hora = 0;
      let otrahoraActualMenos1Numero = now.add(-1, 'hours');

      this.descargados.forEach(cupo => {
        if (cupo.id_producto == item.id_producto) {
          if (cupo.fechaArribado != null && cupo.fechaDescargado != null) {
            let horaArribo = this.dameTiempo(moment(cupo.fechaArribado).format('HH:mm:ss'));
            let otraHoraArribo = moment(cupo.fechaArribado);
            let otraHoraDescarga = moment(cupo.fechaDescargado);
            let diferencia = otraHoraDescarga.diff(otraHoraArribo, 'minutes');
            if (horaArribo >= horaActualMenos1Numero) {
              promedioDescargaItemAhora += (diferencia);
              countDescargaItemAhora++;
            } else {
              promedioDescargaItemMenos1Hora += (diferencia);
              countDescargaItemMenos1Hora++;
            }
          }
        }
      });

      promedioDescargaItemAhora += promedioDescargaItemMenos1Hora;
      countDescargaItemAhora += countDescargaItemMenos1Hora;
      let promedioItemAhoraMin = countDescargaItemAhora > 0 ? Math.floor(promedioDescargaItemAhora / countDescargaItemAhora / 60) : 0;
      item.promedioDescargaAhora = countDescargaItemAhora > 0 ? Math.floor(promedioDescargaItemAhora / countDescargaItemAhora / 60) : 0;
      item.promedioDescargaMenos1Hora = countDescargaItemMenos1Hora > 0 ? Math.floor(promedioDescargaItemMenos1Hora / countDescargaItemMenos1Hora / 60) : 0;
      let promedioItemMenos1HoraMin = countDescargaItemMenos1Hora > 0 ? Math.floor(promedioDescargaItemMenos1Hora / countDescargaItemMenos1Hora / 60) : 0;
      item.flecha = promedioItemAhoraMin < promedioItemMenos1HoraMin ? 1 : 0;
      if (!this.esPlaya) item.horas = item.promedioDescargaAhora.toString() + ' hs';
      let valor = Math.floor((promedioDescargaItemAhora - (item.promedioDescargaAhora * countDescargaItemAhora * 60)) / countDescargaItemAhora);
    });
  }

  crearNavEnPlaya() {
    this.navEnPlaya = [];
    if (this.enPlayaAll.length > 0) {
      let count = Math.floor(this.enPlayaAll.length / 3);
      let fraccion = this.enPlayaAll.length % 3;
      count = fraccion > 0 ? count + 1 : count;
      for (let index = 0; index < count; index++) {
        this.navEnPlaya.push(index);
      }
      this.indexNavPlaya = 0;
    }
  }

  crearNavPendientes() {
    this.navPendientes = [];
    if (this.pendientesAll.length > 0) {
      let count = Math.floor(this.pendientesAll.length / 3);
      let fraccion = this.pendientesAll.length % 3;
      count = fraccion > 0 ? count + 1 : count;
      for (let index = 0; index < count; index++) {
        this.navPendientes.push(index);
      }
      this.indexNavPendiente = 0;
    }
  }

  actualizarEnPlaya(accion) {
    var desde: number = 0;
    var hasta: number = 0;
    switch (accion) {
      case 'init':
        hasta = this.enPlayaAll.length > 3 ? 3 : this.enPlayaAll.length;
        this.enPlaya = [];
        for (let index = 0; index < hasta; index++) {
          const element = this.enPlayaAll[index];
          this.enPlaya.push(element);
        }
        this.indexEnPlaya = 0;
        break;
      case 'next':
        this.indexNavPlaya++;
        var desde: number = this.indexNavPlaya * 3;
        var hasta: number = 0;
        hasta = this.enPlayaAll.length - desde > 3 ? desde + 3 : this.enPlayaAll.length;
        this.enPlaya = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.enPlayaAll[index];
          this.enPlaya.push(element);
        }
        this.indexEnPlaya = desde;
        break;
      case 'previos':
        this.indexNavPlaya--;
        var desde: number = this.indexNavPlaya * 3;
        var hasta: number = 0;
        hasta = this.enPlayaAll.length - desde > 3 ? desde + 3 : this.enPlayaAll.length;
        this.enPlaya = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.enPlayaAll[index];
          this.enPlaya.push(element);
        }
        this.indexEnPlaya = desde;
        break;
      case 'middle':
        desde = this.enPlayaAll.length > 3 ? Math.floor(this.enPlayaAll.length / 2) - 1 : 0;
        hasta = this.enPlayaAll.length - desde > 3 ? desde + 3 : this.enPlayaAll.length - desde;
        this.enPlaya = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.enPlayaAll[index];
          this.enPlaya.push(element);
        }
        this.indexEnPlaya = hasta;
        break;
      case 'last':
        hasta = this.enPlayaAll.length > 3 ? this.enPlayaAll.length - 3 : this.enPlayaAll.length;
        this.enPlaya = [];
        for (let index = hasta; index < this.enPlayaAll.length; index++) {
          const element = this.enPlayaAll[index];
          this.enPlaya.push(element);
        }
        this.indexEnPlaya = hasta;
        break;
      default:
        break;
    }

  }

  actualizarPendiente(accion) {
    var desde: number = 0;
    var hasta: number = 0;
    switch (accion) {
      case 'init':
        let hasta2 = this.pendientesAll.length > 3 ? 3 : this.pendientesAll.length;
        this.pendientes = [];
        for (let index = 0; index < hasta2; index++) {
          const element = this.pendientesAll[index];
          this.pendientes.push(element);
        }
        this.indexPendiente = 0;
        break;
      case 'next':
        this.indexNavPendiente++;
        var desde: number = this.indexNavPendiente * 3;
        var hasta: number = 0;
        hasta = this.pendientesAll.length - desde > 3 ? desde + 3 : this.pendientesAll.length;
        this.pendientes = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pendientesAll[index];
          this.pendientes.push(element);
        }
        this.indexPendiente = desde;
        break;
      case 'previos':
        this.indexNavPendiente--;
        var desde: number = this.indexNavPendiente * 3;
        var hasta: number = 0;
        hasta = this.pendientesAll.length - desde > 3 ? desde + 3 : this.pendientesAll.length;
        this.pendientes = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pendientesAll[index];
          this.pendientes.push(element);
        }
        this.indexPendiente = desde;
        break;
      case 'middle':
        desde = this.pendientesAll.length > 3 ? Math.floor(this.pendientesAll.length / 2) - 1 : 0;
        hasta = this.pendientesAll.length - desde > 3 ? desde + 3 : this.pendientesAll.length - desde;
        this.pendientes = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pendientesAll[index];
          this.pendientes.push(element);
        }
        this.indexPendiente = hasta;
        break;
      case 'last':
        hasta = this.pendientesAll.length > 3 ? this.pendientesAll.length - 3 : this.pendientesAll.length;
        this.pendientes = [];
        for (let index = hasta; index < this.pendientesAll.length; index++) {
          const element = this.pendientesAll[index];
          this.pendientes.push(element);
        }
        this.indexPendiente = hasta;
        break;
      default:
        break;
    }

  }

  actualizarNavTab(accion) {
    var desde: number = 0;
    var hasta: number = 0;
    switch (accion) {
      case 'init':
        hasta = this.tabs.length;
        this.navTabs = [];
        for (let index = 0; index < hasta; index++) {
          const element = this.tabs[index];
          this.navTabs.push(element);
        }
        this.indexTabIni = 0;
        this.indexTabLast = hasta;
        break;
      case 'next':
        var desde: number = this.indexTabIni + 1;
        hasta = this.tabs.length - desde > this.bottonInTab ? desde + this.bottonInTab : this.tabs.length;
        this.navTabs = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.tabs[index];
          this.navTabs.push(element);
        }
        this.indexTabIni = desde;
        this.indexTabLast = hasta;
        break;
      case 'previos':
        var desde: number = this.indexTabIni - 1;
        hasta = this.tabs.length - desde > this.bottonInTab ? desde + this.bottonInTab : this.tabs.length;
        this.navTabs = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.tabs[index];
          this.navTabs.push(element);
        }
        this.indexTabIni = desde;
        this.indexTabLast = hasta;
        break;
      default:
        break;
    }

  }

  gotoPlayaNav(index) {
    this.indexNavPlaya = index;
    var desde: number = index * 3;
    var hasta: number = 0;
    hasta = this.enPlayaAll.length - desde > 3 ? desde + 3 : this.enPlayaAll.length;
    this.enPlaya = [];
    for (let index = desde; index < hasta; index++) {
      const element = this.enPlayaAll[index];
      this.enPlaya.push(element);
    }
    this.indexEnPlaya = desde;
  }

  gotoPendienteNav(index) {
    this.indexNavPendiente = index;
    var desde: number = index * 3;
    var hasta: number = 0;
    hasta = this.pendientesAll.length - desde > 3 ? desde + 3 : this.pendientesAll.length;
    this.pendientes = [];
    for (let index = desde; index < hasta; index++) {
      const element = this.pendientesAll[index];
      this.pendientes.push(element);
    }
    this.indexPendiente = desde;
  }

  aplicarFiltro(valor, cmp) {
    this.data = [];
    switch (valor) {
      case "fecha":
        this.filtro.fecha = this.homeService.formatoFecha(
          cmp.value,
          "amd",
          "-"
        );
    }
    this.getItems();
  }

  /* 
    Esta funcion no se usa en ningun lado, 
    el proximo que la vea si no rompió nada posterior a
    08/01/2021, quitarla.
  */
  // selectTabDestinos(event) {
  //   this.resumenEsActivo = false;
  //   this.selectedTab = event;

  //   event = event == -1 ? 0 : event;
  //   this.filtrar(this.tabs[event].id_puerto)
  //   /*  this.getDescargados(this.tabs[event].id_puerto);
  //    this.getPromediosDescargados();
  //    this.graficar(this.tabs[event].id_puerto); */
  // }

  /* Funcion que detecta el tab seleccionado */
  selectBotonDestinos($event) {
    /* Se recorren tabs para poner en true solo la clickeada */
    this.tabindex = $event.index;
    for (let index = 0; index < this.tabs.length; index++) {
      const element = this.tabs[index];
      element.isActive = index == $event.index ? true : false;
    }
    /* ID Puerto de pestaña seleccionada */
    this.id_puerto_selected_tab = this.navTabs[$event.index].id_puerto;
    /* Para Panel General */
    this.esPlaya = false;
    this.esDestinoConPlaya = false;
    /* Para tipo de destino: Playa, o Destino Con o Sin Playa */
    if (this.id_puerto_selected_tab != 0) {
      this.esPlaya = this.destinos[this.id_puerto_selected_tab]['destino'].es_playa_intermedia;
      if (!this.esPlaya) {
        this.esDestinoConPlaya =
          (this.destinos[this.id_puerto_selected_tab]['destino'].id_playa_intermedia != undefined) ?
            true : false;
      }
    }
    this.filtrar(this.id_puerto_selected_tab);
  }

  /* 
    Esta funcion no se usa en ningun lado, 
    el proximo que la vea si no rompió nada posterior a
    08/01/2021, quitarla.
  */
  // selectTabResumen(event) {
  //   this.tabs.forEach(element => {
  //     element.isActive = false;
  //   });
  //   this.resumenEsActivo = true;
  //   this.selectedTab = -1;
  //   this.change.markForCheck();
  //   this.filtrar(0);
  // }

  refreschTotalEnPlaya(id_puerto) {
    this.totalEnPlaya = {
      cantidad: 0,
      sinTurno: 0,
      enTiempo: 0,
      tarde: 0,
      demorado: 0,
      status: 0,
    }

    if (id_puerto == 0) {
      this.enPlayaAll.forEach(element => {
        this.totalEnPlaya.cantidad = this.totalEnPlaya.cantidad + element.enTiempo + element.tarde + element.demorado + element.sinTurno;
        this.totalEnPlaya.sinTurno = this.totalEnPlaya.sinTurno + element.sinTurno;
        this.totalEnPlaya.enTiempo = this.totalEnPlaya.enTiempo + element.enTiempo;
        this.totalEnPlaya.tarde = this.totalEnPlaya.tarde + element.tarde;
        this.totalEnPlaya.demorado = this.totalEnPlaya.demorado + element.demorado;
        this.totalEnPlaya.status = this.totalEnPlaya.status + element.status;
      });
    } else {
      for (let id_destino in this.valores_estadisticos) {
        if (id_puerto == id_destino) {
          this.enPlayaAll.forEach(element => {
            this.totalEnPlaya.cantidad = this.totalEnPlaya.cantidad + element.enTiempo + element.tarde + element.demorado + element.sinTurno;
            this.totalEnPlaya.sinTurno = this.totalEnPlaya.sinTurno + element.sinTurno;
            this.totalEnPlaya.enTiempo = this.totalEnPlaya.enTiempo + element.enTiempo;
            this.totalEnPlaya.tarde = this.totalEnPlaya.tarde + element.tarde;
            this.totalEnPlaya.demorado = this.totalEnPlaya.demorado + element.demorado;
            this.totalEnPlaya.status = this.totalEnPlaya.status + element.status;
          })
        }
      }
    }
  }

  refreschTotalPendientes(id_puerto) {
    this.totalPendientes = {
      conTurnos: 0,
      sinTurnos: 0,
      conCTG: 0,
      conGPS: 0,
      menosKm: 0,
      medioKm: 0,
      masKm: 0,
    }

    if (id_puerto == 0) {
      this.pendientesAll.forEach(element => {
        this.totalPendientes.conTurnos = this.totalPendientes.conTurnos + element.conTurno;
        this.totalPendientes.sinTurnos = this.totalPendientes.sinTurnos + element.sinTurno;
        this.totalPendientes.conCTG = this.totalPendientes.conCTG + element.ctg;
        this.totalPendientes.conGPS = this.totalPendientes.conGPS + element.gps;
        this.totalPendientes.menosKm = this.totalPendientes.menosKm + element.menosKm;
        this.totalPendientes.medioKm = this.totalPendientes.medioKm + element.medioKm;
        this.totalPendientes.masKm = this.totalPendientes.masKm + element.masKm;
      });
    } else {
      for (let id_destino in this.valores_estadisticos) {
        if (id_puerto == id_destino) {
          this.totalPendientes.conTurnos = this.valores_estadisticos[id_destino].pendientes_con_turno;
          this.totalPendientes.sinTurnos = this.valores_estadisticos[id_destino].pendientes - this.totalPendientes.conTurnos;
          this.totalPendientes.conCTG = this.valores_estadisticos[id_destino].pendientes_con_CTG;
          this.pendientesAll.forEach(element => {
            this.totalPendientes.conGPS = this.totalPendientes.conGPS + element.gps;
            this.totalPendientes.menosKm = this.totalPendientes.menosKm + element.menosKm;
            this.totalPendientes.medioKm = this.totalPendientes.medioKm + element.medioKm;
            this.totalPendientes.masKm = this.totalPendientes.masKm + element.masKm;
          })
        }
      }
    }
  }

  runTimer() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      var currentTime: moment.Moment = moment();
      let tiempoFalta = this.searchEndDate.diff(currentTime)
      tiempoFalta = tiempoFalta / 1000;
      if (tiempoFalta <= 0) {
        this.subscription.unsubscribe();
        if (this.buscarStop) {
          this.buscarStop = false;
          this.getItems();
        }
      }
      else {
        this.minutes = Math.floor(tiempoFalta / 60);
        this.seconds = Math.floor(tiempoFalta - this.minutes * 60);
      }
    })
  }

  graficar(id_puerto) {
    this.iniciarCount();
    if (id_puerto == 0) {
      for (let id_destino in this.destinos) {
        if (!this.destinos[id_destino]['destino'].es_playa_intermedia) {
          for (let id_producto in this.destinos[id_destino]['productos']) {
            for (let key in this.destinos[id_destino]['productos'][id_producto]['cupos']) {
              let fechaArribo = this.dameTiempo(moment(this.destinos[id_destino]['productos'][id_producto]['cupos'][key].fechaArribado).format('HH:mm:ss'));
              for (let index = 0; index < this.cantHoras; index++) {
                if (fechaArribo >= this.lineChart[index] && fechaArribo < this.lineChart[index + 1]) {
                  if (this.destinos[id_destino]['productos'][id_producto]['cupos'][key].idTurno) {
                    this.countConTurno[index] = this.countConTurno[index] + 1;
                  } else {
                    this.countSinTurno[index] = this.countSinTurno[index] + 1;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      /*
        Si es playa intermedia se cambia el id_puerto para que
        busque los cupos en el respectivo destino y no en la playa intermedia
      */
      let es_playa_intermedia = this.destinos[id_puerto]['destino'].es_playa_intermedia;
      if (es_playa_intermedia) {
        for (let id_destino in this.destinos) {
          if (this.destinos[id_destino]['destino'].id_playa_intermedia == id_puerto) {
            id_puerto = this.destinos[id_destino]['destino'].id_destino;
          }
        }
      }
      for (let id_producto in this.destinos[id_puerto]['productos']) {
        for (let key in this.destinos[id_puerto]['productos'][id_producto]['cupos']) {
          let fechaArribo = this.dameTiempo(moment(this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].fechaArribado).format('HH:mm:ss'));
          /* Se debe redefinir la fechaArribo si es playa intermedia */
          if (es_playa_intermedia) {
            if (this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio &&
              this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio_estado == 1) {
              fechaArribo = this.dameTiempo(moment(this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio_fecha_hora).format('HH:mm:ss'));
            }
            /* Se debe redefinir la fechaArribo si es destino final con playa intermedia */
          } else if (this.destinos[id_puerto]['destino'].id_playa_intermedia != undefined) {
            if (this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio &&
              this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio_estado == 3) {
              fechaArribo = this.dameTiempo(moment(this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].ultimo_arribo_intermedio_fecha_hora).format('HH:mm:ss'));
            }
          }
          for (let index = 0; index < this.cantHoras; index++) {
            if (fechaArribo >= this.lineChart[index] && fechaArribo < this.lineChart[index + 1]) {
              if (this.destinos[id_puerto]['productos'][id_producto]['cupos'][key].idTurno) {
                this.countConTurno[index] = this.countConTurno[index] + 1;
              } else {
                this.countSinTurno[index] = this.countSinTurno[index] + 1;
              }
            }
          }
        }
      }
    }

    if (this.fechaBuscadaEsHoy) {
      this.lineChartDataHoy = [{
        data: this.countConTurno,
        label: 'con turno',
        borderWidth: 1
      }, {
        data: this.countSinTurno,
        label: 'sin turno',
        borderWidth: 1
      }];
    } else {
      this.lineChartData = [{
        data: this.countConTurno,
        label: 'con turno',
        borderWidth: 1
      }, {
        data: this.countSinTurno,
        label: 'sin turno',
        borderWidth: 1
      }];
    }
  }

  valorMaximoCupos = 100;
  sharedChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
      position: 'bottom'
    }
  };
  chartColors: Color[] = [{
    backgroundColor: 'rgba(77,83,96,0.2)',
    borderColor: 'rgba(77,83,96,1)',
    //backgroundColor: '#58BCB9',
    //borderColor: '#58BCB9',
    pointBackgroundColor: '#58BCB9',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#D4E6EE',
    borderColor: '#87B1C5',
    // backgroundColor: '##525353',
    // borderColor: '##525353',
    pointBackgroundColor: '##525353',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }];


  lineChartOptions: any = Object.assign({
    animation: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: this.valorMaximoCupos,
        }
      }]
    }
  }, this.sharedChartOptions);
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  lineChartPointsData: Array<any> = [{
    data: [6, 5, 8, 8, 5, 5, 4],
    label: 'con turno',
    borderWidth: 1,
    fill: false,
    pointRadius: 10,
    pointHoverRadius: 15,
    showLine: false
  }, {
    data: [5, 4, 4, 2, 6, 2, 5],
    label: 'sin turno',
    borderWidth: 1,
    fill: false,
    pointRadius: 10,
    pointHoverRadius: 15,
    showLine: false
  }];
  lineChartPointsOptions: any = Object.assign({
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 9,
        }
      }]
    },
    elements: {
      point: {
        pointStyle: 'rectRot',
      }
    }
  }, this.sharedChartOptions);

  loadImageDefault(row) {
    console.log("debe mostrar la imagen por default", this.defaultImagen);
    row.imagen = this.defaultImagen;


  }

  gethoras(time) {
    return Math.floor(time / 3600);
  }

  dameTiempo(time: string) {
    let horas = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(3, 5));
    let segundos = parseInt(time.substring(6, 8));
    return horas * 3600 + minutes * 60 + segundos
  }

  getminutos(time) {
    return Math.floor((time % 3600) / 60);
  }
  getsegundos(time) {
    return time % 60;
  }
  tiempo(hours?, minut?, sec?) {
    return hours * 3600 + minut * 60 + sec
  }

  getKilometros = function (lat1, lon1, lat2, lon2) {
    var R = 6378.137;
    var dLat = this.rad(lat2 - lat1);
    var dLong = this.rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  rad = function (x) { return x * Math.PI / 180; }
}