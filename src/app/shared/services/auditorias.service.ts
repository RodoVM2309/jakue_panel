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

export class AuditoriasService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllAuditorias(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'auditoria-interna', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getV3Auditorias(dateFrom, hourFrom, dateTo, hourTo, username, pageIndex, pageSize): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("dateFrom", dateFrom)
        .set("hourFrom", hourFrom)
        .set("dateTo", dateTo)
        .set("hourTo", hourTo)
        .set("username", username)
        .set('page', pageIndex)
        .set('per-page', pageSize)
    };

    return this.http.get(
      this.globalService.apiHost + "auditoria-interna/filter",options
    );
  }

  getV3Excel(dateFrom, hourFrom, dateTo, hourTo, username): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("dateFrom", dateFrom)
        .set("hourFrom", hourFrom)
        .set("dateTo", dateTo)
        .set("hourTo", hourTo)
        .set("username", username)        
    };

    return this.http.get(
      this.globalService.apiHost + "auditoria-interna/export",options
    );
  }

  /* LOGS DE ERRORES */
  getV3Logs(dateFrom, hourFrom, dateTo, hourTo, username, pageIndex, pageSize): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("dateFrom", dateFrom)
        .set("hourFrom", hourFrom)
        .set("dateTo", dateTo)
        .set("hourTo", hourTo)
        .set("username", username)
        .set('page', pageIndex)
        .set('per-page', pageSize)
    };

    return this.http.get(
      this.globalService.apiHost + "auditoria-interna/filtrar-error",options
    );
  }

  getV3LogExcel(dateFrom, hourFrom, dateTo, hourTo, username): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("dateFrom", dateFrom)
        .set("hourFrom", hourFrom)
        .set("dateTo", dateTo)
        .set("hourTo", hourTo)
        .set("username", username)        
    };

    return this.http.get(
      this.globalService.apiHost + "auditoria-interna/exportar-error",options
    );
  }
  /* */


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
