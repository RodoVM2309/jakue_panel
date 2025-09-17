import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppLoaderService } from '@app/shared/services';
import { FunctionLogsBusqueda } from '../../functions/logs-busqueda';
import { LogsBusquedaService } from '../../services/logs-busqueda.service';
import { Variables } from '../../utils/variables';
import { LogsBusqueda } from '../../models/logs-busquedas';
import { MatPaginator, PageEvent, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-listado-logs-busquedas',
  templateUrl: './listado-logs-busquedas.component.html',
  styleUrls: ['./listado-logs-busquedas.component.scss']
})
export class ListadoLogsBusquedasComponent implements OnInit {

  variables = new Variables;

  dataSource: MatTableDataSource<LogsBusqueda>;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    private fb: FormBuilder,
    private logsBusquedaService: LogsBusquedaService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit() {
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

    this.variables.filtrarForm = this.fb.group({
      fecha: [new Date()],
      horaInicio: [formattedHoraInicio],
      horaFin: [formattedHoraFin],
      terminal: ["Todos"],
      procedencia: ["Todos"],
      producto: ["Todos"],
      estado: ["Todos"],
      placaCamion: [""],
      cupo: [""],
    });

    this.dataSource = new MatTableDataSource<LogsBusqueda>();

    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 5;
    this.variables.pageEvent = this.pageEvent;
    this.getItems();
  }

  getItems() {
    this.loader.open();
    FunctionLogsBusqueda.getAllObservable(
      this.logsBusquedaService,
      this.variables
    ).subscribe({
      next: (logs: LogsBusqueda[]) => {
        this.dataSource.data = logs;
        this.variables.logs = logs;
        this.variables.logsFiltrados = logs;
        this.loader.close();
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.loader.close();
      }
    });
  }
}

