import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//Servicios
import { GlobalService } from '../models/global.service';

// Modelos
import { ConfigBanda,Filtro } from '../models/horario-fertilizantes';


@Injectable({
  providedIn: 'root'
})

export class HorarioFertilizantesService {

  filtros$ = new EventEmitter<Filtro>();

  constructor(private globalService: GlobalService, private http: HttpClient) { }

  getBandaHorarias(): Observable<ConfigBanda> {
    const options = {
      params: new HttpParams()
        .set("m", 'F')
    };
    return this.http.get<ConfigBanda>(this.globalService.apiHost + `horario-puerto/banda-horaria`, options);
  }


  getBandaHorariasFiltro(id_tipo_despacho,id_origen,sem): Observable<ConfigBanda> {
    return this.http.get<ConfigBanda>(this.globalService.apiHost + `horario-puerto/banda-horaria?&id_tipo_despacho=${id_tipo_despacho}&id_origen=${id_origen}&sem=${sem}&m=F`);
  }

  postGrillaDestino(data): Observable<ConfigBanda> {
    return this.http.post<ConfigBanda>(this.globalService.apiHost + 'horario-puerto/asignar-turnos-horarios',data);
  }

  postConfig(data): Observable<ConfigBanda> {
    return this.http.post<ConfigBanda>(this.globalService.apiHost + 'configuracion-destino/configurar-destino',data);
  }


}
