import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './confirm-modal/modal.service';
import { ConfirmModal } from './confirm-modal/confirm-modal';
import { SettingsModal } from './settings-modal/settings-modal';
import { DialogService } from './dialog/dialog.service';
import { DialogComponent, EditProfileData } from './dialog/dialog';
//import { FeeRulesMaintenanceComponent } from './fee-rules-maintenance/fee-rules-maintenance.component';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, ConfirmModal, SettingsModal],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class Curso {
  /**
   * TODO: Implementar un modal de confirmación accesible con standalone e inject()
   * que permita abrir y cerrar el modal desde un botón de eliminar.
   * Al cerrar el modal, el foco debe regresar al botón que lo abrió.
   */
  readonly modalService = inject(ModalService);
  /* Fin */


  /**
   * TODO: Implementar un modal de Directiva Standalone de Focus Trap para Diálogos y Drawers
   * que permita abrir y cerrar el modal desde un botón de configuración.
   * Al cerrar el modal, el foco debe regresar al botón que lo abrió.
   * Se debe usar signal() para controlar la visibilidad del modal.
   * Se debe usar @HostListener('document:keydown.escape') para cerrar el modal con la tecla Escape.
   */
  readonly modalVisible = signal(false);
  private settingsTrigger?: HTMLElement;

  openModal(trigger?: HTMLElement): void {
    this.settingsTrigger = trigger;
    this.modalVisible.set(true);
  }

  closeModal(): void {
    this.modalVisible.set(false);
    this.settingsTrigger?.focus();
  }
  /* Fin */


  /**
   * TODO: Implementar un servicio de diálogos dinámicos con InjectionToken y Standalone
   * para abrir el componente DialogComponent y pasarle datos dinámicos.
   * El servicio debe retornar un DialogRef que permita suscribirse al evento afterClosed()
   * para obtener los datos actualizados del usuario.
   */
  private readonly dialogService = inject(DialogService);

  openEdit(trigger: HTMLElement): void {
    const dialogRef = this.dialogService.open<DialogComponent, EditProfileData, EditProfileData>(
      DialogComponent,
      {
        data: { userName: 'lgoyzueta', role: 'Lead Product Designer' },
        triggerElement: trigger,
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos actualizados:', result);
      }
    });
  }
  /* Fin */
}
