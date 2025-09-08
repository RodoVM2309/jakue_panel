import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { PedidoAsignar } from '../models/pedido';
import { GlobalService } from "../models/global.service";
import 'rxjs/add/operator/map';
import { log } from 'console';


@Injectable({
  providedIn: 'root'
})
export class PedidoResolverService implements Resolve<any> {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.params['id'];
    const url = `${this.globalService.apiHost + 'pedido'}/${id}`;
    console.log(url);

    return this.http.get<PedidoAsignar>(url).pipe(
      tap(_ => console.log('')),
      catchError(this.handleError<PedidoAsignar>(`getPedido id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

/*   this.personasService
          .getDadorCuit(localStorage.getItem("cuit_cuil")).subscribe(ok => {
            console.log(ok)
          }) */

}
