import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { map } from 'rxjs/operators';
import { TransporteChofer } from '../models/transporte-chofer';

const apiUrl = 'http://localhost:3000/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TransporteChoferService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getChoferesSinTransporte(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'chofer/chofer-sin-transportista')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllTransporteChoferes(page, filtro): Observable<any> {
    const options = 
      { params: new HttpParams().set('page', page ).set('Search[nombre_chofer]', filtro) };
    return this.http.get(this.globalService.apiHost + 'transporte-chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postTransporteChofer(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const dat = {  id_chofer: data.id_chofer,alias:data.alias };
    return this.http.post(this.globalService.apiHost + 'transporte-chofer', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postChoferEquipo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'chofer-equipo', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateChoferEquipo(data): Observable<any> {
    
    return this.http.put(this.globalService.apiHost + 'chofer-equipo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }
  updateChoferEquipoFromCentro(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'chofer-equipo/update-centro?id=' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateTransporteChofer(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'transporte-chofer/' + data.id_chofer, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteTransporteChofer(idtransporte, idchofer): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'transporte-chofer/' + idchofer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferByIdPersonaRol(data): Observable<any> {
    const options = data ?
      { params: new HttpParams().set('Search[id_chofer]', data) } : {};
    return this.http.get(this.globalService.apiHost + 'transporte-chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllEquiposSinChofer(id_transportista=null): Observable<any> {
    let idtransporte: string = '';
    if(id_transportista == null){
      idtransporte = ''
    }else{
      idtransporte = id_transportista;
    }
    
    const options = idtransporte ?
      { params: new HttpParams().set('id_transportista', idtransporte) } : {};
    return this.http.get(this.globalService.apiHost + 'equipo/sin-chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllEquiposSinChoferCentro(id_transportista=null): Observable<any> {
    let idtransporte: string = '';
    if(id_transportista == null){
      idtransporte = ''
    }else{
      idtransporte = id_transportista;
    }
    
    const options = idtransporte ?
      { params: new HttpParams().set('id_transportista', idtransporte) } : {};
    return this.http.get(this.globalService.apiHost + 'equipo/sin-chofer-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferEquipo(data): Observable<any> {
    const options = data ?
      { params: new HttpParams().set('search[id_chofer]', data) } : {};
    return this.http.get(this.globalService.apiHost + 'chofer-equipo/equipo-chofer?id_chofer='+data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferEquipoCentro(data): Observable<any> {    
    return this.http.get(this.globalService.apiHost + 'chofer-equipo/equipo-chofer-centro?id_chofer='+data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    
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
