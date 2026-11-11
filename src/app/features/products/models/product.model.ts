export type ProductStatus = 'Activo' | 'Inactivo';

export interface Product {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
}

export type ProductFormValue = Omit<Product, 'id'>;
