import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonasService } from '../services/personas.service';

export function UniqueEmailPersonaValidator(personaService: PersonasService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return personaService.getEmailPersona(c.value).pipe(
      map(persona => {
        return persona && persona.data.length > 0 ? { 'uniqueEmailPersona': true } : null;
      })
    );
  }
}

@Directive({
  selector: '[UniqueEmailPersona]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailPersonaDirective, multi: true }]
})
export class UniqueEmailPersonaDirective {

  constructor(private personaService: PersonasService) { }
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.personaService.getEmailPersona(c.value).pipe(
      map(persona => {
        return persona && persona.data.length > 0 ? { 'uniqueEmailPersona': true } : null;
      })
    );
  }

}
