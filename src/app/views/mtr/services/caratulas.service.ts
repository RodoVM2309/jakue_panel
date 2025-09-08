import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Caratula, Cupo, FiltroCaratula, ResponseCaratula } from "../model/caratulas";
import { GlobalService } from "../../../shared/models/global.service";
import { throwError } from "rxjs";
import { Page } from "@app/shared/models";

@Injectable({
  providedIn: "root",
})
export class CaratulasService {
  dataResponse;

  constructor(private globalService: GlobalService, private http: HttpClient) {}



  findCaratulas(
    filtro: FiltroCaratula,
    sortOrder = "asc",
    page = 0,
    pageSize = 10
  ): Observable<ResponseCaratula> {
    let params = new HttpParams();
    if (filtro.caratula !== "") {
      params = params.set("caratula", filtro.caratula);
    }
    if (filtro.mesEntrega !== "") {
      params = params.set("mesEntrega", filtro.mesEntrega);
    }
    if (filtro.cuitComprador !== "") {
      params = params.set("cuitComprador", filtro.cuitComprador);
    }
    if (filtro.cuitCorredorComprador !== "") {
      params = params.set(
        "cuitCorredorComprador",
        filtro.cuitCorredorComprador
      );
    }
    if (filtro.cuitCorredorVendedor !== "") {
      params = params.set("cuitCorredorVendedor", filtro.cuitCorredorVendedor);
    }
    if (filtro.cuitVendedor !== "") {
      params = params.set("cuitVendedor", filtro.cuitVendedor);
    }
    if (filtro.idCupoTerminal !== "") {
      params = params.set("idCupoTerminal", filtro.idCupoTerminal.toString());
    }
    if (filtro.noCartaPorte !== "") {
      params = params.set("noCartaPorte", filtro.noCartaPorte.toString());
    }
    if (filtro.activo != -1) {
      params = params.set("activo", filtro.activo.toString());
    }
    if (filtro.descargado != -1) {
      params = params.set("descargado", filtro.descargado.toString());
    }
    params = params.set("sortOrder", sortOrder);
    params = params.set("page", page.toString());
    params = params.set("pageSize", pageSize.toString());
    const options = { params: params };

    return this.http
      .get(this.globalService.apiHost + "mtr/caratulas", options)
      .pipe(
        map((res) => {
          this.dataResponse = res["data"];
          const rows = [];
          let data = res["data"]["caratulas"];
          let footer = res["_meta"];
          data.forEach((element) => {
            element.razonSocialComprador =
              res["data"]["razones_sociales"][
                element.cuitComprador
              ].razon_social;
            element.razonSocialCorredorComprador =
              res["data"]["razones_sociales"][
                element.cuitCorredorComprador
              ].razon_social;
            element.razonSocialCorredorVendedor =
              res["data"]["razones_sociales"][
                element.cuitCorredorVendedor
              ].razon_social;
            element.razonSocialVendedor =
              res["data"]["razones_sociales"][
                element.cuitVendedor
              ].razon_social;

              for (let index = 0; index < element.cupos.length; index++) {
                const element1 = element.cupos[index];
                element1.fecha = element1.fecha?  element1.fecha.substring(0,10): '';
                element1.fechaArribado = element1.fechaArribado?  element1.fechaArribado.substring(0,10): '';
                element1.fechaDescargado = element1.fechaDescargado?  element1.fechaDescargado.substring(0,10): '';

                if (element1.idCupoEstado == "1" ||element1.idCupoEstado == "2") {
                  if (element1.ctg === null || element1.ctg == '') {
                    element1.idCupoEstado = 'Sin CTG';
                    continue;
                  } else {
                    element1.idCupoEstado = 'CTG Activo';
                    continue;
                  }
                }

                if (element1.idCupoEstado == "3") {
                  element1.idCupoEstado = 'Descargado';
                  continue;
                }
                if (element1.idCupoEstado == "5") {
                    element1.idCupoEstado = 'En Destino';
                    continue;
                }
                if (element1.esAnulado) {
                  if (element1.esAnulado.toUpperCase() == "S") {
                    element1.idCupoEstado = 'Anulado';
                    continue;
                  }
                }
               
                if (element1.pendienteGeneral) {
                  element1.idCupoEstado = 'Por Asignar';
                  continue;
                }

                if (element1.ctg && element1.idCupoEstado === null) {
                  element1.idCupoEstado = 'CTG Activo';
                  continue;
                } else {
                  element1.idCupoEstado = 'Sin CTG';
                  continue;
                }

                
              }
            rows.push(element, { detailRow: true, element });
          });
         // rows.push({footer: footer})
          console.log(rows);
          let page : Page ={
            size :res["_meta"].perPage,
            totalElements :res["_meta"].totalCount,
            totalPages :res["_meta"].pageCount,
            pageNumber :res["_meta"].currentPage,
          }
          let response : ResponseCaratula= {
            caratulas : rows,
            page: page
          }
          return response;
        })
      )
      .catch(this.handleError);
  }
  filtrarMtr(filtro): Observable<any> {
    let params = new HttpParams();
    if (filtro.caratula !== undefined) {
      params = params.set("filtro", "caratula");
      params = params.set("valor", filtro.caratula);
    }
    if (filtro.alfanumerico !== undefined) {
      params = params.set("filtro", "alfanumerico");
      params = params.set("valor", filtro.alfanumerico);
    }
    if (filtro.cartaPorte !== undefined) {
      params = params.set("filtro", "cartaPorte");
      params = params.set("valor", filtro.cartaPorte);
    }
    const options = { params: params };
    return this.http.get(this.globalService.apiHost + "mtr/filtro", options);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(error.error.data.username[0]);
    }
    if (error.status === 404) {
      return throwError(error.error.data);
    }
    if (error.status === 425) {
      return throwError(error.error.data);
    }
    if (error.status === 426) {
      return throwError(error.error.data.message);
    }
    if (error.status === 500) {
      return throwError(error.error.data.message);
    }
    return throwError(error.message);
  }
}
