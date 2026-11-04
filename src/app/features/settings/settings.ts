
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TabsModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private fb = inject(FormBuilder);

  activeTab = 'general';
  saved = signal(false);

  languages = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' }
  ];

  timezones = [
    { label: 'Lima (UTC-5)', value: 'America/Lima' },
    { label: 'Bogotá (UTC-5)', value: 'America/Bogota' },
    { label: 'Santiago', value: 'America/Santiago' }
  ];

  generalForm = this.fb.nonNullable.group({
    companyName: ['Mi Empresa SAC', [Validators.required]],
    email: [
      'admin@empresa.com',
      [Validators.required, Validators.email]
    ],
    language: ['es', Validators.required],
    timezone: ['America/Lima', Validators.required]
  });

  notificationsForm = this.fb.nonNullable.group({
    emailNotifications: [true],
    systemAlerts: [true],
    weeklyReports: [false]
  });

  securityForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(8)]
    ],
    confirmPassword: ['', Validators.required]
  });

  saveGeneral(): void {
    this.generalForm.markAllAsTouched();

    if (this.generalForm.invalid) return;

    console.log('Configuración general:', this.generalForm.getRawValue());
    this.saved.set(true);
  }

  saveNotifications(): void {
    console.log('Notificaciones:', this.notificationsForm.getRawValue());
    this.saved.set(true);
  }

  saveSecurity(): void {
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } =
      this.securityForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.securityForm.controls.confirmPassword.setErrors({
        mismatch: true
      });
      return;
    }

    // Demo: no se envían ni almacenan contraseñas.
    // La actualización real requiere un backend seguro.
    this.securityForm.reset();
    this.saved.set(false);
  }

  clearMessage(): void {
    this.saved.set(false);
  }
}
