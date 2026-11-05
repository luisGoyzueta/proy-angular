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

  // login(email: string, password: string): boolean {
  //   // Credenciales ficticias, solo para practicar
  //   if (email.trim().toLowerCase() !== 'admin@demo.com' || password !== 'Admin123!') {
  //     return false;
  //   }

  //   const user: AuthUser = {
  //     id: 'demo-admin',
  //     name: 'Administrador Demo',
  //     email: 'admin@demo.com',
  //     role: 'Administrador',
  //   };

  //   this._currentUser.set(user);
  //   sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
  //   return true;
  // }

  login(email: string, password: string): boolean {
    const demoAccounts: Array<{
      email: string;
      password: string;
      user: AuthUser;
    }> = [
      {
        email: 'admin@demo.com',
        password: 'Admin123!',
        user: {
          id: 'demo-admin',
          name: 'Administrador Demo',
          email: 'admin@demo.com',
          role: 'Administrador',
        },
      },
      {
        email: 'editor@demo.com',
        password: 'Editor123!',
        user: {
          id: 'demo-editor',
          name: 'Editor Demo',
          email: 'editor@demo.com',
          role: 'Editor',
        },
      },
      {
        email: 'usuario@demo.com',
        password: 'Usuario123!',
        user: {
          id: 'demo-user',
          name: 'Usuario Demo',
          email: 'usuario@demo.com',
          role: 'Usuario',
        },
      },
    ];

    const account = demoAccounts.find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password,
    );

    if (!account) return false;
    this._currentUser.set(account.user);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(account.user));
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
      const demoUsers: AuthUser[] = [
        {
          id: 'demo-admin',
          name: 'Administrador Demo',
          email: 'admin@demo.com',
          role: 'Administrador',
        },
        {
          id: 'demo-editor',
          name: 'Editor Demo',
          email: 'editor@demo.com',
          role: 'Editor',
        },
        {
          id: 'demo-user',
          name: 'Usuario Demo',
          email: 'usuario@demo.com',
          role: 'Usuario',
        },
      ];

      return (
        demoUsers.find(
          (user) =>
            user.id === (parsed as AuthUser).id &&
            user.email === (parsed as AuthUser).email &&
            user.name === (parsed as AuthUser).name &&
            user.role === (parsed as AuthUser).role,
        ) ?? null
      );
    } catch {
      return null;
    }
  }
}
