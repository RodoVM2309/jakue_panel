import { AbstractControl, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { TablaFecha} from '../models'

export module FunctionConstructorForm {
  export function constructorForm(
  variables,
  data,
  fb
  )
  {

    variables.productos = data.productos;
    let actualYear = variables.minFecha.getFullYear() - 2000;
    variables.addSolicitudForm = fb.group({
      demandadoCuit: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      contraparte: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      destinatario: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      id_producto: ["", [Validators.required]],
      codigoCosecha1: [
        actualYear,
        [Validators.required, cosechaRangeValidator1(10, 98)],
      ],
      codigoCosecha2: [
        actualYear + 1,
        [Validators.required, cosechaRangeValidator2(11, 99)],
      ],
      contrato: ["", Validators.maxLength(70)],
      caratula: ["", Validators.maxLength(6)],
      zona: ["", Validators.maxLength(70)],
      id_gestiona: [null],
      administra: [false],
      nombredemandado: [variables.personEmpty],
      nombrecontraparte: [variables.personEmpty],
      nombredestinatario: [variables.personEmpty],
      autosolicitud: [""],
    });
    for (let index = 0; index < variables.cantDias; index++) {
      let strIndex = index.toString();
      let row = new TablaFecha();
      row.id = index;
      row.fecha = "";
      row.cantidad = 0;
      row.observ = "";
      variables.addSolicitudForm.addControl(
        "fecha_" + strIndex,
        new FormControl(row.fecha)
      );
      variables.addSolicitudForm.addControl(
        "cantidad_" + strIndex,
        new FormControl(row.cantidad, [Validators.min(0), Validators.max(1000)])
      );
      variables.addSolicitudForm.addControl(
        "observ_" + strIndex,
        new FormControl(row.observ, [Validators.maxLength(250)])
      );
      variables.tablaFechas.push(row);
    }
  }
  export function cosechaRangeValidator1(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (isNaN(control.value) || control.value < min || control.value > max) {
        return { cosecha1Error1: true };
      }
      return null;
    };
  }
  export function cosechaRangeValidator2(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (isNaN(control.value) || control.value < min || control.value > max) {
        return { cosecha2Error1: true };
      }
      return null;
    };
  }
}
