import { Component, HostListener, OnInit, inject, input, output, signal } from '@angular/core';
import { FocusTrapDirective } from '../../../directive/focus-trap.directive';
import { UserEditStore, UserDraft, UserRole } from './../store/user-edit.store';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FocusTrapDirective],
  providers: [UserEditStore],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit {
  readonly user = input.required<UserDraft>();
  readonly saved = output<UserDraft>();
  readonly closed = output<void>();

  readonly store = inject(UserEditStore);
  readonly confirmDiscard = signal<boolean>(false);

  ngOnInit(): void {
    this.store.init(this.user());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.attemptClose();
  }

  showNameError(): boolean {
    return (this.store.submitted() || this.store.isDirty()) && this.store.nameError() !== null;
  }

  onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.updateName(value);
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as UserRole;
    this.store.updateRole(value);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.attemptClose();
    }
  }

  attemptClose(): void {
    if (this.store.isDirty() && !this.confirmDiscard()) {
      this.confirmDiscard.set(true);
      return;
    }
    this.closed.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.store.markSubmitted();

    if (!this.store.isValid()) {
      return;
    }

    this.saved.emit(this.store.draft());
  }
}
