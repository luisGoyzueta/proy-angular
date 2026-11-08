export type AuthRole = "Administrador" | "Editor" | "Usuario";

export type AuthStatus = "Activo" | "Inactivo";

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: AuthRole;
  status: AuthStatus;
}

export type PublicAuthUser = Omit<AuthAccount, "password_hash">;
