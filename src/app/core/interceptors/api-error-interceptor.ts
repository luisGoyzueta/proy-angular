import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado.';

      if (error.status === 0) {
        message = 'No se pudo conectar con el servidor.';
      } else if (error.status === 400) {
        message = 'La solicitud contiene datos incorrectos.';
      } else if (error.status === 401) {
        message = 'Debes iniciar sesión.';
      } else if (error.status === 403) {
        message = 'No tienes permisos para esta operación.';
      } else if (error.status === 404) {
        message = 'El recurso solicitado no existe.';
      } else if (error.status === 409) {
        message = 'Existe un conflicto con los datos enviados.';
      } else if (error.status >= 500) {
        message = 'El servidor presenta un problema interno.';
      }

      console.error('[HTTP ERROR]', {
        url: req.url,
        method: req.method,
        status: error.status,
        message,
      });

      return throwError(() => error);
    }),
  );
};
