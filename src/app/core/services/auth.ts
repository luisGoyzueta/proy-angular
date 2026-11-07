import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginCredentials } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _initialized = signal(false);
  private readonly _loading = signal(false);

  private initializationRequest$?: Observable<boolean>;

  readonly currentUser = this._currentUser.asReadonly();
  readonly initialized = this._initialized.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  readonly isAdmin = computed(() => this._currentUser()?.role === 'Administrador');
  private readonly router = inject(Router);
  // INICIAR SESIÓN
  login(credentials: LoginCredentials): Observable<AuthUser> {
    this._loading.set(true);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        map((response) => response.user),

        tap((user) => {
          this._currentUser.set(user);
          this._initialized.set(true);
        }),

        finalize(() => {
          this._loading.set(false);
        }),
      );
  }

  // RECUPERAR SESIÓN AL RECARGAR LA PÁGINA
  initialize(): Observable<boolean> {
    if (this._initialized()) {
      return of(this.isAuthenticated());
    }

    if (this.initializationRequest$) {
      return this.initializationRequest$;
    }

    this.initializationRequest$ = this.http
      .get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        map((response): boolean => {
          this._currentUser.set(response.user);
          return true;
        }),

        catchError(() => {
          this._currentUser.set(null);
          return of(false);
        }),

        tap(() => {
          this._initialized.set(true);
        }),

        finalize(() => {
          this.initializationRequest$ = undefined;
        }),

        shareReplay({ bufferSize: 1, refCount: true }),
      );

    return this.initializationRequest$;
  }

  // CERRAR SESIÓN
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // 1. Limpiar usuario autenticado
        this.clearLocalSession();

        // 2. Redirigir inmediatamente al Login
        void this.router.navigate(['/login'], {
          replaceUrl: true,
        });
      }),
    );
  }

  // LIMPIAR ESTADO LOCAL
  clearLocalSession(): void {
    this._currentUser.set(null);
    this._initialized.set(true);
  }
}
