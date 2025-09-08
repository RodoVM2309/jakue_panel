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
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': localStorage.getItem('token')
  })
}
const headers = new HttpHeaders({
  'Content-Type': 'application/json; charset=UTF-8',
  'Authorization': 'Bearer ' + localStorage.getItem('token')
});


@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getHojaRuta(fecha_desde, fecha_hasta): Observable<RespuestaHttp> {
    const options = { headers: headers, params: new HttpParams().set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta) };
    return this.http.get<RespuestaHttp>(this.globalService.apiHost + 'viaje/consulta?', options)
  }
}
