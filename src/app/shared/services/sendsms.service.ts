import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../models/global.service';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Request-Method': 'POST'
  })
}

@Injectable({
  providedIn: 'root'
})
export class SendsmsService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  postSMS(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'messenger/sms', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postSMSGroup(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'messenger/sms-group', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postNotificacion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'viaje/notificacion', data)
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
