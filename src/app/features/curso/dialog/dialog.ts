import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from './dialog.tokens';
import { FocusTrapDirective } from '../../../directive/focus-trap.directive';

export interface EditProfileData {
  userName: string;
  role: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})

export class DialogComponent {
  readonly data = inject(DIALOG_DATA) as EditProfileData;
  readonly dialogRef = inject(DialogRef<EditProfileData>);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cancel();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(newName: string, newRole: string): void {
    this.dialogRef.close({
      userName: newName,
      role: newRole,
    });
  }
}


