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
export class ListaNegraMotivosService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllListaNegraMotivo(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'lista-negra-motivo')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllListaNegraMotivoSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'lista-negra-motivo/select')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postListaNegraMotivo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'lista-negra-motivo', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateListaNegraMotivo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'lista-negra-motivo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteListaNegraMotivo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'lista-negra-motivo/' + data)
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
