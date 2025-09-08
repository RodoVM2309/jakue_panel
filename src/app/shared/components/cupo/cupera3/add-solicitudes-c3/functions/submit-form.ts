import { Distribucion } from "../models";

export module FunctionSubmitForm {
  export function submit(
    cupoService,
    alertService,
    atencionService,
    errorService,
    variables,
    loader,
    f,
    dialogRef,
    ) {
    let solicitud = {};
    if (
      !variables.addSolicitudForm.invalid &&
      variables.validForm &&
      variables.cantidadCupos > 0 &&
      variables.selectedFecha &&
      variables.invalidFechaCant
    ) {
      loader.open();
      let dist = [];

      for (let index = 0; index < variables.tablaFechas.length; index++) {
        if (
          variables.addSolicitudForm.controls["fecha_" + index].value !== "" &&
          variables.addSolicitudForm.controls["cantidad_" + index].value > 0
        ) {
          let tempDist = new Distribucion();
          tempDist.fecha =
            variables.addSolicitudForm.controls["fecha_" + index].value;
          tempDist.cantidad =
            variables.addSolicitudForm.controls["cantidad_" + index].value;
          tempDist.observaciones =
            variables.addSolicitudForm.controls["observ_" + index].value;
          dist.push(tempDist);
        }
      }
      if (f.autosolicitud.value) {
        solicitud = {
          demandante:
            f.demandadoCuit.value === ""
              ? f.contraparte.value
              : f.demandadoCuit.value,
          contraparte:
            f.demandadoCuit.value === ""
              ? null
              : f.contraparte.value !== ""
              ? f.contraparte.value
              : null,
          destinatario:
            f.destinatario.value === "" ? null : f.destinatario.value,
          id_producto: f.id_producto.value,
          contrato: f.contrato.value.toString(),
          //zona: f.zona.value.toString(),
          codigoCosecha:
            f.codigoCosecha1.value.toString() +
            f.codigoCosecha2.value.toString(),
          id_gestiona: f.id_gestiona.value,
          id_zona_solicitud: f.zona.value == 0 ? null : f.zona.value,
          distribucion: dist,
          canal: "WEB",
          caratula: f.caratula.value,
        };
        //console.log('Datos a enviar',solicitud);
        cupoService.postCupoSolicitadosPropiaDist(solicitud).subscribe(
          (data) => {
            if (loader !== null) {
              loader.close();
            }

            alertService
              .confirm({
                message: "¡Solicitud de cupos agregada correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  dialogRef.close(1);
                }
              });
          },
          (err) => {
            loader.close();
            if (err.status === 422) {
              errorService.confirm({ message: err.message }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            } else {
              errorService.confirm({ message: err }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            }
          }
        );
      } else {
        solicitud = {
          corredor:
            f.demandadoCuit.value == ""
              ? null
              : f.demandadoCuit.value,
          contraparte:
            f.contraparte.value == "" ? null : f.contraparte.value,
          destinatario:
            f.destinatario.value == "" ? null : f.destinatario.value,
          id_producto: f.id_producto.value,
          contrato: f.contrato.value.toString(),
         // zona: f.zona.value.toString(),
          codigoCosecha:
            f.codigoCosecha1.value.toString() +
            f.codigoCosecha2.value.toString(),
          id_gestiona: f.id_gestiona.value,
          id_zona_solicitud: f.zona.value == 0 ? null : f.zona.value,
          distribucion: dist,
          canal: "WEB",
          caratula: f.caratula.value,
        };
        //console.log('Datos a enviar',solicitud);
        cupoService.postCupoSolicitadosDemandanteV3(solicitud).subscribe(
          (data) => {
            if (loader !== null) {
              loader.close();
            }

            alertService
              .confirm({
                message: "¡Solicitud de cupos agregada correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  dialogRef.close(1);
                }
              });
          },
          (err) => {
            loader.close();
            if (err.status === 422) {
              errorService.confirm({ message: err.message }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            } else {
              errorService.confirm({ message: err }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            }
          }
        );
      }
    }
  }
}
