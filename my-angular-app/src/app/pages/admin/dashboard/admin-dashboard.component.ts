import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';

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
 * Muestra estadísticas generales del sistema.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  /** Estadísticas principales del dashboard */
  readonly stats = signal<DashboardStat[]>([
    {
      title: 'Total Productos',
      value: '24',
      icon: 'pi-box',
      color: 'var(--blue-main)',
      bgColor: 'var(--blue-extralight)'
    },
    {
      title: 'Pedidos Hoy',
      value: '12',
      icon: 'pi-shopping-bag',
      color: 'var(--green-main)',
      bgColor: 'var(--green-extralight)'
    },
    {
      title: 'Ventas del Mes',
      value: '$45M',
      icon: 'pi-chart-line',
      color: 'var(--orange-main)',
      bgColor: 'var(--orange-extralight)'
    },
    {
      title: 'Usuarios Activos',
      value: '156',
      icon: 'pi-users',
      color: 'var(--violet-main)',
      bgColor: 'var(--violet-extralight)'
    }
  ]);
}

