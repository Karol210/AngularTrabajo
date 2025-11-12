import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

/**
 * Componente principal del landing page.
 * Muestra productos destacados y permite agregarlos al carrito.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    SkeletonModule,
    ToastModule,
    HeaderComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  /** Signal reactivo con la lista de productos */
  readonly products = this.productService.products;
  
  /** Signal reactivo que indica si los productos están cargando */
  readonly loading = this.productService.loading;

  /**
   * Agrega un producto al carrito y muestra notificación de éxito.
   * @param product - Producto a agregar al carrito
   */
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${product.name} agregado al carrito`,
      life: 3000
    });
  }

  /**
   * Formatea un precio numérico al formato de moneda colombiana (COP).
   * @param price - Precio a formatear
   * @returns Precio formateado (ej: "$ 2.500.000")
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}

