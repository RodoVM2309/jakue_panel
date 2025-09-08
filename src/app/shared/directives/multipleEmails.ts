import { FormControl, AbstractControl, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

export class emailMultiValidator {
  constructor() { }


  static validMultipleEmails = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      let emails = control.value.split(',');
      var regexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      var validityArr = emails.map(function (str) {
        if (control.value) {
          return regexPattern.test(str.trim());

        } else if (!control.value) {
          return true;
        }
      });
      var atLeastOneInvalid = false;
      validityArr.forEach(value => {
        if (value === false)
          atLeastOneInvalid = true;
      });
      if (!atLeastOneInvalid) {
        return null;
      } else {
        return {
          validMultipleEmails: true
        };
      }
    };
  }
}
