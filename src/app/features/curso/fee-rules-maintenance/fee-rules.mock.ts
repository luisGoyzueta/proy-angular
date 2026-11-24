import { Airline, RouteOption, SelectOption } from './fee-rules.model';

export const WEB_OPTIONS: SelectOption[] = [
  { label: 'Portal B2C - Perú', value: 'B2C_PE' },
  { label: 'Portal B2C - Chile', value: 'B2C_CL' },
  { label: 'Portal B2C - Colombia', value: 'B2C_CO' },
  { label: 'Canal Corporativo B2B', value: 'B2B_CORP' },
  { label: 'Agencias Afiliadas', value: 'B2B_AGENCIES' },
];

export const DEVICE_OPTIONS: SelectOption[] = [
  { label: 'Todos los dispositivos', value: 'ALL' },
  { label: 'Desktop / Escritorio', value: 'DESKTOP' },
  { label: 'Mobile / Móvil', value: 'MOBILE' },
  { label: 'Tablet', value: 'TABLET' },
];

export const FLIGHT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Todos los vuelos', value: 'ALL' },
  { label: 'Solo ida (One Way)', value: 'OW' },
  { label: 'Ida y vuelta (Round Trip)', value: 'RT' },
  { label: 'Multidestino (Multi City)', value: 'MC' },
];

export const FARE_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Pública / Regular', value: 'PUBLIC' },
  { label: 'Privada / Negociada', value: 'PRIVATE' },
  { label: 'Corporativa', value: 'CORPORATE' },
  { label: 'Tarifa Operador', value: 'TOUR_OPERATOR' },
];

export const FEE_AMOUNT_TYPE_OPTIONS: SelectOption<'percentage' | 'fixed'>[] = [
  { label: 'Porcentaje (%)', value: 'percentage' },
  { label: 'Monto fijo (USD $)', value: 'fixed' },
];

export const LOCATION_TYPE_OPTIONS: SelectOption<'country' | 'city' | 'region'>[] = [
  { label: 'País', value: 'country' },
  { label: 'Ciudad', value: 'city' },
  { label: 'Región', value: 'region' },
];

export const SELECTION_TYPE_OPTIONS: SelectOption<'ALL' | 'INCLUDE' | 'EXCLUDE'>[] = [
  { label: 'Todas las ubicaciones', value: 'ALL' },
  { label: 'Incluir seleccionadas', value: 'INCLUDE' },
  { label: 'Excluir seleccionadas', value: 'EXCLUDE' },
];

export const AIRLINE_SELECTION_TYPE_OPTIONS: SelectOption<'LIST' | 'ALL'>[] = [
  { label: 'Lista personalizada (PickList)', value: 'LIST' },
  { label: 'Todas las aerolíneas', value: 'ALL' },
];

export const ROUTE_CATALOG: RouteOption[] = [
  { code: 'PE', name: 'Perú', type: 'country' },
  { code: 'CL', name: 'Chile', type: 'country' },
  { code: 'CO', name: 'Colombia', type: 'country' },
  { code: 'US', name: 'Estados Unidos', type: 'country' },
  { code: 'ES', name: 'España', type: 'country' },
  { code: 'LIM', name: 'Lima (LIM)', type: 'city' },
  { code: 'CUZ', name: 'Cusco (CUZ)', type: 'city' },
  { code: 'SCL', name: 'Santiago (SCL)', type: 'city' },
  { code: 'BOG', name: 'Bogotá (BOG)', type: 'city' },
  { code: 'MIA', name: 'Miami (MIA)', type: 'city' },
  { code: 'MAD', name: 'Madrid (MAD)', type: 'city' },
  { code: 'SA', name: 'Sudamérica', type: 'region' },
  { code: 'NA', name: 'Norteamérica', type: 'region' },
  { code: 'EU', name: 'Europa', type: 'region' },
];

export const ALL_AIRLINES_CATALOG: Airline[] = [
  { id: '1', code: 'LA', name: 'LATAM Airlines', country: 'Chile/Perú' },
  { id: '2', code: 'AV', name: 'Avianca', country: 'Colombia' },
  { id: '3', code: 'AA', name: 'American Airlines', country: 'Estados Unidos' },
  { id: '4', code: 'IB', name: 'Iberia', country: 'España' },
  { id: '5', code: 'UX', name: 'Air Europa', country: 'España' },
  { id: '6', code: 'CM', name: 'Copa Airlines', country: 'Panamá' },
  { id: '7', code: 'H2', name: 'SKY Airline', country: 'Chile/Perú' },
  { id: '8', code: 'JA', name: 'JetSMART', country: 'Chile/Perú' },
  { id: '9', code: 'DL', name: 'Delta Air Lines', country: 'Estados Unidos' },
  { id: '10', code: 'UA', name: 'United Airlines', country: 'Estados Unidos' },
  { id: '11', code: 'AF', name: 'Air France', country: 'Francia' },
  { id: '12', code: 'KL', name: 'KLM Royal Dutch', country: 'Países Bajos' },
];
