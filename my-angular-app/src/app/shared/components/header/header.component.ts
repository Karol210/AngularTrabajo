import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class HeaderComponent {
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

  /**
   * Abre el modal de autenticación.
   */
  navigateToLogin(): void {
    this.authModal().show();
  }

  /**
   * Cierra sesión del usuario.
   */
  logout(): void {
    this.authService.userLogout();
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
   */
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   */
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
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

