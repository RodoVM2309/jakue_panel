import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

import { GlobalService } from '../models/global.service';
import { map,catchError, tap } from 'rxjs/operators';
import { SituacionPuertoDestino } from '../models/situacion-puerto';


@Injectable({
  providedIn: 'root'
})

export class PlayasIntermediasService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllPlayasIntermedias(page,filtro): Observable<any> {
    const options = { params: new HttpParams().set('page', page).set('Search[descripcion]',filtro) };
    return this.http.get(this.globalService.apiHost + 'playa-intermedia/listado', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getAllDestinosPuertos(): Observable<any> {
  //   const options = { params: new HttpParams().set('search[id_tipo_destino]', '1') };
  //   return this.http.get(this.globalService.apiHost + 'destino', options)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // getPlayasIntermedias(): Observable<any> {
  //   return this.http.get(this.globalService.apiHost + 'playa-intermedia')
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // getDestinoById(id: number): Observable<any> {
  //   return this.http.get(this.globalService.apiHost + 'destino/' + id)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }
  // getDestinoPersona(): Observable<any> {
  //   return this.http.get(this.globalService.apiHost + 'destino-persona/my' )
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  // getDestinoTurno(fecha): Observable<any> {
  //   const options = { params: new HttpParams().set('fecha', fecha) };
  //   return this.http.get(this.globalService.apiHost + 'destino/turnos',options )
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // /* geDestinoByIdPersonaRol(data): Observable<any> {
  //   const options = data ?
  //     { params: new HttpParams().set('search[id_persona_rol]', data) } : {};
  //   return this.http.get(this.globalService.apiHost + 'destino', options)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // } */
  // getHorarioPuertoDestino(id): Observable<any> {
  //   const options = { params: new HttpParams().set('expand', 'horarios') };
  //   return this.http.get(this.globalService.apiHost + 'destino/'+id, options)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  postPlayaIntermedia(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'playa-intermedia', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  // postPuertoDestino(data): Observable<any> {
  //   return this.http.post(this.globalService.apiHost + 'destino', data)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  // postSmsDestino(data): Observable<any> {
  //   return this.http.post(this.globalService.apiHost + 'destino/mensaje-ventanillas', data)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  updatePlayaIntermedia(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'playa-intermedia/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }
  // updatePuertoDestino(data): Observable<any> {
  //   let dat= {
  //     hora_corte: data.hora_corte
  //   }
  //   return this.http.put(this.globalService.apiHost + 'destino/' + data.id, dat)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }
  // updatePuertoDestinoHoraDemorado(puerto,data): Observable<any> {
  //   let dat= {
  //     tiempo_para_demorado: data
  //   }
  //   return this.http.put(this.globalService.apiHost + 'destino/' + puerto, dat)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }
  // updateHorarioPuertoDestino(puerto,data): Observable<any> {
  //   return this.http.put(this.globalService.apiHost + 'destino/horarios?id_destino=' + puerto, data)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }
  // postHorarioPuertoDestino(puerto,data): Observable<any> {
  //   return this.http.post(this.globalService.apiHost + 'destino/horarios?id_destino=' + puerto, data)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }

  deletePlayaIntermedia(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'playa-intermedia/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  // deletePuertoDestino(data): Observable<any> {
  //   return this.http.delete(this.globalService.apiHost + 'destino/' + data)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // getTipoDestino(): Observable<any> {
  //   return this.http.get<any>(this.globalService.apiHost + 'tipo-destino')
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // getTipoSituacion(): Observable<any> {
  //   return this.http.get<any>(this.globalService.apiHost + 'situacion-puerto')
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // getZonasDestino(): Observable<any> {
  //   return this.http.get<any>(this.globalService.apiHost + 'zona-destino')
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  getZonasPlayaIntermediaSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'zona-destino/select')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPlayaIntermediaSelect(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'playa-intermedia/select')
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPersonaRol(): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + 'persona-rol')
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getAllPersonaRolpag(pagina: any): Observable<any> {
  //   return this.http.get<any>(this.globalService.apiHost + 'persona-rol?page=' + pagina)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  existeCodigoPlantaOncca(codigo: any): Observable<any> {
    const options = codigo ?
      { params: new HttpParams().set('CodigoPlantaOncca', codigo) } : {};
    return this.http.get(this.globalService.apiHost + 'playa-intermedia/existe', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getTurnoPuerto(filtro): Observable<any> {
  //   const dat = {
  //     fecha: filtro.fecha,
  //     id_puerto: filtro.id_destino
  //   };
  //   return this.http.post<any>(this.globalService.apiHost + 'turno-puerto/select-productos',dat)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }
  // getSituacionPuerto(filtro): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('fecha',filtro.fecha)
  //   params = params.set('id_producto',filtro.id_producto)
  //   params = params.set('id_puerto',filtro.id_destino)
  //   const url = `${this.globalService.apiHost + 'destino/situacion-puerto'}`;
  //   return this.http.get<any>(url, { params: params})
  //   .pipe(
  //     tap(SituacionPuertoDestino => {
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  // getDestinoDashboard(filtro):Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('fecha',filtro.fecha)
  //   let data= {
  //     fecha: filtro.fecha
  //   }
  //   const url = `${this.globalService.apiHost + 'v3/cupo/destinados/'+filtro.fecha}`;
  //   return this.http.get<any>(url)
  // }

  // getChoferesVentanilla(filtro):Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('fecha',filtro.fecha)
  //   params = params.set('id_producto',filtro.id_producto)
  //   params = params.set('id_puerto',filtro.id_puerto)
  //   params = params.set('inicio',filtro.inicio)
  //   params = params.set('fin',filtro.fin)
  //   let data= {
  //     id_horario: filtro.id_horario,
  //     inicio:filtro.inicio,
  //     fin: filtro.fin,
  //     fecha: filtro.fecha,
  //     id_puerto:filtro.id_puerto,
  //     id_producto: filtro.id_producto
  //   }
  //   const url = `${this.globalService.apiHost + 'destino/informacion-ventanilla'}`;
  //   return this.http.post<any>(url, data)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }



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
