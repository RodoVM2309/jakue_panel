import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//Servicios
import { GlobalService } from '../models/global.service';

// Modelos
import { ConfigBanda,Filtro } from '../models/horario-puerto';


@Injectable({
  providedIn: 'root'
})



export class HorarioPuertoService {

  filtros$ = new EventEmitter<Filtro>();

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getBandaHorarias(): Observable<ConfigBanda> {
    return this.http.get<ConfigBanda>(this.globalService.apiHost + `horario-puerto/banda-horaria?`);
  }


  getBandaHorariasFiltro(id_producto,id_destino,sem): Observable<ConfigBanda> {
    return this.http.get<ConfigBanda>(this.globalService.apiHost + `horario-puerto/banda-horaria?id_producto=${id_producto}&id_destino=${id_destino}&sem=${sem}`);
  }

  postGrillaDestino(data): Observable<ConfigBanda> {
    return this.http.post<ConfigBanda>(this.globalService.apiHost + 'horario-puerto/asignar-turnos-horarios',data);
  }

  postConfig(data): Observable<ConfigBanda> {
    return this.http.post<ConfigBanda>(this.globalService.apiHost + 'configuracion-destino/configurar-destino',data);
  }


}
