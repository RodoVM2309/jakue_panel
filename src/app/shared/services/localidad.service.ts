import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';


const apiUrl = 'http://localhost:3000/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  postString: string = '';  
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllLocalidad(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'select/localidades?id_provincia=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postLocalidad(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'localidad', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateLocalidad(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'localidad/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteLocalidad(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'localidad/' + data)
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
