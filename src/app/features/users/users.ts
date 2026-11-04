import { Component, OnInit, computed, inject, signal, DestroyRef } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

import { UserForm } from './user-form/user-form';
import { User, UserFormValue } from './user.model';
import { UserService } from './services/user';

@Component({
  selector: 'app-users',
  standalone: true,
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
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  // ESTADOS REACTIVOS
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal<string | null>(null);

  // TOTAL Y USUARIOS ACTIVOS
  readonly totalUsers = computed(() => this.users().length);
  readonly activeUsers = computed(
    () => this.users().filter((user) => user.status === 'Activo').length,
  );

  // ESTADOS DEL FORMULARIO Y BÚSQUEDA
  readonly search = signal('');
  readonly dialogVisible = signal(false);
  readonly selectedUser = signal<User | null>(null);

  // FILTRAR USUARIOS AUTOMÁTICAMENTE
  readonly filteredUsers = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term),
    );
  });

  // INICIALIZACIÓN
  ngOnInit(): void {
    this.loadUsers();
  }

  // OBTENER USUARIOS DESDE LA API
  loadUsers(): void {
    this.loading.set(true);

    this.userService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.users.set(data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar usuarios:', error);
          this.showError(error, 'No se pudieron cargar los usuarios.');
        },
      });
  }

  // ABRIR MODAL NUEVO USUARIO
  openCreate(): void {
    if (this.saving()) return;
    this.selectedUser.set(null);
    this.dialogVisible.set(true);
  }

  // ABRIR MODAL EDITAR USUARIO
  openEdit(user: User): void {
    if (this.saving()) return;
    this.selectedUser.set({ ...user });
    this.dialogVisible.set(true);
  }

  // REGISTRAR O ACTUALIZAR USUARIO
  saveUser(data: UserFormValue): void {
    // Evitar guardados simultáneos
    if (this.saving()) return;

    // Obtener el usuario seleccionado
    const currentUser = this.selectedUser();
    const editing = currentUser !== null;

    // NORMALIZAR EL CORREO
    const userData: UserFormValue = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };

    // VALIDAR CORREO DUPLICADO
    const emailExists = this.users().some(
      (user) => user.email.trim().toLowerCase() === userData.email && user.id !== currentUser?.id,
    );

    if (emailExists) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Correo duplicado',
        detail: 'Ya existe un usuario con ese correo.',
      });
      return;
    }

    // Activar estado de guardado
    this.saving.set(true);

    // DETERMINAR SI ES CREACIÓN O EDICIÓN
    const request$ = currentUser
      ? this.userService.updateUser(currentUser.id, userData)
      : this.userService.createUser(userData);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          // Cerrar y limpiar formulario
          this.dialogVisible.set(false);
          this.selectedUser.set(null);

          this.messageService.add({
            severity: 'success',
            summary: editing ? 'Usuario actualizado' : 'Usuario registrado',
            detail: 'La operación se realizó correctamente.',
          });

          this.loadUsers();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al guardar:', error);
          this.showError(error, 'No se pudo guardar el usuario.');
        },
      });
  }

  // CONFIRMAR ELIMINACIÓN
  confirmDelete(user: User): void {
    if (this.deleting() !== null) return;

    this.confirmationService.confirm({
      header: 'Eliminar usuario',
      message: `¿Deseas eliminar a ${user.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        severity: 'danger',
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.deleteUser(user.id);
      },
    });
  }

  // ELIMINAR USUARIO DESDE LA API
  private deleteUser(id: string): void {
    if (this.deleting()) return;

    this.deleting.set(id);

    this.userService
      .deleteUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deleting.set(null)),
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario eliminado',
            detail: 'El registro fue eliminado correctamente.',
          });
          this.loadUsers();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al eliminar:', error);
          this.showError(error, 'No se pudo eliminar el usuario.');
        },
      });
  }

  // MANEJO DE ERRORES PARA LA INTERFAZ
  private showError(error: HttpErrorResponse, fallback: string): void {
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

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }
}
