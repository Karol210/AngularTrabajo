import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuModule,
    ButtonModule,
    AvatarModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  adminUser = this.authService.adminUser;

  menuItems: MenuItem[] = [
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

  logout(): void {
    this.authService.adminLogout();
  }
}

