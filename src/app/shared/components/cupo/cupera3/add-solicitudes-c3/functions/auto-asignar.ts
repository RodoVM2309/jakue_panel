import { FunctionGetZonasCupoCentro } from ".";
import { FunctionValidations } from "./validations";
export module FunctionAutoAsignar {
  export function autoAsignar(cupoService, userService, variables, event) {
    if (event.checked) {
      variables.demandado = localStorage.getItem("nameUser");
      let person =
        variables.addSolicitudForm.controls["nombrecontraparte"].value;
      FunctionValidations.comprobarContraparteCuit(
        userService,
        variables,
        person.cuit_cuil
      );
      variables.zonas = [{
          id: 0,
          descripcion: "Sin especificar",
        }];
        let myCuit=localStorage.getItem("cuit_cuil");
        cupoService.getZonasC3(myCuit ).subscribe((data) => {

          data.data.forEach((element) => {
            variables.zonas.push(element);
          });
          variables.addSolicitudForm.controls["zona"].setValue(variables.zonas[0].id);
        },
        (error) => {});

        variables.addSolicitudForm.controls["zona"].setValue(variables.zonas[0].id);
      /* FunctionGetZonasCupoCentro.getAllZonas(
        cupoService,
        variables,
        localStorage.getItem("cuit_cuil")
      ); */
    }
    let corredor = variables.addSolicitudForm.controls["nombredemandado"].value;
    let destinatario =
      variables.addSolicitudForm.controls["nombredestinatario"].value;
    FunctionValidations.comprobarDemandado(variables, corredor, destinatario);
  }
}
