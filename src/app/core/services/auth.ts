import { Injectable, computed, signal } from '@angular/core';

export type AuthRole = 'Administrador' | 'Editor' | 'Usuario';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionKey = 'demo_auth_user';
  private readonly _currentUser = signal<AuthUser | null>(this.restoreSession());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Administrador');

  login(email: string, password: string): boolean {
    // Credenciales ficticias, solo para practicar
    if (email.trim().toLowerCase() !== 'admin@demo.com' || password !== 'Admin123!') {
      return false;
    }

    const user: AuthUser = {
      id: 'demo-admin',
      name: 'Administrador Demo',
      email: 'admin@demo.com',
      role: 'Administrador',
    };

    this._currentUser.set(user);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    sessionStorage.removeItem(this.sessionKey);
  }

  private restoreSession(): AuthUser | null {
    try {
      const stored = sessionStorage.getItem(this.sessionKey);
      if (!stored) return null;
      const parsed: unknown = JSON.parse(stored);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('id' in parsed) ||
        !('name' in parsed) ||
        !('email' in parsed) ||
        !('role' in parsed)
      ) {
        return null;
      }

      // Validar los datos de la sesión
      const user = parsed as Record<string, unknown>;
      if (
        user['id'] !== 'demo-admin' ||
        user['name'] !== 'Administrador Demo' ||
        user['email'] !== 'admin@demo.com' ||
        user['role'] !== 'Administrador'
      ) {
        return null;
      }

      //return user as unknown as AuthUser;
      return {
        id: 'demo-admin',
        name: 'Administrador Demo',
        email: 'admin@demo.com',
        role: 'Administrador',
      };
    } catch {
      return null;
    }
  }
}
