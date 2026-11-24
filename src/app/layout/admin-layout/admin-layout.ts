import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdminLayout {
  sidebarOpen = signal(false);
  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }
  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
