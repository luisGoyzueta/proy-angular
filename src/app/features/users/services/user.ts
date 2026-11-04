import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { User, UserFormValue } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // GET: Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET: Obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }

  // POST: Registrar usuario
  createUser(user: UserFormValue): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT: Actualizar usuario
  updateUser(id: string, user: UserFormValue): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${encodeURIComponent(id)}`, user);
  }

  // DELETE: Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
