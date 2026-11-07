import { Injectable, inject } from '@angular/core';
import { UserStore } from '../../features/users/store/user-store';

@Injectable({
  providedIn: 'root',
})
export class SessionCleanupService {
  private readonly userStore = inject(UserStore);

  clear(): void {
    this.userStore.reset();
  }
}
