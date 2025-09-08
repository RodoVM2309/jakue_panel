import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";

import { GlobalService } from "../models/global.service";

@Injectable({
  providedIn: "root"
})
export class BocaService {
  constructor(private globalService: GlobalService, private http: HttpClient) {}

  getAllBoca(page): Observable<any> {
    const options = { params: new HttpParams().set("page", page) };
    return this.http
      .get(this.globalService.apiHost + "boca", options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllBocaTodos(): Observable<any> {
    return this.http
      .get(this.globalService.apiHost + "boca/todos")
      .map(this.extractData)
      .catch(this.handleError);
  }

  postBoca(data): Observable<any> {
    return this.http
      .post(this.globalService.apiHost + "boca", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateBoca(data): Observable<any> {
    return this.http
      .put(this.globalService.apiHost + "boca/" + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteBoca(data): Observable<any> {
    return this.http
      .delete(this.globalService.apiHost + "boca/" + data)
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
      return throwError(error.error.data.message);
    }
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
