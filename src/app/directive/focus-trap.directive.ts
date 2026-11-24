import { Directive, ElementRef, HostListener, AfterViewInit, inject } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})

export class FocusTrapDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);

  // Cadena de selectores que cubren elementos navegables por teclado según WAI-ARIA
  private readonly focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  ngAfterViewInit(): void {
    this.focusFirstElement();
  }

  private getFocusableElements(): HTMLElement[] {
    const rawElements = this.host.nativeElement.querySelectorAll(this.focusableSelectors);
    // Filtrar elementos visibles en el layout (soporta navegadores reales, position: fixed y entornos JSDOM)
    return Array.from(rawElements).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        (el.offsetParent !== null || el.style.position === 'fixed' || (el.style.display !== 'none' && !el.hidden)),
    );
  }

  private focusFirstElement(): void {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Reversa: si estamos en el primero o fuera del contenedor, vamos al último
      if (activeElement === firstElement || !this.host.nativeElement.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Avance: si estamos en el último o fuera del contenedor, vamos al primero
      if (activeElement === lastElement || !this.host.nativeElement.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}
