import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcopladosService } from '../services/acoplados.service';

export function UniquePatenteAcopladoValidator(acopladoService: AcopladosService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acopladoService.getPatenteAcoplado(c.value).pipe(
      map(acoplado => {
        return acoplado && acoplado.data ? { 'uniquePatenteAcoplado': true } : null;
      })
    );
  }
}

@Directive({
  selector: '[UniquePatenteAcoplado]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniquePatenteAcopladoDirective, multi: true }]
})
export class UniquePatenteAcopladoDirective {

  constructor(private acopladoService: AcopladosService) { }
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.acopladoService.getPatenteAcoplado(c.value).pipe(
      map(acoplado => {
        return acoplado && acoplado ? { 'uniquePatenteAcoplado': true } : null;
      })
    );
  }

}
