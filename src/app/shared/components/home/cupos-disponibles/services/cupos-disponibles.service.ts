import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { GlobalService } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { CuposDisponible, DestinoFilter, OrigenDestino, Transportadora } from '../models/cupos-disponible';
import { Destino } from '@app/shared/models/destino';

@Injectable({
  providedIn: 'root'
})
export class CuposDisponiblesService {

  constructor(private globalService: GlobalService,
    private http: HttpClient) { }



  getTransportadoras(): Observable<Transportadora[]> {
    return this.http.get<Transportadora[]>(this.globalService.apiHost + 'centro-intermediario/select')
      .pipe(
        map(response => response['data']),
      )
      .catch(this.handleError);
  }

  getOrigenDestinos(fecha,id_producto): Observable<OrigenDestino[]> {
    let params = new HttpParams()
    if(fecha){
      params = params.set('fecha', fecha);
    }
    if(id_producto){
      params = params.set('id_producto', fecha);
    }
    const options = { params: params };
    return this.http.get<OrigenDestino[]>(this.globalService.apiHost + 'origen/disponibles',options)
      .pipe(
        map(response => response['data']),
      )
      .catch(this.handleError);
  }

  getDestinos(fecha,id_producto): Observable<DestinoFilter[]> {
    let params = new HttpParams()
    if(fecha){
      params = params.set('fecha', fecha);
    }
    if(id_producto){
      params = params.set('id_producto', fecha);
    }
    const options = { params: params };
    return this.http.get<DestinoFilter[]>(this.globalService.apiHost + 'destino/disponibles',options)
      .pipe(
        map(response => response['data']),
      )
      .catch(this.handleError);
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

  /**
   * metodo clonado donde se tendra en cuanta para que me devuelva sin paginar para exportar excel
   * @param filtro param filtros panel pedido
   * @param page numero de pagina
   * @param perPage
   * @returns
   */
  getCuposDisponiblesFilters(filtro, page, perPage, todos:string): Observable<CuposDisponible[]> {
    console.log("xx",todos)
    let params = new HttpParams()
      .set('fecha', (filtro.fechaCupo !== "") ? filtro.fechaCupo : '')
      .set('page', page)
      .set('per-page', perPage)
      .set('sort', 'idCupoTerminal')

    if (filtro.id_producto !== null && filtro.id_producto != '0') {
      params = params.set('id_producto', filtro.id_producto);
    }
    if(filtro.id_transportadora !== null && filtro.id_transportadora != '0'){
      params = params.set('id_transportadora', filtro.id_transportadora);
    }
    if(filtro.id_origen !== null && filtro.id_origen != '0'){
      params = params.set('id_origen', filtro.id_origen);
    }
    if(filtro.id_destino !== null && filtro.id_destino != '0'){
      params = params.set('id_destino', filtro.id_destino);
    }
    if (todos !== undefined && todos !== null) {
      params = params.set('todos', todos);
    }
    const options = { params: params };
    return this.http.get<CuposDisponible[]>(this.globalService.apiHost + 'v3/cupo/disponibles', options)
    .pipe(
      map(response => response['data']),
    )
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
