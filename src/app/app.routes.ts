import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest.guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canActivate: [permissionGuard],
        data: { permission: 'dashboard.view' },
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        canActivate: [permissionGuard],
        data: { permission: 'users.view' },
        loadComponent: () => import('./features/users/users').then((m) => m.Users),
      },
      {
        path: 'settings',
        canActivate: [permissionGuard],
        data: { permission: 'settings.view' },
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'products',
        canActivate: [permissionGuard],
        data: { permission: 'products.view' },
        loadComponent: () => import('./features/products/products').then((m) => m.Products),
      },
      {
        path: 'forbidden',
        loadComponent: () => import('./features/forbidden/forbidden').then((m) => m.Forbidden),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
