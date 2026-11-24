import { Injectable, inject } from '@angular/core';
import { SESSION_CLEANUP_HANDLER, SessionCleanupHandler } from '../tokens/session-cleanup.token';

@Injectable({
  providedIn: 'root',
})
export class SessionCleanupService {
  private readonly handlers = inject(SESSION_CLEANUP_HANDLER, { optional: true }) ?? [];

  clear(): void {
    const handlerList: SessionCleanupHandler[] = Array.isArray(this.handlers)
      ? this.handlers
      : [this.handlers];

    for (const handler of handlerList) {
      if (handler && typeof handler.cleanup === 'function') {
        handler.cleanup();
      }
    }
  }
}
