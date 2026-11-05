import { AuthRole } from '../services/auth';
import { Permission } from '../models/permission.model';

export const ROLE_PERMISSIONS: Record<AuthRole, readonly Permission[]> = {
  Administrador: [
    'dashboard.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'settings.view',
  ],

  Editor: ['dashboard.view', 'users.view', 'users.edit'],

  Usuario: ['dashboard.view'],
};
