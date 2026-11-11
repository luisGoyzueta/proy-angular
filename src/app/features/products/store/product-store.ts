import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../services/product';
import { Product, ProductFormValue } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  private requestVersion = 0;

  // ESTADOS PRIVADOS (MUTABLES)
  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _saving = signal<boolean>(false);
  private readonly _deleting = signal<string | null>(null);
  private readonly _search = signal<string>('');
  private readonly _dialogVisible = signal<boolean>(false);
  private readonly _selectedProduct = signal<Product | null>(null);

  // SEÑALES PÚBLICAS (SOLO LECTURA)
  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly deleting = this._deleting.asReadonly();
  readonly search = this._search.asReadonly();
  readonly dialogVisible = this._dialogVisible.asReadonly();
  readonly selectedProduct = this._selectedProduct.asReadonly();

  // COMPUTADOS
  readonly totalProducts = computed(() => this._products().length);
  readonly activeProducts = computed(
    () => this._products().filter((product) => product.status === 'Activo').length,
  );
  readonly inactiveProducts = computed(
    () => this._products().filter((product) => product.status === 'Inactivo').length,
  );

  // Evitar cargas duplicadas de la API
  private readonly _loaded = signal(false);
  private readonly _error = signal<string | null>(null);
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filteredProducts = computed(() => {
    const term = this._search().trim().toLowerCase();
    if (!term) return this._products();
    return this._products().filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.price.toString().includes(term) ||
        product.status.toLowerCase().includes(term),
    );
  });

  reset(): void {
    this.requestVersion++;
    this._products.set([]);
    this._loading.set(false);
    this._saving.set(false);
    this._deleting.set(null);
    this._search.set('');
    this._dialogVisible.set(false);
    this._selectedProduct.set(null);
    this._error.set(null);
    this._loaded.set(false);
  }

  // MUTACIONES DIRECTAS DE ESTADO LOCAL
  setSearch(term: string): void {
    this._search.set(term);
  }

  openCreate(): void {
    if (this._saving() || this._deleting() !== null) return;
    this._selectedProduct.set(null);
    this._dialogVisible.set(true);
  }

  openEdit(product: Product): void {
    if (this._saving() || this._deleting() !== null) return;
    this._selectedProduct.set({ ...product });
    this._dialogVisible.set(true);
  }

  closeDialog(): void {
    if (this._saving()) return;
    this._dialogVisible.set(false);
    this._selectedProduct.set(null);
  }

  setDialogVisible(visible: boolean): void {
    if (visible) {
      this._dialogVisible.set(true);
    } else {
      this.closeDialog();
    }
  }

  checkProductExists(name: string, currentProductId?: string): boolean {
    const normalizedName = name.trim().toLowerCase();
    return this._products().some(
      (product) =>
        product.name.trim().toLowerCase() === normalizedName && product.id !== currentProductId,
    );
  }

  // ACCIONES ASÍNCRONAS
  loadProducts(
    callbacks?: {
      onError?: (error: HttpErrorResponse) => void;
    },
    forceRefresh = false,
  ): void {
    if (this._loading()) return;
    if (this._loaded() && !forceRefresh) return;
    this._loading.set(true);
    this._error.set(null);
    const version = this.requestVersion;
    this.productService
      .getProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (version === this.requestVersion) {
            this._loading.set(false);
          }
        }),
      )
      .subscribe({
        next: (products) => {
          if (version !== this.requestVersion) {
            return;
          }
          this._products.set(products);
          this._loaded.set(true);
        },
        error: (error: HttpErrorResponse) => {
          if (version !== this.requestVersion) {
            return;
          }
          this._error.set('No se pudieron cargar los productos.');
          callbacks?.onError?.(error);
        },
      });
  }

  saveProduct(
    data: ProductFormValue,
    callbacks?: {
      onSuccess?: (isEditing: boolean) => void;
      onError?: (error: HttpErrorResponse) => void;
    },
  ): void {
    if (this._saving()) return;
    const currentProduct = this._selectedProduct();
    const isEditing = currentProduct !== null;
    const productData: ProductFormValue = {
      ...data,
      name: data.name.trim(),
    };
    this._saving.set(true);
    const request$ = currentProduct
      ? this.productService.updateProduct(currentProduct.id, productData)
      : this.productService.createProduct(productData);
    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._saving.set(false)),
      )
      .subscribe({
        next: () => {
          this._dialogVisible.set(false);
          this._selectedProduct.set(null);
          callbacks?.onSuccess?.(isEditing);
          this.loadProducts(undefined, true);
        },
        error: (error: HttpErrorResponse) => callbacks?.onError?.(error),
      });
  }

  deleteProduct(
    id: string,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (error: HttpErrorResponse) => void;
    },
  ): void {
    if (this._deleting() !== null) return;
    this._deleting.set(id);
    this.productService
      .deleteProduct(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._deleting.set(null)),
      )
      .subscribe({
        next: () => {
          callbacks?.onSuccess?.();
          this.loadProducts(undefined, true);
        },
        error: (error: HttpErrorResponse) => callbacks?.onError?.(error),
      });
  }
}
