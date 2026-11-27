import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'Usuario' | 'Editor' | 'Administrador';

export interface UserDraft {
  name: string;
  role: UserRole;
}

@Injectable()
export class UserEditStore {
  private readonly initialState = signal<UserDraft>({ name: '', role: 'Usuario' });
  private readonly draftState = signal<UserDraft>({ name: '', role: 'Usuario' });
  private readonly submittedState = signal<boolean>(false);

  readonly draft = this.draftState.asReadonly();
  readonly submitted = this.submittedState.asReadonly();

  readonly nameError = computed<string | null>(() => {
    const trimmed = this.draftState().name.trim();
    if (!trimmed) return 'El nombre es obligatorio.';
    if (trimmed.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    return null;
  });

  readonly isValid = computed<boolean>(() => this.nameError() === null);

  readonly isDirty = computed<boolean>(() => {
    const initial = this.initialState();
    const current = this.draftState();
    return initial.name !== current.name || initial.role !== current.role;
  });

  init(user: UserDraft): void {
    this.initialState.set({ ...user });
    this.draftState.set({ ...user });
    this.submittedState.set(false);
  }

  updateName(name: string): void {
    this.draftState.update((current) => ({ ...current, name }));
  }

  updateRole(role: UserRole): void {
    this.draftState.update((current) => ({ ...current, role }));
  }

  markSubmitted(): void {
    this.submittedState.set(true);
  }
}
