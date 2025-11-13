import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

/**
 * Componente del header principal de la aplicación.
 * Contiene logo, botón de login y carrito de compras.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, MenuModule, AuthModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  /** Referencia al modal de autenticación */
  authModal = viewChild.required(AuthModalComponent);

  /** Número total de items en el carrito */
  readonly cartItemsCount = this.cartService.totalItems;

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
   * Navega a la página del carrito de compras.
   * @todo Implementar página de carrito
   */
  navigateToCart(): void {
    console.log('Ver carrito');
  }
}

