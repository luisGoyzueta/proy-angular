import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FocusTrapDirective } from './focus-trap.directive';

@Component({
  standalone: true,
  imports: [FocusTrapDirective],
  template: `
    <div appFocusTrap id="trapContainer">
      <button id="btn1">Botón 1</button>
      <input id="input1" type="text" />
      <button id="btn2">Botón 2</button>
    </div>
  `,
})
class TestHostComponent {}

describe('FocusTrapDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  it('debe enfocar el primer elemento interactivo al inicializarse', () => {
    const btn1 = fixture.nativeElement.querySelector('#btn1') as HTMLElement;
    expect(document.activeElement).toBe(btn1);
  });

  it('debe envolver el foco al primer elemento al presionar Tab en el último elemento', () => {
    const btn1 = fixture.nativeElement.querySelector('#btn1') as HTMLElement;
    const btn2 = fixture.nativeElement.querySelector('#btn2') as HTMLElement;

    btn2.focus();
    expect(document.activeElement).toBe(btn2);

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    btn2.dispatchEvent(event);

    expect(document.activeElement).toBe(btn1);
  });

  it('debe envolver el foco al último elemento al presionar Shift+Tab en el primer elemento', () => {
    const btn1 = fixture.nativeElement.querySelector('#btn1') as HTMLElement;
    const btn2 = fixture.nativeElement.querySelector('#btn2') as HTMLElement;

    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    btn1.dispatchEvent(event);

    expect(document.activeElement).toBe(btn2);
  });
});
