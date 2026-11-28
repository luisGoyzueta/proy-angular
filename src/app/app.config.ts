import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/interceptors/api-error-interceptor';

import { credentialsInterceptor } from './core/interceptors/credentials-interceptor';
import { sessionInterceptor } from './core/interceptors/session-interceptor';
import { SESSION_CLEANUP_HANDLER } from './core/tokens/session-cleanup.token';
import { UserStore } from './features/users/store/user-store';
import { ProductStore } from './features/products/store/product-store';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
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
    {
      provide: SESSION_CLEANUP_HANDLER,
      useExisting: UserStore,
      multi: true,
    },
    {
      provide: SESSION_CLEANUP_HANDLER,
      useExisting: ProductStore,
      multi: true,
    },
  ],
};
