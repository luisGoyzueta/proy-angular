import { Component, HostListener, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusTrapDirective } from '../../../directive/focus-trap.directive';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.scss',
})

export class SettingsModal {
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }

  save(event: Event): void {
    event.preventDefault();
    this.close();
  }
}
