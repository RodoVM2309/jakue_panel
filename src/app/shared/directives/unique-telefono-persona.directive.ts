import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonasService } from '../services/personas.service';

export function UniqueTelefonoPersonaValidator(personaService: PersonasService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return personaService.getTelefonoPersona(c.value).pipe(
      map(persona => {
        return persona && persona.data ? { 'uniqueTelefonoPersona': true } : null;
      })
    );
  }
}

@Directive({
  selector: '[UniqueTelefonoPersona]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueTelefonoPersonaDirective, multi: true }]
})
export class UniqueTelefonoPersonaDirective {

  constructor(private personaService: PersonasService) { }
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.personaService.getTelefonoPersona(c.value).pipe(
      map(persona => {
        return persona && persona.data ? { 'uniqueTelefonoPersona': true } : null;
      })
    );
  }

}
