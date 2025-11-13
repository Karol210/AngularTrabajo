import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductResponse } from '../models/product-response';
import { ApiResponse } from '../models/api-response.model';
import { StorageKeys } from '../enums/storage-keys.enum';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar productos de la tienda.
 * Proporciona signals reactivos y métodos para consultar productos desde el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly productsState = signal<Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/products`;
  
  /** Signal reactivo con la lista de productos */
  readonly products = this.productsState.asReadonly();
  
  /** Signal reactivo que indica si los productos están cargando */
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.loadProducts();
  }

  /**
   * Genera los headers necesarios para las peticiones HTTP.
   * Incluye Content-Type y Authorization si existe token en sesión.
   * @returns HttpHeaders configurados
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem(StorageKeys.ADMIN_TOKEN);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Mapea un ProductResponse del backend a un Product para uso interno.
   * @param response - Respuesta del backend
   * @returns Producto mapeado para la aplicación
   */
  private mapProductResponseToProduct(response: ProductResponse): Product {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      categoryName: response.categoryName,
      categoryDescription: response.categoryDescription,
      unitPrice: response.unitPrice,
      taxRate: response.taxRate,
      taxAmount: response.taxAmount,
      totalPrice: response.totalPrice,
      imageUrl: response.imageUrl,
      active: response.active
    };
  }

  /**
   * Carga todos los productos desde el backend.
   * Actualiza el estado del signal con los productos obtenidos.
   */
  private loadProducts(): void {
    this.loadingState.set(true);
    
    this.listAllProducts().subscribe({
      next: (response) => {
        const products = response.body.map(pr => this.mapProductResponseToProduct(pr));
        this.productsState.set(products);
        this.loadingState.set(false);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.productsState.set([]);
        this.loadingState.set(false);
      }
    });
  }

  /**
   * Lista todos los productos activos del backend.
   * @returns Observable con la respuesta del backend
   */
  listAllProducts(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${this.baseUrl}/list-all`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en listAllProducts:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca un producto por su ID.
   * @param id - ID del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductById(id: number): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  /**
   * Busca un producto por su nombre.
   * @param name - Nombre del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductByName(name: string): Product | undefined {
    return this.productsState().find(p => p.name === name);
  }

  /**
   * Obtiene solo los productos activos.
   * @returns Array de productos con active = true
   */
  getActiveProducts(): Product[] {
    return this.productsState().filter(p => p.active);
  }

  /**
   * Filtra productos por categoría.
   * @param categoryName - Nombre de la categoría
   * @returns Array de productos de la categoría especificada
   */
  getProductsByCategory(categoryName: string): Product[] {
    return this.productsState().filter(p => p.categoryName === categoryName);
  }
}

