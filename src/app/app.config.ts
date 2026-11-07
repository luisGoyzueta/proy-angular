import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/interceptors/api-error-interceptor';

import { credentialsInterceptor } from './core/interceptors/credentials-interceptor';
import { sessionInterceptor } from './core/interceptors/session-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiErrorInterceptor, credentialsInterceptor, sessionInterceptor]),
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
      ripple: true,
    }),
  ],
};
