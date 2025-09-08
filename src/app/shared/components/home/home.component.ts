import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { egretAnimations } from "../../animations/egret-animations";
import { MatPaginator, MatSort } from '@angular/material';

import { HomeService } from './home.service';
import { NomencladoresService } from '../../services/nomencladores.service';

import { PedidoDataSource } from '../../services/pedido.datasource';

import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs';

import { Provincia } from '../../models/provincia';
import { Pedido } from '../../models/pedido';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: egretAnimations,
  providers: [HomeService, NomencladoresService]
})
export class HomeComponent implements OnInit {



  constructor(private router: Router) { }

  ngOnInit() {
    console.log("pro");
    let acepto_tyc = parseInt(localStorage.getItem('accept_tyc'));

    if( acepto_tyc == 0 ){
      this.router.navigateByUrl('/sessions/signin');
      return;
    }

  }



}




