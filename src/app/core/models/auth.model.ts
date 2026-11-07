export type AuthRole = 'Administrador' | 'Editor' | 'Usuario';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  status: 'Activo' | 'Inactivo';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}
