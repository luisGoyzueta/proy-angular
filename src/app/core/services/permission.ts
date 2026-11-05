import { Injectable, computed, inject } from '@angular/core';

import { AuthService } from './auth';
import { Permission } from '../models/permission.model';
import { ROLE_PERMISSIONS } from '../config/role-permissions';

@Injectable({
  providedIn: 'root',
})

export class PermissionService {
  private readonly authService = inject(AuthService);
  readonly permissions = computed<readonly Permission[]>(() => {
    const user = this.authService.currentUser();

    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] ?? [];
  });

  has(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }

  hasAny(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.has(permission));
  }

  hasAll(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.has(permission));
  }
}
