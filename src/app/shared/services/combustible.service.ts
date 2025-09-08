import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { map } from 'rxjs/operators';
import { RetiroCombustible } from '../models/retiro-combustible';
@Injectable({
  providedIn: 'root'
})
export class CombustibleService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllRetiroCombustible(page,filtro): Observable<any> {
    const options = { params: new HttpParams()
      .set('page', page)
      .set('nombreChofer',filtro.nombre)
      .set('cuitChofer',filtro.cuit)
      .set('nombreTransportista',filtro.transportista)
      .set('patenteCamion',filtro.patente)
      .set('estado',filtro.estado!=-1 ? filtro.estado:'')
     };
    return this.http.get(this.globalService.apiHost + 'retiro-combustible/by-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getSearchRetiroCombustible(page,filtro): Observable<any> {
    const options = { params: new HttpParams()
      .set('page', page)
      .set('nombreChofer',filtro.nombre)
      .set('cuitChofer',filtro.cuit)
      .set('nombreTransportista',filtro.transportista)
      .set('patenteCamion',filtro.patente)
      .set('estado',filtro.estado!=-1 ? filtro.estado:'')
     };
    return this.http.get(this.globalService.apiHost + 'retiro-combustible/by-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postRetiroCombustible(data): Observable<RetiroCombustible> {   
    return this.http.post<RetiroCombustible>(this.globalService.apiHost + 'retiro-combustible', data)
  }

  updateRetiroCombustible(data): Observable<RetiroCombustible> {
    return this.http.put<RetiroCombustible>(this.globalService.apiHost + 'retiro-combustible/' + data.id, data)
  }

  deleteRetiroCombustible(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'retiro-combustible/' + data.id)  
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
}
