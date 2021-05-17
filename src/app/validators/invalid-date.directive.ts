// Checks the control to ensure the date is not in the past or too far in the future

import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appInvalidDate]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateDirective, multi: true}]
})
export class DateDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const dateString = control.value;
    if (dateString) {
      const date = new Date(dateString);
      const now = new Date();
      if (date < now) {
        const errors: ValidationErrors = {
          past: true
         };
        return errors;
      }
      if (dateString.split('-')[0].length > 4) {
        const errors: ValidationErrors = {
          future: true
        };
        return errors;
      }
    }
    return null;
  }
}
