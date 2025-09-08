import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../models/global.service';
import { throwError } from 'rxjs';

import { Inconsistencia } from 'app/shared/models/inconsistencia';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CcppService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllCabeceras(page, perPage): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('per-page', perPage)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/cabecera', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllCabecerasNotPagination(): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/cabecera', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  selectCabeceras(): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.get<any>(this.globalService.apiHost + 'v3/cabecera/select', {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCabecera(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'v3/cabecera', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIdCabecera(id): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'v3/cabecera/' + id, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCabecera(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'v3/cabecera/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCabecera(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'v3/cabecera/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getInconsistencias(page, perPage): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('per-page', perPage)
    }
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/inconsistencia', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCcpp(page): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
    }
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/ccpp', {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCartaPorte(id): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    /*  const options ={ params: new HttpParams()
         .set( 'page',page)
     } */
    return this.http.get<any>(this.globalService.apiHost + 'v3/ccpp/' + id, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCcpp(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'v3/ccpp', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCcpp(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'v3/ccpp/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  editarCcpp(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'v3/ccpp/' + data.id + '/intervinientes', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAuditorias(page, perPage): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('per-page', perPage)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  searchCabecera(titulo): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('titulo', titulo)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/cabecera', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  searchAuditoria(cupo, page): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('alfanumerico', cupo)
        .set('page', page)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAuditoriasLeidas(page): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/leida', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCentroEmpresa(page, filtro): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('nombre_interno', filtro.nombre_interno)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/centro-interno', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCentroInterno(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'v3/centro-interno', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postAuditoria(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'v3/auditoria/leida', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getConsultas(page): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set('page', page)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/ccpp', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  searchConsultas(objBusq): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set(objBusq.campo, objBusq.valor)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/ccpp', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  previewAuditoria(objBusq): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    const options = {
      params: new HttpParams()
        .set(objBusq.campo, objBusq.valor)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/auditoria/ccpp', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postAplicarCabecera(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'v3/cupo/aplicar-cabecera', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  sendMensaje(data): Observable<any> {
    var formData: any = new FormData();
    formData.append('email', data.email);
    formData.append('cuerpo', data.cuerpo);
    formData.append('adjunto', data.adjunto, data.adjunto.name);
    return this.http.post(this.globalService.apiHost + 'v3/auditoria/send-mensaje', formData)
      .map(this.extractData)
      .catch(this.handleError);
  }
  sendMensaje_inc(data, nomb_pdf, mailusuario): Observable<any> {
    var formData: any = new FormData();
    formData.append('email', mailusuario);
    formData.append('cuerpo', data.cuerpo);
    formData.append('adjunto', data.adjunto, nomb_pdf);
    return this.http.post(this.globalService.apiHost + 'v3/auditoria/send-mensaje', formData)
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
