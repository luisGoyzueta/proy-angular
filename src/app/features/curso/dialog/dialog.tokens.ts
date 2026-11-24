import { InjectionToken } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');

export class DialogRef<R = unknown> {
  private readonly afterClosed$ = new Subject<R | undefined>();
  private triggerElement: HTMLElement | null = null;

  constructor(trigger?: HTMLElement) {
    this.triggerElement = trigger || (document.activeElement as HTMLElement);
  }

  afterClosed(): Observable<R | undefined> {
    return this.afterClosed$.asObservable();
  }

  close(result?: R): void {
    this.afterClosed$.next(result);
    this.afterClosed$.complete();

    if (this.triggerElement) {
      this.triggerElement.focus();
      this.triggerElement = null;
    }
  }
}
