import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { GlobalService } from '../models/global.service';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MagypCadena, MagypAutoridad, Test } from 'app/shared/models/magyp-cadena';

@Injectable({
  providedIn: 'root'
})
export class MagypService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllCadena() {
    return this.http.get<any>(this.globalService.apiHost + 'magyp/cadena/listado');
  }

  getCadenas(): Observable<any> {

    return this.http.get(this.globalService.apiHost + 'magyp/cadena/listado')
      .map(this.extractData)
      .catch(this.handleError);
  }


  getContactos(fechas): Observable<any> {

    const options = {
      params: new HttpParams()
        .set("fechaDesde", fechas.fechaDesde)
        .set("fechaHasta", fechas.fechaHasta)
    };

    return this.http.get(this.globalService.apiHost + 'magyp/contacto', options)
      .map(this.extractData)
      .catch(this.handleError);
  }



  getSeguimiento(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'magyp/reporte/seguimiento', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getInicio(): Observable<any> {

    return this.http.get(this.globalService.apiHost + 'magyp/reporte/inicio')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getById(id: string) {
    return this.http.get<MagypCadena>(`${environment.apiURL}magyp/cadena/${id}`);
  }

  add(MagypCadena: MagypCadena): Observable<MagypCadena> {
    return this.http.post<MagypCadena>(`${environment.apiURL}magyp/cadena`, MagypCadena)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(params): Observable<MagypCadena> {
    return this.http.put<MagypCadena>(`${environment.apiURL}magyp/cadena/${params.id}`, params)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: string): Observable<{}> {
    return this.http.delete(`${environment.apiURL}magyp/cadena/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllAutoridades() {
    return this.http.get<any>(this.globalService.apiHost + 'magyp/autoridad-salud/listado');
  }



  getByIdAutoridad(id: string) {
    return this.http.get<MagypAutoridad>(`${environment.apiURL}magyp/autoridad-salud/${id}`);
  }

  addAutoridad(MagypCadena: MagypAutoridad): Observable<MagypAutoridad> {
    return this.http.post<MagypAutoridad>(`${environment.apiURL}magyp/autoridad-salud`, MagypCadena)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAutoridad(params): Observable<MagypAutoridad> {
    return this.http.put<MagypAutoridad>(`${environment.apiURL}magyp/autoridad-salud/${params.id}`, params)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAutoridad(id: string): Observable<{}> {
    return this.http.delete(`${environment.apiURL}magyp/autoridad-salud/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBuscarTestCuit(cuit: string) {
    if (cuit !== '') {
      return this.http.get<any>(`${environment.apiURL}magyp/test?cuit=${cuit}`);
    }
    else {
      return this.http.get<Test[]>(`${environment.apiURL}magyp/test`);
    }
  }
  getBuscarCuit(cuit: string) {
    return this.http.get<any>(`${environment.apiURL}magyp/test/existe-cuit/${cuit}`)
      .map(this.extractCuit)
      .catch(this.handleError);
  }

  postTest(data) {
    return this.http.post<any>(`${environment.apiURL}magyp/test`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMensaje(id: string): Observable<{}> {
    return this.http.delete(`${environment.apiURL}magyp/contacto/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }



  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 425) {
      return throwError(error.error.data);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private extractCuit(res: Response) {
    let body = res;
    return body || false;
  }

}
