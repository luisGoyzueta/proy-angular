import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AuthService } from './auth';
import { PermissionService } from './permission';

import type { AuthUser } from '../models/auth.model';

describe('PermissionService', () => {
  let service: PermissionService;

  const currentUser = signal<AuthUser | null>(null);

  beforeEach(() => {
    currentUser.set(null);

    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        {
          provide: AuthService,
          useValue: {
            currentUser: currentUser.asReadonly(),
          },
        },
      ],
    });

    service = TestBed.inject(PermissionService);
  });

  function setRole(role: AuthUser['role']): void {
    currentUser.set({
      id: '1',
      name: 'Usuario de prueba',
      email: 'test@example.com',
      role,
      status: 'Activo',
    });
  }

  it('Administrador tiene todos los permisos', () => {
    setRole('Administrador');

    expect(service.has('users.view')).toBe(true);
    expect(service.has('users.create')).toBe(true);
    expect(service.has('users.edit')).toBe(true);
    expect(service.has('users.delete')).toBe(true);
    expect(service.has('settings.view')).toBe(true);
  });

  it('Editor puede consultar y editar usuarios', () => {
    setRole('Editor');

    expect(service.has('users.view')).toBe(true);
    expect(service.has('users.edit')).toBe(true);
  });

  it('Editor no puede crear ni eliminar usuarios', () => {
    setRole('Editor');

    expect(service.has('users.create')).toBe(false);
    expect(service.has('users.delete')).toBe(false);
  });

  it('Usuario solo puede acceder al Dashboard', () => {
    setRole('Usuario');

    expect(service.has('dashboard.view')).toBe(true);
    expect(service.has('users.view')).toBe(false);
    expect(service.has('settings.view')).toBe(false);
  });

  it('Sin sesión no debe tener permisos', () => {
    currentUser.set(null);

    expect(service.has('dashboard.view')).toBe(false);
    expect(service.has('users.view')).toBe(false);
  });
});
