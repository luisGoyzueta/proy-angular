import { InjectionToken } from '@angular/core';

export interface SessionCleanupHandler {
  cleanup(): void;
}

export const SESSION_CLEANUP_HANDLER = new InjectionToken<SessionCleanupHandler[]>(
  'SESSION_CLEANUP_HANDLER',
);
