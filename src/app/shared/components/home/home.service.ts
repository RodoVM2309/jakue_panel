import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { GlobalService } from '../../models/global.service';
import { Pedido } from '../../models/pedido';
import { Provincia } from '../../models/provincia';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public origen_planta = new BehaviorSubject<Object>(null);
  public customisOrigenPlanta = this.origen_planta.asObservable();

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  public changeOrigenPlanta(indicators: Object): void {
    this.origen_planta.next(indicators);
  }

  getAllPedidos_sp(): Observable<Pedido[]> {
    let rol: string = localStorage.getItem('rol');
    if (rol == '1') {
      return this.http.get(this.globalService.apiHost + 'pedido').pipe(
        map(res => res["data"])
      );
    } else {
      return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2').pipe(
        map(res => res["data"])
      );
    }
  }
  getPedido(id): Observable<any> {
    //  return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2?id=' + idUser, options)
    const options = id ?
      { params: new HttpParams().set('Search[id]', id) } : {};
    return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPedidos(page: number, filtro): Observable<any> {
    let pageString = page.toString();
    let rol: string = localStorage.getItem('rol');
    let params;
    if (rol === '1') {
      if (filtro.origen != null) {
        params = new HttpParams()
          .set('page', pageString)
          .set('per-page', '10')
          .set('Search[origen_nombre]', filtro.origen)
          .set('Search[nombre_generador]', filtro.generador)
          .set('Search[zona_destino_nombre]', filtro.zonadestino)
          .set('Search[producto_nombre]', filtro.producto)
          .set('Search[nombre_cliente]', filtro.dador)
          .set('Search[contrato]', filtro.contrato)
          .set('Search[fecha_desde]', (filtro.fechadesde === "") ? filtro.fechadesde : this.formatoFecha(filtro.fechadesde, 'amd', '-'))
          .set('Search[fecha_hasta]', (filtro.fechahasta === "") ? filtro.fechahasta : this.formatoFecha(filtro.fechahasta, 'amd', '-'));
        if (filtro.tipo !== null) {
          params = params.set('Search[tipo]', filtro.tipo);
        }
        if (filtro.pendientes_asignar !== null) {
          params = params.set('Search[pendientes_asignar]', filtro.pendientes_asignar);
        }
        if (filtro.pedidos_rojos !== null) {
          params = params.set('Search[pedidos_rojos]', filtro.pedidos_rojos);
        }
        if (filtro.en_tiempo !== null) {
          params = params.set('Search[en_tiempo]', filtro.en_tiempo);
        }
        if (filtro.fuera_tiempo !== null) {
          params = params.set('Search[fuera_tiempo]', filtro.fuera_tiempo);
        }
        if (filtro.pedidos_cerrados !== null) {
          params = params.set('Search[pedidos_cerrados]', filtro.pedidos_cerrados);
        }
        if (filtro.pedidos_ocultos !== null) {
          params = params.set('Search[pedidos_ocultos]', filtro.pedidos_ocultos);
        }
        if (filtro.pedidos_difusion !== null) {
          params = params.set('Search[pedidos_difusion]', filtro.pedidos_difusion);
        }
        if (filtro.pedidos_ocultos !== null) {
          params = params.set('Search[ocultos]', filtro.pedidos_ocultos);
        }
      } else {
        params = new HttpParams()
          .set('page', pageString)
          .set('per-page', '10');
      }

    } else {
      if (rol === '5') {
        params = new HttpParams()
          .set('page', pageString)
          .set('per-page', '10');
      } else {
        if (filtro.origen != null) {
          params = new HttpParams()
            .set('page', pageString)
            .set('per-page', '10')
            .set('Search[origen_nombre]', filtro.origen)
            .set('Search[nombre_generador]', filtro.generador)
            .set('Search[zona_destino_nombre]', filtro.zonadestino)
            .set('Search[producto_nombre]', filtro.producto)
            .set('Search[nombre_cliente]', filtro.dador)
            .set('Search[dadorCuit]', filtro.dadorCuit == undefined || filtro.dadorCuit == null ? '' : filtro.dadorCuit.toString())
            .set('Search[contrato]', filtro.contrato)
            .set('Search[fecha_desde]', (filtro.fechadesde === "") ? filtro.fechadesde : this.formatoFecha(filtro.fechadesde, 'amd', '-'))
            .set('Search[fecha_hasta]', (filtro.fechahasta === "") ? filtro.fechahasta : this.formatoFecha(filtro.fechahasta, 'amd', '-'));
          if (filtro.tipo !== null) {
            params = params.set('Search[tipo]', filtro.tipo);
          }
          if (filtro.pendientes_asignar !== null) {
            params = params.set('Search[pendientes_asignar]', filtro.pendientes_asignar);
          }
          if (filtro.pedidos_rojos !== null) {
            params = params.set('Search[pedidos_rojos]', filtro.pedidos_rojos);
          }
          if (filtro.en_tiempo !== null) {
            params = params.set('Search[en_tiempo]', filtro.en_tiempo);
          }
          if (filtro.fuera_tiempo !== null) {
            params = params.set('Search[fuera_tiempo]', filtro.fuera_tiempo);
          }
          if (filtro.pedidos_cerrados !== null) {
            params = params.set('Search[pedidos_cerrados]', filtro.pedidos_cerrados);
          }
          if (filtro.pedidos_ocultos !== null) {
            params = params.set('Search[pedidos_ocultos]', filtro.pedidos_ocultos);
          }
          if (filtro.pedidos_difusion !== null) {
            params = params.set('Search[pedidos_difusion]', filtro.pedidos_difusion);
          }
          if (filtro.pedidos_ocultos !== null) {
            params = params.set('Search[oculto]', filtro.pedidos_ocultos);
          }
        } else {
          params = new HttpParams()
            .set('page', pageString)
            .set('per-page', '10');
        }
      }
    }
    const options = { params: params };
    switch (rol) {
      case '1':
        return this.http.get(this.globalService.apiHost + 'pedido', options)
          .map(this.extractData)
          .catch(this.handleError);
      //break;
      case '5':
        return this.http.get(this.globalService.apiHost + 'pedido/by-dador', options)
          .map(this.extractData)
          .catch(this.handleError);
      //break;
      case '11':
        return this.http.get(this.globalService.apiHost + 'pedido/by-operador', options)
          .map(this.extractData)
          .catch(this.handleError);
      //break;
      default:
        return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2', options)
          .map(this.extractData)
          .catch(this.handleError);
      //break;
    };


  }
  getAllPedidosRetorno(page: number, filtro): Observable<Pedido[]> {

    let rol: string = localStorage.getItem('rol');
    let params;
    if (rol === '1') {
      if (filtro.origen != null) {
        params = new HttpParams()
          .set('page', (page + 1).toString())
          .set('Search[origen_nombre]', filtro.origen)
          .set('Search[zona_destino_nombre]', filtro.zonadestino)
          .set('Search[producto_nombre]', filtro.producto)
          .set('Search[nombre_cliente]', filtro.dador)
          .set('Search[fecha_desde]', filtro.fechadesde)
          .set('Search[fecha_hasta]', filtro.fechahasta)
          .set('onlyRetorno', filtro.solopedidoretorno);
      } else {
        params = new HttpParams()
          .set('page', (page + 1).toString());
      }

    } else {
      if (filtro.origen != null) {
        params = new HttpParams()

          .set('page', (page + 1).toString())
          .set('Search[origen_nombre]', filtro.origen)
          .set('Search[zona_destino_nombre]', filtro.zonadestino)
          .set('Search[producto_nombre]', filtro.producto)
          .set('Search[nombre_cliente]', filtro.dador)
          .set('Search[fecha_desde]', filtro.fechadesde)
          .set('Search[fecha_hasta]', filtro.fechahasta)
          .set('onlyRetorno', filtro.solopedidoretorno);
      } else {
        params = new HttpParams()

          .set('page', (page + 1).toString());
      }
    }

    const options = { params: params };
    if (rol == '1') {
      return this.http.get(this.globalService.apiHost + 'pedido', options).pipe(
        map(res => res["data"])
      );
    } else {
      return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2', options).pipe(
        map(res => res["data"])
      );
    }
  }

  getAllViajes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'viaje').pipe(
      map(res => res["data"])
    );
  }

  getAllViajesPedido(pedido): Observable<any> {
    let rol: string = localStorage.getItem('rol');
    if (rol == '3') {
      return this.http.get(this.globalService.apiHost + 'viaje/by-pedido?id=' + pedido)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http.get(this.globalService.apiHost + 'viaje/by-dador?id=' + pedido)
        .map(this.extractData)
        .catch(this.handleError);
    }

  }

  getAllViajesUser(): Observable<any> {
    let campo: string = '';
    let rol: string = localStorage.getItem('rol');
    switch (rol) {
      case '4':
        return this.http.get(this.globalService.apiHost + 'transportista/viajes').pipe(
          map(res => res["data"])
        );
      case '5':
        campo = 'id_dador';
        break;
      case '6':
        campo = 'id_destinatario';
        break;
      case '7':
        campo = 'id_destino';
        break;
      case '8':
        campo = 'id_entregador';
        break;
      case '9':
        campo = 'id_corredor';
        return this.http.get(this.globalService.apiHost + 'viaje/by-corredor').pipe(
          map(res => res["data"])
        );
      //break;
      case '10':
        //campo = 'id_intermediario';
        return this.http.get(this.globalService.apiHost + 'intermediario/viajes').pipe(
          map(res => res["data"])
        );
      default:
        campo = 'id_transportista';
    }
    return this.http.get(this.globalService.apiHost + 'viaje?').pipe(
      map(res => res["data"])
    );

  }
  getProvincias(): Observable<Provincia[]> {
    return this.http.get(this.globalService.apiHost + 'provincia').pipe(
      map(res => res["data"])
    );
  }
  getAll(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'pedido')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getDescendencia(pedido): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'pedido/descendencia?id=' + pedido)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCuposVinculados(filtro, page, perPage): Observable<any> {
    let params = new HttpParams()
      .set('fechaCupo', (filtro.fechaCupo !== "") ? filtro.fechaCupo : '')
      .set('alfanumericoCupo', (filtro.alfanumericoCupo !== "") ? filtro.alfanumericoCupo : '')
      .set('nombreChofer', (filtro.nombreChofer !== "") ? filtro.nombreChofer : '')
      .set('nombreDestino', (filtro.nombreDestino !== "") ? filtro.nombreDestino : '')
      .set('destinatarioCuit', (filtro.destinatarioCuit !== "") ? filtro.destinatarioCuit : '')
      .set('cartaPorte', (filtro.cartaPorte !== "") ? filtro.cartaPorte : '')
      .set('corredorCuit', (filtro.corredorCuit !== "") ? filtro.corredorCuit : '')
      .set('entregadorCuit', (filtro.entregadorCuit !== "") ? filtro.entregadorCuit : '')
      .set('nombreEstadoCupo', (filtro.nombreEstadoCupo !== "") ? filtro.nombreEstadoCupo : '')
      .set('vencidos', (filtro.vencido !== 0) ? filtro.vencido : 0)
      .set('page', page)
      .set('per-page', perPage)
      ;
    if (filtro.id_producto !== null) {
      params = params.set('id_producto', filtro.id_producto);
    }
    const options = { params: params };
    return this.http.get(`${this.globalService.apiHost}api-cupo/cupos-vinculados-panel`, options)
      .map(this.extractData)
      .catch(this.handleError);

  }
  getInfoCupo(idCupo): Observable<any> {
    return this.http.get(`${this.globalService.apiHost}api-cupo/info?id_cupo=${idCupo}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getSiniestroByViaje(idViaje): Observable<any> {
    return this.http.get(`${this.globalService.apiHost}siniestro/by-viaje?id_viaje=${idViaje}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  devolverCupo(idCupo): Observable<any> {
    return this.http.get(`${this.globalService.apiHost}api-cupo/devolver?id_cupo=${idCupo}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
  recuperarCupo(cupo): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v3/cupo/proveedor-recuperar`, cupo)
      .map(this.extractData)
      .catch(this.handleError);
  }
  liberarCupo(idCupo): Observable<any> {
    return this.http
      .get(
        `${this.globalService.apiHost}api-cupo/liberar?id_cupo=${idCupo}`)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getCuposDisponibles(filtro, page, perPage): Observable<any> {
    let params = new HttpParams()
      .set('fecha', (filtro.fechaCupo !== "") ? filtro.fechaCupo : '')
      //.set('idCupoTerminal', (filtro.idCupoTerminal !== "") ? filtro.idCupoTerminal : '')
      //.set('nombreDestino', (filtro.nombreDestino !== "") ? filtro.nombreDestino : '')
      //.set('dadorCuit', (filtro.dadorCuit !== "") ? filtro.dadorCuit : '')
      //.set('cosecha', (filtro.cosecha !== "") ? filtro.cosecha : '')
      //.set('nroContrato', (filtro.nroContrato !== "") ? filtro.nroContrato : '')
      //.set('vencidos', (filtro.vencido !== 0) ? filtro.vencido : 0)
      //.set('usado', filtro.usado)
      .set('page', page)
      .set('per-page', perPage)
      .set('sort', 'idCupoTerminal');
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
    const options = { params: params };
    return this.http.get(this.globalService.apiHost + 'v3/cupo/disponibles', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  putCupo(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'v3/cupo/' + data.id, data)

  }

  getPedidoPublicos(idRol: any, page: any): Observable<any> {
    /* const options = { params: params }; */
    if (idRol === '4') {
      return this.http.get(`${this.globalService.apiHost}pedido/publico-transportista`)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http.get(`${this.globalService.apiHost}pedido/publico-intermediario`)
        .map(this.extractData)
        .catch(this.handleError);
    }
  }
  postPostularPedidoPublicoTransportista(idPedido, cantidad): Observable<any> {
    let params = new HttpParams()
      .set('id_pedido', idPedido)
      .set('cantidad_choferes', cantidad)
    return this.http.post(`${this.globalService.apiHost}transportista-postulado`, params)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postPostularPedidoPublicoIntermediario(idPedido, cantidad): Observable<any> {
    let params = new HttpParams()
      .set('id_pedido', idPedido)
      .set('cantidad_choferes', cantidad)
    return this.http.post(`${this.globalService.apiHost}intermediario-postulado`, params)
      .map(this.extractData)
      .catch(this.handleError);
  }
  cancelarPostuladoPedidoPublicoTransportista(idPedido): Observable<any> {
    return this.http.delete(`${this.globalService.apiHost}transportista-postulado/${idPedido}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
  cancelarPostuladoPedidoPublicoIntermediario(idPedido): Observable<any> {
    return this.http.delete(`${this.globalService.apiHost}intermediario-postulado/${idPedido}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getResumenSolicitud(): Observable<any> {
    //return this.http.get(this.globalService.apiHost + 'demanda-cupo/resumen-solicitud?id_demandante=' + idUser)
    return this.http.get(this.globalService.apiHost + 'demanda-cupo/resumen-solicitud')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDetalleSolicitud(idDemanda): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'demanda-cupo/detalle-solicitud?id_demanda=' + idDemanda)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSolicitudByDemandante(data, filtro): Observable<any> {
    var params = new HttpParams();
    params = params.set("page", data.page)
    params = params.set("per-page", data.per_page)
    params = params.set('producto', filtro.producto)
    params = params.set('fecha_desde', filtro.fecha_desde)
    params = params.set('fecha_hasta', filtro.fecha_hasta)
    params = params.set('oculto', filtro.oculto)
    if (data.sort) {
      params = params.set("sort", data.sort);
    }

    const options = { params: params };
    return this.http.get(this.globalService.apiHost + 'demanda-cupo/by-demandante', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCuposAExportar(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'api-cupo/cupos-sin-paginar')
      .map(this.extractData)
      .catch(this.handleError);
  }

  putDemandaCupo(data): Observable<any> {
    //return this.http.put(this.globalService.apiHost + 'demanda-cupo/variar-cantidad' + data.id_demanda_cupo, data)
    return this.http.put(this.globalService.apiHost + 'demanda-cupo/variar-cantidad', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPrepedido(data): Observable<any> {
    //.set('id_demandante', idUser)
    let params = new HttpParams()
      .set('page', data.page)
      .set('per-page', data.per_page)
    const options = { params: params };
    return this.http.get(this.globalService.apiHost + 'centro/pre-pedidos')
      .map(this.extractData)
      .catch(this.handleError);
  }
  deletePrePedido(idPedido): Observable<any> {
    return this.http.delete(`${this.globalService.apiHost}pre-pedido/${idPedido}`)
      .map(this.extractData)
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
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public formatoFecha(date, formato = 'dma', separador = "/") {
    const toTwoDigits = num => (num < 10 ? "0" + num : num);
    let today = new Date(date);
    let year = today.getFullYear();
    let month = toTwoDigits(today.getMonth() + 1);
    let day = toTwoDigits(today.getDate());
    let a = (formato === 'dma') ? `${day}${separador}${month}${separador}${year}` : `${year}${separador}${month}${separador}${day}`;
    return a;
  }

  public sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }



  public formatoHora(date) {
    let today = new Date(date);
    let hora = today.getHours();
    let minutos = today.getMinutes();
    let segundos = today.getSeconds();
    return `${hora}:${minutos}`;
  }



  quitar_chofer(cupo): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}cupo/cancelar-viaje`, cupo)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
