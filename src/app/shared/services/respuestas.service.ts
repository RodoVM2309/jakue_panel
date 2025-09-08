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
export class RespuestasService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }
  getAllRespuesta(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'consulta')
      .map(this.extractData)
      .catch(this.handleError);
  }
  postRespuesta(data): Observable<any> {        
      return this.http.post(this.globalService.apiHost + 'respuesta-consulta', data)
      .map(this.extractData)
      .catch(this.handleError);
    /* else{
      return this.http.post(this.globalService.apiHost + 'respuesta-consulta-huerfano', data)
      .map(this.extractData)
      .catch(this.handleError);
    }; */
    
  }

  deleteRespuesta(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'consulta/' + data)
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
