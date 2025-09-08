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

export class ProductosService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllProductos(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'producto', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProductosPuerto(id:number): Observable<any> {
    return this.http.get(this.globalService.apiHost + "destino/producto-destino?id="+id);
  } 

  postProducto(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'producto', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProducto(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'producto/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteProducto(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'producto/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProductosPlanta(): Observable<any> {
    return this.http.get(this.globalService.apiHost + "producto/codigo-select?m=C");
  }
  horas(time){
    return Math.floor( time / 3600 );
  }
  minutos(time){
    return  Math.floor( (time % 3600) / 60 );
  }
  segundos(time){
    return time % 60;
  }
  tiempo(hours?,minut?,sec?){
    return hours*3600+minut*60+sec
  }

  private handleError(error: HttpErrorResponse) {
    
    if(error.status === 401){
      return throwError(error.error.data.username[0]);
    }
    if(error.status === 425){
      return throwError(error.error.data);
    }
    if(error.status === 500){
        return throwError(error.error.data.previous.message);
    }
    return throwError(error.message);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
