import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
@Injectable({
  providedIn: 'root'
})
export class AcopladosService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }
  getAllAcoplados(page, filtro): Observable<any> {   
    const options = { params: new HttpParams().set('page', page).set('Search[patente]', filtro) };
    return this.http.get(this.globalService.apiHost + 'acoplado', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getPatenteAcoplado(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'acoplado/patente-existe?patente=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAcopladoSinEquipo(): Observable<any> {   
    return this.http.get(this.globalService.apiHost + 'acoplado/sin-equipo')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postAcoplado(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'acoplado', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBloquearAcoplado(data): Observable<any> {
    data.bloqueado = 1;
    return this.http.put(this.globalService.apiHost + 'acoplado/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postDesBloquearAcoplado(data): Observable<any> {
    data.bloqueado = 0;
    return this.http.put(this.globalService.apiHost + 'acoplado/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateAcoplado(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'acoplado/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteAcoplado(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'acoplado/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
    if (error.status === 425) {
      return throwError(error.error.data.previous.message);
    }
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
