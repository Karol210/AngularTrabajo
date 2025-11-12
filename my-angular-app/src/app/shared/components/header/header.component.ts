import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../../core/services/cart.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, BadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  cartItemsCount = this.cartService.totalItems;

  navigateToLogin(): void {
    // Por ahora solo mostrar mensaje - implementar modal de login después
    console.log('Iniciar sesión');
  }

  navigateToCart(): void {
    // Navegar al carrito - implementar después
    console.log('Ver carrito');
  }
}

