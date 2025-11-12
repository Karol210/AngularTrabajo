import { Injectable, signal, computed } from '@angular/core';
import { StorageKeys } from '../enums/storage-keys.enum';
import { Product, CartItem } from '../models/product.model';

/**
 * Servicio para gestionar el carrito de compras del usuario.
 * Sincroniza automáticamente con localStorage y proporciona signals reactivos.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsState = signal<CartItem[]>([]);
  
  cartItems = this.cartItemsState.asReadonly();
  
  /**
   * Total de items en el carrito.
   * Se recalcula automáticamente cuando cambia cartItems.
   */
  totalItems = computed(() => 
    this.cartItemsState().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  /**
   * Precio total del carrito en pesos colombianos (COP).
   * Se recalcula automáticamente cuando cambia cartItems.
   */
  totalPrice = computed(() => 
    this.cartItemsState().reduce((sum, item) => sum + (item.product.totalPrice * item.quantity), 0)
  );

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartJson = localStorage.getItem(StorageKeys.CART_ITEMS);
    if (cartJson) {
      try {
        const items = JSON.parse(cartJson);
        this.cartItemsState.set(items);
      } catch (error) {
        this.clearCart();
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem(StorageKeys.CART_ITEMS, JSON.stringify(this.cartItemsState()));
  }

  /**
   * Agrega un producto al carrito o incrementa cantidad si ya existe.
   * Persiste cambios en localStorage automáticamente.
   * 
   * @param product - Producto a agregar
   * @param quantity - Cantidad a agregar (default: 1)
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsState();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItemsState.set(updatedItems);
    } else {
      this.cartItemsState.update(items => [...items, { product, quantity }]);
    }

    this.saveCartToStorage();
  }

  /**
   * Elimina un producto del carrito.
   * 
   * @param productId - ID del producto a eliminar
   */
  removeFromCart(productId: number): void {
    this.cartItemsState.update(items => items.filter(item => item.product.id !== productId));
    this.saveCartToStorage();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * Si la cantidad es 0 o menor, elimina el producto del carrito.
   * 
   * @param productId - ID del producto a actualizar
   * @param quantity - Nueva cantidad
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItemsState.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    this.saveCartToStorage();
  }

  /**
   * Limpia todos los productos del carrito.
   * Elimina los datos de localStorage.
   */
  clearCart(): void {
    this.cartItemsState.set([]);
    localStorage.removeItem(StorageKeys.CART_ITEMS);
  }
}

