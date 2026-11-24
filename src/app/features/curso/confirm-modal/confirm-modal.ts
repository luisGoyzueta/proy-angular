import { Component, ElementRef, HostListener, viewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  template: `
    @if (modalService.isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div
          #dialogContainer
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          tabindex="-1"
          (click)="$event.stopPropagation()" >
          <h2 id="modal-title" class="title">Eliminar componente</h2>
          <p id="modal-desc" class="description">
            Esta acción no se puede deshacer. ¿Deseas eliminar el elemento seleccionado?
          </p>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="modalService.close()">
              Cancelar
            </button>
            <button #confirmBtn type="button" class="btn-danger" (click)="confirm()">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  readonly modalService = inject(ModalService);
  //version antigua de angular
  // @ViewChild('confirmBtn') confirmButton?: ElementRef<HTMLButtonElement>;

  readonly confirmButton = viewChild<ElementRef<HTMLButtonElement>>('confirmBtn');

  constructor() {
    effect(() => {
      if (this.modalService.isOpen()) {
        //setTimeout(() => this.confirmButton?.nativeElement.focus(), 0);
        setTimeout(() => this.confirmButton()?.nativeElement.focus(), 0);
      }
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.modalService.isOpen()) {
      this.modalService.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.modalService.close();
    }
  }

  confirm(): void {
    // Lógica de confirmación
    this.modalService.close();
  }
}
