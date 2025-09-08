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
import { GlobalService } from "../models/global.service";
import { User } from "../models/user";
import { throwError } from "rxjs";
import { PARAMETERS } from "@angular/core/src/util/decorators";

const apiUrl = "http://localhost:3000/api";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class UserService {
  postString: string = "";
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  /*   public getHeaders(): HttpHeaders {
         this.postString= localStorage.getItem('token');
         console.log('El token:'+this.postString);
         const headt = new HttpHeaders({
           'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' ,
           'x-access-token':localStorage.getItem('token'),
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
           'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
           'Access-Control-Allow-Credentials': 'true'
         });
               return headt;
     } */

  getAll() {
    return this.http.get<User[]>("/api/users");
  }

  getById(id: number) {
    return this.http.get("/api/users/" + id);
  }

  create(user: User) {
    return this.http.post<any>(apiUrl + "/createUser", user);
  }

  update(user: User) {
    return this.http.put<any>(apiUrl + "/users/" + user.id, user);
  }

  delete(id: number) {
    return this.http.delete<any>(apiUrl + "/users/" + id);
  }

  getAllUsers(): Observable<any> {
    // console.log('Valor de autorization:' + httpOptions.headers);
    return this.http
      .get(apiUrl + "/getAllUsers")
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllRoles(page): Observable<any> {
    const options = { params: new HttpParams().set("page", page) };
    return this.http
      .get(this.globalService.apiHost + "roles", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllRolesSelect(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "roles/select")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRolById(id: number) {
    return this.http
      .get(apiUrl + "/getRolId/" + id)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIdPersonaRol(id_rol: string): Observable<any> {
    const options = { params: new HttpParams().set("id_rol", id_rol) };
    return this.http
      .get<any>(this.globalService.apiHost + "usuario/mi-persona-rol", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postRol(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "roles", data, httpOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateRol(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "roles/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  esDadorCuit(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "dador-receptor/es-dador", options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  esCorredor(cuit): Observable<any> {
    // console.log(this.globalService.apiHost + "es-corredor/" + cuit);
    return this.http
      .get(this.globalService.apiHost + "es-corredor/" + cuit)
      .map(this.extractData)
      .catch(this.handleError);
  }
  esReceptorCuit(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "dador-receptor/es-receptor", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  esDestinatarioCuit(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "dador-receptor/existe", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  esChoferCuit(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "chofer/validate", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  esChoferDisponibleCuit(cuit): Observable<any> {
    const options = { params: new HttpParams().set("cuit", cuit) };
    return this.http
      .get(this.globalService.apiHost + "chofer/esta-ocupado", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRol(data): Observable<any> {
    return this.http
      .delete(this.globalService.apiHost + "roles/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {


    return throwError(error.message);
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
}
