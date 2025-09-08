export module FunctionGetZonasCupoCentro {

  export function getAllZonas(cupoService, variables, centro) {
    variables.zonas = [{
      id: 0,
      descripcion: "Sin especificar",
    }];
    cupoService.getZonasC3(centro).subscribe((data) => {

      data.data.forEach((element) => {
        element.id= element.id;
        variables.zonasCupos.push(element);
      });
    },
    (error) => {});

  }
}
