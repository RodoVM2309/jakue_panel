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
export class PaisService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllPais(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'pais')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postPais(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'pais', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePais(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'pais/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deletePais(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'pais/' + data)
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
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
