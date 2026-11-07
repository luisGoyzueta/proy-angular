import { Component, computed, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionService } from '../../core/services/permission';
import { Permission } from '../../core/models/permission.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission?: Permission;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly navigate = output<void>();
  readonly permissions = inject(PermissionService);
  readonly menuItems: readonly MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      permission: 'dashboard.view',
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      route: '/users',
      permission: 'users.view',
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/settings',
      permission: 'settings.view',
    },
  ];

  readonly visibleMenuItems = computed(() =>
    this.menuItems.filter((item) => !item.permission || this.permissions.has(item.permission)),
  );
}
