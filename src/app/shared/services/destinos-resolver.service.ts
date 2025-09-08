import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Puerto } from 'app/shared/models/puerto';
import { GlobalService } from "../models/global.service";
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class DestinosResolverService implements Resolve<any> {

  constructor(private http: HttpClient, private globalService: GlobalService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const url = `${this.globalService.apiHost + 'destino-persona/my'}`;
    //const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    return this.http.get<Puerto>(url).pipe(
      // tap(_ => console.log('')),
      catchError(this.handleError<Puerto>(`getDestinos`))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
