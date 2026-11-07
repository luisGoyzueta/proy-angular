import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '../services/auth';
import { PermissionService } from '../services/permission';
import { Permission } from '../models/permission.model';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as Permission | undefined;

  return authService.initialize().pipe(
    map((authenticated) => {
      if (!authenticated) {
        return router.createUrlTree(['/login'], {
          queryParams: {
            returnUrl: state.url,
          },
        });
      }

      if (requiredPermission && permissionService.has(requiredPermission)) {
        return true;
      }

      return router.createUrlTree(['/forbidden']);
    }),
  );
};
