import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { SessionCleanupService } from '../services/session-cleanup';
import { environment } from '../../../environments/environment';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cleanup = inject(SessionCleanupService);
  const router = inject(Router);

  const apiUrl = environment.apiUrl.replace(/\/$/, '');
  const isApiRequest = req.url.startsWith(`${apiUrl}/`);
  const isLoginRequest = req.url === `${apiUrl}/auth/login`;
  const isSessionCheck = req.url === `${apiUrl}/auth/me`;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiRequest && error.status === 401 && !isLoginRequest && !isSessionCheck) {
        authService.clearLocalSession();
        cleanup.clear();

        const returnUrl = router.url;

        void router.navigate(['/login'], {
          queryParams: {
            returnUrl: returnUrl.startsWith('/login') ? '/dashboard' : returnUrl,
          },
        });
      }

      return throwError(() => error);
    }),
  );
};
