import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth';
import { environment } from '../../../environments/environment';

import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Router } from '@angular/router';
import { vi } from 'vitest';

@Component({
  standalone: true,
  template: '',
})
class MockLoginComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/auth`;

  const mockUser = {
    id: '1',
    name: 'Administrador',
    email: 'admin@demo.com',
    role: 'Administrador' as const,
    status: 'Activo' as const,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([
          {
            path: 'login',
            component: MockLoginComponent,
          },
        ]),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe iniciar sin usuario autenticado', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debe iniciar sesión correctamente', () => {
    service
      .login({
        email: 'admin@demo.com',
        password: 'PasswordPrueba123!',
      })
      .subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);

    expect(req.request.method).toBe('POST');

    req.flush({ user: mockUser });

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);
  });

  it('debe rechazar credenciales incorrectas', () => {
    let errorStatus: number | undefined;

    service
      .login({
        email: 'admin@demo.com',
        password: 'incorrecta',
      })
      .subscribe({
        error: (error) => {
          errorStatus = error.status;
        },
      });

    const req = httpMock.expectOne(`${apiUrl}/login`);

    req.flush(
      { message: 'Credenciales incorrectas.' },
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(errorStatus).toBe(401);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debe restaurar la sesión desde el backend', () => {
    let authenticated = false;

    service.initialize().subscribe((result) => {
      authenticated = result;
    });

    const req = httpMock.expectOne(`${apiUrl}/me`);

    expect(req.request.method).toBe('GET');

    req.flush({ user: mockUser });

    expect(authenticated).toBe(true);
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.initialized()).toBe(true);
  });

  it('debe limpiar la sesión después del Logout', () => {
    service
      .login({
        email: 'admin@demo.com',
        password: 'PasswordPrueba123!',
      })
      .subscribe();

    httpMock.expectOne(`${apiUrl}/login`).flush({ user: mockUser });

    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/logout`);

    expect(req.request.method).toBe('POST');

    req.flush(null);

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });


it('debe cerrar sesión y redirigir al Login', () => {
  const router = TestBed.inject(Router);

  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  // Simular login
  service
    .login({
      email: 'admin@demo.com',
      password: 'password123',
    })
    .subscribe();

  httpMock.expectOne(`${apiUrl}/login`).flush({ user: mockUser });

  expect(service.isAuthenticated()).toBe(true);

  // Ejecutar logout
  service.logout().subscribe();

  const req = httpMock.expectOne(`${apiUrl}/logout`);

  expect(req.request.method).toBe('POST');
  expect(req.request.withCredentials).toBe(true);

  req.flush(null, {
    status: 204,
    statusText: 'No Content',
  });

  // Verificar limpieza de sesión
  expect(service.isAuthenticated()).toBe(false);
  expect(service.currentUser()).toBeNull();

  // Verificar redirección
  expect(navigateSpy).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
});

});
