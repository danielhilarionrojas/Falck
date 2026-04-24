import { FormArray, FormControl } from '@angular/forms';

import { minLengthArray } from './min-length-array.validator';

describe('minLengthArray', () => {
  it('returns error when array shorter than min', () => {
    const arr = new FormArray<FormControl<string>>([]);
    const result = minLengthArray(1)(arr);
    expect(result).toEqual({ minLengthArray: { required: 1, actual: 0 } });
  });

  it('returns null when array meets min', () => {
    const arr = new FormArray<FormControl<string>>([new FormControl('', { nonNullable: true })]);
    expect(minLengthArray(1)(arr)).toBeNull();
  });

  it('is no-op for non-FormArray controls', () => {
    const ctrl = new FormControl('x', { nonNullable: true });
    expect(minLengthArray(5)(ctrl)).toBeNull();
  });
});
