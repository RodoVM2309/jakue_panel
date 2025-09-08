import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogsBusqueda } from '../models/logs-busquedas';
import { Variables } from '../utils/variables';
import { DatePipe } from '@angular/common';
import { convertirHora } from '../functions/convert-time';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class LogsBusquedaService {
  private baseUrl = `${environment.apiURL}`;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getAll(variables: Variables): Observable<LogsBusqueda[]> {
    let pageIndex = variables.pageEvent.pageIndex === 0 ? 1 : variables.pageEvent.pageIndex;

    const options = {
      params: new HttpParams()
        .set('page', pageIndex.toString())
        .set('per-page', variables.pageEvent.pageSize.toString())
        .set('cupo', variables.filtrarForm.value.cupo)
        .set('chapa', variables.filtrarForm.value.placaCamion)
        .set("fecha_scan", this.datePipe.transform(variables.filtrarForm.get('fecha').value, 'yyyy-MM-dd'))
    };
    
    // params = params.set("fecha_scan", this.datePipe.transform(variables.filtrarForm.get('fecha').value, 'yyyy-MM-dd'));
    // params = params.set("hora_scan_min", convertirHora(variables.filtrarForm.get('horaInicio').value));
    // params = params.set("hora_scan_max", convertirHora(variables.filtrarForm.get('horaFin').value));
    return this.http
      .get<any>(`${this.baseUrl}cupo/mi-terminal`, options)
      .pipe(
        map((res) => {
          variables.pageEvent.length = res.data.length;
          let result = res.data.map((log) => new LogsBusqueda(log))
          return result
        }),
        catchError(this.handleError)
      );
  }

  // Limpiar parametros url que esten vacios
  removeNullValuesFromQueryParams(params: HttpParams) {
    const paramsKeysAux = params.keys();
    paramsKeysAux.forEach((key) => {
      const value = params.get(key);
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "undefined"
      ) {
        params["map"].delete(key);
      }
    });
    return params;
  }

  // Manejador de errores
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(error.error.data.message);
    }
    if (error.status === 402) {
      let errorData = {
        status: error.status,
        message: error.error.data.mensaje,
      };
      return throwError(errorData);
    }
    if (error.status === 422) {
      let mensaje = "";
      error.error.data.forEach((element) => {
        mensaje =
          mensaje === "" ? element.message : mensaje + ", " + element.message;
      });
      let errorData = {
        status: error.status,
        message: mensaje,
      };
      return throwError(errorData);
    }
    if (error.status === 425) {
      return throwError(error.error.data.message.errors);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
    return throwError("Something bad happened; please try again later.");
  }
}
