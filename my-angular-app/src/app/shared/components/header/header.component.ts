import { Component, inject, viewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { delay, switchMap, Subject, debounceTime } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { CartItem } from '../../../core/models/product.model';

/**
 * Componente del header principal de la aplicación.
 * Contiene logo, botón de login y carrito de compras.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    BadgeModule, 
    MenuModule, 
    OverlayPanelModule,
    InputNumberModule,
    FormsModule,
    AuthModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  /** Referencia al modal de autenticación */
  authModal = viewChild.required(AuthModalComponent);

  /** Referencia al panel del carrito */
  cartPanel = viewChild.required<OverlayPanel>('cartPanel');

  /** Número total de items en el carrito */
  readonly cartItemsCount = this.cartService.totalItems;

  /** Items del carrito */
  readonly cartItems = this.cartService.cartItems;

  /** Precio total del carrito */
  readonly totalPrice = this.cartService.totalPrice;

  /** Nombre del usuario autenticado */
  readonly currentUser = this.authService.currentUser;

  /** Indica si hay un usuario autenticado */
  readonly isAuthenticated = this.authService.isUserAuthenticated;

  /** Subject para manejar cambios de cantidad con debounce */
  private quantityChange$ = new Subject<{ productId: number; quantity: number }>();

  constructor() {
    // Suscribirse a los cambios de cantidad con debounce
    this.quantityChange$.pipe(
      debounceTime(800) // Espera 800ms después del último cambio
    ).subscribe(({ productId, quantity }) => {
      this.executeUpdateQuantity(productId, quantity);
    });
  }

  ngOnDestroy(): void {
    this.quantityChange$.complete();
  }

  /**
   * Abre el modal de autenticación.
   */
  navigateToLogin(): void {
    this.authModal().show();
  }

  /**
   * Cierra sesión del usuario y limpia el carrito.
   */
  logout(): void {
    this.authService.userLogout();
    this.cartService.clearCart();
  }

  /**
   * Muestra el panel del carrito de compras.
   * Si el usuario no está autenticado, muestra el modal de login.
   */
  toggleCartPanel(event: Event): void {
    if (!this.isAuthenticated()) {
      this.authModal().show();
      return;
    }
    this.cartPanel().toggle(event);
  }

  /**
   * Elimina un producto del carrito.
   * Encadena: delete → delay 1s → summary
   */
  removeFromCart(productId: number): void {
    // Encadenar: removeFromCart → delay → getCartSummary
    this.cartService.removeFromCart(productId).pipe(
      delay(1000), // Espera 1 segundo después de eliminar
      switchMap(() => this.cartService.getCartSummary()) // Luego obtiene el resumen
    ).subscribe({
      next: (summaryResponse) => {
        // Actualiza el estado del carrito
        this.cartService.updateCartState(summaryResponse.body);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }

  /**
   * Emite un cambio de cantidad al Subject para procesar con debounce.
   * Evita llamados excesivos mientras el usuario está cambiando la cantidad.
   */
  updateQuantity(productId: number, quantity: number): void {
    this.quantityChange$.next({ productId, quantity });
  }

  /**
   * Ejecuta la actualización de cantidad en el backend.
   * Encadena: add → delay 1s → summary
   */
  private executeUpdateQuantity(productId: number, quantity: number): void {
    // Encadenar: updateQuantity → delay → getCartSummary
    this.cartService.updateQuantity(productId, quantity).pipe(
      delay(1000), // Espera 1 segundo después de actualizar
      switchMap(() => this.cartService.getCartSummary()) // Luego obtiene el resumen
    ).subscribe({
      next: (summaryResponse) => {
        // Actualiza el estado del carrito
        this.cartService.updateCartState(summaryResponse.body);
      },
      error: (error) => {
        console.error('Error al actualizar cantidad:', error);
      }
    });
  }

  /**
   * Formatea el precio en pesos colombianos.
   */
  formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Procede a la compra.
   * @todo Implementar modal de compra
   */
  proceedToCheckout(): void {
    console.log('Proceder a compra - Modal pendiente');
    this.cartPanel().hide();
  }
}

