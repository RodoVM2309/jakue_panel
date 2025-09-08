import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[rucValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => rucValidatorDirective),
      multi: true
    }
  ]
})
export class rucValidatorDirective {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    //const rucPattern = /^[1-9]{1}[0-9]{6}-[0-9K]{1}$/;
    const rucPattern = /^[0-9-]{5,11}$/;
    const value = control.value;
    let valid = false;

    if (value) {
      valid = rucPattern.test(value);
    }
    if (!value || valid) {
      return null;
    } else {
      return {
        rucValidator: true
      };
    }
  }

}
