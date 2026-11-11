import { Component, OnInit, inject, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';


import { ProductForm } from './product-form/product-form';
import { Product, ProductFormValue } from './models/product.model';
import { ProductStore } from './store/product-store';

import { PermissionService } from '../../core/services/permission';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    ProductForm,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  // INYECCIÓN DE DEPENDENCIAS
  readonly store = inject(ProductStore);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Una única fuente de estado: UserStore.
  readonly products = this.store.products;
  readonly filteredProducts = this.store.filteredProducts;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly deleting = this.store.deleting;
  readonly totalProducts = this.store.totalProducts;
  readonly activeProducts = this.store.activeProducts;
  readonly search = this.store.search;
  readonly dialogVisible = this.store.dialogVisible;
  readonly selectedProduct = this.store.selectedProduct;

  readonly permissions = inject(PermissionService);
  readonly canCreate = computed(() => this.permissions.has('products.create'));
  readonly canEdit = computed(() => this.permissions.has('products.edit'));
  readonly canDelete = computed(() => this.permissions.has('products.delete'));

  // INICIALIZACIÓN
  ngOnInit(): void {
    this.loadProducts();
  }

  // OBTENER PRODUCTOS DESDE LA API
  loadProducts(): void {
    this.store.loadProducts({
      onError: (error) => this.showError(error, 'No se pudieron cargar los productos.'),
    });
  }

  setSearch(term: string): void {
    this.store.setSearch(term);
  }

  setDialogVisible(visible: boolean): void {
    this.store.setDialogVisible(visible);
  }

  // ABRIR MODAL NUEVO PRODUCTO
  openCreate(): void {
    if (!this.canCreate()) return;
    this.store.openCreate();
  }

  // ABRIR MODAL EDITAR PRODUCTO
  openEdit(product: Product): void {
    if (!this.canEdit()) return;
    this.store.openEdit(product);
  }

  // REGISTRAR O ACTUALIZAR PRODUCTO
  saveProduct(data: ProductFormValue): void {
    const currentProduct = this.selectedProduct();
    const editing = currentProduct !== null;

    // Verificar permisos
    if (editing && !this.canEdit()) return;
    if (!editing && !this.canCreate()) return;

    // Evitar operaciones simultáneas
    if (this.saving()) return;

    // Normalizar nombre
    const name = data.name.trim();

    // Verificar duplicados
    if (this.store.checkProductExists(name, currentProduct?.id)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nombre duplicado',
        detail: 'Ya existe un producto con ese nombre.',
      });
      return;
    }

    // Delegar guardado al Store
    this.store.saveProduct(data, {
      onSuccess: (isEditing) => {
        this.messageService.add({
          severity: 'success',
          summary: isEditing ? 'Producto actualizado' : 'Producto registrado',
          detail: 'La operación se realizó correctamente.',
        });
      },
      onError: (error) => {
        this.showError(error, 'No se pudo guardar el producto.');
      },
    });
  }

  // CONFIRMAR ELIMINACIÓN
  confirmDelete(product: Product): void {
    if (!this.canDelete()) return;
    if (this.deleting() !== null || this.saving()) return;

    this.confirmationService.confirm({
      header: 'Eliminar producto',
      message: `¿Deseas eliminar el producto "${product.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteProduct(product.id),
    });
  }

  // ELIMINAR PRODUCTO DESDE LA API
  private deleteProduct(id: string): void {
    if (!this.canDelete()) return;
    if (this.deleting() !== null || this.saving()) return;

    this.store.deleteProduct(id, {
      onSuccess: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Producto eliminado',
          detail: 'El registro fue eliminado correctamente.',
        });
      },
      onError: (error) => this.showError(error, 'No se pudo eliminar el producto.'),
    });
  }

  // MANEJO DE ERRORES PARA LA INTERFAZ
  private showError(error: HttpErrorResponse, fallback: string): void {
    console.error('Error HTTP:', error);
    let detail = fallback;
    if (error.status === 0) {
      detail = 'No hay conexión con la API. Verifica JSON Server.';
    } else if (error.status === 404) {
      detail = 'El registro solicitado ya no existe.';
    } else if (error.status === 409) {
      detail = 'Existe un conflicto con los datos enviados.';
    } else if (error.status >= 500) {
      detail = 'Error interno del servidor. Inténtalo nuevamente.';
    }
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}
