import { AppLoaderService } from "@app/shared/services";
import { BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LogsBusqueda } from "../models/logs-busquedas";
import { LogsBusquedaService } from "../services/logs-busqueda.service";
import { Variables } from "../utils/variables";

export const estados = {
  1: { clave: 'SIN PROCESAR', bgColor: '#C9BC5E', color: '#000' },
  2: { clave: 'SIN PROCESAR', bgColor: '#C9BC5E', color: '#000' },
  3: { clave: 'DESCARGADO', bgColor: '#009DE0', color: '#fff' },
  4: { clave: 'RECHAZADO', bgColor: '#007CD8', color: '#fff' },
  5: { clave: 'ARRIBADO', bgColor: '#006CB1', color: '#fff' },
};

export module FunctionLogsBusqueda {
  export function getAll(
    service: LogsBusquedaService,
    loader: AppLoaderService,
    logsSubject: BehaviorSubject<LogsBusqueda[]>,
    loadingSubject: BehaviorSubject<boolean>,
    variables: Variables
  ) {
    loader.open();

    service.getAll(variables)
      .pipe(
        catchError(() => of([])),
        finalize(() => loadingSubject.next(false))
      )
      .subscribe({
        next: (logs: LogsBusqueda[]) => {
          variables.logs = logs;
          variables.logsFiltrados = logs;

          let prod = [];
          let estad = [];
          let dest = [];

          // Armo los filtros
          logs.forEach(log => {
            prod.push(log.producto);
            estad.push(log.estado);
            dest.push(log.terminal);
          });

          // producto
          variables.productos = prod.filter((valor, indice, self) => {
            return self.indexOf(valor) === indice;
          });

          // destino
          variables.destinos = dest.filter((valor, indice, self) => {
            return self.indexOf(valor) === indice;
          });

          // estado
          const estadTemp = estad.map(id => estados[id] || { clave: 'SIN PROCESAR', color: '#C9BC5E' });
          variables.estados = estadTemp.filter((el, index) => {
            return index === estadTemp.findIndex(obj => {
              return obj.clave === el.clave;
            });
          });

          // add todos
          variables.productos.unshift("Todos");
          variables.destinos.unshift("Todos");
          variables.estados.unshift({ clave: 'Todos' });

          // Asegurar que el total del paginador sea correcto al cargar inicialmente
          if (!variables.pageEvent.length || variables.pageEvent.length === 0) {
            variables.pageEvent.length = variables.logs.length;
          }

          loader.close();

          logsSubject.next(variables.logsFiltrados);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
}
