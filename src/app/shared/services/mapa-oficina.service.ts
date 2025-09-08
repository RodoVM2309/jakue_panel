import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';

@Injectable({
  providedIn: 'root'
})
export class MapaOficinaService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllMapaOficina(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'mapa-oficina-lnh', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postMapaOficina(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'mapa-oficina-lnh', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMapaOficina(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'mapa-oficina-lnh/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteMapaOficina(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'mapa-oficina-lnh/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllMapaRadares(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'mapa-radar', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postMapaRadares(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'mapa-radar', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMapaRadares(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'mapa-radar/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteMapaRadares(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'mapa-radar/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllMapaRuta(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'mapa-oficina-ruta', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postMapaRuta(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'mapa-oficina-ruta', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMapaRuta(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'mapa-oficina-ruta/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteMapaRuta(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'mapa-oficina-ruta/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllMapaTalleres(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'mapa-taller', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postMapaTalleres(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'mapa-taller', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMapaTalleres(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'mapa-taller/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteMapaTalleres(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'mapa-taller/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    
    if(error.status === 401){
      return throwError(error.error.data.username[0]);
    }
    if(error.status === 425){
      return throwError(error.error.data);
    }
    if(error.status === 500){
      return throwError(error.error.data.previous.message);
    }
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
