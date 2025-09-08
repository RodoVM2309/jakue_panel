import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material';
import { GlobalService } from '@app/shared/models';
import { Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TransportadoraService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getViajes(
    filters: any,
    page: PageEvent,
  ): Observable<any> {
    var params = new HttpParams();
    if (filters.fecha) {
      params = params.set('fecha', filters.fecha);
    }
    if (filters.id_producto && filters.id_producto != 0) {
      params = params.set('id_producto', filters.id_producto);
    }
    params = params.set('page', (page.pageIndex + 1).toString());
    params = params.set('per-page', page.pageSize.toString());

    //params = params.set('sort', '-id');
    const options = { params: params };
    return this.http.get(this.globalService.apiHost + "v3/cupo/transportadora", options)
      .map(this.extractData)
      .catch(this.handleError);;
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 404) {
      return throwError(error.error.data);
    }
    if (error.status === 425) {
      return throwError(error.error.data);
    }
    if (error.status === 426) {
      return throwError(error.error.data.message);
    }
    if (error.status === 500) {
      return throwError(error.error.data.message);
    }
    return throwError(error.message);
  }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
