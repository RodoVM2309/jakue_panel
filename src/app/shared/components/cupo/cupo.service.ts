import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";
import { GlobalService } from "../../models/global.service";




@Injectable({
  providedIn: "root"
})
export class CupoService {
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getCuposAsignados(fecha): Observable<any> {
    const options = fecha
      ? { params: new HttpParams().set("fecha", fecha) }
      : {};
    return this.http.get(
      this.globalService.apiHost + "v2/cupos/disponibles/" + fecha.toString(),
    );
  }
  getV3CuposAsignados(fecha): Observable<any> {
    const options = fecha
      ? { params: new HttpParams().set("fecha", fecha) }
      : {};
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/listado", options
    );
  }
  getV3ListadoCuposAsignados(fecha): Observable<any> {
    const options = fecha
      ? { params: new HttpParams().set("fechaDesde", fecha) }
      : {};
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/listado-asignacion", options
    );
  }
  getListadoCuposAsignadosC3(fecha): Observable<any> {
    const options = fecha
      ? { params: new HttpParams().set("fechaDesde", fecha) }
      : {};
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/listado-asignacion-zonas", options
    );
  }
  getV3Demandas(fechaDesde, fechaHasta): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fechaDesde", fechaDesde)
        .set("fechaHasta", fechaHasta)

    };
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/seguimiento/", options
    );
  }
  getV3CuposRecuperar(fechaDesde, fechaHasta): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fechaDesde", fechaDesde)
        .set("fechaHasta", fechaHasta)

    };
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/listado-recuperar", options
    );
  }
  getV3Cupos(fecha, idCuitDestinatario, idDestino): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fechaDesde", fecha)
        .set("idCuitDestinatario", idCuitDestinatario)
        .set("idDestino", idDestino)

    };
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/lista", options
    );
  }
  getV2CuposDisponibles(fecha): Observable<any> {
    const options = fecha
      ? { params: new HttpParams().set("fecha", fecha) }
      : {};
    return this.http.get(
      this.globalService.apiHost + "v2/cupos/disponibles/" + fecha.toString(),
    );
  }

  getDetalleDador(filtro, page, perPage): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("page", page)
        .set("per-page", perPage)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/detalle-dador",
      options
    );
  }
  getDetalleDadorCupos(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("id_dador", filtro.id_dador)
        .set("estado", filtro.estado)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/detalle-dador-cupos",
      options
    );
  }
  getCuposAllMap(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("id_producto", filtro.id_producto == 0 ? '' : filtro.id_producto)
        .set('fechaDesde', filtro.fecha_desde)
        .set('fechaHasta', filtro.fecha_hasta)
    };
    return this.http.get(this.globalService.apiHost + "v3/cupo/all-map", options);
  }
  getAsignadosReceptor(filtro, page, perPage): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("page", page)
        .set("per-page", perPage)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/asignados-receptor",
      options
    );
  }
  getAsignadosReceptorCupo(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("id_receptor", filtro.id_receptor)
        .set("estado", filtro.estado)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/asignados-receptor-cupos",
      options
    );
  }
  getDemandaCupos(fecha): Observable<any> {
    return this.http.get(this.globalService.apiHost + "v3/cupo/demandados/" + fecha);
  }
  getV3Destinatarios(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "v3/cupo/destinatarios");
  }
  getTipoProductos(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "producto/tipo-producto");
  }
  getProductos(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "producto/codigo-select-centro?m=C");
  }
  getZonas(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "select?expand=zonaSolicitud");
  }
  getZonasC3(cuitCentro = ''): Observable<any> {
    const options = cuitCentro
      ? { params: new HttpParams().set("cuit", cuitCentro) }
      : {};
    return this.http.get(this.globalService.apiHost + "v3/zona-centro/buscar",
      options);
  }
  getLocalidades(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "select?expand=localidades");
  }

  getProductos2(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "producto/codigo-select?m=C");
  }
  getProductosCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "centro-producto/select");
  }

  getDestinos(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "destino/planta-select-crear");
  }

  getInfoCupos(
    fecha: string,
    id_producto: number,
    id_dador: number,
    id_destino: number
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
          .set("id_dador", id_dador.toString())
          .set("id_destino", id_destino.toString())
      }
      : {};
    return this.http.get<any>(this.globalService.apiHost + "cupo/lista", options);
  }

  getProcesoStop(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "api-cupo/proceso-stop");
  }


  getInfoCuposDevolver(
    fecha: string,
    id_producto: number,
    id_dador: number
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
          .set("id_dador", id_dador.toString())
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "cupo/lista-simple",
      options
    );
  }

  getInfoCuposRecuperar(
    fecha: string,
    id_producto: number,
    id_receptor: number
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          .set("id", id_receptor.toString())
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "cupo/lista-simple-recuperar",
      options
    );
  }

  getCuposByPedido(id_pedido): Observable<any> {
    const options = id_pedido
      ? {
        params: new HttpParams().set("id_pedido", id_pedido)
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "cupo/by-pedido",
      options
    );
  }
  getCupo(id_cupo): Observable<any> {

    return this.http.get(
      this.globalService.apiHost + "cupo/" + id_cupo
    );
  }

  postCupoDisponible(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "api-cupo/carga-cupos-panel", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postVariarCantidad(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "demanda-cupo/variar-cantidad", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  validarLoteCupoDisponible(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "cupo/validar-cupo", data)
  }
  postCupoSolicitados(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "demanda-cupo/carga-solicitud", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCupoSolicitadosV2(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v2/cupos/carga-solicitud", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCupoSolicitadosPropia(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/carga-solicitud-propia", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCupoSolicitadosDemandante(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/carga-solicitud", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCupoSolicitadosDemandanteV3(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/carga-solicitud-distribuida", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCupoSolicitadosPropiaDist(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/carga-solicitud-propia-distribuida", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDemandas(
    fecha: string,
    id_producto: number,
    id_demandante: number
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
          .set("id_demandante", id_demandante.toString())
        //.set("id_demandado", idUser)
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "demanda-cupo/lista",
      options
    );
  }
  getBuscarDemandas(
    fecha: string,
    id_producto: number,
    cuit: string,
    demandanteNombre: string
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
          //.set("id_demandado", idUser)
          .set("demandanteCuit", cuit)
          .set("demandanteNombre", demandanteNombre)
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "demanda-cupo/buscar-x-demandante",
      options
    );
  }
  getBuscarParaAsignarDemandante(
    cuit: string,
    demandanteNombre: string
  ): Observable<any> {
    const options = {
      params: new HttpParams()
        //.set("id_demandado", idUser)
        .set("demandanteCuit", cuit ? cuit : "")
        .set("demandanteNombre", demandanteNombre ? demandanteNombre : "")
    };

    return this.http.get(
      this.globalService.apiHost + "centro/buscar-para-asignar",
      options
    );
  }

  getDemandasVencidas(cantidad_dias: number): Observable<any> {
    const options = cantidad_dias
      ? {
        params: new HttpParams()
          .set("cantidad_dias", cantidad_dias.toString())
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "demanda-cupo/solicitudes-vencidas",
      options
    );
  }
  getInfoDemandas(
    fecha: string,
    id_producto: number,
    id_demandante: number
  ): Observable<any> {
    const options = fecha
      ? {
        params: new HttpParams()
          //.set("id_demandado", idUser)
          .set("fecha", fecha)
          .set("id_producto", id_producto.toString())
          .set("id_demandante", id_demandante.toString())
      }
      : {};
    return this.http.get(
      this.globalService.apiHost + "demanda-cupo/lista",
      options
    );
  }

  postAutoAsignarCupos(cupos): Observable<any> {
    let params = new HttpParams().set("cupos", cupos);
    return this.http.post(
      `${this.globalService.apiHost}cupo/autoasignar`,
      params
    );
  }
  postAsignarCupos(id_receptor, cupos, demanda, solicitado): Observable<any> {
    let params = new HttpParams()
      .set("id_receptor", id_receptor)
      .set("cupos", cupos)
      .set("demandas", demanda)
      .set("solicitado", solicitado);
    return this.http.post(`${this.globalService.apiHost}cupo/asignar`, params);
  }

  postAsignarCuposV2(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v2/cupos/asignar`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postAsignarCuposV3(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v3/cupo/asignar`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postAsignarCuposV32(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v3/cupo/asignar2`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postRechazarCuposV3(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v3/cupo/rechazar-solicitudes`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postRechazarCupos(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}v3/cupo/devolver`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }


  devolverCupos(cupos): Observable<any> {
    let params = new HttpParams().set("cupos", cupos);
    return this.http.post(
      `${this.globalService.apiHost}cupo/devolver-lote`,
      params
    );
  }

  recuperarCupos(cupos, id_motivo_recuperar, motivo_recuperar): Observable<any> {
    let params = new HttpParams().set("cupos", cupos)
      .set("id_motivo_recuperar", id_motivo_recuperar)
      .set("motivo_recuperar", motivo_recuperar);
    return this.http.post(
      `${this.globalService.apiHost}v3/cupo/recuperar`,
      params
    );
  }

  getPanelConsolidado(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("id_dador", filtro.id_dador)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/panel-consolidado",
      options
    );
  }
  getDetallesPanelConsolidado(filtro, row): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("id_dador", filtro.id_dador)
        .set("id_destino", row.id_destino)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/panel-consolidado-detalle",
      options
    );
  }
  getDetallesAlfanumerico(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", filtro.fecha)
        .set("id_producto", filtro.id_producto)
        .set("id_dador", filtro.id_dador)
        .set("id_receptor", filtro.id_receptor)
        .set("id_destino", filtro.id_destino)
        .set("estado", filtro.estado)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/panel-consolidado-mas-detalle",
      options
    );
  }
  getDetallesSolicitud(row): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("id_demanda", row.id_demanda_cupo)
    };
    return this.http.get(
      this.globalService.apiHost + "demanda-cupo/detalle-solicitud",
      options
    );
  }

  getDadoresByReceptor(fecha): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("fecha", fecha)
    };
    return this.http.get(
      this.globalService.apiHost + "cupo-cliente/dadores-by-receptor",
      options
    );
  }

  getCCPP(idCupo): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("idCupo", idCupo)
    };
    return this.http.get(
      this.globalService.apiHost + "v2/cupo/obtener-carta-porte",
      options
    );
  }

  getMotivoRechazo(): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("expand", 'motivoRechazoDemandaCupo')
    };
    return this.http.get(
      this.globalService.apiHost + "select",
      options
    );
  }
  getTieneEmailCuit(cuit: string): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("expand", 'tiene_email_notificacion')
    };
    return this.http.get(
      this.globalService.apiHost + "info-cuit" + '/' + cuit,
      options
    );
  }


  getLocalidadDestino(id): Observable<any> {
    return this.http.get(
      this.globalService.apiHost + "destino/" + id + "?expand=nombreLocalidad");
  }


  public formatoFecha(date, formato = 'dma', separador = "/") {
    const toTwoDigits = num => (num < 10 ? "0" + num : num);
    let today = new Date(date);
    let year = today.getFullYear();
    let month = toTwoDigits(today.getMonth() + 1);
    let day = toTwoDigits(today.getDate());
    return (formato === 'dma') ? `${day}${separador}${month}${separador}${year}` : `${year}${separador}${month}${separador}${day}`;
  }

  putCupoCliente(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'cupo-cliente/' + data.id_cupo_cliente, data)

  }

  getBuscarCupo(filtro): Observable<any> {
    return this.http.post(
      this.globalService.apiHost + "cupo/buscar", filtro
    );
  }

  adicionarCupoDisponible(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/adicionar", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  generarCupoDisponible(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/generar", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postEnviarNotificacion(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "v3/cupo/enviar-notificacion", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getNotificacionesPendientes(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "v3/cupo/no-notificaciones-pendientes")
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCentroSinMailNotificacion(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "v3/cupo/centro-sin-mail-notificacion")
      .map(this.extractData)
      .catch(this.handleError);
  }

  postBuscarCupo(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}cupo/buscar`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postActualizarEstado(data,): Observable<any> {
    return this.http.post(`${this.globalService.apiHost}cupo/actualizar-estado`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  exportarCuposPuerto(fecha: string): Observable<any> {
    const options = {
      params: new HttpParams().set("fecha", fecha),
      responseType: 'blob' as 'json'
    };
    return this.http.get(
      this.globalService.apiHost + "v3/cupo/exportar-cupos-puerto",
      options
    );
  }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 402) {
      let errorData = {
        status: error.status,
        message: error.error.data.mensaje
      }
      return throwError(errorData);
    }
    if (error.status === 422) {

      let mensaje = ''
      error.error.data.forEach(element => {
        mensaje = mensaje === '' ? element.message : mensaje + ', ' + element.message
      });
      let errorData = {
        status: error.status,
        message: mensaje
      }
      return throwError(errorData);
    }
    if (error.status === 425) {
      return throwError(error.error.data.message.errors);
    }
    if (error.status === 500) {
      return throwError(error.error.data.previous.message);
    }
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
