import type { AuthRole } from "../auth/auth.types.js";

export type Permission =
  | 'dashboard.view'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'settings.view'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete';

export const ROLE_PERMISSIONS: Record<AuthRole, readonly Permission[]> = {
  Administrador: [
    'dashboard.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'settings.view',
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
  ],

  Editor: ['dashboard.view', 'users.view', 'users.edit', 'products.view', 'products.edit'],

  Usuario: ['dashboard.view', 'products.view'],
};
