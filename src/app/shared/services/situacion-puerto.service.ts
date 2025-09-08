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
export class SituacionPuertoService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllSituacionPuerto(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'situacion-puerto')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postSituacionPuerto(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'situacion-puerto', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateSituacionPuerto(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'situacion-puerto/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteSituacionPuerto(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'situacion-puerto/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getListEstadosPuerto(data): Observable<any> {
    return this.http.get<any>(`${this.globalService.apiHost }situacion-puerto/${data}/lista` )
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
