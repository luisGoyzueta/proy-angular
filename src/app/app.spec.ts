import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AuthService } from './core/services/auth';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
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

  it('debe autenticar al usuario correctamente', () => {
    const credentials = {
      email: 'admin@demo.com',
      password: 'PasswordSegura123!',
    };

    const user = {
      id: '1',
      name: 'Administrador',
      email: 'admin@demo.com',
      role: 'Administrador' as const,
      status: 'Activo' as const,
    };

    let result = null;

    service.login(credentials).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush({ user });

    expect(result).toEqual(user);
    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);
  });

  it('no debe autenticar con credenciales incorrectas', () => {
    service
      .login({
        email: 'admin@demo.com',
        password: 'incorrecta',
      })
      .subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);

    req.flush(
      { message: 'Credenciales incorrectas.' },
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
