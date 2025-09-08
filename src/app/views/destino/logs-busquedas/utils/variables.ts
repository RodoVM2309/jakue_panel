import { FormGroup } from "@angular/forms";
import { LogsDataSource } from "../components/listado-logs-busquedas/listado-logs-busquedas.component";
import { LogsBusqueda } from "../models/logs-busquedas";
import { PageEvent } from "@angular/material";

export class Variables {
  showTable: boolean = true;
  filtrarForm: FormGroup;
  logs: LogsBusqueda[] = [];
  logsFiltrados: LogsBusqueda[] = [];
  productos: string[] = [];
  destinos: string[] = [];
  estados: any[] = [];
  filtroActivo: boolean;
  pageEvent: PageEvent = new PageEvent();
}
