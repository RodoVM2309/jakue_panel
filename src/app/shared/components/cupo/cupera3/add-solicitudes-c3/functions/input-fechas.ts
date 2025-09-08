import * as moment from "moment";
import { FunctionValidations } from "./validations";

export module FunctionInputFechas {
  export function chanceFecha(
    homeService,
    variables,
    fecha,
     i
  ) {
    if (fecha.value) {
      if (!variables.selectedFecha && i == 0) {
        generarFechas(homeService,variables,fecha);
      } else {
        for (let index = 0; index < variables.cantDias; index++) {
          let fech =
            homeService.formatoFecha(fecha.value, "amd", "-") +
            " 12:00:00";
          let fech1 =
            homeService.formatoFecha(
              variables.addSolicitudForm.controls["fecha_" + index].value,
              "amd",
              "-"
            ) + " 12:00:00";
          let exis = fech1 == fech ? true : false;
          if (
            variables.addSolicitudForm.controls["fecha_" + index].value !==
            ""
          ) {
            if (index !== i && exis) {
              if (
                variables.addSolicitudForm.controls["cantidad_" + index]
                  .value > 0
              ) {
                variables.invalidFechaCant = false;
              }
              variables.addSolicitudForm.controls["fecha_" + i].setValue(
                ""
              );
              return false;
            }
          }
        }
      }
      FunctionValidations.comprobarForm(variables);
    } else {
      if (variables.addSolicitudForm.controls["cantidad_" + i].value > 0) {
        variables.invalidFechaCant = false;
      }
    }
    variables.selectedFecha = false;
    for (let index = 1; index < variables.cantDias; index++) {
      if (
        variables.addSolicitudForm.controls["fecha_" + index].value !== ""
      ) {
        variables.selectedFecha = true;
      }
    }
  }

  export function generarFechas(homeService,variables, fecha) {
    let fechaInicial: moment.Moment = moment(fecha.value);
    for (let index = 1; index < variables.cantDias; index++) {
      let tempMoment1: moment.Moment = fechaInicial.add(1, "d");
      let fechaString =
        homeService.formatoFecha(tempMoment1, "amd", "-") + " 12:00:00";
      variables.addSolicitudForm.controls["fecha_" + index].setValue(
        new Date(fechaString)
      );
    }
  }
}
