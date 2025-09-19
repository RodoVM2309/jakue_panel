import { AppLoaderService } from "@app/shared/services";
import { BehaviorSubject, of, Observable } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
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
  // Función para ordenar logs por fechaScan
  export function ordenarLogsPorFechaIngreso(logs: LogsBusqueda[], ascendente: boolean = true): LogsBusqueda[] {
    return logs.sort((a, b) => {
      const fechaA = new Date(a.fechaScan);
      const fechaB = new Date(b.fechaScan);
      
      if (ascendente) {
        return fechaA.getTime() - fechaB.getTime(); // Ascendente: fechas más tempranas primero
      } else {
        return fechaB.getTime() - fechaA.getTime(); // Descendente: fechas más recientes primero
      }
    });
  }

  export function getAll(
    service: LogsBusquedaService,
    loader: AppLoaderService,
    logsSubject: BehaviorSubject<LogsBusqueda[]>,
    loadingSubject: BehaviorSubject<boolean>,
    variables: Variables
  ) {
    // Si se usan BehaviorSubjects (modo original)
    if (logsSubject && loadingSubject) {
      loader.open();

      service.getAll(variables)
        .pipe(
          catchError(() => of([])),
          finalize(() => loadingSubject.next(false))
        )
        .subscribe({
          next: (logs: LogsBusqueda[]) => {
            processLogs(logs, variables);
            loader.close();
            logsSubject.next(variables.logsFiltrados);
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }

  // Función para usar con MatTableDataSource
  export function getAllObservable(
    service: LogsBusquedaService,
    variables: Variables
  ): Observable<LogsBusqueda[]> {
    return service.getAll(variables)
      .pipe(
        catchError(() => of([])),
        map((logs: LogsBusqueda[]) => {
          processLogs(logs, variables);
          return logs;
        })
      );
  }

  // Función helper para procesar logs
  function processLogs(logs: LogsBusqueda[], variables: Variables) {
    // Ordenar por fechaScan según la preferencia del usuario (ascendente por defecto)
    ordenarLogsPorFechaIngreso(logs, variables.ordenAscendente);

    variables.logs = logs;
    variables.logsFiltrados = logs;

    let prod = [];
    let estad = [];
    let dest = [];
    let clien = [];

    // Armo los filtros
    logs.forEach(log => {
      prod.push(log.producto);
      estad.push(log.estado);
      dest.push(log.terminal);
      clien.push(log.procedencia);
    });

    // producto
    variables.productos = prod.filter((valor, indice, self) => {
      return self.indexOf(valor) === indice;
    });

    // destino
    variables.destinos = dest.filter((valor, indice, self) => {
      return self.indexOf(valor) === indice;
    });

    // clientes
    variables.clientes = clien.filter((valor, indice, self) => {
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
    variables.clientes.unshift("Todos");
    variables.estados.unshift({ clave: 'Todos' });

    // Configurar el total para el paginador con todos los registros
    variables.pageEvent.length = variables.logs.length;
  }
}
