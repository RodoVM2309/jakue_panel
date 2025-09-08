import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl, FormControl, AsyncValidatorFn } from '@angular/forms';
import { PersonasService } from '../services/personas.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export function cuitValidator(cuitControl: FormControl, tipoPersonaControl: FormControl) {
  const cuitNumber = cuitControl.value;
  const tipoPersona = cuitControl.value;
  let firstDigito = '';
  let segundoDigito = '';
  if (cuitControl.value) {
    firstDigito = cuitControl.value.substring(0, 1);
    if (tipoPersona === 1 && firstDigito === '2') {
      return {
        validCuit: true
      };
    }
    if (tipoPersona === 2 && firstDigito === '3') {
      return {
        validCuit: true
      };
    }

  };
  return null;
}
export function cuitValidator1(tipoPersonaControl: AbstractControl, personaService: PersonasService ): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const cuitNumber = control.value;
    const tipoPersona = tipoPersonaControl.value;
    let firstDigito = '';

    if (control.value !== undefined && (isNaN(control.value))) {
      return { 'validCuit': true };
    }
    firstDigito = control.value.substring(0, 1);
    if (tipoPersona === 1 && firstDigito === '2') {
      return {
        validCuit: true
      };
    }
    if (tipoPersona === 2 && firstDigito === '3') {
      return {
        validCuit: true
      };
    }

    return null;
  };
}
export function existPersonaCuit (personaService: PersonasService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log('Entre aqui al existeCuit', c.value);
    return personaService.getPersonaByCuit(c.value).pipe(
      map(persona => {
        console.log('Por fin al existeCuit');
        return persona && persona.data ? { 'existeCuit': true } : null;
      })
    );
  }
};

export class CuitValidator {
  constructor(private personaService: PersonasService) { }



  static validCuit = (tipoPersonaControl: AbstractControl): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const cuitNumber = control.value;
      const tipoPersona = tipoPersonaControl.value;
      let firstDigito = '';

      if (control.value !== undefined && (isNaN(control.value))) {
        return { 'validCuit': true };
      }
      firstDigito = control.value.substring(0, 1);
      if (tipoPersona === 1 && firstDigito !== '2') {
        return {
          validCuit: true
        };
      }
      if (tipoPersona === 2 && firstDigito !== '3') {
        return {
          validCuit: true
        };
      }
      const multiplicador = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
      let suma_prod = 0;
      let valint;
      for (let i = 0; i < 11; i++) {
        valint = cuitNumber.substring(i, i + 1);
        suma_prod += multiplicador[i] * parseInt(valint);
      }
      if (suma_prod % 11 !== 0) {
        return {
          validCuit: true
        };
      }



      return null;
    };
  }
}
