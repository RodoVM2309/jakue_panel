import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllGrupos(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'grupo-notificaciones', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getConfiguracionNotificaciones(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'configuracion-centro' )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFiltroChoferes(page, idGrupo): Observable<any> {
    const options = {
      params: new HttpParams().set('page', page).set('id_grupo', idGrupo)
    };
    return this.http.get<any>(this.globalService.apiHost + 'grupo-notificaciones/filtro-choferes', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  putConfiguracionMarketing(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-centro' , data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postConfiguracionMarketing(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'configuracion-centro', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postGrupo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'grupo-notificaciones', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postNotificacionesGrupo(data): Observable<any> {     
    const opciones = {
      params: new HttpParams().set('id_grupo', data.id_grupo).set('mensaje', data.mensaje)
    };    
    //return this.http.post(this.globalService.apiHost + 'grupo-notificaciones/filtro-notificacion?id_grupo='+data.id_grupo+'&mensaje='+data.mensaje,opciones)
    return this.http.get(this.globalService.apiHost + 'grupo-notificaciones/filtro-notificacion',opciones)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateGrupo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'grupo-notificaciones/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteGrupo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'grupo-notificaciones/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postNotificacionAcoplado(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'notificaciones-tipo-acoplado', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteNotificacionAcoplado(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'notificaciones-tipo-acoplado/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    
    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 404) {
      return throwError(error.error.data);
    }
    if (error.status === 425) {
      return throwError(error.error.data);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
