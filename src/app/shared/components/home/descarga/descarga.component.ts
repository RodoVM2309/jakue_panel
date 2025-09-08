import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { egretAnimations } from "../../../animations/egret-animations";
import { MatPaginator, MatSort, MatDialog, MatSnackBar, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { HomeService } from '../home.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { PedidoDataSource } from '../../../services/pedido.datasource';
import 'rxjs/add/observable/of';
import {  Subscription, of } from 'rxjs';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';

@Component({
  selector: 'app-descarga',
  templateUrl: './descarga.component.html',
  styleUrls: ['./descarga.component.scss'],
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
export class DescargaComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public groups: GroupDescriptor[];

  public gridView: DataResult;
  dataSource: PedidoDataSource;
  public getItemSub: Subscription;
  viajes = [];
  rolDador = false;
  countPedido: number;
  rol = localStorage.getItem('rol');

  constructor(private homeService: HomeService, private dialog: MatDialog,
    private nomecladoresServices: NomencladoresService, public router: Router,
     private loader: AppLoaderService,
    ) { }

  ngOnInit() {
    let rol: string = localStorage.getItem('rol');
    if (rol === '5') {
      this.rolDador = true;
    }
    this.loadComponent();    
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  

  getItems() {
    this.getItemSub = this.nomecladoresServices.getAllPedidos()
      .subscribe(data => {
        this.countPedido = data._meta.totalCount;
      });
  }



  public groupChange(groups: GroupDescriptor[]): void {
    this.viajes = [];
    this.loader.open();
    this.groups = groups;
    this.getItemSub = this.homeService.getAllPedidos(0, {})
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          let arrayviaje;
          let arrayviaje1;
          const nombre_centro = data[i].nombre_centro;
          arrayviaje = data[i].viajes;
          arrayviaje1 = data[i].viajes;
          if (arrayviaje.length !== 0) {
            for (let a = 0; a < arrayviaje.length; a++) {
              if (arrayviaje[a].bloqueado === 0 && arrayviaje[a].estado !== 'Descargado') {
                //arrayviaje1[a].concat(nombre_centro);
                this.viajes.push(arrayviaje[a]);
              }
            }
          }
        }
        this.loadProducts(this.viajes);
        this.loader.close();
      });
  }

  private loadProducts(data: any): void {
    this.gridView = process(data, { group: this.groups });
  }

  loadComponent() {
    this.getItemSub = this.homeService.getAllViajes()
      .subscribe(data => {
        let arrayviaje;

        arrayviaje = data;
        if (arrayviaje.length !== 0) {
          for (let a = 0; a < arrayviaje.length; a++) {
            if (arrayviaje[a].bloqueado === 0 && arrayviaje[a].id_estado !== 9) {

              this.viajes.push(arrayviaje[a]);
            }
          }
        }
       
        this.loadProducts(this.viajes);
      });
  }
  loadPedidoPage() {
    this.dataSource.loadPedidos(this.paginator.pageIndex);
  }

}
