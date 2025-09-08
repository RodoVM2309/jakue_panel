import { PersonRazonSocial } from "@app/shared/models";
import { FunctionValidations } from "./validations";

export module FunctionCompleteCuit {
  export function completeCuit(
    cupoService,
    userService,
    variables,
    person: PersonRazonSocial,
    control: string
  ) {
    if (person) {
      variables.addSolicitudForm.controls[control].setValue(
        person.cuit_cuil
      );
      if (control === "destinatario") {
        FunctionValidations.comprobarDestinatarioCuit(
          cupoService,
          userService,
          variables,
          person.cuit_cuil);
        FunctionValidations.comprobarDemandado(
          variables,
          variables.addSolicitudForm.controls["nombredemandado"].value,
          person
        );
      }
      if (control === "demandadoCuit") {
        FunctionValidations.comprobarCorredorCuit(cupoService,userService,variables,person.cuit_cuil);
        FunctionValidations.comprobarDemandado(
          variables,
          person,
          variables.addSolicitudForm.controls["nombredestinatario"].value
        );
      }

      if (control === "contraparte") {
        FunctionValidations.comprobarDemandado(
          variables,
          variables.addSolicitudForm.controls["nombredemandado"].value,
          variables.addSolicitudForm.controls["nombredestinatario"].value
        );
      }
    }
  }
}
