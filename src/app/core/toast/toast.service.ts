import { Injectable, inject, signal, computed } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppToastSeverity, TOAST_DEFAULTS } from './toast.model';

export interface ToastLogEntry {
  summary: string;
  detail?: string;
  severity: AppToastSeverity;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AppToastService {
  private readonly messageService = inject(MessageService);
  private readonly defaults = inject(TOAST_DEFAULTS);

  private readonly _history = signal<ToastLogEntry[]>([]);
  readonly history = this._history.asReadonly();
  readonly historyCount = computed(() => this._history().length);

  notify(summary: string, severity: AppToastSeverity = 'info', detail?: string): void {
    const isCritical = severity === 'error';

    this.messageService.add({
      key: isCritical ? 'critical' : 'standard',
      severity,
      summary,
      detail,
      life: this.defaults.lifeMs,
      sticky: isCritical && this.defaults.stickyErrors,
    });

    this._history.update((items) => [
      { summary, detail, severity, timestamp: new Date() },
      ...items,
    ]);
  }

  clearAll(): void {
    this.messageService.clear();
  }
}
