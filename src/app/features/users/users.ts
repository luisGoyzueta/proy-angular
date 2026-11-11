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

import { UserForm } from './user-form/user-form';
import { User, UserFormValue } from './user.model';
import { UserStore } from './store/user-store';

import { PermissionService } from '../../core/services/permission';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    UserForm,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  // INYECCIÓN DE DEPENDENCIAS
  readonly store = inject(UserStore);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Una única fuente de estado: UserStore.
  readonly users = this.store.users;
  readonly filteredUsers = this.store.filteredUsers;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly deleting = this.store.deleting;
  readonly totalUsers = this.store.totalUsers;
  readonly activeUsers = this.store.activeUsers;
  readonly search = this.store.search;
  readonly dialogVisible = this.store.dialogVisible;
  readonly selectedUser = this.store.selectedUser;

  readonly permissions = inject(PermissionService);
  readonly canCreate = computed(() => this.permissions.has('users.create'));
  readonly canEdit = computed(() => this.permissions.has('users.edit'));
  readonly canDelete = computed(() => this.permissions.has('users.delete'));

  // INICIALIZACIÓN
  ngOnInit(): void {
    this.loadUsers();
  }

  // OBTENER USUARIOS DESDE LA API
  loadUsers(): void {
    this.store.loadUsers({
      onError: (error) => this.showError(error, 'No se pudieron cargar los usuarios.'),
    });
  }

  setSearch(term: string): void {
    this.store.setSearch(term);
  }

  setDialogVisible(visible: boolean): void {
    this.store.setDialogVisible(visible);
  }

  // ABRIR MODAL NUEVO USUARIO
  openCreate(): void {
    if (!this.canCreate()) return;
    this.store.openCreate();
  }

  // ABRIR MODAL EDITAR USUARIO
  openEdit(user: User): void {
    if (!this.canEdit()) return;
    this.store.openEdit(user);
  }

  // REGISTRAR O ACTUALIZAR USUARIO
  saveUser(data: UserFormValue): void {
    // Obtener el usuario seleccionado desde el Signal
    const currentUser = this.selectedUser();
    const editing = currentUser !== null;

    // Verificar permisos
    if (editing && !this.canEdit()) return;
    if (!editing && !this.canCreate()) return;

    // Evitar operaciones simultáneas
    if (this.saving()) return;

    // Normalizar correo
    const email = data.email.trim().toLowerCase();

    // Verificar duplicados
    if (this.store.checkEmailExists(email, currentUser?.id)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Correo duplicado',
        detail: 'Ya existe un usuario con ese correo.',
      });
      return;
    }

    // Delegar guardado al Store
    this.store.saveUser(data, {
      onSuccess: (isEditing) => {
        this.messageService.add({
          severity: 'success',
          summary: isEditing ? 'Usuario actualizado' : 'Usuario registrado',
          detail: 'La operación se realizó correctamente.',
        });
      },
      onError: (error) => {
        this.showError(error, 'No se pudo guardar el usuario.');
      },
    });
  }

  // CONFIRMAR ELIMINACIÓN
  confirmDelete(user: User): void {
    if (!this.canDelete()) return;
    if (this.deleting() !== null || this.saving()) return;

    this.confirmationService.confirm({
      header: 'Eliminar usuario',
      message: `¿Deseas eliminar a ${user.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteUser(user.id),
    });
  }

  // ELIMINAR USUARIO DESDE LA API
  private deleteUser(id: string): void {
    if (!this.canDelete()) return;
    if (this.deleting() !== null || this.saving()) return;

    this.store.deleteUser(id, {
      onSuccess: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario eliminado',
          detail: 'El registro fue eliminado correctamente.',
        });
      },
      onError: (error) => this.showError(error, 'No se pudo eliminar el usuario.'),
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
