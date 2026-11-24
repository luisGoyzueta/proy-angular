import {
  Injectable,
  Type,
  Injector,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from './dialog.tokens';

export interface DialogConfig<D = unknown> {
  data?: D;
  triggerElement?: HTMLElement;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  open<T, D = unknown, R = unknown>(component: Type<T>, config?: DialogConfig<D>): DialogRef<R> {
    const dialogRef = new DialogRef<R>(config?.triggerElement);

    // Crear un inyector local que provee DIALOG_DATA y DialogRef específicamente para este diálogo
    const customInjector = Injector.create({
      providers: [
        { provide: DIALOG_DATA, useValue: config?.data },
        { provide: DialogRef, useValue: dialogRef },
      ],
      parent: this.envInjector,
    });

    // Instanciar el componente standalone pasando el inyector personalizado
    const componentRef = createComponent(component, {
      environmentInjector: this.envInjector,
      elementInjector: customInjector,
    });

    // Adjuntar la vista al árbol de detección de cambios y al DOM raíz
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);

    // Suscribirse al cierre para limpiar el DOM y destruir el componente
    dialogRef.afterClosed().subscribe(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return dialogRef;
  }
}
