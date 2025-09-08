import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  equipo: Equipo[];

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllEquipos(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page )} ;
    return this.http.get(this.globalService.apiHost + 'equipo/equipo-transporte', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getEquipoxCamion(idCamion): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'equipo?search[id_camion]?=' + idCamion)
      .map(this.extractData)
      .catch(this.handleError);

  }
  getEquipoxAcoplado(idAcoplado): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'equipo?search[id_acoplado]?=' + idAcoplado)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postEquipo(data): Observable<any> {
    let newEquipo: any;
    if (data.id_camion == '') return;
    if (data.id_acoplado == '')
      newEquipo = {
        id_camion: (data.id_camion != null ? data.id_camion : '')
      }
    else
      newEquipo = {
        id_camion: (data.id_camion != null ? data.id_camion : ''),
        id_acoplado: (data.id_acoplado != null ? data.id_acoplado : '')
      }
    return this.http.post(this.globalService.apiHost + 'equipo', newEquipo)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBloquearEquipo(data): Observable<any> {
    data.bloqueado = 1;
    //console.log(' postConfirmViaje');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'equipo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postDesBloquearEquipo(data): Observable<any> {
    data.bloqueado = 0;
    //console.log(' postConfirmViaje');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'equipo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateEquipo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'equipo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteEquipo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'equipo/' + data)
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
