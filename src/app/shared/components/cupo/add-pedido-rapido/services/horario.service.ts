import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";
import { GlobalService } from "@app/shared/models";


export interface ResponseHorario {
    success: boolean;
    status:  number;
    data:    dataHorarioPuerto[];
}

export interface dataHorarioPuerto {
    id:          number;
    fecha:       Date;
    hora_inicio: string;
    hora_fin:    string;
    id_puerto:   number;
    cantidad:    number;
    id_producto: number;
    ocupados:    null;
}


@Injectable({
  providedIn: "root"
})
export class HorarioService {
  constructor(private globalService: GlobalService, private http: HttpClient) { }
 

  getHorarioPuerto(id_destino: number, id_cupo: number): Observable<ResponseHorario> {

    return this.http.get<ResponseHorario>(`${this.globalService.apiHost}/horario-puerto/get-horario-puerto?id_destino=${id_destino}&id_cupo=${id_cupo}`);
  }

}
