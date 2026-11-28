import { FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { priceRangeValidator } from './price-range.validator';

describe('priceRangeValidator (Función de Validación Aislada)', () => {
  const createFormGroup = (from: number | null, to: number | null) =>
    new FormGroup({
      priceFrom: new FormControl<number | null>(from),
      priceTo: new FormControl<number | null>(to),
    });

  it('debe ser válido cuando ambos valores son null o vacíos', () => {
    const form = createFormGroup(null, null);
    expect(priceRangeValidator(form)).toBeNull();
  });

  it('debe ser válido cuando priceTo es mayor que priceFrom', () => {
    const form = createFormGroup(100, 200);
    expect(priceRangeValidator(form)).toBeNull();
  });

  it('debe ser válido cuando priceTo es igual a priceFrom', () => {
    const form = createFormGroup(150, 150);
    expect(priceRangeValidator(form)).toBeNull();
  });

  it('debe ser válido cuando solo priceFrom tiene valor', () => {
    const form = createFormGroup(100, null);
    expect(priceRangeValidator(form)).toBeNull();
  });

  it('debe ser válido cuando solo priceTo tiene valor', () => {
    const form = createFormGroup(null, 250);
    expect(priceRangeValidator(form)).toBeNull();
  });

  it('debe retornar { priceRangeInvalid: true } cuando priceTo es menor que priceFrom', () => {
    const form = createFormGroup(300, 100);
    expect(priceRangeValidator(form)).toEqual({ priceRangeInvalid: true });
  });
});
