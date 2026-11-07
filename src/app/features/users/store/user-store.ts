import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../services/user';
import { User, UserFormValue } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  private requestVersion = 0;

  // ESTADOS PRIVADOS (MUTABLES)
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _saving = signal<boolean>(false);
  private readonly _deleting = signal<string | null>(null);
  private readonly _search = signal<string>('');
  private readonly _dialogVisible = signal<boolean>(false);
  private readonly _selectedUser = signal<User | null>(null);

  // SEÑALES PÚBLICAS (SOLO LECTURA)
  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly deleting = this._deleting.asReadonly();
  readonly search = this._search.asReadonly();
  readonly dialogVisible = this._dialogVisible.asReadonly();
  readonly selectedUser = this._selectedUser.asReadonly();

  // COMPUTADOS
  readonly totalUsers = computed(() => this._users().length);
  readonly activeUsers = computed(
    () => this._users().filter((user) => user.status === 'Activo').length,
  );
  readonly inactiveUsers = computed(
    () => this._users().filter((user) => user.status === 'Inactivo').length,
  );

  // Evitar cargas duplicadas de la API
  private readonly _loaded = signal(false);
  private readonly _error = signal<string | null>(null);
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filteredUsers = computed(() => {
    const term = this._search().trim().toLowerCase();
    if (!term) return this._users();
    return this._users().filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term),
    );
  });

  reset(): void {
    this.requestVersion++;
    this._users.set([]);
    this._loading.set(false);
    this._saving.set(false);
    this._deleting.set(null);
    this._search.set('');
    this._dialogVisible.set(false);
    this._selectedUser.set(null);
    this._error.set(null);
    this._loaded.set(false);
  }

  // MUTACIONES DIRECTAS DE ESTADO LOCAL
  setSearch(term: string): void {
    this._search.set(term);
  }

  openCreate(): void {
    if (this._saving() || this._deleting() !== null) return;
    this._selectedUser.set(null);
    this._dialogVisible.set(true);
  }

  openEdit(user: User): void {
    if (this._saving() || this._deleting() !== null) return;
    this._selectedUser.set({ ...user });
    this._dialogVisible.set(true);
  }

  closeDialog(): void {
    if (this._saving()) return;
    this._dialogVisible.set(false);
    this._selectedUser.set(null);
  }

  setDialogVisible(visible: boolean): void {
    if (visible) {
      this._dialogVisible.set(true);
    } else {
      this.closeDialog();
    }
  }

  checkEmailExists(email: string, currentUserId?: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return this._users().some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail && user.id !== currentUserId,
    );
  }

  // ACCIONES ASÍNCRONAS

  loadUsers(
    callbacks?: {
      onError?: (error: HttpErrorResponse) => void;
    },
    forceRefresh = false,
  ): void {
    // Evitar peticiones simultáneas
    if (this._loading()) return;

    // Evitar cargas repetidas si los datos ya existen
    if (this._loaded() && !forceRefresh) return;

    this._loading.set(true);
    this._error.set(null);

    // 1. CAPTURAR LA VERSIÓN ACTUAL ANTES DE LA PETICIÓN
    const version = this.requestVersion;

    this.userService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          // Solo apagar loading si sigue siendo la petición vigente
          if (version === this.requestVersion) {
            this._loading.set(false);
          }
        }),
      )
      .subscribe({
        next: (users) => {
          // 1. VERIFICAR SI LA VERSIÓN ES LA MÁS RECENTE
          if (version !== this.requestVersion) {
            return;
          }
          this._users.set(users);
          this._loaded.set(true);
        },
        error: (error: HttpErrorResponse) => {
          // 2. DESCARTAR ERROR SI LA VERSIÓN YA NO ES VIGENTE
          if (version !== this.requestVersion) {
            return;
          }
          this._error.set('No se pudieron cargar los usuarios.');
          callbacks?.onError?.(error);
        },
      });
  }

  saveUser(
    data: UserFormValue,
    callbacks?: {
      onSuccess?: (isEditing: boolean) => void;
      onError?: (error: HttpErrorResponse) => void;
    },
  ): void {
    if (this._saving()) return;

    const currentUser = this._selectedUser();
    const isEditing = currentUser !== null;

    const userData: UserFormValue = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };

    this._saving.set(true);

    const request$ = currentUser
      ? this.userService.updateUser(currentUser.id, userData)
      : this.userService.createUser(userData);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._saving.set(false)),
      )
      .subscribe({
        next: () => {
          this._dialogVisible.set(false);
          this._selectedUser.set(null);
          callbacks?.onSuccess?.(isEditing);
          this.loadUsers(undefined, true);
        },
        error: (error: HttpErrorResponse) => callbacks?.onError?.(error),
      });
  }

  deleteUser(
    id: string,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (error: HttpErrorResponse) => void;
    },
  ): void {
    if (this._deleting() !== null) return;

    this._deleting.set(id);

    this.userService
      .deleteUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._deleting.set(null)),
      )
      .subscribe({
        next: () => {
          callbacks?.onSuccess?.();
          this.loadUsers(undefined, true);
        },
        error: (error: HttpErrorResponse) => callbacks?.onError?.(error),
      });
  }
}
