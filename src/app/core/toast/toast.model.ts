import { InjectionToken } from '@angular/core';

export type AppToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastDefaults {
  lifeMs: number;
  stickyErrors: boolean;
}

export const TOAST_DEFAULTS = new InjectionToken<ToastDefaults>('TOAST_DEFAULTS', {
  providedIn: 'root',
  factory: () => ({
    lifeMs: 4000,
    stickyErrors: true,
  }),
});
