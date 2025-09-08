import 'rxjs/add/operator/map';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';


import { GlobalService } from '../models/global.service';
import { map, catchError, tap } from 'rxjs/operators';
import { DetalleReserva, FiltrosSeguimiento } from '../models/fertilizantes.model';
import { HomeService } from '../components/home/home.service';



@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  filtros$ = new EventEmitter<any>();
  dataCapacidadTerminal$ = new EventEmitter<any>();
  dataReservas$ = new EventEmitter<any>();

  constructor(private globalService: GlobalService, private http: HttpClient, private homeService: HomeService) { }

  getSelectZonasClientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "seguimiento/select-zona-cliente").pipe(
      map(resp => resp['data'])
    );
  }
  getGrupoClientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "seguimiento/select-grupo-cliente").pipe(
      map(resp => resp['data'])
    );
  }
  getClientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "seguimiento/select-clientes").pipe(
      map(resp => resp['data'])
    );
  }
  getDataCuit(cuit:any): Observable<any> {
    return this.http.get(this.globalService.apiHost + "seguimiento/cuit-verify?cuit=" + cuit).pipe(
      map(resp => resp['data'])
    );
  }

  capacidadTerminal(): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-capacidad-terminal`)
      .pipe(
        map(resp => resp['data']['capacidad_terminal'])
      );
  }
  sendFiltrosCapacidadTerminal(data): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-capacidad-terminal?id_origen=${data.id_origen}&fecha=${data.fecha}&id_grupo_cliente=${data.id_grupo_cliente}&id_cuenta_cliente=${data.id_cuenta_cliente}&id_zona=${data.id_zona}`)
      .pipe(
        map(resp => resp['data']['capacidad_terminal'])
      );
  }

  reservas(): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-reservas`);
  }
  sendFiltrosReservas(data): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-reservas?id_origen=${data.id_origen}&fecha=${data.fecha}&id_grupo_cliente=${data.id_grupo_cliente}&id_cuenta_cliente=${data.id_cuenta_cliente}&id_zona=${data.id_zona}&page=${data.page}&per-page=${data.perPage}`);
  }

  detalleReservas(data): Observable<DetalleReserva> {
    //console.log(data);
    let idPedido = (data.id_pedido) ? `&id_pedido=${data.id_pedido}` : '';
    return this.http.get<DetalleReserva>(
      this.globalService.apiHost + `seguimiento/detalle-reservas?id_cuenta_cliente=${data.id_cuenta_cliente}&id_origen=${data.id_origen}&fecha=${data.fecha}&estado=${data.estado}${idPedido}`)
      .pipe(
        map(resp => resp['data'])
      );
  }
  detalleReservasSeguimiento(data): Observable<any> {
    let idPedido = (data.id_pedido) ? `&id_pedido=${data.id_pedido}` : '';
    return this.http.get<DetalleReserva>(
      this.globalService.apiHost + `seguimiento/comercial-seguimiento-detalle-reservas?id_cuenta_cliente=${data.id_cuenta_cliente}&id_origen=${data.id_origen}&fecha=${data.fecha}&id_reserva=${data.id_reserva}&estado=${data.estado}${idPedido}`)
      .pipe(
        map(resp => resp['data'])
      );
  }
  detalleCupoProveedor(id_reserva): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/ver-cupo-proveedor?id_reserva=${id_reserva}`)
      .pipe(
        map(resp => resp['data'])
      );
  }
  detalleCupoCliente(id_reserva): Observable<any> {
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/ver-cupo-cliente?id_reserva=${id_reserva}`)
      .pipe(
        map(resp => resp['data'])
      );
  }

  seguimientoFiltros(data, page, pageSize): Observable<any> {

    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");
    let dniChofer = data['dniChofer'] || null;

    let options: any = {
      params: new HttpParams()
        .set('begin', begin)
        .set('end', end)
        .set('id_terminal', data['id_terminal'])
        .set('id_tipo', data['id_tipo'])
        .set('consignatario', data['consignatario'])
        .set('id_zona', data['id_zona'])
        .set('id_grupoCliente', data['id_grupoCliente'])
        .set('cliente', data['cliente'])
        .set('cupo', data['cupo'])
        .set('id_producto', data['id_producto'])
        .set('id_detalleProducto', data['id_detalleProducto'])
        .set('km_terminal', data['km_terminal'])
        .set('empresaTransporte', data['empresaTransporte'])
        .set('dniChofer', dniChofer)
        .set('doc', data['doc'])
        .set('arribo', data['arribo'])
        .set('page', page)
      //.set('per-page',pageSize)
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-situacion-terminal`, options);
  }

  comercialSeguimientoFiltros(data, page, pageSize): Observable<any> {
    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");

    let options: any = {
      params: new HttpParams()
        .set('begin', begin)
        .set('end', end)
        .set('id_terminal', data['id_terminal'])
        .set('id_tipo', data['id_tipo'])
        .set('id_zona', data['id_zona'])
        .set('id_grupo_cliente', data['id_grupo_cliente'])
        .set('cliente', data['cliente'])
        .set('id_producto', data['id_producto'])
        .set('reserva', data['id_reserva'])
        .set('estado', data['id_estado'])
        .set('page', page)
        .set('per-page', pageSize)
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-comercial-seguimiento`, options);
  }

  comercialGestionReservaFiltros(data, page, pageSize): Observable<any> {

    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");

    let options: any = {
      params: new HttpParams()
        .set('begin', begin)
        .set('end', end)
        .set('id_terminal', data['terminal'])
        .set('id_tipo', data['tipo_despacho'])
        .set('cliente', data['cliente'])
        .set('id_producto', data['producto'])
        .set('reserva', data['reserva'])
        .set('estado', data['estado'])
        .set('page', page)
        .set('per-page', pageSize)
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/filtrar-gestion-reserva`, options);
  }



  seguimientoReservaFiltros(data, page, pageSize, esMuvinProveedor: boolean): Observable<any> {
    let endPoint = (esMuvinProveedor == false) ? 'seguimiento/filtrar-seguimiento' : 'seguimiento/filtrar-seguimiento-logistico';

    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");

    let params = new HttpParams()
      .set('begin', begin)
      .set('end', end)
      .set('id_terminal', data['terminal'])
      .set('id_tipo', data['tipo_despacho'])
      .set('id_producto', data['producto'])
      .set('reserva', data['reserva'])
      .set('estado', data['estado'])
      .set('page', page)
      .set('per-page', pageSize)
    if (esMuvinProveedor) {
      params = params.set('cliente', data['cliente']);
      params = params.set('id_zona', data['zona']);
    }

    const options = { params: params };
    return this.http.get<any>(this.globalService.apiHost + endPoint, options);
  }

  exportarDatosMonitorTerminal(data) {

    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");
    let dniChofer = data['dniChofer'] || null;
    let options: any = {
      params: new HttpParams()
        .set('begin', begin)
        .set('end', end)
        .set('id_terminal', data['id_terminal'])
        .set('id_tipo', data['id_tipo'])
        .set('consignatario', data['consignatario'])
        .set('id_zona', data['id_zona'])
        .set('id_grupoCliente', data['id_grupoCliente'])
        .set('cliente', data['cliente'])
        .set('cupo', data['cupo'])
        .set('id_producto', data['id_producto'])
        .set('id_detalleProducto', data['id_detalleProducto'])
        .set('km_terminal', data['km_terminal'])
        .set('empresaTransporte', data['empresaTransporte'])
        .set('dniChofer', dniChofer)
        .set('doc', data['doc'])
        .set('arribo', data['arribo'])
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/exportar-situacion-terminal`, options).pipe(
        map(resp => resp['data'])
      );
  }

  exportarDatosComercialSeguimiento(data) {

    let begin = this.homeService.formatoFecha(data['rango_fecha']['begin'], "amd", "-");
    let end = this.homeService.formatoFecha(data['rango_fecha']['end'], "amd", "-");
    let dniChofer = data['dniChofer'] || null;
    let options: any = {
      params: new HttpParams()
        .set('begin', begin)
        .set('end', end)
        .set('id_terminal', data['id_terminal'])
        .set('id_tipo', data['id_tipo'])
        .set('id_zona', data['id_zona'])
        .set('id_grupo_cliente', data['id_grupo_cliente'])
        .set('cliente', data['cliente'])
        .set('id_producto', data['id_producto'])
        .set('reserva', data['id_reserva'])
        .set('estado', data['id_estado'])
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/exportar-situacion-terminal`, options).pipe(
        map(resp => resp['data'])
      );
  }

  listaProveedores(): Observable<any> {
    let options: any = {
      params: new HttpParams()
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/lista-proveedores`, options);
  }

  listaTerminales(id): Observable<any> {
    let options: any = {
      params: new HttpParams()
        .set('id', id)
        .set('m', "F")
        .set('solucion_muvin', "true")
    };
    //console.log(data);
    return this.http.get<any>(
      this.globalService.apiHost + `seguimiento/terminales-proveedor?m=F&solucion_muvin=true`, options);
  }

  derivarReserva(data): Observable<any> {        
    return this.http.post(this.globalService.apiHost + 'pedido/derivar-reserva', data);
  /* else{
    return this.http.post(this.globalService.apiHost + 'respuesta-consulta-huerfano', data)
    .map(this.extractData)
    .catch(this.handleError);
  }; */
  
}

}
