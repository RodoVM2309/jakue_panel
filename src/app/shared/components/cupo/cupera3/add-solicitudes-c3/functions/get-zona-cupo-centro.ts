export module FunctionGetZonasCupoCentro {

  export function getAllZonas(cupoService, variables, centro) {
    variables.zonas = [{
      id: 0,
      descripcion: "Sin especificar",
    }];
    cupoService.getZonasC3(centro).subscribe((data) => {

      data.data.forEach((element) => {
        variables.zonas.push(element);
      });
      variables.addSolicitudForm.controls["zona"].setValue(variables.zonas[0].id);
    },
    (error) => {});

    variables.addSolicitudForm.controls["zona"].setValue(variables.zonas[0].id);
  }
}
