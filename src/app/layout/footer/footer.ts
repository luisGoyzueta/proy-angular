import { Component, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AppToastService } from '../../core/toast/toast.service'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ToastModule, ButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly toast = inject(AppToastService);
}
