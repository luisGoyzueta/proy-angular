import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { SessionCleanupService } from './session-cleanup';
import { SESSION_CLEANUP_HANDLER, SessionCleanupHandler } from '../tokens/session-cleanup.token';

describe('SessionCleanupService', () => {
  it('debe ejecutar cleanup en todos los handlers registrados', () => {
    const handler1: SessionCleanupHandler = { cleanup: vi.fn() };
    const handler2: SessionCleanupHandler = { cleanup: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        SessionCleanupService,
        { provide: SESSION_CLEANUP_HANDLER, useValue: handler1, multi: true },
        { provide: SESSION_CLEANUP_HANDLER, useValue: handler2, multi: true },
      ],
    });

    const service = TestBed.inject(SessionCleanupService);
    service.clear();

    expect(handler1.cleanup).toHaveBeenCalledOnce();
    expect(handler2.cleanup).toHaveBeenCalledOnce();
  });

  it('no debe fallar si no hay handlers registrados', () => {
    TestBed.configureTestingModule({
      providers: [SessionCleanupService],
    });

    const service = TestBed.inject(SessionCleanupService);
    expect(() => service.clear()).not.toThrow();
  });
});
