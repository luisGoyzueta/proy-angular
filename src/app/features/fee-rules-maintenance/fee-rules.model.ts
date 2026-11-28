import { FormControl, FormGroup } from '@angular/forms';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
}

export interface Airline {
  id: string;
  code: string;
  name: string;
  country: string;
}

export interface RouteOption {
  code: string;
  name: string;
  type: 'country' | 'city' | 'region';
}

/**
 * Esquema de controles fuertemente tipados para el formulario de reglas de Fee
 */
export interface FeeRuleFormControls {
  // 1. Configuración General
  ruleName: FormControl<string>;
  web: FormControl<string>;
  device: FormControl<string>;
  pcc: FormControl<string>;

  // 2. Reglas de Tarifa y Fee
  flightType: FormControl<string>;
  fareType: FormControl<string>;
  feeAmountType: FormControl<'percentage' | 'fixed'>;
  feeValue: FormControl<number | null>;

  // 3. Rango de Precio Venta
  priceFrom: FormControl<number | null>;
  priceTo: FormControl<number | null>;

  // 4. Rutas (Origen)
  originLocationType: FormControl<'country' | 'city' | 'region'>;
  originSelectionType: FormControl<'ALL' | 'INCLUDE' | 'EXCLUDE'>;
  originSelection: FormControl<string[]>;

  // 4. Rutas (Destino)
  destLocationType: FormControl<'country' | 'city' | 'region'>;
  destSelectionType: FormControl<'ALL' | 'INCLUDE' | 'EXCLUDE'>;
  destSelection: FormControl<string[]>;

  // 5. Aerolíneas
  airlineSelectionType: FormControl<'LIST' | 'ALL'>;

  // 6. Estado
  active: FormControl<boolean>;
}

export type FeeRuleFormGroup = FormGroup<FeeRuleFormControls>;

/**
 * Contrato de datos que emite el formulario al guardarse
 */
export interface FeeRulePayload {
  ruleName: string;
  web: string;
  device: string;
  pcc: string;
  flightType: string;
  fareType: string;
  feeAmountType: 'percentage' | 'fixed';
  feeValue: number | null;
  priceFrom: number | null;
  priceTo: number | null;
  originLocationType: 'country' | 'city' | 'region';
  originSelectionType: 'ALL' | 'INCLUDE' | 'EXCLUDE';
  originSelection: string[];
  destLocationType: 'country' | 'city' | 'region';
  destSelectionType: 'ALL' | 'INCLUDE' | 'EXCLUDE';
  destSelection: string[];
  airlineSelectionType: 'LIST' | 'ALL';
  active: boolean;
  selectedAirlines: string[] | 'ALL';
}
