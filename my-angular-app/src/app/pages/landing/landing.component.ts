import { Component, inject, viewChild } from '@angular/core';
import { delay, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { Messages, MessageTitles } from '../../shared/constants/messages.constants';

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
    HeaderComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  /** Referencia al componente del header */
  headerComponent = viewChild.required(HeaderComponent);

  /** Signal reactivo con la lista de productos */
  readonly products = this.productService.products;
  
  /** Signal reactivo que indica si los productos están cargando */
  readonly loading = this.productService.loading;

  /**
   * Agrega un producto al carrito y muestra notificación de éxito.
   * Si el usuario no está autenticado, muestra el modal de login.
   * Encadena: add → delay 1s → summary
   * @param product - Producto a agregar al carrito
   */
  addToCart(product: Product): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isUserAuthenticated()) {
      this.headerComponent().navigateToLogin();
      return;
    }

    // Encadenar: addToCart → delay → getCartSummary
    this.cartService.addToCart(product, 1).pipe(
      delay(1000), // Espera 1 segundo después de agregar
      switchMap(() => this.cartService.getCartSummary()) // Luego obtiene el resumen
    ).subscribe({
      next: (summaryResponse) => {
        // Actualiza el estado del carrito
        this.cartService.updateCartState(summaryResponse.body);
        
        // Muestra notificación de éxito
        this.messageService.add({
          severity: 'success',
          summary: MessageTitles.SUCCESS,
          detail: `${product.name} ${Messages.SUCCESS.PRODUCT_ADDED}`,
          life: 3000
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: MessageTitles.ERROR,
          detail: Messages.ERROR.ADD_TO_CART_FAILED,
          life: 3000
        });
      }
    });
  }

  /**
   * Formatea un precio numérico al formato de moneda colombiana (COP).
   * @param price - Precio a formatear
   * @returns Precio formateado (ej: "$ 2.500.000")
   */
  formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}

