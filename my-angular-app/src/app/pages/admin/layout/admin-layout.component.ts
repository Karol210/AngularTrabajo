import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Layout principal del área de administración.
 * Contiene sidebar con navegación y área de contenido.
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuModule,
    AvatarModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);

  /** Usuario administrador actual */
  readonly adminUser = this.authService.adminUser;

  /** Items del menú de navegación */
  readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/admin/dashboard']
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      routerLink: ['/admin/products']
    },
    {
      label: 'Pedidos',
      icon: 'pi pi-shopping-bag',
      routerLink: ['/admin/orders']
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  /**
   * Cierra la sesión del administrador y redirige al login.
   */
  logout(): void {
    this.authService.adminLogout();
  }
}

