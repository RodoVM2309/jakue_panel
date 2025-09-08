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

export class PromocionesService {
  postString: string = '';
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getAllPromociones(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'promocion', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllGanadoresPromociones(promo): Observable<any> {
    const options =  { params: new HttpParams().set('id_promocion', promo ) } ;
    return this.http.get(this.globalService.apiHost + 'promocion/historicos', options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postPromocion(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'promocion', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePromocion(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'promocion/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deletePromocion(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'promocion/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  getAllSorteos(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'sorteo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  postPonerSorteoVigente(data): Observable<any> {
    
    data.vigente = 1;
    const datos = {
      id: data.id,
      vigente: data.vigente
    }
    data.vigente = 'SI';
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'sorteo/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postQuitarSorteoVigente(data): Observable<any> {
    
    data.vigente = 0;
    const datos = {
      id: data.id,
      vigente: data.vigente
    }
    data.vigente = 'NO';
    //const options = { params: new HttpParams().set('id', data.id).set('cantidad', data.quantity) };
    return this.http.put(this.globalService.apiHost + 'sorteo/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getHaySorteoVigente(): Observable<any> {   
    return this.http.get(this.globalService.apiHost + 'sorteo/hay-vigente')
      .map(this.extractData)
      .catch(this.handleError);
  }
  postSorteo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'sorteo', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateSorteo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'sorteo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteSorteo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'sorteo/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllConcursos(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'concurso', options)
      .map(this.extractData)
      .catch(this.handleError);
  }  
  postConcurso(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'concurso', data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postPonerConcursoVigente(data): Observable<any> {    
    data.vigente = 1;
    const datos = {
      id: data.id,
      vigente: data.vigente
    }
    data.vigente = 'SI';
    return this.http.put(this.globalService.apiHost + 'concurso/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError);
  }
  postQuitarConcursoVigente(data): Observable<any> {    
    data.vigente = 0;
    const datos = {
      id: data.id,
      vigente: data.vigente
    }
    data.vigente = 'NO';
    return this.http.put(this.globalService.apiHost + 'concurso/' + datos.id, datos)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateConcurso(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'concurso/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }
  getHayConcursoVigente(): Observable<any> {   
    return this.http.get(this.globalService.apiHost + 'concurso/hay-vigente')
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteConcurso(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'concurso/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllNoticias(page): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ) } ;
    return this.http.get(this.globalService.apiHost + 'noticias', options)
      .map(this.extractData)
      .catch(this.handleError);
  }  
  postNoticia(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'noticias', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateNoticia(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'noticias/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteNoticia(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'noticias/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllGanadoresSorteo(page,id_sorteo): Observable<any> {
    const options =  { params: new HttpParams().set('page', page ).set('search[id_sorteo]',id_sorteo) } ;
    return this.http.get(this.globalService.apiHost + 'ganadores-sorteo', options)
      .map(this.extractData)
      .catch(this.handleError);
  }  
  postGanadoresSorteo(data): Observable<any> {
    return this.http.post(this.globalService.apiHost + 'ganadores-sorteo', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateGanadoresSorteo(data): Observable<any> {
    return this.http.put(this.globalService.apiHost + 'ganadores-sorteo/' + data.id, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  deleteGanadoresSorteo(data): Observable<any> {
    return this.http.delete(this.globalService.apiHost + 'ganadores-sorteo/' + data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  buscarPersona(data): Observable<any> {   
    return this.http.get(this.globalService.apiHost + 'sorteo/buscar-persona?dni='+data)
      .map(this.extractData)
      .catch(this.handleError);
  }
  buscarHuerfano(data): Observable<any> {   
    return this.http.get(this.globalService.apiHost + 'sorteo/buscar-huerfano?dni='+data)
      .map(this.extractData)
      .catch(this.handleError);
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
