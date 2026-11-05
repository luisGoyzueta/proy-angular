import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';


@Component({
  selector: 'app-header',
  imports: [ButtonModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuClick = output<void>();

  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
