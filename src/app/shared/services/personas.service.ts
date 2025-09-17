import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";

import { GlobalService } from "../models/global.service";
import { map, tap } from "rxjs/operators";
import { Person } from "../models/person";
import { IPersonRazonSocialResponse, PersonRazonSocial } from "../models/personRazonSocial";
import { UrlResolver } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class PersonasService {
  postString: string = "";
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAll() {
    return this.http.get<Person[]>("/api/personas");
  }

  getAllPersonas(page, filtro, filtro_cuit): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("page", page)
        .set("Search[razon_social]", filtro)
        .set("Search[cuit_cuil]", filtro_cuit)
    };
    return this.http
      .get(this.globalService.apiHost + "usuario", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPersonasMovil_key(filtro): Observable<any> {
    const options = {
      params: new HttpParams().set("Search[movil_key]", filtro)
    };
    return this.http
      .get(this.globalService.apiHost + "usuario", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPersonasSelect(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "usuario")
      .map(this.extractData)
      .catch(this.handleError);
  }


  getAllChoferesPerdidos(page, filtro): Observable<any> {
    const options = {
      params: new HttpParams()
        .set("page", page)
        .set("Search[tipo_acoplado]", filtro)
    };
    return this.http
      .get(this.globalService.apiHost + "chofer-perdido", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPersonaById(id: number): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "usuario/" + id)
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*getPersonaByPersonaRol(id: number): Observable<any> {
    const options = id
      ? { params: new HttpParams().set("id", id.toString()) }
      : {};
    return this.http
      .get(this.globalService.apiHost + "usuario/by-persona-rol", options)
      .map(this.extractData)
      .catch(this.handleError);
  } */
  getPersonaByPersonaRol(id: number): Observable<any> {
    const options = {
      params: new HttpParams().set("id", id.toString())
    };
    let rol = localStorage.getItem("rol");
    switch (rol) {
      case "1":
        return this.http
          .get(this.globalService.apiHost + "usuario/" + id.toString())
          .map(this.extractData)
          .catch(this.handleError);

      case "3":
        return this.http
          .get(this.globalService.apiHost + "usuario/view-trabajador/", options)
          .map(this.extractData)
          .catch(this.handleError);

      case "4":
        return this.http
          .get(this.globalService.apiHost + "usuario/view-trabajador-transporte/", options)
          .map(this.extractData)
          .catch(this.handleError);

      case "5":
        return this.http
          .get(this.globalService.apiHost + "usuario/view-pertenesco/", options)
          .map(this.extractData)
          .catch(this.handleError);

      default:
        return this.http
          .get(this.globalService.apiHost + "usuario/view-trabajador/", options)
          .map(this.extractData)
          .catch(this.handleError);

    }
  }
  getAllChoferesLibresTodos(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "chofer/huerfanos")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMyPersonaRolPerfil(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "usuario/my")
      .map(this.extractData)
      .catch(this.handleError);
  }

  postPersona(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "usuario", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePersona(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "usuario/update-trabajador?id=" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updatePersonaAdmin(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "usuario/update-persona?id=" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  chancePassword(oldPassword: string, newPassword: string, retypePassword: string): Observable<any> {
    let data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      retypePassword: retypePassword
    }
    return this.http.post<any>(this.globalService.apiHost + 'usuario/change-password', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateUsuario(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "usuario/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deletePersona(data): Observable<any> {
    return this.http
      .delete(this.globalService.apiHost + "usuario/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }



  getTipoPersona(): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "tipo-persona")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPais(): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "select?expand=paises")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProvincias(data): Observable<any> {
    const options = data
      ? { params: new HttpParams().set("id_pais", data) }
      : {};
    return this.http
      .get<any>(this.globalService.apiHost + "select/provincias", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProvinciaid(data): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "provincia/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  geLocalidades(data): Observable<any> {
    const options = data
      ? { params: new HttpParams().set("id_provincia", data) }
      : {};
    return this.http
      .get(this.globalService.apiHost + "select/localidades", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  geLocalidadid(data): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "localidad/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllRolesxPersona(data): Observable<any> {
    const options = data
      ? { params: new HttpParams().set("cuit", data) }
      : {};
    return this.http
      .get(this.globalService.apiHost + "persona-rol/roles", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getPersonaNombreByCuit(cuit): Observable<any> {
    const options = cuit
      ? { params: new HttpParams().set("cuit", cuit) }
      : {};
    return this.http
      .get(this.globalService.apiHost + "persona-rol/nombre-by-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  /* getPersonaByRazonSocial(criterio): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "cuitByRazonSocial/"+criterio)
      .map(this.extractData)
      .catch(this.handleError);
  } */

  getPersonaByRazonSocial(filter: {razon_social: string} = {razon_social: ''}, rol?:{ nombre:string}): Observable<any> {
     let url = rol ?this.globalService.apiHost + "cuitByRazonSocial/"+rol.nombre+'/'+filter.razon_social :this.globalService.apiHost + "cuitByRazonSocial/"+filter.razon_social
      return this.http.get<any>(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  putRolPersona(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "persona-rol/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRolPersona(data): Observable<any> {
    return this.http
      .delete(this.globalService.apiHost + "persona-rol/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postRolPersona(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "persona-rol", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPersonaRol(): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "persona-rol")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPersonaRolpag(pagina: any): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "persona-rol?page=" + pagina)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllIntermediarios(): Observable<any> {
    const options = { params: new HttpParams().set("search[id_rol]", "10") };
    return this.http
      .get(this.globalService.apiHost + "persona-rol", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioByCentro(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "centro-intermediario")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDadorCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/dador-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getEmpresaCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/centro-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/chofer-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verificarListaNegra(id_chofer: number, id_destino: number): Observable<any> {
    const data = {
      id_chofer: id_chofer,
      id_destino: id_destino
    };
    return this.http
      .post(this.globalService.apiHost + "lista-negra/verificar", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEntregadorCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/entregador-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIntermediarioCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(
        this.globalService.apiHost + "persona-rol/intermediario-cuit",
        options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  getOperadorCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/operador-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getDestinatarioCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(
        this.globalService.apiHost + "persona-rol/destinatario-cuit",
        options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTransportistaCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(
        this.globalService.apiHost + "persona-rol/transportista-cuit",
        options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCorredorCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/corredor-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDestinoCuit(data): Observable<any> {
    const options = { params: new HttpParams().set("cuit", data) };
    return this.http
      .get(this.globalService.apiHost + "persona-rol/destino-cuit", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChoferById(id: number, isCentro: boolean): Observable<any> {
    if (isCentro) {
      const options = { params: new HttpParams().set("id", id.toString()) };
      return this.http
        .get(this.globalService.apiHost + "chofer/view-centro", options)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(this.globalService.apiHost + "chofer/" + id)
        .map(this.extractData)
        .catch(this.handleError);
    }

  }


  esTipoFisico(cuit): boolean {
    if (cuit.substring(0, 1) !== "2") {
      return false;
    }
    return true;
  }

  validarCUIT(cuit, tipopersona): boolean {
    const multiplicador = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    const cadenaCUIT = cuit.toString();
    let suma_prod = 0;
    let valint;
    for (let i = 0; i < 11; i++) {
      valint = cadenaCUIT.substring(i, i + 1);
      suma_prod += multiplicador[i] * parseInt(valint);
    }
    if (suma_prod % 11 !== 0) {
      return false;
    }
    if (tipopersona === 1 && cadenaCUIT.substring(0, 1) !== "2") {
      return false;
    }
    if (tipopersona === 2 && cadenaCUIT.substring(0, 1) !== "3") {
      return false;
    }
    return true;
  }
  getEmailPersona(data): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "persona-rol/existe-correo?correo=" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getTelefonoPersona(data): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "persona-rol/existe-telefono?telefono=" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postChoferPerdido(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "chofer-perdido", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPersonaByCuit(data): Observable<any> {
    return this.http
      .get<any>(this.globalService.apiHost + "persona-rol/existe-cuit?cuit=" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  validarExistCuit(data): Observable<any> {
    return this.http.get<any>(this.globalService.apiHost + "persona-rol/existe-cuit?cuit=" + data)
    .pipe(
      map(resp => resp['data'])
    );
  }

  /*
  getDatosChofer(cuit): Observable<any> {
    return this.http.get(this.globalService.apiHost + `pedido/check-chofer?cuit=${cuit}`)
      .pipe(
        map(resp => resp['data'])
      );
  }
  */

  private handleError(error: HttpErrorResponse) {

    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 500) {
      return throwError(error.error.data.message);
    }
    if (error.status === 422) {
      let mensaje = ''
      error.error.data.forEach(element => {
        mensaje = mensaje === '' ? element.errors : mensaje + ', ' + element.errors
      });
      return throwError(mensaje);
    }
    if (error.status === 425) {
      return throwError(error.error.data.message);
    }
    if (error.status === 422) {
      let mensaje = ''
      error.error.data.forEach(element => {
        mensaje = mensaje === '' ? element.errors : mensaje + ', ' + element.errors
      });
      return throwError(mensaje);
    }
    return throwError(error.error);

  }

  private handleError1(response: any) {
    let errorMessage: any = {};
    // Connection error
    if (response.error.status === 0) {
      errorMessage = {
        success: false,
        status: 0,
        data: "Sorry, there was a connection error occurred. Please try again."
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

  getPedidoGenerarExcel(): Observable<Blob> {
    return this.http
      .get(this.globalService.apiHost + "pedido/generar-excel",{responseType: "blob"})
      /*.map(this.extractData)
      .catch(this.handleError);*/
  }


}
