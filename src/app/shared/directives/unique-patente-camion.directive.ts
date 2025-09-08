import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CamionService } from '../services/camion.service';

export function UniquePatenteCamionValidator(camionService: CamionService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return camionService.getPatenteCamion(c.value).pipe(
      map(camion => {
        return camion && camion.data ? { 'uniquePatenteCamion': true } : null;
      })
    );
  }
}

  @Directive({
    selector: '[uniquePatenteCamion]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniquePatenteCamionDirective, multi: true }]
  })

  export class UniquePatenteCamionDirective {

    constructor(private camionService: CamionService) { }
    validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
      return this.camionService.getPatenteCamion(c.value).pipe(
        map(camion => {
          return camion && camion.data ? { 'uniquePatenteCamion': true } : null;
        })
      );
    }

  }
