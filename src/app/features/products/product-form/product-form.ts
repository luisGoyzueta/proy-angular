import { Component, input, output, computed, effect, untracked, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Product, ProductFormValue, ProductStatus } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})

export class ProductForm {
  private readonly fb = inject(FormBuilder);

  // Inputs modernos con Signals
  readonly visible = input(false);
  readonly product = input<Product | null>(null);

  // Outputs modernos
  readonly visibleChange = output<boolean>();
  readonly save = output<ProductFormValue>();

  // Opciones de los selectores
  readonly statuses = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  // Formulario reactivo
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    status: this.fb.nonNullable.control<ProductStatus>('Activo', Validators.required),
  });

  // Detectar si estamos editando
  readonly isEditing = computed(() => this.product() !== null);
  constructor() {
    let previousVisible = false;
    let previousProductId: string | null = null;

    effect(() => {
      const isVisible = this.visible();
      const currentProduct = this.product();
      const currentProductId = currentProduct?.id ?? null;

      // Detectar transición de apertura o cambio real de registro mientras está abierto
      const justOpened = isVisible && !previousVisible;
      const productChanged = isVisible && currentProductId !== previousProductId;

      // Actualizar estado previo
      previousVisible = isVisible;
      previousProductId = isVisible ? currentProductId : null; // Reset al cerrar para garantizar carga limpia en reaperturas

      if (justOpened || productChanged) {
        untracked(() => this.loadForm(currentProduct));
      }
    });
  }

  // Cargar datos para crear o editar
  loadForm(product: Product | null): void {
    this.form.reset({
      name: product?.name ?? '',
      price: product?.price ?? 0,
      status: product?.status ?? 'Activo',
    });
  }

  // Validar y emitir los datos
  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      name: value.name.trim(),
      price: Number(value.price),
      status: value.status,
    });
  }

  // Solicitar el cierre del modal
  close(): void {
    this.visibleChange.emit(false);
  }
}
