import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'users',
                title: 'Usuarios',
                loadComponent: () => import('./features/users/users').then((m) => m.Users),
            },
            {
                path: 'settings',
                title: 'Configuración',
                loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
