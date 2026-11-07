import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'p-chart[appAccessibleChart]',
  standalone: true,
})
export class AccessibleChart implements AfterViewInit {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly chartLabel = input('Gráfico de evolución de datos');

  ngAfterViewInit(): void {
    const canvas = this.element.nativeElement.querySelector('canvas');

    if (canvas) {
      canvas.setAttribute('aria-label', this.chartLabel());
    }
  }
}
