export module FunctionInitFormGestion {

  export function initFormGestion(variables) {
    variables.gestionForm.controls["selectedAccion"].setValue("");
    variables.placeholderAccion = "  asignar/asignar todos/rechazar";
    variables.placeholderCabecera = "  3 > Seleccionar cabecera";
    variables.gestionForm.controls["cuposxModulos"].setValue("");
    variables.gestionForm.controls["selectedCabecera"].setValue("");
  }}
