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
export class RazonRechazoService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllRazonRechazo(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'motivo-calada-rechazada')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postRazonRechazo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'motivo-calada-rechazada', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateRazonRechazo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'motivo-calada-rechazada/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteRazonRechazo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'motivo-calada-rechazada/' + data)
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
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
