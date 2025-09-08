import { AbstractControl, ValidatorFn } from '@angular/forms';
export class CustomValidator {

    static yearValidator(number): any {
        if (number.pristine) {
            return null;
        }
        let today  = new Date();
        let theYear = today.getFullYear();
        if (number.value > theYear || number.value < 1940) {
            return { invalidNumber: true };
        }

    }

    static isNumberCheck(): ValidatorFn {
      return  (c: AbstractControl): {[key: string]: boolean} | null => {
        let number = /^[.\d]+$/.test(c.value) ? +c.value : NaN;
        if (number !== number) {
          return { 'value': true };
        }

        return null;
      };
    }

}

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): {[key: string]: any} => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true};
  }
}
