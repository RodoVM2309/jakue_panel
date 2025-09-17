import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


export interface CedulaChofer {
  id: number;
  cedula: string;
  tipo_documento: number;
  encontrada: number; // El API devuelve 1 o 0, no boolean
  nombre: string; // El API devuelve 'nombre', no 'nombre_completo'
  apellido: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class CedulasChoferService {

  constructor(private http: HttpClient) { }

  // Obtener listado de cédulas
  getAllCedulas(params: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params.cedula && params.cedula !== '') {
      httpParams = httpParams.set('cedula', params.cedula);
    }
    
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    
    if (params.per_page) {
      httpParams = httpParams.set('per_page', params.per_page.toString());
    }

    const url = `${environment.apiURL}cedula-chofer`;
    
    return this.http.get<any>(url, { params: httpParams });
  }

  // Buscar/verificar cédula
  buscarCedula(cedula: string): Observable<any> {
    const params = new HttpParams().set('cedula', cedula);
    return this.http.get<any>(`${environment.apiURL}cedula-chofer/buscar`, { params });
  }

  // Aplicar cédula
  aplicarCedula(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<any>(`${environment.apiURL}cedula-chofer/aplicar`, { params });
  }
}
