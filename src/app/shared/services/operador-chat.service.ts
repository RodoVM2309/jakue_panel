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

@Injectable({
  providedIn: "root"
})
export class OperadorChatService {
  constructor(private globalService: GlobalService, private http: HttpClient) {}

  getAllOperadorChat(page): Observable<any> {
    const options = { params: new HttpParams().set("page", page) };
    return this.http
      .get(this.globalService.apiHost + "operadores-chat/mios", options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllOperadorChatClientes(page): Observable<any> {
    const options = { params: new HttpParams().set("page", page) };
    return this.http
      .get(this.globalService.apiHost + "operadores-chat/clientes", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  getAllOperadorChatTodos(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "operadores-chat/todos")
      .map(this.extractData)
      .catch(this.handleError);
  }

  postOperadorChat(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "operadores-chat/create-mio", data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postOperadorChatCliente(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "operadores-chat/create-cliente", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateOperadorChat(data): Observable<any> {
    return this.http
      .put<any>(this.globalService.apiHost + "operadores-chat/update-mio?id=" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateOperadorChatCliente(data): Observable<any> {
    return this.http
      .put<any>(this.globalService.apiHost + "operadores-chat/update-cliente?id=" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteOperadorChat(data): Observable<any> {
    return this.http
      .delete<any>(this.globalService.apiHost + "operadores-chat/" + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    
    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 422) {
      return throwError(error.error.data);
    }
    if (error.status === 425) {
      return throwError(error.error.data);
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
}
