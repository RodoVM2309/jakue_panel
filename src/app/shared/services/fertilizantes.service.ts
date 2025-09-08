import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';


import { GlobalService } from '../models/global.service';
import { map, catchError, tap } from 'rxjs/operators';

//Modelos
import { TiposDespachos, ListadoProductosFertilizantes, ListaRolFertilizante, ListadoOrigenesFetilizantes, PedidoFertilizantes } from '../models/fertilizantes.model';

import { ChoferZona } from '../models/chofer-zona';


@Injectable({
  providedIn: 'root'
})

export class FertilizantesService {

  infoChofer$ = new EventEmitter<ChoferZona>();

  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getTipoDespachoOrigen(id: number): Observable<any> {
    return this.http.get(this.globalService.apiHost + "destino/producto-destino?m=F&id=" + id);
  }

  getTipoDespacho(): Observable<TiposDespachos> {
    return this.http.get<TiposDespachos>(this.globalService.apiHost + "/producto/tipo-despacho");
  }

  getProductos(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + `/producto/productos-fertilizantes`);
  }

  getProductosFertilizantes(): Observable<ListadoProductosFertilizantes> {
    return this.http.get<ListadoProductosFertilizantes>(this.globalService.apiHost + `producto/select?m=F`);
  }

  getDetalleProductoFertilizantes(id: number): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + `producto/detalle-by-producto?id_producto=${id}`);
  }

  getPersonaRolFertilizantes(): Observable<ListaRolFertilizante> {
    return this.http.get<ListaRolFertilizante>(this.globalService.apiHost + `persona-rol/usuarios-fertilizantes`);
  }
  getSolicitante(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + `destino-persona/solicitar`).pipe(
      map(resp => resp['data'])
    );
  }

  getProovedores(): Observable<any> {
    return this.http.get(this.globalService.apiHost + `destino-persona/cargar-proveedores`);
  }

  getOrigenes(id_pr: any): Observable<ListadoOrigenesFetilizantes> {
    return this.http.get<ListadoOrigenesFetilizantes>(this.globalService.apiHost + `destino-persona/my?solucion_muvin=true&id_persona_rol=${id_pr}&m=F`);
  }


  getValidarDatosImportados(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'pedido/validar-producto', data)
      .pipe(
        map(resp => resp['data']['mensaje'])
      );
  }

  updateChoferReserva(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'pedido/asignar-chofer', data);
  }

  updateChoferReservaSeguimiento(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'pedido/asignar-chofer-seguimiento', data);
  }

  getDatosChofer(cuit): Observable<any> {
    return this.http.get(this.globalService.apiHost + `pedido/check-chofer?cuit=${cuit}`)
      .pipe(
        map(resp => resp['data'])
      );
  }

  postPedidoFertilizantes(data): Observable<any> {
    /* console.log("==== POST PEDIDO FERTILIZANTE ====",data)
    return this.http.post<any>(this.globalService.apiHost + 'pedido', data) */
    return this.http.post<any>(this.globalService.apiHost + 'pedido/insert-lote', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePedidoFertilizantes(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + `pedido/${data.id}`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // BUSCAR TURNOS

  getBuscarTurno(filtro): Observable<any> {
    return this.http.post(this.globalService.apiHost + "seguimiento/buscar", filtro);
  }

  confirmarArribo(dato): Observable<any> {
    return this.http.post(this.globalService.apiHost + "seguimiento/confirmar-arribo", dato);
  }

  //BANDAS HORARIAS FERTILIZANTES

  getFetilizantesOrigen(solucion_muvin = false): Observable<any> {
    return this.http.get(this.globalService.apiHost + `destino-persona/my?m=F&solucion_muvin=${solucion_muvin}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.message);//.username[0]
    }
    if (error.status === 425) {
      return throwError(error.error.data);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
    if (error.status === 405) {
      return throwError(error.error.data);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }



}
