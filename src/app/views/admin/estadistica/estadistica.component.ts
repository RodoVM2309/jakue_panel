import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import {
  MatDialogRef, MatDialog, MatProgressBar, MatButton,  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA
} from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { CentrosService } from '../../../shared/services/centros.service';
import { Ranking } from '../../../shared/models/ranking';
import { ListadoPedidosComponent } from './listado-pedidos/listado-pedidos.component';
import { ListadoViajesComponent } from './listado-viajes/listado-viajes.component';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss'],
  animations: egretAnimations,
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    }
  ]
})
export class EstadisticaComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;
  public chartLinea: BaseChartDirective;
  staticForm: FormGroup;
  minDate: any;
  maxDate: any;
  fecha_desde: any;
  fecha_hasta: any;
  total_viajes = 0;
  total_pedidos = 0;
  total_camiones = 0;
  lista_negra = 0;
  ranking: Ranking[];
  rank1 = 0;
  rank2 = 0;
  rank3 = 0;
  rank4 = 0;
  rank5 = 0;
  showChartLine = false;
  empresaMostrada = '';
  por_mes: any;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes:[{
        ticks:{
          stepSize:1
        }
      }]
    }
  };
  barChartLabels: string[] = [];
  barChartLabels1: string[] = [];
  barChartType = 'bar';
  barChartLegend = true;

  barChartData: any[] = [{ data: [], label: 'Meses/Año' }];
  barChartData1: any[] = [{ data: [], label: 'Producto' }];
  public lineChartColors: any[] = [    
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];



  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public listRankingId: number[] = [];

  public pieChartType: string = 'pie';

  public randomizeType(): void {
   // this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }
  // events

  constructor(private loader: AppLoaderService, private dialog: MatDialog,
    public router: Router, private centrosService: CentrosService,
    private errorService: AppErrorService
    ) { }

  ngOnInit() {
    this.staticForm = new FormGroup({
      desdeDate: new FormControl(new Date(), [Validators.required]),
      hastaDate: new FormControl(new Date(), [Validators.required])
    });
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.desdeDate.value.toISOString();
    this.cargar_estadisticas();

  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === 'desde') {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }
  get f() { return this.staticForm.controls; }

  Ejecutarfiltro() {
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.hastaDate.value.toISOString();
    this.cargar_estadisticas();
    this.showChartLine = false;
  }
  cargar_estadisticas() {
    this.centrosService.getAllEstadisticas(this.fecha_desde, this.fecha_hasta)
      .subscribe(data => {
        this.total_camiones = data.data.cantidad_camiones;
        this.total_pedidos = data.data.cantidad_pedidos;
        this.total_viajes = data.data.cantidad_viajes;
        this.lista_negra = data.data.lista_negra;
        this.ranking = [];
        this.ranking = data.data.ranking;
        this.pieChartLabels = [];
        if (this.ranking.length > 0) {
          this.pieChartData = [];
          this.ranking.forEach(element => {

            this.pieChartLabels.push(element.razon_social);
            this.pieChartData.push(element.cantidad_viajes);
          });
        };
        //this.chart.chart.update();

      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Esta estadística no se pudo cargar, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
  cargarPedidos() {
    let title = 'Listado de pedidos ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListadoPedidosComponent, {
      width: '1200px',
      height: '600px',
      disableClose: true,
      data: { title: title, payload: { fecha_desde: this.fecha_desde, fecha_hasta: this.fecha_hasta } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  cargarViajes() {

    let title = 'Listado de Viajes';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListadoViajesComponent, {
      width: '1200px',
      height: '600px',
      disableClose: true,
      data: { title: title, payload: { fecha_desde: this.fecha_desde, fecha_hasta: this.fecha_hasta } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  public chartClicked(e: any): void {
    this.showChartLine = true;
    const mydataPorMes: string[] = [];
    const mydataPorProducto: string[] = [];
    this.empresaMostrada = this.ranking[e.active[0]._index].razon_social.toString();
    if (this.ranking[e.active[0]._index].tipo.toString() === 'transportista') {
      this.centrosService.getTransportistaEstadistica(this.ranking[e.active[0]._index].id.toString(), this.fecha_desde, this.fecha_hasta)
        .subscribe(data => {
          const mydata: number[] = [];         
          const mydataProducto: number[] = [];         
          for (let j = 0; j < data.data.por_mes.length; j++) {
            mydataPorMes.push(data.data.por_mes[j].mes.toString());
            mydata.push(data.data.por_mes[j].cantidad_viajes);
          };
          for (let j = 0; j < data.data.por_producto.length; j++) {
            mydataPorProducto.push(data.data.por_producto[j].producto.toString());
            mydataProducto.push(data.data.por_producto[j].cantidad_viajes);
          };
          const clone = JSON.parse(JSON.stringify(this.barChartData));
          clone[0].data = mydata;
          this.barChartData = clone;
          const clone1 = JSON.parse(JSON.stringify(this.barChartData1));
          clone1[0].data = mydataProducto;
          this.barChartData1 = clone1;
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Esta estadística no se pudo cargar, intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }
    else {
      this.centrosService.getIntermediarioEstadistica(this.ranking[e.active[0]._index].id.toString(), this.fecha_desde, this.fecha_hasta)
        .subscribe(data => {

          const mydata: number[] = [];         
          const mydataProducto: number[] = [];         
          for (let j = 0; j < data.data.por_mes.length; j++) {
            mydataPorMes.push(data.data.por_mes[j].mes.toString());
            mydata.push(data.data.por_mes[j].cantidad_viajes);
          };
          for (let j = 0; j < data.data.por_producto.length; j++) {
            mydataPorProducto.push(data.data.por_producto[j].producto.toString());
            mydataProducto.push(data.data.por_producto[j].cantidad_viajes);
          };
          const clone = JSON.parse(JSON.stringify(this.barChartData));
          clone[0].data = mydata;
          this.barChartData = clone;
          const clone1 = JSON.parse(JSON.stringify(this.barChartData1));
          clone1[0].data = mydataProducto;
          this.barChartData1 = clone1;

        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Esta estadística no se pudo cargar, intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    };
    this.barChartLabels = mydataPorMes;
    this.barChartLabels1 = mydataPorProducto;
    
  }

  public chartHovered(e: any): void {
  }
}
