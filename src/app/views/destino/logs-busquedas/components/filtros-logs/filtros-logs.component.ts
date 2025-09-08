import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Variables } from '../../utils/variables';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepicker
} from "saturn-datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { estados } from '../../functions/logs-busqueda';
import { debounceTime } from 'rxjs/operators';
import { FiltroInterno } from '../../interfaces/types';
import { LogsDataSource } from '../listado-logs-busquedas/listado-logs-busquedas.component';
import { HelperService } from '../../services/help.service';

@Component({
  selector: 'app-filtros-logs',
  templateUrl: './filtros-logs.component.html',
  styleUrls: ['./filtros-logs.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class FiltrosLogsComponent implements OnInit {

  @Input() variables: Variables;
  @Input() dataSource: LogsDataSource;

  @ViewChild("picker") dateRange: SatDatepicker<any>;
  @Output() refresh = new EventEmitter<boolean>();
  @Output() filter = new EventEmitter<boolean>();

  formatTimePiker = 24;
  hoursOnly = true;

  filtros: FiltroInterno[] = [];

  constructor(private helpSevices: HelperService) { }

  get horaInit() {
    return this.variables.filtrarForm.get('horaInicio').value;
  }

  ngOnInit() {
    this.variables.filtrarForm.get('placaCamion').valueChanges
      .pipe(debounceTime(500)) // esperar 500 ms después del último cambio
      .subscribe((valueChapa) => {
        this.variables.pageEvent.pageIndex = 1;
        this.refresh.emit(true);
        this.helpSevices.changePaginator(true);
      });

    this.variables.filtrarForm.get('cupo').valueChanges
      .pipe(debounceTime(500)) // esperar 500 ms después del último cambio
      .subscribe((valueCupo) => {
        this.variables.pageEvent.pageIndex = 1;
        this.refresh.emit(true);
        this.helpSevices.changePaginator(true);
      });
  }

  filtroGeneral() {
    this.refresh.emit(true);
  }

  filtroAccion(campo: string) {
    const valorSelect = this.variables.filtrarForm.get(campo).value;
    const index = this.filtros.findIndex(filter => filter.campo == campo);
    if (valorSelect == "Todos") {
      if (index != -1) {
        this.filtros.splice(index, 1);
      }
    } else {
      if (index != -1) {
        this.filtros[index].valor = valorSelect;
      } else {
        this.filtros.push({
          campo: campo,
          valor: valorSelect
        });
      }
    }
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    const filtros = this.filtros;
    this.variables.logsFiltrados = this.variables.logs.filter(objeto => {
      let resultado = true;
      for (const filtro of filtros) {
        switch (filtro.campo) {
          case 'estado':
            if (filtro.valor == "SIN PROCESAR") {
              resultado = resultado &&
                (
                  objeto[filtro.campo] == "1" ||
                  objeto[filtro.campo] == "2" ||
                  objeto[filtro.campo] == "" ||
                  objeto[filtro.campo] == "null" ||
                  objeto[filtro.campo] == null
                );
            } else {
              const id_estado = this.obtenerIdPorClave(filtro.valor, estados);
              resultado = resultado && objeto[filtro.campo] == id_estado;
            }
            break;
          case 'producto':
            resultado = resultado && objeto[filtro.campo] == filtro.valor;
            break;
          case 'terminal':
            resultado = resultado && objeto[filtro.campo] == filtro.valor;
            break;
          case 'cupo':
            resultado = resultado && objeto[filtro.campo] && objeto[filtro.campo].includes(filtro.valor);
            break;
          case 'placaCamion':
            resultado = resultado && objeto[filtro.campo] && objeto[filtro.campo].includes(filtro.valor);
            break;
        }
      }
      return resultado;
    });
    this.dataSource.asyncTable(this.variables);
  }

  obtenerIdPorClave(claveBuscada, estados) {
    for (const id in estados) {
      if (estados[id].clave === claveBuscada) {
        return id;
      }
    }
    return null; // Si no se encontró ninguna coincidencia, devolver null
  }

  clearFilter() {
    // Obtener la fecha y hora actual
    const horaInicio = new Date();

    // Restar 4 horas y 30 minutos
    horaInicio.setHours(horaInicio.getHours() - 4);
    horaInicio.setMinutes(horaInicio.getMinutes() - 30);

    // Formatear la hora en formato "hh:mm AM/PM"
    const formattedHoraInicio = horaInicio.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Obtener la fecha y hora actual
    const horaFin = new Date();

    // Agregar 30 minutos
    horaFin.setMinutes(horaFin.getMinutes() + 30);

    // Formatear la hora en formato "hh:mm AM/PM"
    const formattedHoraFin = horaFin.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    this.variables.filtrarForm.get('fecha').setValue(new Date());
    this.variables.filtrarForm.get('horaInicio').setValue(formattedHoraInicio);
    this.variables.filtrarForm.get('horaFin').setValue(formattedHoraFin);
    this.variables.filtrarForm.get('terminal').setValue("Todos");
    this.variables.filtrarForm.get('producto').setValue("Todos");
    this.variables.filtrarForm.get('estado').setValue("Todos");
    this.variables.filtrarForm.get('placaCamion').setValue("");
    this.variables.filtrarForm.get('cupo').setValue("");

    this.variables.filtrarForm.updateValueAndValidity();

    this.refresh.emit(true);
  }

}
