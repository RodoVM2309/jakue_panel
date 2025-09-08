import { Directive } from "@angular/core";
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
  NG_ASYNC_VALIDATORS,
  AsyncValidatorFn
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "../services/user.service";

export function IsChoferCuitValidator(
  userService: UserService
): AsyncValidatorFn {
  return (
    c: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.esChoferCuit(c.value).pipe(
      map(dador => {
        return dador.data ? { isChoferCuit: true } : null;
      })
    );
  };
}

@Directive({
  selector: "[isChoferCuit]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: IsChoferCuitDirective,
      multi: true
    }
  ]
})
export class IsChoferCuitDirective {
  constructor(private userService: UserService) {}
  validate(
    c: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.esChoferCuit(c.value).pipe(
      map(dador => {
        return dador && dador.data ? { isChoferCuit: true } : null;
      })
    );
  }
}
