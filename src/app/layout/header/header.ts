import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

import { SessionCleanupService } from '../../core/services/session-cleanup';


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
  private readonly cleanup = inject(SessionCleanupService);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.cleanup.clear();
        void this.router.navigate(['/login']);
      },
      error: () => {
        // La sesión remota podría seguir vigente.
        // No afirmamos que se haya cerrado correctamente.
        console.error('No se pudo cerrar la sesión.');

        // Aquí puedes mostrar un Toast de error
        // y permitir que el usuario vuelva a intentarlo.
      },
    });
  }
}
