import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { CentroProducto } from '../models/centro-producto';


@Injectable({
  providedIn: 'root'
})
export class CentroProductoService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }
  getCentroProducto(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-producto/select')
      .map(this.extractData)
      .catch(this.handleError);
    ;
  }

  getCentroProductoNoVinculado(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-producto/select-no-vinculados')
      .map(this.extractData)
      .catch(this.handleError);
    ;
  }

  postCentroProducto(producto): Observable<CentroProducto> {
    const dat = { id_producto: producto.id };
    return this.http.post<CentroProducto>(this.globalService.apiHost + 'centro-producto', dat)
  }

  updateCentroProducto(data): Observable<CentroProducto> {
    return this.http.put<CentroProducto>(this.globalService.apiHost + 'centro-producto/' + data.id, data)
  }

  deleteCentroProducto(row): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-producto/'  + row.id)
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

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
