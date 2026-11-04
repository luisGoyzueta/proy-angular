import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  navigate = output<void>();

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      route: '/users'
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/settings'
    }
  ];
}