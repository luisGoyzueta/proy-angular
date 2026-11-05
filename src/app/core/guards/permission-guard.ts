import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PermissionService } from '../services/permission';
import { Permission } from '../models/permission.model';

export const permissionGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const requiredPermission = route.data['permission'] as Permission | undefined;

  if (!requiredPermission) {
    return router.createUrlTree(['/dashboard']);
  }

  if (permissionService.has(requiredPermission)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
