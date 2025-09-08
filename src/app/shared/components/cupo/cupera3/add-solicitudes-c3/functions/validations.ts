import { FunctionGetZonasCupoCentro } from "../../shared/functions";

export module FunctionValidations {
  export function comprobarForm(variables) {
    variables.validForm = true;
    const demandadoCuit =
      variables.addSolicitudForm.controls["demandadoCuit"].value;
    const destinatario =
      variables.addSolicitudForm.controls["destinatario"].value;
    const nombredemandado =
      variables.addSolicitudForm.controls["nombredemandado"].value;
    const nombredestinatario =
      variables.addSolicitudForm.controls["nombredestinatario"].value;
    const nombrecontraparte =
      variables.addSolicitudForm.controls["nombrecontraparte"].value;
    const isPropia = variables.addSolicitudForm.controls["autosolicitud"].value;
    if (isPropia) {
      //solicitud propia
      if (
        nombredemandado === variables.personEmpty &&
        nombrecontraparte === variables.personEmpty
      ) {
        variables.validForm = false;
      } else {
        if (variables.incorrect_corredor_cuit) variables.validForm = false;
      }
    } else {
      // No es propia
      if (
        nombredemandado === variables.personEmpty &&
        nombredestinatario === variables.personEmpty
      ) {
        variables.validForm = false;
      } else {
        if (
          !variables.incorrect_destinatario_cuit &&
          (demandadoCuit.length > 0 || destinatario.length > 0)
        ) {
          variables.validForm = true;
          variables.addSolicitudForm.controls["demandadoCuit"].markAsPristine();
          variables.addSolicitudForm.controls["demandadoCuit"].setValue(
            demandadoCuit
          );
          variables.addSolicitudForm.controls["destinatario"].markAsPristine();
          variables.addSolicitudForm.controls["destinatario"].setValue(
            destinatario
          );
          variables.noEsCorredorDemandando = false;
        }
        if (variables.incorrect_destinatario_cuit && destinatario.length > 0) {
          variables.addSolicitudForm.controls["destinatario"].setErrors({
            invalidForm: true,
          });
          variables.addSolicitudForm.controls["destinatario"].markAsDirty();
          variables.validForm = false;
        }
      }
    }
    let tempCant = 0;
    variables.invalidFechaCant = true;
    for (let index = 0; index < variables.cantDias; index++) {
      tempCant =
        tempCant +
        variables.addSolicitudForm.controls["cantidad_" + index].value;
      if (
        variables.addSolicitudForm.controls["cantidad_" + index].value > 0 &&
        variables.addSolicitudForm.controls["fecha_" + index].value == ""
      ) {
        if (variables.invalidFechaCant) {
          variables.invalidFechaCant = false;
        }
      }
    }
    variables.cantidadCupos = tempCant;
    return variables.validForm;
  }

  export function comprobarDemandado(variables, corredor, destinatario) {
    if (variables.addSolicitudForm.controls["autosolicitud"].value) {
      variables.demandado = localStorage.getItem("nameUser");
    } else {
      if (corredor.razon_social !== "") {
        variables.demandado = corredor.razon_social;
      } else if (destinatario.razon_social !== "") {
        variables.demandado = destinatario.razon_social;
      } else {
        variables.demandado = " (Sin definir)";
      }
    }
    //comprobarForm(variables);
  }
  export function comprobarCorredorCuit(
    cupoService,
    userService,
    variables,
    valor: string
  ) {
    variables.isInicio = false;
    //variables.incorrect_corredor_cuit = true;
    variables.noEsCorredorDemandando = false;
    variables.mismo_cuit = false;
    if (valor.length == 11) {
      if (valor == variables.micuit) {
        variables.mismo_cuit = true;
        variables.addSolicitudForm.controls["demandadoCuit"].setErrors({
          invalidForm: true,
        });
        variables.addSolicitudForm.controls["demandadoCuit"].markAsDirty();
      } else {
        userService.esCorredor(valor).subscribe(
          (res) => {
            variables.incorrect_corredor_cuit = !res.data.esCorredor;
            if (!res.data.esCorredor) {
              variables.noEsCorredorDemandando = true;
              variables.invalidZona = true;
              variables.zonas = [];
              variables.addSolicitudForm.controls["demandadoCuit"].setErrors({
                invalidCorredor: true,
              });

              variables.addSolicitudForm.controls[
                "demandadoCuit"
              ].markAsDirty();
              variables.addSolicitudForm.controls[
                "zona"
              ].setValue('');
              //FunctionValidations.comprobarForm(variables);
            } else {
              variables.invalidZona = false;
              if (!variables.addSolicitudForm.controls['autosolicitud'].value){
                FunctionGetZonasCupoCentro.getAllZonas(
                  cupoService,
                  variables,
                  valor
                );
              }
            }
          },
          (error) => {}
        );
      }
    }
    /*  else if (valor.length == 0) {
      comprobarForm(variables);
    } */
  }
  export function comprobarContraparteCuit(
    userService,
    variables,
    valor: string
  ) {
    variables.isInicio = false;
    variables.esContraparteCorredor = false;
    variables.esContraparteDador = false;
    variables.soyContraparte = false;
    if (valor.length === 11) {
      if (valor == variables.micuit) {
        variables.soyContraparte = true;
      } else {
        userService.esCorredor(valor).subscribe(
          (res) => {
            variables.esContraparteCorredor = res.data.esCorredor;
            if (variables.esContraparteCorredor) {
              variables.esContraparteDador = true;
              //comprobarForm(variables);
            } else {
              userService.esDadorCuit(valor).subscribe(
                (res) => {
                  variables.esContraparteDador = res.data;
                  //comprobarForm(variables);
                },
                (error) => {}
              );
            }
          },
          (error) => {}
        );
      }
    }
    /* else if (valor.length == 0) {
      comprobarForm(variables);
    } */
  }

  export function comprobarDestinatarioCuit(
    cupoService,
    userService,
    variables,
    valor: string
  ) {
    variables.isInicio = false;
    if (valor.length == 11) {
      userService.esDadorCuit(valor).subscribe(
        (res) => {
          variables.incorrect_destinatario_cuit = !res.data;
          if (!res.data) {
            variables.addSolicitudForm.controls["destinatario"].setErrors({
              invalidForm: true,
            });
            variables.addSolicitudForm.controls["destinatario"].markAsDirty();
            if (
              variables.addSolicitudForm.controls["demandadoCuit"].value ===
                "" ||
              variables.noEsCorredorDemandando
            ) {
              variables.invalidZona = true;
              variables.zonas=[];
            }
          } else {
            if (
              variables.addSolicitudForm.controls["demandadoCuit"].value === ""
            ) {
              variables.invalidZona = false;
              if (!variables.addSolicitudForm.controls['autosolicitud'].value){
                FunctionGetZonasCupoCentro.getAllZonas(
                  cupoService,
                  variables,
                  valor
                );
              }
            }
          }
        },
        (error) => {}
      );
    }
    //variables.incorrect_destinatario_cuit = valor.length == 0 ? false : true;
  }

  export function validateCodigoCosecha(value, tipo, variables) {
    if (tipo === "desde") {
      variables.addSolicitudForm.controls["codigoCosecha2"].setValue(
        parseInt(value) + 1
      );
    } else {
      variables.addSolicitudForm.controls["codigoCosecha1"].setValue(
        parseInt(value) - 1
      );
    }
  }

  export function noEsCorredor(variables): boolean {
    return (!variables.mismo_cuit && variables.incorrect_corredor_cuit) ||
      variables.noEsCorredorDemandando
      ? true
      : false;
  }

  export function enableZona(variables) {

    if (
      variables.addSolicitudForm.controls["nombredestinatario"].value !==
        variables.personEmpty ||
      variables.addSolicitudForm.controls["destinatario"].value != "" ||
      variables.addSolicitudForm.controls["nombredemandado"].value !=
        variables.personEmpty ||
      variables.addSolicitudForm.controls["demandadoCuit"].value != ""
    ) {
      if (
        variables.incorrect_destinatario_cuit ||
        variables.noEsCorredorDemandando
      ) {
        variables.invalidZona = true;
        variables.zonas = [];
        variables.addSolicitudForm.controls[
          "zona"
        ].setValue('');

      } else {
        variables.invalidZona = false;
      }
    } else {
      variables.invalidZona = true;
      variables.zonas = [];
      variables.addSolicitudForm.controls[
        "zona"
      ].setValue('');
    }
  }
}
