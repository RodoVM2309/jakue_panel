import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ReservasService } from 'app/shared/services/reservas.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

export interface Listado {
  nombre: string;
  item: any;
  total: any;
  class: string;
}

@Component({
  selector: 'app-capacidad-terminal',
  templateUrl: './capacidad-terminal.component.html',
  styleUrls: ['./capacidad-terminal.component.scss']
})
export class CapacidadTerminalComponent implements OnInit, OnDestroy {

  subcriptionFiltro: Subscription;
  despachos = [];
  planificacion = [];
  reservas = [];
  saldo = [];
  cupo = [];
  totales = [];

  listas: Listado[] = [];

  nombres = [
    { nombre: 'PLANIFICADOS', indet: 'planificacion', class: '' },
    { nombre: 'CUPOS', indet: 'cupo', class: '' },
    { nombre: 'RESERVAS', indet: 'reservas', class: '' }];

  constructor(private reservasService: ReservasService, private loader: AppLoaderService) {

  }

  ngOnInit() {
    this.cargaIncial();
    this.infoEmitida();

  }
  ngOnDestroy() {
    this.subcriptionFiltro.unsubscribe();
  }

  cargaIncial() {
    this.reservasService.capacidadTerminal().subscribe(resp => {
      this.despachos = Object.values(resp.despachos);
      this.nombres.forEach(data => {
        const list: Listado = {
          nombre: data.nombre,
          item: Object.values(resp[data.indet]),
          total: 0,
          class: data.class
        }
        this.listas.push(list);
      });

      const arrayinicial = new Array(this.despachos.length);

      this.listas.push({
        nombre: 'SALDO',
        item: arrayinicial.fill(0),
        total: 0,
        class: 'strong'
      });
    });
  }

  infoEmitida() {
    this.subcriptionFiltro = this.reservasService.dataCapacidadTerminal$.subscribe(resp => {

      this.listas = [];

      this.despachos = Object.values(resp.despachos);

      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      this.nombres.forEach(data => {
        const list: Listado = {
          nombre: data.nombre,
          item: Object.values(resp[data.indet]),
          total: Object.values(resp[data.indet]).reduce(reducer),
          class: data.class
        }
        this.listas.push(list);
      });

      this.planificacion = Object.values(resp.planificacion);
      this.cupo = Object.values(resp.cupo);
      this.reservas = Object.values(resp.reservas);

      this.saldo = [];

      this.planificacion.forEach((planificacion, index) => {
        let saldo = planificacion - (this.cupo[index] + this.reservas[index]);
        if (saldo < 0) {
          saldo = 0;
        }
        this.saldo.push(saldo);
      });

      this.listas.push({
        nombre: 'SALDO',
        item: this.saldo,
        total: this.saldo.reduce(reducer),
        class: 'strong'
      });
    });
  }
}
