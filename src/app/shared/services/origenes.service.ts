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

export class OrigenesService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllOrigenes(data): Observable<any> {
    const options =
      {
        params: new HttpParams()
          .set('page', data.page)
          .set('per-page', data.per_page)
          .set('search[descripcion]', data.filtro_descripcion)
      };

    return this.http.get(this.globalService.apiHost + 'origen', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrigenById(id: number): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'origen/' + id)
      .map(this.extractData)
      .catch(this.handleError);

  }

  postOrigen(data): Observable<any> {    
    return this.http.post(this.globalService.apiHost + 'origen', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateOrigen(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'origen/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteOrigen(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'origen/' + data)
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

