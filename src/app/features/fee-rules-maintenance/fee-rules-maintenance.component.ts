import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG 21 Standalone Components & Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';

// Modelos, Catálogos y Validadores modulares
import {
  Airline,
  SelectOption,
  FeeRuleFormControls,
  FeeRuleFormGroup,
  FeeRulePayload,
} from './fee-rules.model';
import {
  WEB_OPTIONS,
  DEVICE_OPTIONS,
  FLIGHT_TYPE_OPTIONS,
  FARE_TYPE_OPTIONS,
  FEE_AMOUNT_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  SELECTION_TYPE_OPTIONS,
  AIRLINE_SELECTION_TYPE_OPTIONS,
  ROUTE_CATALOG,
  ALL_AIRLINES_CATALOG,
} from './fee-rules.mock';
import { priceRangeValidator } from './price-range.validator';

// Re-exportar para retrocompatibilidad total con archivos existentes
export * from './fee-rules.model';
export * from './fee-rules.mock';
export * from './price-range.validator';

@Component({
  selector: 'app-fee-rules-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    SelectButtonModule,
    ToggleSwitchModule,
    MultiSelectModule,
    PickListModule,
    ButtonModule,
    MessageModule,
    CardModule,
    TooltipModule,
    SharedModule,
  ],
  templateUrl: './fee-rules-maintenance.component.html',
  styleUrl: './fee-rules-maintenance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeeRulesMaintenanceComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Estados reactivos con Signals
  readonly submitted = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly formErrorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Opciones de catálogo inmutables
  readonly webOptions = WEB_OPTIONS;
  readonly deviceOptions = DEVICE_OPTIONS;
  readonly flightTypeOptions = FLIGHT_TYPE_OPTIONS;
  readonly fareTypeOptions = FARE_TYPE_OPTIONS;
  readonly feeAmountTypeOptions = FEE_AMOUNT_TYPE_OPTIONS;
  readonly locationTypeOptions = LOCATION_TYPE_OPTIONS;
  readonly selectionTypeOptions = SELECTION_TYPE_OPTIONS;
  readonly airlineSelectionTypeOptions = AIRLINE_SELECTION_TYPE_OPTIONS;
  readonly routeCatalog = ROUTE_CATALOG;
  readonly allAirlinesCatalog = ALL_AIRLINES_CATALOG;

  // Estado del PickList
  readonly sourceAirlines = signal<Airline[]>([]);
  readonly targetAirlines = signal<Airline[]>([]);

  // Formulario reactivo fuertemente tipado
  readonly feeRuleForm: FeeRuleFormGroup = this.fb.group<FeeRuleFormControls>(
    {
      // 1. Configuración General
      ruleName: this.fb.control('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      web: this.fb.control('', [Validators.required]),
      device: this.fb.control('ALL', [Validators.required]),
      pcc: this.fb.control('', [Validators.required, Validators.pattern(/^[A-Z0-9]{3,5}$/)]),

      // 2. Reglas de Tarifa y Fee
      flightType: this.fb.control('ALL', [Validators.required]),
      fareType: this.fb.control('PUBLIC', [Validators.required]),
      feeAmountType: this.fb.control<'percentage' | 'fixed'>('percentage', [Validators.required]),
      feeValue: this.fb.control<number | null>(10, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100),
      ]),

      // 3. Rango de Precio Venta
      priceFrom: this.fb.control<number | null>(null, [Validators.min(0)]),
      priceTo: this.fb.control<number | null>(null, [Validators.min(0)]),

      // 4. Rutas (Origen)
      originLocationType: this.fb.control<'country' | 'city' | 'region'>('country', [
        Validators.required,
      ]),
      originSelectionType: this.fb.control<'ALL' | 'INCLUDE' | 'EXCLUDE'>('INCLUDE', [
        Validators.required,
      ]),
      originSelection: this.fb.control<string[]>([]),

      // 4. Rutas (Destino)
      destLocationType: this.fb.control<'country' | 'city' | 'region'>('country', [
        Validators.required,
      ]),
      destSelectionType: this.fb.control<'ALL' | 'INCLUDE' | 'EXCLUDE'>('INCLUDE', [
        Validators.required,
      ]),
      destSelection: this.fb.control<string[]>([]),

      // 5. Aerolíneas
      airlineSelectionType: this.fb.control<'LIST' | 'ALL'>('LIST', [Validators.required]),

      // 6. Estado
      active: this.fb.control<boolean>(true, [Validators.required]),
    },
    {
      validators: [priceRangeValidator],
    },
  );

  // Computed signals derivadas del estado del formulario
  readonly selectedFeeAmountType = signal<'percentage' | 'fixed'>('percentage');
  readonly isOriginSelectionDisabled = signal<boolean>(false);
  readonly isDestSelectionDisabled = signal<boolean>(false);
  readonly isAirlinesPickListDisabled = signal<boolean>(false);

  // Contador accesible de aerolíneas
  readonly targetAirlinesCount = computed(() => this.targetAirlines().length);

  // Valores computados para validación y formato de montos
  readonly feePrefix = computed(() =>
    this.selectedFeeAmountType() === 'fixed' ? '$ ' : undefined,
  );
  readonly feeSuffix = computed(() =>
    this.selectedFeeAmountType() === 'percentage' ? ' %' : undefined,
  );
  readonly feeMaxLimit = computed(() =>
    this.selectedFeeAmountType() === 'percentage' ? 100 : 999999,
  );

  ngOnInit(): void {
    this.initializeAirlines();
    this.setupReactivity();
  }

  private initializeAirlines(): void {
    // Inicializar picklist con aerolíneas por defecto
    this.sourceAirlines.set([...this.allAirlinesCatalog.slice(2)]);
    this.targetAirlines.set([...this.allAirlinesCatalog.slice(0, 2)]); // LA y AV pre-seleccionadas
  }

  private setupReactivity(): void {
    // 1. Escuchar cambio en Tipo Monto de Fee con limpieza automática
    this.feeRuleForm.controls.feeAmountType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        this.selectedFeeAmountType.set(type);
        const feeValControl = this.feeRuleForm.controls.feeValue;
        if (type === 'percentage') {
          feeValControl.setValidators([
            Validators.required,
            Validators.min(0.01),
            Validators.max(100),
          ]);
          if (feeValControl.value !== null && feeValControl.value > 100) {
            feeValControl.setValue(10);
          }
        } else {
          feeValControl.setValidators([
            Validators.required,
            Validators.min(0.01),
            Validators.max(999999),
          ]);
        }
        feeValControl.updateValueAndValidity();
      });

    // 2. Escuchar cambio en Origen: Tipo de Selección ('ALL' vs 'INCLUDE'/'EXCLUDE')
    this.feeRuleForm.controls.originSelectionType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        const isAll = type === 'ALL';
        this.isOriginSelectionDisabled.set(isAll);
        const ctrl = this.feeRuleForm.controls.originSelection;
        if (isAll) {
          ctrl.disable({ emitEvent: false });
          ctrl.setValue([]);
          ctrl.clearValidators();
        } else {
          ctrl.enable({ emitEvent: false });
          ctrl.setValidators([Validators.required]);
        }
        ctrl.updateValueAndValidity();
      });

    // 3. Escuchar cambio en Destino: Tipo de Selección
    this.feeRuleForm.controls.destSelectionType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        const isAll = type === 'ALL';
        this.isDestSelectionDisabled.set(isAll);
        const ctrl = this.feeRuleForm.controls.destSelection;
        if (isAll) {
          ctrl.disable({ emitEvent: false });
          ctrl.setValue([]);
          ctrl.clearValidators();
        } else {
          ctrl.enable({ emitEvent: false });
          ctrl.setValidators([Validators.required]);
        }
        ctrl.updateValueAndValidity();
      });

    // 4. Escuchar cambio en Aerolíneas: 'ALL' vs 'LIST'
    this.feeRuleForm.controls.airlineSelectionType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        this.isAirlinesPickListDisabled.set(type === 'ALL');
      });
  }

  // Opciones filtradas de ubicación según tipo de ubicación (País, Ciudad, Región)
  getFilteredRouteOptions(type?: 'country' | 'city' | 'region' | string | null): SelectOption[] {
    if (!type) {
      return [];
    }
    return this.routeCatalog
      .filter((item) => item.type === type)
      .map((item) => ({ label: item.name, value: item.code }));
  }

  /**
   * Helper de validación accesible fuertemente tipado
   */
  hasError(controlName: keyof FeeRuleFormControls, errorName?: string): boolean {
    const control = this.feeRuleForm.controls[controlName];
    if (!control) return false;
    const isTouchedOrSubmitted = control.touched || this.submitted();
    if (errorName) {
      return control.hasError(errorName) && isTouchedOrSubmitted;
    }
    return control.invalid && isTouchedOrSubmitted;
  }

  hasCrossPriceError(): boolean {
    const isTouchedOrSubmitted =
      this.feeRuleForm.controls.priceFrom.touched ||
      this.feeRuleForm.controls.priceTo.touched ||
      this.submitted();
    return this.feeRuleForm.hasError('priceRangeInvalid') && isTouchedOrSubmitted;
  }

  /**
   * Generación dinámica y accesible de aria-describedby
   */
  getAriaDescribedBy(fieldId: string, hasHelp = false, hasError = false): string | null {
    const parts: string[] = [];
    if (hasHelp) parts.push(`${fieldId}-help`);
    if (hasError) parts.push(`${fieldId}-error`);
    return parts.length > 0 ? parts.join(' ') : null;
  }

  /**
   * Gestión de eventos PickList con sincronización inmutable de Signals.
   * Maneja tanto traslados individuales como traslados masivos (Move All).
   * Preserva la integridad de las listas sin perder elementos ni duplicar registros.
   */
  onPickListMoveToTarget(event: { items?: Airline[] }): void {
    const movedItems = event?.items ?? [];
    if (!Array.isArray(movedItems) || movedItems.length === 0) {
      return;
    }

    const movedIds = new Set(movedItems.map((item) => item.id));

    // 1. Remover de source preservando el resto de aerolíneas disponibles
    this.sourceAirlines.update((source) => source.filter((item) => !movedIds.has(item.id)));

    // 2. Agregar a target previniendo duplicados
    this.targetAirlines.update((target) => {
      const existingIds = new Set(target.map((item) => item.id));
      const itemsToAdd = movedItems.filter((item) => !existingIds.has(item.id));
      return [...target, ...itemsToAdd];
    });
  }

  onPickListMoveToSource(event: { items?: Airline[] }): void {
    const movedItems = event?.items ?? [];
    if (!Array.isArray(movedItems) || movedItems.length === 0) {
      return;
    }

    const movedIds = new Set(movedItems.map((item) => item.id));

    // 1. Remover de target preservando el resto de aerolíneas seleccionadas
    this.targetAirlines.update((target) => target.filter((item) => !movedIds.has(item.id)));

    // 2. Agregar a source previniendo duplicados
    this.sourceAirlines.update((source) => {
      const existingIds = new Set(source.map((item) => item.id));
      const itemsToAdd = movedItems.filter((item) => !existingIds.has(item.id));
      return [...source, ...itemsToAdd];
    });
  }

  /**
   * Envío del formulario con gestión estricta de accesibilidad y foco
   */
  onSubmit(): void {
    this.submitted.set(true);
    this.formErrorMessage.set(null);
    this.successMessage.set(null);

    // Validación de lista de aerolíneas
    if (
      this.feeRuleForm.controls.airlineSelectionType.value === 'LIST' &&
      this.targetAirlines().length === 0
    ) {
      this.formErrorMessage.set(
        'Debes seleccionar al menos una aerolínea en la lista o cambiar el tipo de selección a "Todas las aerolíneas".',
      );
      this.focusFirstInvalidField();
      return;
    }

    if (this.feeRuleForm.invalid) {
      this.feeRuleForm.markAllAsTouched();
      this.formErrorMessage.set(
        'Por favor, corrige los campos marcados en rojo antes de guardar la regla.',
      );
      this.focusFirstInvalidField();
      return;
    }

    // Proceso de guardado simulado
    this.saving.set(true);

    const payload: FeeRulePayload = {
      ...this.feeRuleForm.getRawValue(),
      selectedAirlines:
        this.feeRuleForm.controls.airlineSelectionType.value === 'LIST'
          ? this.targetAirlines().map((a) => a.code)
          : 'ALL',
    };

    console.info('Payload de regla de Fee a emitir:', payload);

    setTimeout(() => {
      this.saving.set(false);
      this.successMessage.set('La regla de Fee se guardó exitosamente.');
      this.submitted.set(false);
    }, 900);
  }

  onCancel(): void {
    this.submitted.set(false);
    this.formErrorMessage.set(null);
    this.successMessage.set(null);
    this.feeRuleForm.reset({
      ruleName: '',
      web: '',
      device: 'ALL',
      pcc: '',
      flightType: 'ALL',
      fareType: 'PUBLIC',
      feeAmountType: 'percentage',
      feeValue: 10,
      priceFrom: null,
      priceTo: null,
      originLocationType: 'country',
      originSelectionType: 'INCLUDE',
      originSelection: [],
      destLocationType: 'country',
      destSelectionType: 'INCLUDE',
      destSelection: [],
      airlineSelectionType: 'LIST',
      active: true,
    });
    this.initializeAirlines();
  }

  /**
   * Gestión de foco accesible encapsulada en el elemento del componente
   */
  private focusFirstInvalidField(): void {
    setTimeout(() => {
      const hostElement: HTMLElement = this.elementRef.nativeElement;

      // 1. Si hay banner de error general dentro del componente, enfocarlo
      const alertSummary = hostElement.querySelector<HTMLElement>('#form-error-summary');
      if (alertSummary) {
        alertSummary.focus?.();
        return;
      }

      // 2. De lo contrario, buscar el primer control inválido dentro del componente
      const firstInvalidControl = hostElement.querySelector<HTMLElement>(
        '[aria-invalid="true"], .ng-invalid:not(form):not(fieldset)',
      );
      if (firstInvalidControl) {
        firstInvalidControl.focus?.();
        firstInvalidControl.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }
}
