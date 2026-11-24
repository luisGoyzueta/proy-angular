import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ModalService {
  private isOpenSignal = signal<boolean>(false);
  private triggerElement: HTMLElement | null = null;

  readonly isOpen = this.isOpenSignal.asReadonly();

  open(trigger?: HTMLElement): void {
    this.triggerElement = trigger || (document.activeElement as HTMLElement);
    this.isOpenSignal.set(true);
  }

  close(): void {
    this.isOpenSignal.set(false);
    if (this.triggerElement) {
      this.triggerElement.focus();
      this.triggerElement = null;
    }
  }
}
