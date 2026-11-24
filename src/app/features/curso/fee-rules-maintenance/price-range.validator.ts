import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador cruzado para rango de precio: 'Hasta' >= 'Desde'.
 * Retorna `{ priceRangeInvalid: true }` si ambos valores existen y priceTo < priceFrom.
 */
export const priceRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const priceFrom = control.get('priceFrom')?.value;
  const priceTo = control.get('priceTo')?.value;

  if (
    priceFrom !== null &&
    priceFrom !== undefined &&
    priceTo !== null &&
    priceTo !== undefined &&
    priceTo < priceFrom
  ) {
    return { priceRangeInvalid: true };
  }
  return null;
};
