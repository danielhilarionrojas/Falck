import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minLengthArray =
  (min: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;
    return control.length >= min ? null : { minLengthArray: { required: min, actual: control.length } };
  };
