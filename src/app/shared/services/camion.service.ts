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
export class CamionService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllCamiones(page,filtro): Observable<any> {
    const options = { params: new HttpParams().set('Search[patente]', filtro).set('page', page) } ;
    return this.http.get(this.globalService.apiHost + 'camion',options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPatenteCamion(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'camion/patente-existe?patente=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCamionSinEquipo(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'camion/sin-equipo')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCamion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'camion', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBloquearCamion(data): Observable<any> {
    data.bloqueado = 1;
    return this.http.put(this.globalService.apiHost + 'camion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postDesBloquearCamion(data): Observable<any> {
    data.bloqueado = 0;
    return this.http.put(this.globalService.apiHost + 'camion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCamion(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'camion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteCamion(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'camion/' + data)
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
      return throwError(error.error.data.message.errors);
    }
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
