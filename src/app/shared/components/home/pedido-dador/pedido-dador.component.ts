import {Component, ElementRef, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { egretAnimations } from "../../../animations/egret-animations";
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';

import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs';

import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { AddPedidoDadorRetornoComponent } from '../add-pedido-dador-retorno/add-pedido-dador-retorno.component';
import { AddPedidoDadorComponent } from '../add-pedido-dador/add-pedido-dador.component';
import { Pedido } from '../../../models/pedido';
@Component({
  selector: 'app-pedido-dador',
  templateUrl: './pedido-dador.component.html',
  styleUrls: ['./pedido-dador.component.scss'],
  animations:egretAnimations
})
export class PedidoDadorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  public getItemSub: Subscription;
   
  public groups: GroupDescriptor[];
  public gridView: DataResult;
  pedidos:Pedido[];
  constructor( private dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.getItems();
  }
   groupChange(groups: GroupDescriptor[], data: any): void {
    this.groups = groups;
    this.loadProducts(data);
  }

  loadProducts(data: any): void {
    this.gridView = process(data, { group: this.groups });
  }

  cargar_viajes(data: any): void {
    this.gridView = data;
  }
  
  getItems() {
  }
  gotoAddPedido(){
    let title = 'Agregar Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoDadorComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }

  gotoAddPedidoRetorno(){
    let title = 'Agregar Pedido Retorno';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoDadorRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }
}
