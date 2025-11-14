import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

/**
 * Estadística del dashboard.
 */
interface DashboardStat {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

/**
 * Componente principal del dashboard administrativo.
 * Muestra estadísticas generales del sistema incluyendo usuarios registrados.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  
  /** Usuario administrador actual */
  readonly adminUser = this.authService.adminUser;
  
  /** Nombre de bienvenida del administrador */
  readonly welcomeName = computed(() => {
    const user = this.adminUser();
    return user?.username || 'Administrador';
  });
  
  /** Total de usuarios en el sistema */
  private readonly totalUsers = signal<number>(0);
  
  /** Estadísticas principales del dashboard */
  readonly stats = computed<DashboardStat[]>(() => [
    {
      title: 'Total Productos',
      value: '24',
      icon: 'pi-box',
      color: 'var(--blue-main)',
      bgColor: 'var(--blue-extralight)'
    },
    {
      title: 'Total Usuarios',
      value: this.totalUsers().toString(),
      icon: 'pi-users',
      color: 'var(--green-main)',
      bgColor: 'var(--green-extralight)'
    },
    {
      title: 'Ventas del Mes',
      value: '$45M',
      icon: 'pi-chart-line',
      color: 'var(--orange-main)',
      bgColor: 'var(--orange-extralight)'
    }
  ]);

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga el total de usuarios desde el backend.
   */
  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (!response.failure && response.body) {
          this.totalUsers.set(response.body.length);
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }
}

