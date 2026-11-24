import { ComponentFixture, TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { FeeRulesMaintenanceComponent, Airline } from './fee-rules-maintenance.component';

describe('FeeRulesMaintenanceComponent (Etapa 1 - Estabilidad PickList y Caracterización)', () => {
  let component: FeeRulesMaintenanceComponent;
  let fixture: ComponentFixture<FeeRulesMaintenanceComponent>;

  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeRulesMaintenanceComponent],
      providers: [
        providePrimeNG({
          theme: {
            preset: Aura,
            options: { darkModeSelector: false },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeRulesMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('1. Inicialización y Estado Inicial', () => {
    it('debe crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar el catálogo de aerolíneas con 10 en source y 2 en target', () => {
      const source = component.sourceAirlines();
      const target = component.targetAirlines();

      expect(source.length).toBe(10);
      expect(target.length).toBe(2);
      expect(component.targetAirlinesCount()).toBe(2);

      // Total de aerolíneas en el sistema = 12
      expect(source.length + target.length).toBe(12);

      // Verificar que LA y AV están preseleccionadas en target
      expect(target.some((a) => a.code === 'LA')).toBe(true);
      expect(target.some((a) => a.code === 'AV')).toBe(true);
    });

    it('debe inicializar el formulario con valores esperados', () => {
      const form = component.feeRuleForm;
      expect(form.get('device')?.value).toBe('ALL');
      expect(form.get('feeAmountType')?.value).toBe('percentage');
      expect(form.get('airlineSelectionType')?.value).toBe('LIST');
      expect(form.get('active')?.value).toBe(true);
      expect(form.get('flightType')?.value).toBe('ALL');
    });
  });

  describe('2. Pruebas de Caracterización de Lógica de Negocio y Validación', () => {
    it('debe alternar límites y sufijo al cambiar feeAmountType a fixed y percentage', () => {
      component.feeRuleForm.get('feeAmountType')?.setValue('fixed');
      expect(component.selectedFeeAmountType()).toBe('fixed');
      expect(component.feeMaxLimit()).toBe(999999);
      expect(component.feeSuffix()).toBeUndefined();

      component.feeRuleForm.get('feeAmountType')?.setValue('percentage');
      expect(component.selectedFeeAmountType()).toBe('percentage');
      expect(component.feeMaxLimit()).toBe(100);
      expect(component.feeSuffix()).toBe(' %');
    });

    it('debe deshabilitar originSelection si originSelectionType es ALL y habilitar si es INCLUDE', () => {
      const typeCtrl = component.feeRuleForm.get('originSelectionType');
      const selCtrl = component.feeRuleForm.get('originSelection');

      typeCtrl?.setValue('ALL');
      expect(component.isOriginSelectionDisabled()).toBe(true);
      expect(selCtrl?.disabled).toBe(true);

      typeCtrl?.setValue('INCLUDE');
      expect(component.isOriginSelectionDisabled()).toBe(false);
      expect(selCtrl?.enabled).toBe(true);
    });

    it('debe validar el validador de rango de precios (priceRangeValidator)', () => {
      const form = component.feeRuleForm;
      const fromCtrl = form.get('priceFrom');
      const toCtrl = form.get('priceTo');

      // Válido cuando from <= to
      fromCtrl?.setValue(10);
      toCtrl?.setValue(50);
      expect(form.errors).toBeNull();

      // Inválido cuando from > to
      fromCtrl?.setValue(60);
      toCtrl?.setValue(50);
      expect(form.errors).toEqual({ priceRangeInvalid: true });

      // Válido si alguno es null
      fromCtrl?.setValue(null);
      toCtrl?.setValue(50);
      expect(form.errors).toBeNull();
    });

    it('debe resetear el formulario y restablecer aerolíneas con onCancel()', () => {
      // Modificar estado
      component.feeRuleForm.get('ruleName')?.setValue('Regla de Prueba');
      component.targetAirlines.set([]);

      component.onCancel();

      expect(component.feeRuleForm.get('ruleName')?.value).toBe('');
      expect(component.targetAirlines().length).toBe(2);
      expect(component.sourceAirlines().length).toBe(10);
    });
  });

  describe('3. PickList: Pruebas de Regresión y Estabilidad Funcional (Etapa 1)', () => {
    it('debe mover una aerolínea de Source a Target sin perder los demás elementos de Source', () => {
      const initialSource = [...component.sourceAirlines()];
      const initialTarget = [...component.targetAirlines()];
      const itemToMove: Airline = initialSource[0]; // Ej. AA

      component.onPickListMoveToTarget({ items: [itemToMove] });

      const newSource = component.sourceAirlines();
      const newTarget = component.targetAirlines();

      // 1. Target debe incrementarse en 1 y contener el elemento movido
      expect(newTarget.length).toBe(initialTarget.length + 1);
      expect(newTarget.some((a) => a.id === itemToMove.id)).toBe(true);
      expect(component.targetAirlinesCount()).toBe(3);

      // 2. Source debe decrementar en 1 y NO contener el elemento movido
      expect(newSource.length).toBe(initialSource.length - 1);
      expect(newSource.some((a) => a.id === itemToMove.id)).toBe(false);

      // 3. No se debe perder ninguna otra aerolínea (total sigue siendo 12)
      expect(newSource.length + newTarget.length).toBe(12);
    });

    it('debe mover una aerolínea de Target a Source sin perder los demás elementos de Target', () => {
      const initialSource = [...component.sourceAirlines()];
      const initialTarget = [...component.targetAirlines()];
      const itemToMove: Airline = initialTarget[0]; // Ej. LA

      component.onPickListMoveToSource({ items: [itemToMove] });

      const newSource = component.sourceAirlines();
      const newTarget = component.targetAirlines();

      // 1. Target debe decrementar en 1
      expect(newTarget.length).toBe(initialTarget.length - 1);
      expect(newTarget.some((a) => a.id === itemToMove.id)).toBe(false);
      expect(component.targetAirlinesCount()).toBe(1);

      // 2. Source debe incrementar en 1 y contener el elemento devuelto
      expect(newSource.length).toBe(initialSource.length + 1);
      expect(newSource.some((a) => a.id === itemToMove.id)).toBe(true);

      // 3. Total preservado
      expect(newSource.length + newTarget.length).toBe(12);
    });

    it('debe soportar movimientos múltiples simultáneos en ambos sentidos', () => {
      const itemsToTarget = component.sourceAirlines().slice(0, 3); // 3 aerolíneas
      component.onPickListMoveToTarget({ items: itemsToTarget });

      expect(component.sourceAirlines().length).toBe(7);
      expect(component.targetAirlines().length).toBe(5);
      expect(component.targetAirlinesCount()).toBe(5);
      expect(component.sourceAirlines().length + component.targetAirlines().length).toBe(12);

      // Regresar 2 aerolíneas a Source
      const itemsBackToSource = component.targetAirlines().slice(0, 2);
      component.onPickListMoveToSource({ items: itemsBackToSource });

      expect(component.sourceAirlines().length).toBe(9);
      expect(component.targetAirlines().length).toBe(3);
      expect(component.targetAirlinesCount()).toBe(3);
      expect(component.sourceAirlines().length + component.targetAirlines().length).toBe(12);
    });

    it('debe soportar mover todas las aerolíneas a Target (Move All)', () => {
      const allSource = [...component.sourceAirlines()];
      component.onPickListMoveToTarget({ items: allSource });

      expect(component.sourceAirlines().length).toBe(0);
      expect(component.targetAirlines().length).toBe(12);
      expect(component.targetAirlinesCount()).toBe(12);
    });

    it('debe soportar mover todas las aerolíneas a Source (Move All)', () => {
      const allTarget = [...component.targetAirlines()];
      component.onPickListMoveToSource({ items: allTarget });

      expect(component.targetAirlines().length).toBe(0);
      expect(component.sourceAirlines().length).toBe(12);
      expect(component.targetAirlinesCount()).toBe(0);
    });

    it('no debe duplicar elementos si se envían ítems ya existentes en la lista destino', () => {
      const existingInTarget = component.targetAirlines()[0];
      component.onPickListMoveToTarget({ items: [existingInTarget] });

      expect(component.targetAirlines().length).toBe(2);
      expect(component.sourceAirlines().length).toBe(10);
    });

    it('debe manejar eventos vacíos o nulos de forma segura sin lanzar errores', () => {
      expect(() => component.onPickListMoveToTarget({})).not.toThrow();
      expect(() => component.onPickListMoveToSource({ items: [] })).not.toThrow();
      expect(component.sourceAirlines().length).toBe(10);
      expect(component.targetAirlines().length).toBe(2);
    });
  });

  describe('4. Validación de Envío respecto a PickList', () => {
    it('debe marcar error al intentar enviar con selección LIST si no hay aerolíneas seleccionadas', () => {
      component.feeRuleForm.controls.airlineSelectionType.setValue('LIST');
      component.targetAirlines.set([]);

      component.onSubmit();

      expect(component.formErrorMessage()).toContain(
        'Debes seleccionar al menos una aerolínea en la lista',
      );
    });
  });

  describe('5. Angular 21 y TypeScript Moderno (Etapa 2)', () => {
    it('debe permitir acceso y mutación tipada mediante feeRuleForm.controls', () => {
      component.feeRuleForm.controls.ruleName.setValue('Tarifa Promocional Verano');
      expect(component.feeRuleForm.controls.ruleName.value).toBe('Tarifa Promocional Verano');

      component.feeRuleForm.controls.active.setValue(false);
      expect(component.feeRuleForm.controls.active.value).toBe(false);

      expect(component.hasError('ruleName')).toBe(false);
    });

    it('debe limpiar suscripciones al destruir el componente (takeUntilDestroyed)', () => {
      const typeCtrl = component.feeRuleForm.controls.originSelectionType;
      expect(component.isOriginSelectionDisabled()).toBe(false);

      // Destruir el fixture y componente
      fixture.destroy();

      // Cambios posteriores en el formulario no deben afectar las signals ni causar fugas
      typeCtrl.setValue('ALL');
      // Al estar destruido, la señal no debe haber reaccionado al evento
      expect(component.isOriginSelectionDisabled()).toBe(false);
    });
  });
});
