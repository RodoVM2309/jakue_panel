import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export function IsDadorCuitValidator(userService: UserService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.esDadorCuit(c.value).pipe(
      map(dador => {
        return dador.data  ? { 'isDadorCuit': true } : null;
      })
    );
  }
}

@Directive({
  selector: '[isDadorCuit]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: IsDadorCuitDirective, multi: true }]
})
export class IsDadorCuitDirective {

  constructor(private userService: UserService ) { }
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.esDadorCuit(c.value).pipe(
      map(dador => {
        return dador && dador.data  ? { 'isDadorCuit': true } : null;
      })
    );
  }
}
