import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { map } from 'rxjs/operators';
import { Destino } from '../models/destino';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllTrabajadores(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/trabajadores')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllChoferesVencidos(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/choferes-vencidos')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllTrabajadoresxRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/trabajadores')
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

