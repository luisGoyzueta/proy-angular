import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusTrapDirective } from '../../../directive/focus-trap.directive';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.scss',
  host: {
    '(keydown.escape)': 'onEscape($event)',
  },
})
export class SettingsModal {
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  onEscape(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  save(event: Event): void {
    event.preventDefault();
    this.close();
  }
}
