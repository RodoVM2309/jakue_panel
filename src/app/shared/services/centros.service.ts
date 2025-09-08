import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';


@Injectable({
  providedIn: 'root'
})
export class CentrosService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllEstadisticas(fecha_desde, fecha_hasta): Observable<any> {
    const options =
    {
      params: new HttpParams().set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta)
    };
    return this.http.get(this.globalService.apiHost + 'centro/estadistica', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllPedidos(page, fecha_desde, fecha_hasta): Observable<any> {
    const options =
    {
      params: new HttpParams().set('page', page).set('Search[fecha_desde]', fecha_desde).set('Search[fecha_hasta]', fecha_hasta)
    };
    return this.http.get(this.globalService.apiHost + 'pedido/by-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getViajes(page, filtro): Observable<any> {
    const options =
    {
      params: new HttpParams().set('page', page.page).set('razon_social', filtro.nombre)
    };
    return this.http.get(this.globalService.apiHost + 'viaje/lista-historico', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllPedidosCentro(page, fecha_desde, fecha_hasta): Observable<any> {
    const options =
    {
      params: new HttpParams().set('page', page).set('Search[fecha_desde]', fecha_desde).set('Search[fecha_hasta]', fecha_hasta)
    };
    return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllViajes(page, fecha_desde, fecha_hasta): Observable<any> {
    const options =
    {
      params: new HttpParams().set('page', page).set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta)
    };
    return this.http.get(this.globalService.apiHost + 'viaje/estadistica-by-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllCentros(page, filtro, filtro_cuit): Observable<any> {
    const options = { params: new HttpParams().set('page', page).set('Search[razon_social]', filtro).set('Search[cuit_cuil]', filtro_cuit) };
    return this.http.get(this.globalService.apiHost + 'centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllCentrosSinPage(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/select')
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*----------------llamada a la api de OneSingal--------------*/

  getAllChoferUnistall(offset): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2RjNjM4M2EtYjA2YS00N2I1LTk0MmQtZTM3YTZmNjFmYWVk'
    });
    const options = {
      params: new HttpParams()
        .set('app_id', '18ed32e6-0e0a-4259-9894-7049bee82fad')
        .set('limit', '300')
        .set('offset', offset),
      headers
    };
    return this.http.get('https://onesignal.com/api/v1/players/', options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  /*-----------------------------------------------------------*/

  getAllCentroClientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-cliente')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllInteligencia(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/inteligencia', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCentroCorredores(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-corredor')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCentroTransportes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-transporte')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCentroEntregadores(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-entregador')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCentroDestinatarios(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-destinatario')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCentroTotalizador(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/totalizador-choferes-all')
      .map(this.extractData)
      .catch(this.handleError);
  }

  ///////////////////////////////////////////////////////
  getClientesByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_cliente]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-cliente', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferByTransportista(page, filtro): Observable<any> {
    const options =
    {
      params: new HttpParams().set('id_transportista', filtro.id).set('page', page)
    };
    return this.http.get(this.globalService.apiHost + 'transporte-chofer/chofer-by-transportista', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCorredoresByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_corredor]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-corredor', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getUsuariosWhatsapp(page): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'whats-app', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postUsuariosWhatsapp(data): Observable<any> {
    const dat = {
      telefono: data.telefono,
      cuit_cliente: data.cuit_cliente,
      razon_social: data.razon_social
    };
    return this.http.post(this.globalService.apiHost + 'whats-app', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteUsuariosWhatsapp(idcliente): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'whats-app/' + idcliente)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getOperadoresByIdCentro(page, filtro, filtroCuit): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_operador]', filtro).set('Search[cuit_cuil]', filtroCuit) };
    return this.http.get(this.globalService.apiHost + 'centro-operador', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTransporteByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_transporte]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-transporte', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllConsultasRecientes(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'consulta/recientes')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransporteByIdCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-transporte/select')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransportistaPostuladoByPedido(idPedido, m = null): Observable<any> {
    const options = idPedido ? { params: new HttpParams().set('id_pedido', idPedido).set('m', m) } : {};
    return this.http.get(this.globalService.apiHost + 'transportista-postulado/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioPostuladoByPedido(idPedido): Observable<any> {
    const options = idPedido ?
      { params: new HttpParams().set('id_pedido', idPedido) } : {};
    return this.http.get(this.globalService.apiHost + 'intermediario-postulado/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getOperadoreByIdCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-operador/select')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_intermediario]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-intermediario', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioEstadistica(id, fecha_desde, fecha_hasta): Observable<any> {
    const options = id ?
      {
        params: new HttpParams().set('id', id).set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta)
      } : {};
    return this.http.get(this.globalService.apiHost + 'intermediario/estadistica-grafica', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransportistaEstadistica(id, fecha_desde, fecha_hasta): Observable<any> {
    const options = id ?
      {
        params: new HttpParams().set('id', id).set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta)
      } : {};
    return this.http.get(this.globalService.apiHost + 'transportista/estadistica-grafica', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioByIdCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-intermediario/select')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioByIdCentroSelectAreCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-intermediario/select-are-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEntregadorByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_entregador]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-entregador', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDestinatarioByIdCentro(page, filtro): Observable<any> {
    const options =
      { params: new HttpParams().set('page', page).set('Search[nombre_destinatario]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro-destinatario', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getClientesSinCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'dador/dador-sin-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCorredoresSinCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'corredor/sin-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getOperadoresSinCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'operador/sin-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroCliente(data): Observable<any> {
    const dat = { id_cliente: data.id_cliente };
    return this.http.post(this.globalService.apiHost + 'centro-cliente', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroCorredor(data): Observable<any> {
    const dat = { id_corredor: data.id_corredor };
    return this.http.post(this.globalService.apiHost + 'centro-corredor', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postCentroOperador(data): Observable<any> {
    const dat = { id_operador: data.id_operador };
    return this.http.post(this.globalService.apiHost + 'centro-operador', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroTransporte(data): Observable<any> {
    let dat: any;
    if (data.unipersonal) {
      dat = {
        id_transporte: data.id_transporte,
        id_intermediario: (data.id_intermediario) ? data.id_intermediario : '',
        unipersonal: data.unipersonal ? data.unipersonal : '',
        camion: (data.camion) ? data.camion : '',
        acoplado: (data.acoplado) ? data.acoplado : null
      };
      return this.http.post(this.globalService.apiHost + 'centro-transporte/registrar', dat)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      dat = {
        id_transporte: data.id_transporte,
        id_intermediario: (data.id_intermediario) ? data.id_intermediario : '',
        unipersonal: '',
      };
      return this.http.post(this.globalService.apiHost + 'centro-transporte', dat)
        .map(this.extractData)
        .catch(this.handleError);
    }

  }

  postCentroIntermediario(data): Observable<any> {
    const dat = { id_intermediario: data.id_intermediario };
    return this.http.post(this.globalService.apiHost + 'centro-intermediario', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroEntregador(data): Observable<any> {
    const dat = { id_entregador: data.id_entregador };
    return this.http.post(this.globalService.apiHost + 'centro-entregador', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroDestinatario(data): Observable<any> {
    const dat = { id_destinatario: data.id_destinatario };
    return this.http.post(this.globalService.apiHost + 'centro-destinatario', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateCentroCliente(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-cliente/' + data.id_cliente, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateCentroCorredor(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-corredor/' + data.id_corredor, data)
      .map(this.extractData)
      .catch(this.handleError);

  }
  updateCentroOperador(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-operador/' + data.id_operador, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateCentroTransporte(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-transporte/' + data.id_transporte, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateCentroIntermediario(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-intermediario/' + data.id_intermediario, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateCentroEntregador(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-entregador/' + data.id_entregador, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  updateCentroDestinatario(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'centro-destinatario/' + data.id_destinatario, data)
      .map(this.extractData)
      .catch(this.handleError);

  }
  deleteCentroCliente(idcliente): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-cliente/' + idcliente)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCentroCorredor(idcorredor): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-corredor/' + idcorredor)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteCentroOperador(idoperador): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-operador/' + idoperador)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCentroTransporte(idtransporte): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-transporte/' + idtransporte)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCentroIntermediario(idintermediario): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-intermediario/' + idintermediario)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCentroEntregador(identregador): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-entregador/' + identregador)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCentroDestinatario(iddestinatario): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'centro-destinatario/' + iddestinatario)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postZonaChofer(data): Observable<any> {
    const dat = { id_chofer: data.id_chofer, id_zona: data.id_zona };
    return this.http.post(this.globalService.apiHost + 'centro-transporte', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransportistaByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-transporte?Search[id_transporte]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getClienteByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-cliente?Search[id_cliente]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCorredorByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-corredor?Search[id_corredor]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-intermediario?Search[id_intermediario]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEntregadorByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-entregador?Search[id_entregador]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDestinatarioByIdPersonaRol(data): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-destinatario?Search[id_destinatario]=' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferesCentro(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('Search[razon_social]', filtro.nombre)
        .set('Search[cuit_cuil]', filtro.cuit)
        .set('Search[patente]', filtro.patente)
        .set('Search[nombre_transportista]', filtro.transportista)
        .set('page', page)
    };
    return this.http.get(this.globalService.apiHost + 'centro/mis-choferes', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferesCentroListaTipo2(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('nombre_transportista', filtro.nombre)
        .set('patente', filtro.patente)
        .set('page', page.page)
        .set('per-page', page.per_page)
    };
    return this.http.get(this.globalService.apiHost + 'centro/choferes-lista-tipo2', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getListadoContratoCentro(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('numeroContrato', filtro.numeroContrato)
        .set('alfanumericoCupo', filtro.alfanumericoCupo)
        .set('page', page.page)
        .set('per-page', page.per_page)
    };
    return this.http.get(this.globalService.apiHost + 'cupo/recibidos', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllChoferesCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/mis-choferes-select')
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllDocumentacionChoferesCentro(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('nombreChofer', filtro.nombre)
        .set('cuitChofer', filtro.cuit)
        .set('nombreTransportista', filtro.transportista)
        .set('patenteCamion', filtro.patente)
    };
    return this.http.get(this.globalService.apiHost + 'centro/mis-choferes2', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferesIntermediario(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page).set('Search[razon_social]', filtro) };
    return this.http.get(this.globalService.apiHost + 'centro/choferes-intermediarios', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getChoferesPorEvaluar(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'chofer/por-evaluar', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTotalAppChoferesDescargada(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/totalizador-choferes')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getZonasCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'zonas')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postChoferZona(data): Observable<any> {
    const dat = { id_chofer: data.id_chofer, id_zona: data.id_zona };
    return this.http.post(this.globalService.apiHost + 'chofer-zona', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateChoferZona(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'chofer-zona/' + data.id_chofer, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteChoferesPorEvaluar(idChofer): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'chofer/por-evaluar/' + idChofer)
      .map(this.extractData)
      .catch(this.handleError);
  }
  ///////////////////////////////////////////////////////  Lista Negra

  postChoferListaNegra(data): Observable<any> {
    const dat = { 
      id_chofer: data.id_chofer, 
      explicacion: data.explicacion, 
      id_motivo: data.id_motivo,
      fecha_hasta: data.fecha_hasta || null
    };
    return this.http.post(this.globalService.apiHost + 'lista-negra', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verificarChoferListaNegra(data): Observable<any> {
    const dat = { 
      id_chofer: data.id_chofer, 
      id_destino: data.id_destino || 1
    };
    return this.http.post(this.globalService.apiHost + 'lista-negra/verificar', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateChoferListaNegra(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'lista-negra/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getListNegra(page, filtro): Observable<any> {
    let params = new HttpParams().set('page', page);
    
    // Si filtro es un string (compatibilidad hacia atrás)
    if (typeof filtro === 'string') {
      if (filtro && filtro.trim() !== '') {
        params = params.set('nombre_chofer', filtro);
      }
    } else if (typeof filtro === 'object') {
      // Si filtro es un objeto con múltiples filtros
      if (filtro.busqueda && filtro.busqueda.trim() !== '') {
        params = params.set('nombre_chofer', filtro.busqueda);
      }
      if (filtro.activo !== undefined) {
        params = params.set('activo', filtro.activo.toString());
      }
    }
    
    const options = { params: params };
    return this.http.get(this.globalService.apiHost + 'lista-negra/listado', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteListaNegra(idChofer): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'lista-negra/' + idChofer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProveedoresCentro(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('tipo', filtro.tipo).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/proveedores-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransportistaByIntermediario(page, filtro): Observable<any> {
    /*Listado de empresas de transporte de un intermediario*/
    const options = { params: new HttpParams().set('id_intermediario', filtro.id_intermediario).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro-transporte/transportista-by-intermediario', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferByTransportista1(page, filtro): Observable<any> {
    /*Listado de camiones por transportista*/
    const options = { params: new HttpParams().set('id_transportista', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'transporte-chofer/chofer-by-transportista', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCargadoresRechazo(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/cargadores-rechazo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getProductosRechazo(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/productos-rechazo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMotivoRechazo(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/motivos-rechazo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLugarCargaRechazo(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/lugar-carga-rechazo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDestinoCargaRechazo(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/destino-carga-rechazo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCargadoresDesvio(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/cargadores-desvio', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProductosDesvio(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/productos-desvio', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMotivoDesvio(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/motivos-desvio', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLugarCargaDesvio(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/lugar-carga-desvio', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDestinoCargaDesvio(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'dador/destino-carga-desvio', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTiempoLugaresCarga(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/tiempo-lugar-carga', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTiempoLugaresDescarga(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/tiempo-lugar-descarga', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFlotaIntermediario(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/flota-intermediarios', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getViajesProveedores(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('tipo', filtro.tipo).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/viajes-proveedores', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getViajesProductos(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id_transporte', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/viajes-productos-transporte', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getViajesProductos2(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('id_intermediario', filtro.id).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'centro/viajes-productos-intermediarios', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllBusquedaCentro(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'busqueda', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getBusqueda(page, filtro): Observable<any> {
    const options = { params: new HttpParams().set('search[id]', filtro).set('page', page) };
    return this.http.get(this.globalService.apiHost + 'busqueda', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getBusquedaPedido(idPedido: number): Observable<any> {
    const options = { params: new HttpParams().set('search[id_pedido]', idPedido.toString()) };
    return this.http.get(this.globalService.apiHost + 'busqueda', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBusqueda(data): Observable<any> {
    const dat = {
      fecha: data.fecha,
      id_producto: data.selectedProducto,
      condiciones_pago: data.condiciones_pago,
      da_gasoil: data.da_gasoil,
      da_efectivo: data.da_efectivo,
      precio_viaje: data.precio_viaje,
      carga_peligrosa: data.carga_peligrosa,
      observaciones: data.observaciones,
      id_medio_pago: data.id_medio_pago,
      longitud_localidad: data.longitud_localidad,
      latitud_localidad: data.latitud_localidad,
      longitud_zona_destino: data.longitud_zona_destino,
      latitud_zona_destino: data.latitud_zona_destino,
      localidad_carga: data.localidad_carga,
      zona_destino: data.zona_destino,
      tipo_acoplado: data.tipo_acoplado,
    };
    return this.http.post(this.globalService.apiHost + 'busqueda', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  putBusqueda(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'busqueda/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBusquedaChoferesDisponibles(data): Observable<any> {
    const options = { params: new HttpParams().set('id', data) };
    return this.http.get(this.globalService.apiHost + 'busqueda/listado-choferes', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getBusquedaChoferesAsignados(data): Observable<any> {
    const options = { params: new HttpParams().set('id', data) };
    return this.http.get(this.globalService.apiHost + 'busqueda/choferes-notificados', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getBusquedaChoferesHuerfanosAsignados(data): Observable<any> {
    const options = { params: new HttpParams().set('id', data) };
    return this.http.get(this.globalService.apiHost + 'busqueda-chofer-huerfano', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBusquedaChofer(busqueda, chofer): Observable<any> {
    const dat = {
      id_busqueda: busqueda,
      id_chofer: chofer
    };
    return this.http.post(this.globalService.apiHost + 'busqueda-chofer', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postBusquedaChoferHuerfano(busqueda, chofer): Observable<any> {
    const dat = {
      id_busqueda: busqueda,
      id_chofer: chofer
    };
    return this.http.post(this.globalService.apiHost + 'busqueda-chofer-huerfano', dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCentroCuit(data): Observable<any> {
    const options = { params: new HttpParams().set('cuit', data) };
    return this.http.get(this.globalService.apiHost + 'centro/existe', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllMotivosRechazos(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'motivo-rechazo-viaje', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getMotivosRechazosViaje(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'motivo-rechazo-viaje/select-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllListaCentro(id_tipo_turneada): Observable<any> {
    const options = { params: new HttpParams().set('id_tipo_turneada', id_tipo_turneada) };
    return this.http.get(this.globalService.apiHost + 'lista-centro/by-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getMisListaCentro(id_chofer): Observable<any> {
    const options = { params: new HttpParams().set('id_chofer', id_chofer) };
    return this.http.get(this.globalService.apiHost + 'lista-centro/chofer', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllListaCentro2(id_tipo_turneada): Observable<any> {
    const options = { params: new HttpParams().set('id_tipo_turneada', id_tipo_turneada) };
    return this.http.get(this.globalService.apiHost + 'lista-centro/select', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postMotivoRechazo(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "motivo-rechazo-viaje", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateMotivoRechazo(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "motivo-rechazo-viaje/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postListaCentro(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "lista-centro", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postDuplicarListaCentro(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "lista-centro/duplicar?id_lista=" + data.id_lista, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateListaCentro(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "lista-centro/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferesSeleccionadosListaCentro(data): Observable<any> {
    const options = { params: new HttpParams().set('id_lista', data) };
    return this.http.get(this.globalService.apiHost + 'lista-centro/choferes-in-list', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferesDisponiblesListaCentro(data): Observable<any> {
    const options = { params: new HttpParams().set('id_lista', data) };
    return this.http.get(this.globalService.apiHost + 'lista-centro/choferes-out-list', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postOrdenarChoferesListaCentro(id, data): Observable<any> {
    const dat = {
      choferes: data
    };
    return this.http
      .post(this.globalService.apiHost + "lista-centro/ordenar?id_lista=" + id, dat)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getListaViajesRechazadosTurneada(page): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('page', page)
    };
    return this.http.get(this.globalService.apiHost + 'centro/viajes-rechazados-turneada', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  penalizarChoferViajeRechazado(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "viaje/" + data.id_viaje, data)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getListaEstadoChoferes(idlista): Observable<any> {
    const options = { params: new HttpParams().set('id_lista', idlista) };
    return this.http.get(this.globalService.apiHost + 'lista-choferes/choferes-estado', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getListaEstadoChoferesCentro(filtro = ''): Observable<any> {
    const options = { params: new HttpParams().set('razon_social', filtro) };
    return this.http.get(this.globalService.apiHost + 'lista-choferes/choferes-estado-centro', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getListaEstadoChoferesCentro1(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'lista-choferes/choferes-estado-centro')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getReporteListaTurneadas(idlista): Observable<any> {
    const options = { params: new HttpParams().set('id_lista', idlista) };
    return this.http.get(this.globalService.apiHost + 'historico-premio-sancion/reporte', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMostrarLogsCentro(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('metodo', filtro.metodo)
        .set('fecha', filtro.fecha)
        .set('json_entrada', filtro.json_entrada)
        .set('json_salida', filtro.json_salida)
    };
    return this.http.get(this.globalService.apiHost + 'centro/logs', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMostrarLogsId(id): Observable<any> {
    const options = { params: new HttpParams().set('id', id) };
    return this.http.get(this.globalService.apiHost + 'centro/log', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  cambiarDisponibilidadChofer(id): Observable<any> {
    const options = { params: new HttpParams().set('id_chofer', id) };
    return this.http.get(this.globalService.apiHost + 'chofer/cambiar-disponibilidad', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  revertirDisponibilidadChofer(id): Observable<any> {
    const options = { params: new HttpParams().set('id_chofer', id) };
    return this.http.get(this.globalService.apiHost + 'chofer/revertir-disponibilidad', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDadoresCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'dador-receptor/select-by-receptor')
      .map(this.extractData)
      .catch(this.handleError);
  }
  postDadoresCentro(id_dador): Observable<any> {
    const dat = { cuit_dador: id_dador };
    return this.http
      .post(this.globalService.apiHost + "dador-receptor/add-dador", dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteDadoresCentro(id_dador): Observable<any> {
    const dat = { id_dador: id_dador };
    return this.http
      .post(this.globalService.apiHost + "dador-receptor/delete-dador", dat)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllDadores(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/select-dadores')
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCargaMasiva(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "chofer/carga-masiva", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //// Empresa
  getCentroEmpresa(page, perPage, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('page', page)
        .set('per-page', perPage)
        .set('nombre_interno', filtro.nombre_interno)
    };
    return this.http.get<any>(this.globalService.apiHost + 'v3/centro-interno', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCentroEmpresaTotal(filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('nombre_interno', filtro.nombre_interno)
        .set('cuit_interno', filtro.cuit_interno)
    };
    return this.http.get<any>(this.globalService.apiHost + '/v3/centro-interno/select', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postCentroInterno(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'v3/centro-interno', data)
      .map(this.extractData)
      .catch(this.handleError);
  }


  deleteCentroInterno(idCentroInterno): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'v3/centro-interno/' + idCentroInterno)
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
      return throwError(error);//.error.data.previous.message
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
