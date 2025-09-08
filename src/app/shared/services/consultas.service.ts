import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
//import { WebsocketService } from './websocket.service';


@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(
    private globalService: GlobalService,
    private http: HttpClient,
    //public wsServices: WebsocketService
    ) { }

  getAllConsultas(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'consulta/listado')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllConsultas2(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'consulta/listado2')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllConsultasRecientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'consulta/recientes')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getConsultasByChofer(data): Observable<any> {
    const options = { params: new HttpParams().set('id_chofer', data.id_chofer).set('libre', data.libre) };
    return this.http.get(this.globalService.apiHost + 'consulta/by-chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postConsulta(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'consulta', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  putConsulta(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'consulta/' + data.id_consulta, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  putConsultaLibre(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'consulta-huerfano/' + data.id_consulta, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteConsulta(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'consulta/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteConsulta_libre(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'onsulta-huerfano/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRespuesta(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'respuesta-consulta/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRespuestaHuerfano(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'respuesta-consulta-huerfano/' + data)
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
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
