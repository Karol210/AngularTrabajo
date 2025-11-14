import { Component, inject, signal, computed, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user-response';

/**
 * Componente de administración de usuarios.
 * Permite visualizar, editar y gestionar usuarios del sistema.
 * 
 * @todo Implementar modal para editar usuario
 * @todo Implementar modal para cambiar roles de usuario
 * @todo Implementar activar/desactivar usuario
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  
  /** Signal que contiene la lista de usuarios */
  readonly users = signal<UserResponse[]>([]);
  
  /** Signal que indica si los usuarios están cargando */
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga todos los usuarios desde el backend.
   */
  loadUsers(): void {
    this.loading.set(true);
    
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (!response.failure && response.body) {
          this.users.set(response.body);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading.set(false);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios. Intenta nuevamente.',
          life: 5000
        });
      }
    });
  }

  /**
   * Refresca la lista de usuarios forzando una nueva carga desde el backend.
   */
  refreshUsers(): void {
    this.loadUsers();
  }

  /**
   * Obtiene la clase CSS correspondiente al estado del usuario.
   * Usada para aplicar colores diferentes según el estado.
   * 
   * @param user - Usuario a evaluar
   * @returns Clase CSS: 'status-active' o 'status-inactive'
   */
  getStatusClass(user: UserResponse): string {
    return user.status === 'Activo' ? 'status-active' : 'status-inactive';
  }

  /**
   * Formatea el array de roles como string separado por comas.
   * 
   * @param roles - Array de roles del usuario
   * @returns String con roles separados por comas
   * 
   * @example
   * formatRoles(['Cliente', 'Administrador']) // "Cliente, Administrador"
   */
  formatRoles(roles: string[]): string {
    return roles.join(', ');
  }

  /**
   * Muestra los detalles completos del usuario.
   * 
   * @param user - Usuario a visualizar
   * 
   * @todo Implementar modal con información detallada del usuario
   */
  viewUser(user: UserResponse): void {
    alert(`Ver detalles de: ${user.nombre} ${user.apellido}\n\nID: ${user.usuarioId}\nEmail: ${user.email}\nRoles: ${this.formatRoles(user.roles)}`);
  }

  /**
   * Inicia el flujo de edición de un usuario existente.
   * 
   * @param user - Usuario a editar
   * 
   * @todo Implementar modal con formulario pre-cargado
   * @todo Conectar con endpoint PUT /api/v1/users/{id}
   */
  editUser(user: UserResponse): void {
    alert(`Editar usuario: ${user.nombre} ${user.apellido} (ID: ${user.usuarioId})`);
  }

  /**
   * Activa o desactiva un usuario después de confirmación.
   * 
   * @param user - Usuario a activar/desactivar
   * 
   * @todo Conectar con endpoint PATCH /api/v1/users/{id}/toggle
   */
  toggleUserStatus(user: UserResponse): void {
    const action = user.status === 'Activo' ? 'desactivar' : 'activar';
    const confirmToggle = confirm(
      `¿Deseas ${action} al usuario "${user.nombre} ${user.apellido}"?`
    );
    
    if (confirmToggle) {
      alert(`Usuario "${user.nombre} ${user.apellido}" ${action === 'activar' ? 'activado' : 'desactivado'} (simulado)`);
      this.refreshUsers();
    }
  }

  /**
   * Elimina un usuario después de confirmación.
   * 
   * @param user - Usuario a eliminar
   * 
   * @todo Conectar con endpoint DELETE /api/v1/users/{id}
   */
  deleteUser(user: UserResponse): void {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${user.nombre} ${user.apellido}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      alert(`Usuario "${user.nombre} ${user.apellido}" eliminado (simulado)`);
    }
  }

  /**
   * Gestiona los roles de un usuario.
   * 
   * @param user - Usuario para gestionar roles
   * 
   * @todo Implementar modal para agregar/quitar roles
   * @todo Conectar con endpoint POST /api/v1/users/{id}/roles
   */
  manageRoles(user: UserResponse): void {
    alert(`Gestionar roles de: ${user.nombre} ${user.apellido}\n\nRoles actuales: ${this.formatRoles(user.roles)}`);
  }
}

