import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { GlobalService } from '../models/global.service';
import { Pedido } from '../models/pedido';
import { TipoCombustible } from '../models/tipo-combustible';
import { get } from 'http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
}
const headers = new HttpHeaders({
  'Content-Type': 'application/json; charset=UTF-8',
  'Authorization': 'Bearer ' + localStorage.getItem('token')
});
@Injectable({
  providedIn: 'root'
})
export class NomencladoresService {

  constructor(private globalService: GlobalService, private http: HttpClient) { }
  //Pedidos

  getAllPedidos(): Observable<any> {
    let rol: string = localStorage.getItem('rol');
    if (rol == '1') {
      return this.http.get(this.globalService.apiHost + 'pedido')
        .map(this.extractData)
        .catch(this.handleError1);
    } else {
      return this.http.get(this.globalService.apiHost + 'pedido/pedido-centro2')
        .map(this.extractData)
        .catch(this.handleError1);
    }
  }

  getAllPedidosRetorno(): Observable<any> {

    let rol: string = localStorage.getItem('rol');
    if (rol == '1') {
      return this.http.get(this.globalService.apiHost + 'pedido-retorno')
        .map(this.extractData)
        .catch(this.handleError1);
    } else {
      return this.http.get(this.globalService.apiHost + 'pedido-retorno/pedido-centro')
        .map(this.extractData)
        .catch(this.handleError1);
    }
  }
  getAllPedidosAdmin(): Observable<any> {
    let rol: string = localStorage.getItem('rol');
    if (rol == '1') {
      return this.http.get(this.globalService.apiHost + 'pedido')
        .map(this.extractData)
        .catch(this.handleError1);
    }
  }
  getPedido(idPedido, m = null): Observable<any> {
    return this.http.get(this.globalService.apiHost + `pedido/${idPedido}?m=${m}`)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getPedido1(idPedido): Observable<Pedido> {
    const options = idPedido ?
      { params: new HttpParams().set('Search[id]', idPedido) } : {};
    return this.http.get<Pedido>(this.globalService.apiHost + 'pedido/' + idPedido);
  }

  getCamionesPremios(idPedido): Observable<any> {
    const options = idPedido ?
      { params: new HttpParams().set('id', idPedido) } : {};

    return this.http.get(this.globalService.apiHost + 'pedido/flota-premio', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getPedidoRetorno(idPedido): Observable<any> {

    return this.http.get(this.globalService.apiHost + 'pedido-retorno/' + idPedido)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getViaje(idViaje): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'viaje/' + idViaje)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postDerivar(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + '/v3/cupo/derivar-transportadora', data);
  }
  postPedidoDador(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido/create-by-cliente', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPropuestaTurnear(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido/asignar-turneada', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPedidoRapido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    // return this.http.post(this.globalService.apiHost + 'pedido/rapido', data);
    return this.http.post(
      `${this.globalService.apiHost}pedido/rapido`,
      data,
      httpOptions
    );
  }

  postUpdateViaje(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido/update-viaje', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postPedidoCondiciones(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido-condiciones', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getPedidoCondiciones(idPedido): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'pedido-condiciones/' + idPedido)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getPedidoTipoAcoplado(idPedido): Observable<any> {
    const options = idPedido ?
      { params: new HttpParams().set('id_pedido', idPedido) } : {}
    return this.http.get(this.globalService.apiHost + 'pedido-tipo-acoplado/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getPedidoZonaIdeal(idPedido): Observable<any> {
    const options = idPedido ?
      { params: new HttpParams().set('id_pedido', idPedido) } : {}
    return this.http.get(this.globalService.apiHost + 'pedido-zona-ideal/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postPedidoTipoAcoplado(data): Observable<any> {

    return this.http.post(this.globalService.apiHost + 'pedido-tipo-acoplado', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postPedidoZonaIdeal(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'pedido-zona-ideal', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postPedidoRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.post(this.globalService.apiHost + 'pedido-retorno', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postBloquearPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 1;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postFechaPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postConfirmarPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postConfirmarPedidoRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');

    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido-retorno/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postBloquearPedidoRotorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 1;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido-retorno/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  updateBloquearViaje(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 1;
    const datos = {
      id: data.id,
      bloqueado: data.bloqueado
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'viaje/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  updateViajeMotivoRechazo(data): Observable<any> {
    const datos = {
      id: data.id_viaje,
      id_motivo_rechaso: data.id_motivo
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'viaje/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerCliente(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.cliente_muvin = 1;
    const datos = {
      id: data.id_usuario,
      cliente_muvin: data.cliente_muvin
    }
    data.cliente_muvin = 'SI';
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerVisualiza(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.visualiza_flota_intermediario = 1;
    const datos = {
      id: data.id_usuario,
      visualiza_flota_intermediario: data.visualiza_flota_intermediario
    }
    data.visualiza_flota_intermediario = 'SI';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerVeChoferesLibres(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.ve_choferes_libres = 1;
    const datos = {
      id: data.id_usuario,
      ve_choferes_libres: data.ve_choferes_libres
    }
    data.ve_choferes_libres = 'SI';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerCondiciones(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.condiciones_viaje = 1;
    const datos = {
      id: data.id,
      condiciones_viaje: 1
    }
    data.condiciones = 'SI';
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerDadorCupo(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.dador_cupo = 1;
    const datos = {
      id: data.id_usuario,
      es_dador_cupo: 1
    }
    data.dador_cupo = 'SI';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerClienteFinal(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.cliente_final = 1;
    const datos = {
      id: data.id_usuario,
      es_cliente_final: 1
    }
    data.cliente_final = 'SI';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerKm(data): Observable<any> {
    data.km = 1;
    const datos = {
      id: data.id_usuario,
      km: data.km
    }
    data.km = 'SI';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postPonerLineaWhatsapp(data): Observable<any> {
    const datos = {
      linea_whats_app: 1
    };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarLineaWhatsapp(data): Observable<any> {
    const datos = {
      linea_whats_app: 0
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postUsaCupera(data): Observable<any> {
    const datos = {
      usaCupera: 2
    };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarUsaCupera(data): Observable<any> {
    const datos = {
      usaCupera: 1
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postEsDestinatario(data): Observable<any> {
    const datos = {
      esDestinatario: 1
    };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarEsDestinatario(data): Observable<any> {
    const datos = {
      esDestinatario: 0
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + data.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postQuitarCliente(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.cliente_muvin = 0;
    const datos = {
      id: data.id_usuario,
      cliente_muvin: data.cliente_muvin
    }
    data.cliente_muvin = 'NO';
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarVisualiza(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.visualiza_flota_intermediario = 0;
    const datos = {
      id: data.id_usuario,
      visualiza_flota_intermediario: data.visualiza_flota_intermediario
    }
    data.visualiza_flota_intermediario = 'NO';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarVeChoferesLibres(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.ve_choferes_libres = 0;
    const datos = {
      id: data.id_usuario,
      ve_choferes_libres: data.ve_choferes_libres
    }
    data.ve_choferes_libres = 'NO';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarDadorCupo(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.dador_cupo = 0;
    const datos = {
      id: data.id_usuario,
      es_dador_cupo: data.dador_cupo
    }
    data.dador_cupo = 'NO';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarClienteFinal(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.cliente_final = 0;
    const datos = {
      id: data.id_usuario,
      es_cliente_final: data.cliente_final
    }
    data.cliente_final = 'NO';
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarCondiciones(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.condiciones = 0;
    const datos = {
      id: data.id,
      condiciones_viaje: 0
    }
    data.condiciones = 'NO';
    return this.http.put(this.globalService.apiHost + 'configuracion-centro/actualizar-admin?id=' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postQuitarKm(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.km = 0;
    const datos = {
      id: data.id_usuario,
      km: data.km
    }
    data.km = 'NO';
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'usuario/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postBloquearViajeRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 1;
    const datos = {
      id: data.id,
      bloqueado: data.bloqueado
    }
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'viaje-retorno/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postOcultarPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.oculto = 1;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postOcultarPedidoRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.oculto = 1;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido-retorno/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  evaluarCupos(id): Observable<any> {
    return this.http.get(this.globalService.apiHost + `pedido/evaluar/${id}`).pipe(
      map(resp => resp['data'])
    );
  }
  borrarPedido(id): Observable<any> {
    return this.http.get(this.globalService.apiHost + `pedido/borrar/${id}`).pipe(
      map(resp => resp['data'])
    );
  }

  postDesBloquearPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 0;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postDesBloquearPedidoRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    data.bloqueado = 0;
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'pedido-retorno/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postReducir(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.get(this.globalService.apiHost + 'pedido/reducir', {
      params: new HttpParams()
        .set('id', data.id)
        .set('cantidad', data.quantity)
    })
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postConfirmViaje(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put<any>(this.globalService.apiHost + 'viaje/' + data.id, data);
  }

  postConfirmViajeRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'viaje-retorno/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postCaladaRechazada(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'calada-rechazada', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postCaladaRechazadaRetorno(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'calada-rechazada-retorno', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postDesviarViaje(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');

    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    if (data.isNew) {
      let desvio = {
        id_viaje: data.id,
        id_destino: data.id_newDestino,
        id_desvio_motivo: data.id_desvio_motivo,
        observaciones: data.observaciones
      }
      return this.http.post(this.globalService.apiHost + 'desvio/centro-create', desvio)
        .map(this.extractData)
        .catch(this.handleError1);
    } else {
      let desvio = {
        id: data.idDesvio,
        id_viaje: data.id,
        id_destino: data.id_newDestino,
        id_desvio_motivo: data.id_desvio_motivo,
        observaciones: data.observaciones
      }
      return this.http.put(this.globalService.apiHost + 'desvio/' + data.idDesvio, desvio)
        .map(this.extractData)
        .catch(this.handleError1);
    }

  }
  postDesviarViajeRetorno(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');

    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    if (data.isNew) {
      let desvio = {
        id_viaje: data.id,
        id_destino: data.id_newDestino,
        id_desvio_motivo: data.id_desvio_motivo,
        observaciones: data.observaciones
      }
      return this.http.post(this.globalService.apiHost + 'desvio-retorno', desvio)
        .map(this.extractData)
        .catch(this.handleError1);
    } else {
      let desvio = {
        id: data.idDesvio,
        id_viaje: data.id,
        id_destino: data.id_newDestino,
        id_desvio_motivo: data.id_desvio_motivo,
        observaciones: data.observaciones
      }
      return this.http.put(this.globalService.apiHost + 'desvio-retorno/' + data.idDesvio, desvio)
        .map(this.extractData)
        .catch(this.handleError1);
    }

  }
  getCartaPorte(id): Observable<any> {
    const options = { headers: headers };
    return this.http.get(this.globalService.apiHost + 'viaje/pdf-down?id=' + id, options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getMediospago(): Observable<any> {
    const options = { headers: headers };
    return this.http.get(this.globalService.apiHost + 'medio-pago', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDesvioViaje(data): Observable<any> {
    const options = data ?
      { headers: headers, params: new HttpParams().set('search[id_viaje]', data) } : {};

    return this.http.get(this.globalService.apiHost + 'desvio', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDesvioViajeRetorno(data): Observable<any> {
    const options = data ?
      { headers: headers, params: new HttpParams().set('search[id_viaje]', data) } : {};

    return this.http.get(this.globalService.apiHost + 'desvio-retorno', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDCentroIntermediario(data): Observable<any> {
    const options = data ?
      { headers: headers, params: new HttpParams().set('id', data) } : {};

    return this.http.get(this.globalService.apiHost + 'intermediario/are-centro', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getCamionesDisponible(idPedido, m = null): Observable<any> {
    const options = idPedido ?
      {
        headers: headers,
        params: new HttpParams().set('id', idPedido).set('m', m)
      } : {};

    return this.http.get(this.globalService.apiHost + 'centro/choferes-pedido', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getChoferesPropuestaTurnear(idPedido): Observable<any> {
    const options = idPedido ?
      { headers: headers, params: new HttpParams().set('id_pedido', idPedido) } : {};

    return this.http.get(this.globalService.apiHost + 'pedido/propuesta-turnear', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getCamionesViaje(idPedido): Observable<any> {
    const options = idPedido ?
      { headers: headers, params: new HttpParams().set('id', idPedido) } : {};

    return this.http.get(this.globalService.apiHost + 'viaje/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCamionesViajeRetorno(idPedido): Observable<any> {
    const options = idPedido ?
      { headers: headers, params: new HttpParams().set('id', idPedido) } : {};

    return this.http.get(this.globalService.apiHost + 'viaje/by-pedido', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getCamionesCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/choferes')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDatosCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/my')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDatosDador(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'dador/my')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDatosMuvin(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'muvin/resumen?id=')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDatosPedidosViajes(fecha_desde, fecha_hasta, tipo): Observable<any> {
    const options = { params: new HttpParams().set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta).set('pedido', tipo) };
    return this.http.get(this.globalService.apiHost + 'centro/descarga-masiva?', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDatosNuevosProveedores(fecha_desde, fecha_hasta): Observable<any> {
    const options = { headers: headers, params: new HttpParams().set('fecha_desde', fecha_desde).set('fecha_hasta', fecha_hasta) };
    return this.http.get(this.globalService.apiHost + 'centro/nuevos-proveedores?', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Camiones
  getAllMarcaCamionesSelect(): Observable<any> {
    const options = { headers: headers };
    return this.http.get<any>(this.globalService.apiHost + 'select?expand=marcaCamion', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllMarcaCamiones(page): Observable<any> {
    const options = { headers: headers, params: new HttpParams().set('page', page) };
    return this.http.get<any>(this.globalService.apiHost + 'marca-camion', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getMarcaByDescription(marca: string): Observable<any> {
    const options = { headers: headers };
    return this.http.get<any>(this.globalService.apiHost + 'marca-camion?search[descripcion]?=' + marca, options);
  }
  postViajeCamion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'viaje', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postViajeCambiarLista(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "viaje/cambiar-lista", data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postViajeRetornoCamion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'viaje-retorno', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putViajeCamion(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'viaje/' + data.id_viaje, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postMarcaCamion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'marca-camion', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  updateMarcaCamion(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'marca-camion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);

  }

  deleteMarcaCamion(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'marca-camion/' + data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //TipoCamiones
  getAllTipoCamionesSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'select?expand=tipoCamion')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllTipoCamiones(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get<any>(this.globalService.apiHost + 'tipo-camion', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postTipoCamion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'tipo-camion', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  updateTipoCamion(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'tipo-camion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);

  }

  deleteTipoCamion(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'tipo-camion/' + data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  // Motivos de rechazo
  getAllMotivosRechazo(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'select?expand=motivoRecuperarCupo')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Marca Acoplados
  getAllMarcaAcopladosSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'select?expand=marcaAcoplado')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllMarcaAcoplados(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get<any>(this.globalService.apiHost + 'marca-acoplado', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postMarcaAcoplado(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'marca-acoplado', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  updateMarcaAcoplado(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'marca-acoplado/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);

  }

  deleteMarcaAcoplado(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'marca-acoplado/' + data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //tipo Acoplados
  getAllTipoAcopladosSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'select?expand=tipoAcoplado')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllZonaIdealesSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'zona-huerfano/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllTipoAcoplados(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get<any>(this.globalService.apiHost + 'tipo-acoplado', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postTipoAcoplado(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'tipo-acoplado', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  updateTipoAcoplado(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'tipo-acoplado/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);

  }

  deleteTipoAcoplado(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'tipo-acoplado/' + data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Origen
  getAllOrigenes(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'origen')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllOrigenesSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'origen/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getAllOrigenesCentro(centro): Observable<any> {
    const options = centro ?
      { params: new HttpParams().set('id', centro) } : {};
    return this.http.get<any>(this.globalService.apiHost + 'origen/select', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllOrigenesCargador(centro): Observable<any> {
    const options = centro ?
      { params: new HttpParams().set('id', centro) } : {};
    return this.http.get<any>(this.globalService.apiHost + 'origen/select-dador', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllOrigenesDador(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'dador/origenes')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Zona
  getAllZonas(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'zona-destino/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllZonasPrepedido(zona: string): Observable<any> {
    const options = zona ?
      { params: new HttpParams().set('nombre_zona', zona) } : {};
    return this.http.get<any>(this.globalService.apiHost + 'zona-destino/buscar', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Cargador
  getAllDadores(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'centro-cliente/cliente-centro')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getDadoresPrePedido(cuit: string): Observable<any> {
    const options = cuit ?
      { params: new HttpParams().set('cuit', cuit) } : {};
    return this.http.get<any>(this.globalService.apiHost + 'centro/buscar-cargador', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getMisCentros(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'dador/mis-centros')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getMisClientes(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'centro-cliente')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getMisChoferes(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'dador/choferes')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Destinatario
  getAllDestinatario(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'centro/destinatario')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDestinatarioByCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-destinatario')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getDestinatarioByCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'destinatario/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  //Producto
  getAllProductos(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'producto')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllProductosSelect2(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'producto/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllProductosSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'producto/select-centro?m=C')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllProductosSelectCargador(id_centro): Observable<any> {
    const options = { params: new HttpParams().set('id_centro', id_centro) };
    return this.http.get<any>(this.globalService.apiHost + 'producto/select-cargador', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllSelectProducto(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'api-cupo/select-producto')

      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllVinculadoSelectProducto(): Observable<any> {
    return this.http
      .get<any>(
        this.globalService.apiHost + "api-cupo/vinculado-select-producto"
      )

      .map(this.extractData)
      .catch(this.handleError1);
  }
  //Destinos
  getAllDestinos(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'destino')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllDestinosSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'destino/select?m=F')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  //Entregadores
  getAllEntregador(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'entregador')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getEntregadorByCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-entregador')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCentroEntregadorSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-entregador/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getEntregadorByCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'entregador/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  //Corredores
  getAllCorredor(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'corredor')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCorredorByCentro(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro-corredor')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCorredorByCentroSelect(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'corredor/select')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //Corredores
  getAllEstadoViaje(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'viaje-estado')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllEstado(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'estado')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllDesviosMotivo(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'desvio-motivo')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getAllEstadosDescarga(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'estado-descarga')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllMotivoCaladaRechazada(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'motivo-calada-rechazada')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getAllEstadosDescargaViaje(id): Observable<any> {
    const options = id ?
      { params: new HttpParams().set('search[id_viaje]', id) } : {};
    return this.http.get<any>(this.globalService.apiHost + 'viaje-estado', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postEstadoDescargaViaje(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'viaje-estado', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  putEstadoDescargaViaje(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'viaje-estado/' + data.id_viaje + ',' + data.id_estado_descarga, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  deleteEstadoDescargaViaje(idViaje, idEstadoDescarga): Observable<any> {
    return this.http.delete<any>(this.globalService.apiHost + 'viaje-estado/' + idViaje + ',' + idEstadoDescarga)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  desglosarPedido(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'pedido/desglosar', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  desglosarPedidoCupo(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'pedido/desglosar-cupos', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getStatusMap(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/status-map')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getStatusMapAdmin(): Observable<any> {
    return this.http.get(this.globalService.apiHost + 'centro/status-map-admin')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  //// configuracion centro
  getConfiguracionCentro(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'configuracion-centro/my')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getConfiguracionCentroDador(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "configuracion-centro/centro-dador", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getListaCentroDisponible(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'lista-centro/disponibilidad')

  }
  getConfiguracionMuvin(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'configuracion-muvin')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getConfiguracionCentroAll(): Observable<any> {

    return this.http.get<any>(this.globalService.apiHost + 'configuracion-centro')
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putConfiguracionCentroKey(data): Observable<any> {
    console.log(data);
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-centro/actualizar-key', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putConfiguracionCentro(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-centro/actualizar', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putConfiguracionCentroContrato(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-centro/actualizar-contrato', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putConfiguracionCentroMail(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-centro/actualizar-mail', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putConfiguracionMuvin(data): Observable<any> {
    return this.http.put<any>(this.globalService.apiHost + 'configuracion-muvin/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  postConfiguracionCentro(data): Observable<any> {
    return this.http.post<any>(this.globalService.apiHost + 'configuracion-centro', data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putPedido(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.put(this.globalService.apiHost + 'pedido/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putUsuario(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.put(this.globalService.apiHost + 'usuario/' + data.id_usuario, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  putUsuarioInterviniente(data): Observable<any> {
    httpOptions.headers.append('Origin', '*');
    return this.http.put(this.globalService.apiHost + 'usuario/' + data.id_usuario, data)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCheckCartaPorte(id): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'viaje/check-carta-porte?id=' + id)
      .map(this.extractData)
      .catch(this.handleError1);
  }
  getCheckSeguro(id): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'viaje/check-seguro?id=' + id)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getAllDadoresByReceptor(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'dador-receptor/select-by-receptor')
      .map(this.extractData)
      .catch(this.handleError1);
  }

  getValidateCupo(listCupop, accion): Observable<any> {
    const data = {
      accion: accion,
      cupos: listCupop
    }
    console.log(data)
    return this.http.post<any>(this.globalService.apiHost + 'pedido/verificar-estado', data);
  }

  getAllTipoCombustible(page): Observable<any> {
    const options = { params: new HttpParams().set('page', page) };
    return this.http.get(this.globalService.apiHost + 'tipo-combustible', options)
      .map(this.extractData)
      .catch(this.handleError1);
  }

  postTipoCombustible(data): Observable<TipoCombustible> {
    return this.http.post<TipoCombustible>(this.globalService.apiHost + 'tipo-combustible', data)
  }

  updateTipoCombustible(data): Observable<TipoCombustible> {
    return this.http.put<TipoCombustible>(this.globalService.apiHost + 'tipo-combustible/' + data.id, data)
  }

  deleteTipoCombustible(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'tipo-combustible/' + data)
  }

  updateChapas(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'chofer/actualizar-chapas', data)
  }
  updatePhone(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'viaje/update-telefono-chofer', data)
  }

  private handleError1(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 425) {
      let msg = '';
      msg += error.error.data.error
      /* for(let i=0;i<error.error.data.error.length;i++){
        let eleme =error.error.data.error[i];
        msg+=error.error.data.error[i];
      } */
      return throwError(msg);
    }
    if (error.status === 500) {
      return throwError(error);//.error.data.previous.message
    }

  }
  private handleError(response: any) {
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
