import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Product, ProductFormValue } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  // GET: Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // GET: Obtener un producto por ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }

  // POST: Registrar producto
  createProduct(product: ProductFormValue): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // PUT: Actualizar producto
  updateProduct(id: string, product: ProductFormValue): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${encodeURIComponent(id)}`, product);
  }

  // DELETE: Eliminar producto
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
