import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../../core/services/cart.service';

/**
 * Componente del header principal de la aplicación.
 * Contiene logo, botón de login y carrito de compras.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, BadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  /** Número total de items en el carrito */
  readonly cartItemsCount = this.cartService.totalItems;

  /**
   * Navega a la página de login de usuario.
   * @todo Implementar modal de login
   */
  navigateToLogin(): void {
    console.log('Iniciar sesión');
  }

  /**
   * Navega a la página del carrito de compras.
   * @todo Implementar página de carrito
   */
  navigateToCart(): void {
    console.log('Ver carrito');
  }
}

