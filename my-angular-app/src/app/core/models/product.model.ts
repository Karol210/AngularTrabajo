/**
 * Interfaz de producto para uso interno en la aplicación.
 * Se mapea desde ProductResponse del backend.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  categoryDescription: string;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  imageUrl?: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

