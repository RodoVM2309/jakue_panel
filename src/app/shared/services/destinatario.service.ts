import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../models/global.service';
import { throwError } from 'rxjs';
import { RespuestaHttp } from '../models/respuestaHttp';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
}

@Injectable({
  providedIn: 'root'
})
export class DestinatarioService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getResumen(): Observable<RespuestaHttp> {
    return this.http.get<RespuestaHttp>(this.globalService.apiHost + 'destinatario/resumen?')
  }
  getViajes(id_destino: number, id_producto: number): Observable<RespuestaHttp> {
    const options = {
      params: new HttpParams()
        .set('id_destino', id_destino.toString())
        .set('id_producto', id_producto.toString())
    };
    return this.http.get<RespuestaHttp>(this.globalService.apiHost + 'destinatario/detalle?', options)
  }
  getAllChoferes(): Observable<RespuestaHttp> {
    return this.http.get<RespuestaHttp>(this.globalService.apiHost + 'destinatario/mapa?')
  }
  getDestinatarioByIdPersonaRol(data): Observable<RespuestaHttp> {
    return this.http.get<RespuestaHttp>(this.globalService.apiHost + 'centro-destinatario?Search[id_destinatario]=' + data)
  }
}
