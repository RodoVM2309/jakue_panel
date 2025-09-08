import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { Page } from '../../../../shared/models/page';
import { CentrosService } from './../../../../shared/services/centros.service';
import { Viaje } from './../../../../shared/models/viaje';


@Component({
  selector: 'app-listado-viajes',
  templateUrl: './listado-viajes.component.html',
  styleUrls: ['./listado-viajes.component.scss']
})
export class ListadoViajesComponent implements OnInit, OnDestroy { 
  public viajes: Viaje[];
  public tempViajes: Viaje[];
  public tempViaje: Viaje;
  page = new Page();  
  public getItemSub: Subscription;
  public fechaDesde: any;
  public fechaHasta: any;
  
  @ViewChild('myTable') table: any;
  
  public iconUrlGreen = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private centrosService: CentrosService,
    public router: Router,
    public dialogRef: MatDialogRef<ListadoViajesComponent>,) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }
 
  ngOnInit() {
     /* this.cargarTodos()
     this.setPage({ offset: 0 }); */
     this.fechaDesde = this.data.payload.fecha_desde;
     this.fechaHasta = this.data.payload.fecha_hasta;
     this.setPage({ offset: 0 });
     
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.centrosService.getAllViajes(this.page.pageNumber, this.fechaDesde, this.fechaHasta)
    .subscribe(pagedData => {
      this.viajes = pagedData.data;
      this.tempViajes= this.viajes;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
 
  getRowHeight(row) {
    if (!row) return 50;
    if (row.height === undefined) return 50;
    return row.height;
  }
  toggleExpandRow(row){
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
  }
  updateFilter(event) {
    let tempo = [];
    tempo = this.tempViajes;
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
    this.viajes = rows;
    else
    this.viajes= this.tempViajes; 
  }
 
  
}
