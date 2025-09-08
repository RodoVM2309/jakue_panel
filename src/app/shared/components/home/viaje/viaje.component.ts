import {  Component, ElementRef, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { egretAnimations } from "../../../animations/egret-animations";
import { MatPaginator, MatSort,  MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { HomeService } from '../home.service';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

import 'rxjs/add/observable/of';
import {  Subscription } from 'rxjs';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { Viaje } from '../../../models/viaje';
@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.scss'],
  animations:egretAnimations
})
export class ViajeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  public getItemSub: Subscription;
   
  public groups: GroupDescriptor[];
  public gridView: DataResult;
  viajes:Viaje[];
  constructor(private homeService: HomeService, 
     public router: Router) { }

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
    this.getItemSub = this.homeService.getAllViajesUser()
      .subscribe(data => {
        this.viajes = data;
        this.gridView = data;
      });
  }

}
