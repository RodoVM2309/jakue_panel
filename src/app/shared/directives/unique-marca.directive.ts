import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NomencladoresService } from '../services/nomencladores.service';

export function UniqueMarcaCamionValidator(nomencladoresService: NomencladoresService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return nomencladoresService.getMarcaByDescription(c.value).pipe(
      map(marca => {
        return marca && marca.data.length > 0 ? { 'uniqueMarcaCamion': true } : null;
      })
    );
  }
}
@Directive({
  selector: '[UniqueMarca]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueMarcaValidatorDirective, multi: true }]
})
export class UniqueMarcaValidatorDirective implements AsyncValidator {

  constructor(private nomencladores: NomencladoresService) { }

  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.nomencladores.getMarcaByDescription(c.value).pipe(
      map(marca => {
        return marca && marca.length > 0 ? { '': true } : null;
      })
    );
  }

}
