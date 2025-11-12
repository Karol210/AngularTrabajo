/**
 * Interfaz que representa la respuesta de un producto del backend.
 * Incluye información del producto y su categoría.
 */
export interface ProductResponse {
  id: number;
  categoryName: string;
  categoryDescription: string;
  name: string;
  description: string;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  active: boolean;
  imageUrl?: string; // Opcional, algunos productos pueden no tener imagen
}

