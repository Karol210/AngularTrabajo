import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsState = signal<Product[]>([]);
  private loadingState = signal(false);
  
  products = this.productsState.asReadonly();
  loading = this.loadingState.asReadonly();

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingState.set(true);
    
    // Simulación de llamada HTTP - reemplazar con servicio real
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

  getProductById(id: string): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  getFeaturedProducts(): Product[] {
    return this.productsState().filter(p => p.featured);
  }
}

