import { PersonRazonSocial } from "@app/shared/models";
import { FunctionGetZonasCupoCentro } from "./get-zona-cupo-centro";
import { FunctionValidations } from "./validations";

export module FunctionFromEvent {
  export function FromEventNombreDestinatario(
    text,
    variables,
    personasService,
    cupoService
  ) {
    if (text.length == 0) {
      variables.addSolicitudForm.controls["nombredestinatario"].setValue(
        variables.personEmpty
      );
      variables.addSolicitudForm.controls["destinatario"].setValue("");
      variables.filteredOptionsDestinatarios = [];
      FunctionValidations.comprobarDemandado(
        variables,
        variables.personEmpty,
        variables.addSolicitudForm.controls["nombredemandado"].value
      );
      FunctionValidations.enableZona(variables);
    } else {
      variables.isLoading = true;
      personasService
        .getPersonaByRazonSocial(
          { razon_social: text.toLowerCase() },
          { nombre: "centro" }
        )
        .subscribe(
          (resp) => {
            variables.filteredOptionsDestinatarios = resp.data;
            variables.isLoading = false;
          },
          (err) => {
            variables.addSolicitudForm.controls["nombredestinatario"].setValue(
              variables.personEmpty
            );
            variables.addSolicitudForm.controls["destinatario"].setValue("");
          }
        );
    }
  }

  export function FromEventDestinatario(
    text,
    variables,
    personasService,
    cupoService
  ) {
    let cuit = text.toLowerCase();
    personasService.getPersonaNombreByCuit(cuit).subscribe(
      (resp) => {
        let personTitular = new PersonRazonSocial(resp.data, cuit);
        variables.addSolicitudForm.controls["nombredestinatario"].setValue(
          personTitular
        );
        let corredor1 =
          variables.addSolicitudForm.controls["nombredemandado"].value;
        let corredor =
          corredor1.value == "" ? variables.personEmpty : corredor1;
        FunctionValidations.comprobarDemandado(
          variables,
          corredor,
          personTitular
        );
        FunctionValidations.enableZona(variables);
        //FunctionValidations.comprobarForm(variables);
      },
      (err) => {
        FunctionValidations.comprobarDemandado(
          variables,
          variables.addSolicitudForm.controls["nombredemandado"].value,
          variables.personEmpty
        );
      }
    );
  }

  export function FromEventNombreDemandado(
    text,
    variables,
    personasService,
    cupoService
  ) {
    if (text.length == 0) {
      variables.addSolicitudForm.controls["nombredemandado"].setValue(
        variables.personEmpty
      );
      variables.addSolicitudForm.controls["demandadoCuit"].setValue("");
      variables.filteredOptionsCorredores = [];
      variables.noEsCorredorDemandando = false;
      variables.incorrect_corredor_cuit= false;
      FunctionValidations.comprobarDemandado(
        variables,
        variables.personEmpty,
        variables.addSolicitudForm.controls["nombredestinatario"].value
      );
      if (
        variables.addSolicitudForm.controls["destinatario"].value !== "" &&
        !variables.incorrect_destinatario_cuit
      ) {
        variables.invalidZona = false;
        if (!variables.addSolicitudForm.controls['autosolicitud'].value){
          FunctionGetZonasCupoCentro.getAllZonas(
            cupoService,
            variables,
            variables.addSolicitudForm.controls["destinatario"].value
          );
        }
      } else {
        FunctionValidations.enableZona(variables);
      }
    } else {
      variables.isLoading = true;
      personasService
        .getPersonaByRazonSocial(
          { razon_social: text.toLowerCase() },
          { nombre: "centro" }
        )
        .subscribe(
          (resp) => {
            variables.filteredOptionsCorredores = resp.data;
            variables.isLoading = false;
          },
          (err) => {
            let person = new PersonRazonSocial("", "");
            variables.addSolicitudForm.controls["nombredemandado"].setValue(
              person
            );
            variables.addSolicitudForm.controls["demandadoCuit"].setValue("");
            FunctionValidations.enableZona(variables);
          }
        );
    }
  }

  export function FromEventDemandadoCuit(
    text,
    variables,
    personasService,
    cupoService
  ) {
    let cuit = text.toLowerCase();
    personasService.getPersonaNombreByCuit(cuit).subscribe(
      (resp) => {
        let person = new PersonRazonSocial(resp.data, cuit);
        variables.addSolicitudForm.controls["nombredemandado"].setValue(person);
        let destinatario =
          variables.addSolicitudForm.controls["destinatario"].value;
        FunctionValidations.comprobarDemandado(variables, person, destinatario);
      },
      (err) => {
        let person = new PersonRazonSocial("", "");
        variables.addSolicitudForm.controls["nombredemandado"].setValue(person);
        let destinatario =
          variables.addSolicitudForm.controls["destinatario"].value;
        FunctionValidations.comprobarDemandado(variables, person, destinatario);
        FunctionValidations.enableZona(variables);
      }
    );
  }

  export function FromEventNombreContraparte(
    text,
    variables,
    personasService,
    cupoService
  ) {
    if (text.length == 0) {
      variables.addSolicitudForm.controls["nombrecontraparte"].setValue(
        variables.personEmpty
      );
      variables.addSolicitudForm.controls["contraparte"].setValue("");
      variables.filteredOptionsContrapartes = [];
      FunctionValidations.comprobarDemandado(
        variables,
        variables.addSolicitudForm.controls["nombredemandado"].value,
        variables.addSolicitudForm.controls["nombredestinatario"].value
      );
    } else {
      variables.isLoading = true;
      personasService
        .getPersonaByRazonSocial(
          { razon_social: text.toLowerCase() },
          { nombre: "centro" }
        )
        .subscribe(
          (resp) => {
            variables.filteredOptionsContrapartes = resp.data;
            variables.isLoading = false;
          },
          (err) => {
            let person = new PersonRazonSocial("", "");
            variables.addSolicitudForm.controls["nombrecontraparte"].setValue(
              person
            );
            variables.addSolicitudForm.controls["contraparte"].setValue("");
          }
        );
    }
  }

  export function FromEventContraparte(
    text,
    variables,
    personasService,
    cupoService
  ) {
    let cuit = text.toLowerCase();
    personasService.getPersonaNombreByCuit(cuit).subscribe(
      (resp) => {
        let person = new PersonRazonSocial(resp.data, cuit);
        variables.addSolicitudForm.controls["nombrecontraparte"].setValue(
          person
        );
      },
      (err) => {
        let person = new PersonRazonSocial("", "");
        variables.addSolicitudForm.controls["nombrecontraparte"].setValue(
          person
        );
      }
    );
  }
}
