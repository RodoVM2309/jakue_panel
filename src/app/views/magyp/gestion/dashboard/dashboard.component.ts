import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { MagypService } from '../../../../shared/services/magyp.service';
import { parseNumber } from '@progress/kendo-angular-intl';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]), egretAnimations
  ],
})
export class DashboardComponent implements OnInit {
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  }
  carga: any;
  casos: any;
  casosProvincias: any;
  casosLocalidad: any;
  casosCadena: any;
  cantProvincias = 0;
  cantLocalidades = 0;
  cantCadena = 0;
  zoom = 4;
  previous;
  totalCasos = 0;
  public iconUrlBlue = 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png';
  clusterStyles = [
    {
      textColor: '#fff',
      url: 'assets/images/muvin/marker_cluster_covid.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#fff',
      url: 'assets/images/muvin/marker_cluster_covid.png',
      height: 50,
      width: 50
    },
    {
      textColor: '#fff',
      url: 'assets/images/muvin/marker_cluster_covid.png',
      height: 50,
      width: 50
    }
  ];
  lineChartSteppedData= [{
    data: [],
    label: 'Casos',
    borderWidth: 0,
    fill: true,
    // steppedLine: true
  }];
  public lineChartLabels: Array<any> = [];
  /*
  * Full width Chart Options
  */
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        display: false,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        scaleLabel: {
          display: false,
          labelString: 'Casos Positivos',
          fontColor: '#000000',
          fontSize:10
      },
        ticks: {
          beginAtZero: true,
          suggestedMax: 20,
          fontColor: "#f39a34",
          stepSize: 5
        }
      }]
    }
  };
  clickedMarker(infowindow) {
    console.log("Click en clickMarker");
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  public lineChartColors: Array<any> = [{
    backgroundColor: 'rgba(3, 169, 244, 0.5)',
    borderColor: 'rgba(0,0,0,0)',
    pointBackgroundColor: 'rgba(3, 169, 244, 0.4)',
    pointBorderColor: 'rgba(0, 0, 0, 0)',
    pointHoverBackgroundColor: 'rgba(3, 169, 244, 1)',
    pointHoverBorderColor: 'rgba(148,159,177,0)'
  }];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  constructor(private magypService: MagypService) { }

  ngOnInit() {
    this.getDashboard();
  }

  rezize() {
    this.zoom = 5;
  }

  getDashboard() {
    this.magypService.getInicio()
      .subscribe(
        res => {
          this.totalCasos = 0;
          this.carga = res.data;
          this.casos = [];
          let cant = 0;
          let caso;
          console.log(res);
          if (res.data.por_provincia.length > 0) {
            for (let index = 0; index < res.data.por_provincia.length; index++) {
              cant = 0;
              cant = parseInt(res.data.por_provincia[index].cantidad);
              this.totalCasos = this.totalCasos + cant;
              if (cant > 0) {
                for (let i = 0; i < cant; i++) {
                  caso = {
                    latitud: parseNumber(res.data.por_provincia[index].latitud),
                    longitud: parseNumber(res.data.por_provincia[index].longitud)
                  }
                  this.casos.push(caso);
                }
                setTimeout(() => {
                    this.rezize();
                  }, 2000);
                }

            }

          }
          if (res.data.por_provincia.length > 0) {
            this.casosProvincias = [];
            let provi;
            for (let i = 0; i < res.data.por_provincia.length; i++) {
              provi = {
                nombre: res.data.por_provincia[i].nombreProvincia,
                cantidad: parseInt(res.data.por_provincia[i].cantidad),
                valor:  (parseInt(res.data.por_provincia[i].cantidad)*100/this.totalCasos).toString(),
                cant: parseInt(res.data.por_provincia[i].cantidad).toString()
              }
              if (i < 4) {
                this.casosProvincias.push(provi);
              }
            }
          }

          if (res.data.por_localidad.length > 0) {
            this.casosLocalidad = [];
            let provi;
            for (let i = 0; i < res.data.por_localidad.length; i++) {
              provi = {
                nombre: res.data.por_localidad[i].nombreLocalidad,
                cantidad: parseInt(res.data.por_localidad[i].cantidad),
                valor: parseInt(res.data.por_localidad[i].cantidad)*100/this.totalCasos,
                cant: parseInt(res.data.por_localidad[i].cantidad).toString()
              }
              if (i < 4) {
                this.casosLocalidad.push(provi);
              }
            }
          }

          if (res.data.por_cadena.length > 0) {
            this.casosCadena = [];
            let provi;
            for (let i = 0; i < res.data.por_cadena.length; i++) {
              provi = {
                nombre: res.data.por_cadena[i].nombreCadena,
                cantidad: parseInt(res.data.por_cadena[i].cantidad),
                valor: parseInt(res.data.por_cadena[i].cantidad)*100/this.totalCasos,
                cant: parseInt(res.data.por_cadena[i].cantidad).toString()
              }
              if (i < 4) {
                this.casosCadena.push(provi);
              }
            }
          }

          console.log(res.data.por_fecha);
          console.log(this.casosProvincias);
          console.log(this.casosLocalidad);
          console.log(this.casosCadena);
          console.log(this.casos);


          if (res.data.por_fecha.length > 0) {
            this.lineChartLabels =[];
            this.lineChartSteppedData[0].data=[];

            for (let index = 0; index < res.data.por_fecha.length; index++) {
              this.lineChartLabels.push(res.data.por_fecha[index].fecha);
              this.lineChartSteppedData[0].data.push(parseInt(res.data.por_fecha[index].cantidad));
            }
          }
        },
        error => {

        }
      );
  }
}
