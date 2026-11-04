import { Component, input, output, computed, effect, untracked, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User, UserFormValue, UserRole, UserStatus } from '../user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private readonly fb = inject(FormBuilder);

  // Inputs modernos con Signals
  readonly visible = input(false);
  readonly user = input<User | null>(null);

  // Outputs modernos
  readonly visibleChange = output<boolean>();
  readonly save = output<UserFormValue>();

  // Opciones de los selectores
  readonly roles = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Usuario', value: 'Usuario' },
  ];

  readonly statuses = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  // Formulario reactivo
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    role: this.fb.nonNullable.control<UserRole>('Usuario', Validators.required),
    status: this.fb.nonNullable.control<UserStatus>('Activo', Validators.required),
  });

  // Detectar si estamos editando
  readonly isEditing = computed(() => this.user() !== null);
  constructor() {
    let previousVisible = false;
    let previousUserId: string | null = null;

    effect(() => {
      const isVisible = this.visible();
      const currentUser = this.user();
      const currentUserId = currentUser?.id ?? null;

      // Detectar transición de apertura o cambio real de registro mientras está abierto
      const justOpened = isVisible && !previousVisible;
      const userChanged = isVisible && currentUserId !== previousUserId;

      // Actualizar estado previo
      previousVisible = isVisible;
      previousUserId = isVisible ? currentUserId : null; // Reset al cerrar para garantizar carga limpia en reaperturas

      if (justOpened || userChanged) {
        untracked(() => this.loadForm(currentUser));
      }
    });
  }

  // Cargar datos para crear o editar
  loadForm(user: User | null): void {
    this.form.reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'Usuario',
      status: user?.status ?? 'Activo',
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
      email: value.email.trim(),
      role: value.role,
      status: value.status,
    });
  }

  // Solicitar el cierre del modal
  close(): void {
    this.visibleChange.emit(false);
  }
}
