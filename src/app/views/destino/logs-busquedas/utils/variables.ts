import { FormGroup } from "@angular/forms";
import { LogsBusqueda } from "../models/logs-busquedas";
import { PageEvent } from "@angular/material";

export class Variables {
  showTable: boolean = true;
  filtrarForm: FormGroup;
  logs: LogsBusqueda[] = [];
  logsFiltrados: LogsBusqueda[] = [];
  productos: string[] = [];
  destinos: string[] = [];
  clientes: string[] = [];
  estados: any[] = [];
  filtroActivo: boolean;
  pageEvent: PageEvent = new PageEvent();
}
