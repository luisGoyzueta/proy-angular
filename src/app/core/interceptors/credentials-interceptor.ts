import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo enviar credenciales a nuestra propia API.
  const apiBase = new URL(environment.apiUrl);
  const requestUrl = new URL(req.url, apiBase);

  const belongsToApi =
    requestUrl.origin === apiBase.origin &&
    requestUrl.pathname.startsWith(apiBase.pathname.replace(/\/$/, '') + '/');

  if (!belongsToApi) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true,
    }),
  );
};
