import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from '../models/global.service';

import { Terms } from '../models/terms';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  constructor(private globalService: GlobalService, private http: HttpClient) { } 

  updateTerms(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'termino/actualizar', data)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

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

}
