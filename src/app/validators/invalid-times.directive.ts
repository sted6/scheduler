// Checks the form group to ensure the start time is before the end time

import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appInvalidTimes]',
  providers: [{provide: NG_VALIDATORS, useExisting: InvalidTimesDirective, multi: true}]
})
export class InvalidTimesDirective implements Validator {

  validate(form: FormGroup): ValidationErrors | null {
    console.log(form);
    return this.timeRangeValidator(form);
  }

  timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime');
    const endTime = control.get('endTime');

    if (startTime != null && endTime != null) {
      if (endTime.value < startTime.value) {
        return { invalidTimes: true };
      }
    }

    return null;
  };
}
