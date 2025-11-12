import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

/**
 * Servicio para gestionar productos de la tienda.
 * Proporciona signals reactivos y métodos para consultar productos.
 * 
 * @todo Reemplazar mock data con llamadas HTTP reales al backend
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsState = signal<Product[]>([]);
  private readonly loadingState = signal(false);
  
  /** Signal reactivo con la lista de productos */
  readonly products = this.productsState.asReadonly();
  
  /** Signal reactivo que indica si los productos están cargando */
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.loadProducts();
  }

  /**
   * Carga los productos desde el backend.
   * Actualmente usa datos mock simulando un delay de red.
   */
  private loadProducts(): void {
    this.loadingState.set(true);
    
    // Simulación de llamada HTTP con delay
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Laptop HP Pavilion',
          description: 'Laptop HP Pavilion 15.6" Intel Core i5 8GB RAM 512GB SSD',
          price: 2500000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Laptop',
          category: 'Tecnología',
          stock: 15,
          featured: true
        },
        {
          id: '2',
          name: 'iPhone 15 Pro',
          description: 'iPhone 15 Pro 256GB - Titanio Azul',
          price: 4800000,
          imageUrl: 'https://via.placeholder.com/300x300?text=iPhone',
          category: 'Tecnología',
          stock: 8,
          featured: true
        },
        {
          id: '3',
          name: 'Samsung Galaxy Watch',
          description: 'Samsung Galaxy Watch 6 - Smartwatch con GPS',
          price: 890000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Watch',
          category: 'Accesorios',
          stock: 25,
          featured: false
        },
        {
          id: '4',
          name: 'Auriculares Sony',
          description: 'Sony WH-1000XM5 - Cancelación de ruido',
          price: 1200000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
          category: 'Audio',
          stock: 12,
          featured: true
        }
      ];

      this.productsState.set(mockProducts);
      this.loadingState.set(false);
    }, 1000);
  }

  /**
   * Busca un producto por su ID.
   * @param id - ID del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductById(id: string): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  /**
   * Obtiene solo los productos destacados.
   * @returns Array de productos con featured = true
   */
  getFeaturedProducts(): Product[] {
    return this.productsState().filter(p => p.featured);
  }
}

