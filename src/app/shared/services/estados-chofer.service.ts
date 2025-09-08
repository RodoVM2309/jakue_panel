import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadosChoferService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getDataChofer(idchofer): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'chofer/' + idchofer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllEstadosChofer(page, idchofer): Observable<any> {
    const options = 
      {
        params: new HttpParams().set('page', page).set('id_chofer', idchofer)
      } ;
    return this.http.get(this.globalService.apiHost + 'estado-chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postEstadoChofer(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "estado-chofer", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
 

  updateEstadoChofer(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "estado-chofer/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteEstadoChofer(id): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'estado-chofer/' + id)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postHistoricoPremiosSanciones(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "historico-premio-sancion", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateListaChoferes(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "lista-choferes/" + data.id_lista + ',' + data.id_chofer, data)
      .map(this.extractData)
      .catch(this.handleError);
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

  private handleError1(response: any) {
    let errorMessage: any = {};
    // Connection error
    if (response.error.status === 0) {
      errorMessage = {
        success: false,
        status: 0,
        data: 'Sorry, there was a connection error occurred. Please try again.'
      };
    } else {
      errorMessage = response.error;
    }

    return Observable.throw(errorMessage);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
