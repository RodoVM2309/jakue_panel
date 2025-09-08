import { FormControl, Validators } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { TablaFecha} from '../models'

export module FunctionInitForm {
  export function init(
  variables,
  data
  )
  {
    variables.productos = data.productos;
    if (data.caratula) {
      if (
        data.caratula.id == -1 ||
        data.caratula.descripcion == "Sin nominar"
      ) {
        variables.addSolicitudForm.controls["caratula"].setValue("");
      } else {
        variables.addSolicitudForm.controls["caratula"].setValue(
          data.caratula.descripcion
        );
      }
    }
    if (data.filtros.idProductos) {
      variables.addSolicitudForm.controls["id_producto"].setValue(
        parseInt(data.filtros.idProductos[0])
      );
    }
    variables.filteredOptions = variables.addSolicitudForm.controls[
      "demandadoCuit"
    ].valueChanges.pipe(
      startWith(""),
      map((value:string) => _filter(variables,value))
    );
  }
  export function _filter(variables,value: string): string[] {
    const filterValue = value.toLowerCase();
    return variables.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
