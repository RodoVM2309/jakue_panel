import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppLoaderService } from '@app/shared/services';
import { FunctionLogsBusqueda } from '../../functions/logs-busqueda';
import { LogsBusquedaService } from '../../services/logs-busqueda.service';
import { Variables } from '../../utils/variables';
import { LogsBusqueda } from '../../models/logs-busquedas';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-listado-logs-busquedas',
  templateUrl: './listado-logs-busquedas.component.html',
  styleUrls: ['./listado-logs-busquedas.component.scss']
})
export class ListadoLogsBusquedasComponent implements OnInit {

  variables = new Variables;

  dataSource: LogsDataSource;
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
      producto: ["Todos"],
      estado: ["Todos"],
      placaCamion: [""],
      cupo: [""],
    });

    this.dataSource = new LogsDataSource(this.logsBusquedaService, this.loader);

    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
    this.variables.pageEvent = this.pageEvent;
    this.getItems();
  }

  getItems() {
    this.dataSource.loadAllLogs(
      this.variables
    );
    this.loader.close();
  }
}

export class LogsDataSource implements DataSource<LogsBusqueda> {
  private logsSubject = new BehaviorSubject<LogsBusqueda[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private logsBusquedaService: LogsBusquedaService,
    private loader: AppLoaderService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<LogsBusqueda[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadAllLogs(variables: Variables) {
    this.loadingSubject.next(true);

    FunctionLogsBusqueda.getAll(
      this.logsBusquedaService,
      this.loader,
      this.logsSubject,
      this.loadingSubject,
      variables
    );
  }

  asyncTable(variables: Variables) {
    this.logsSubject.next(variables.logsFiltrados);
  }
}

