import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEdit } from './user-edit';

describe('UserEdit', () => {
  let component: UserEdit;
  let fixture: ComponentFixture<UserEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEdit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', { name: 'Ana García', role: 'Usuario' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close when clicking directly on the backdrop and not when clicking inside the modal card', () => {
    let closedCount = 0;
    component.closed.subscribe(() => {
      closedCount++;
    });

    const modalCard = fixture.nativeElement.querySelector('.modal-card') as HTMLElement;
    modalCard.click();
    expect(closedCount).toBe(0);

    const backdrop = fixture.nativeElement.querySelector('.backdrop') as HTMLElement;
    backdrop.click();
    expect(closedCount).toBe(1);
  });

  it('should prompt before discarding dirty changes on Escape', () => {
    const nameInput = fixture.nativeElement.querySelector('#member-name') as HTMLInputElement;
    nameInput.value = 'Ana Modificada';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.confirmDiscard()).toBe(true);
    expect(fixture.nativeElement.querySelector('.discard-banner')).toBeTruthy();
  });
});
