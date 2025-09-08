import { Component, OnInit, OnDestroy, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef,  MAT_DIALOG_DATA,  MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { CentrosService } from './../../../../shared/services/centros.service';
import { Page } from '../../../../shared/models/page';

import { HomeService } from './../../../../shared/components/home/home.service';



export class ChoferDisponible {
  id_chofer: number;
  nombre_chofer: string;
  celular: string;
  transportista: string;
  intermediario: string;
  id_tipo_acoplado: number;
  tipo_acoplado: string;
  longitud: number;
  latitud: string;
  distancia: number;
  nombre_centro: string;
}

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListadoPedidosComponent implements OnInit, OnDestroy {
  @ViewChild('myTable') table: any;
  public choferes: ChoferDisponible[];
  public choferesTodos: ChoferDisponible[];
  page = new Page();
  public pedidos: any;
  public tempPedidos: any;
  public fechaDesde: any;
  public fechaHasta: any;
  public  filtro;
  public  filtroNombre;
  public  filtroApellido;
  public getItemSub: Subscription;
  idchoferlibre: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  previous;
  seleccionados = [];
  llamar = false;
  showEmpresa = true;
  rows: any[] = [];
  expanded: any = {};
  timeout: any;
   ELEMENT_DATA:any=  [];
   public viajes_x_asignar = 0;
   public cant = [];
   public cantfalt = [];
   public propioData: any;
   public quantity: any;
   displayedColumns: string[] = ["nombre_centro", "cantidad", "viajes_asignados", "cuantos_faltan"];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);


  public iconUrlGreen = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private centrosService: CentrosService,
    public router: Router, 
    public dialogRef: MatDialogRef<ListadoPedidosComponent>, 
    private homeService: HomeService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }
 
  ngOnInit() {
     
     this.fechaDesde = this.data.payload.fecha_desde;
     this.fechaHasta = this.data.payload.fecha_hasta;
     this.setPage({ offset: 0 });

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
  updateFilter(event) {
    let tempo = [];
    tempo = this.tempPedidos;
    const val = event.target.value.toLowerCase();
    const columns = Object.keys(tempo[0]);
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
    if (val!='')
    this.pedidos = rows;
    else
    this.pedidos= this.tempPedidos; 

  }
 
  updateFilterNombre(event) {
    const val = event.target.value.toLowerCase();
    this.filtroNombre = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  updateFilterApellido(event) {
    const val = event.target.value.toLowerCase();
    this.filtroApellido = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }

   onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.centrosService.getAllPedidosCentro(this.page.pageNumber, this.fechaDesde, this.fechaHasta)
    .subscribe(pagedData => {
      this.pedidos = pagedData.data;
      this.tempPedidos= this.pedidos;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
  toggleExpandRow(row){
    if (row.soy_padre) {
      this.ELEMENT_DATA = [];
    this.viajes_x_asignar = row.viajes_x_asignar;
    this.propioData = {
      nombre_centro: 'Propio',
      cantidad: row.viajes_mios,
      viajes_asignados: (row.viajes_mios -row.viajes_x_asignar)
    };
      this.homeService.getDescendencia(row.id)
      .subscribe(data => {
        this.ELEMENT_DATA.push(this.propioData);
        for (let i = 0; i < data.data.length; i++) {
         this. ELEMENT_DATA.push(data.data[i]);
          this.cant.push(data.data[i].cantidad);
          this.cantfalt.push(data.data[i].cantidad - data.data[i].viajes_asignados);
        }
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      });
    }
    this.table.rowDetail.toggleExpandRow(row);

  }


  onDetailToggle(event) {
  }
}
