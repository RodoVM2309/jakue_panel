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
    'Content-Type': 'application/json; charset=UTF-8'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllZonas(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'zonas', {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  postZona(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const dat = { descripcion: data.descripcion };
    return this.http.post(this.globalService.apiHost + 'zonas', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateZona(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'zonas/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteZona(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'zonas/' + data)
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
