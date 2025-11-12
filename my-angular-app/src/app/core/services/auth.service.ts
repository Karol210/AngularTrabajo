import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKeys } from '../enums/storage-keys.enum';
import { AppRoutes } from '../enums/app-routes.enum';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

/**
 * Servicio para gestionar la autenticación de administradores.
 * Maneja login, logout y persistencia de sesión en sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private adminUserState = signal<User | null>(null);
  
  /**
   * Signal reactivo con el usuario administrador actual.
   * Null si no hay sesión activa.
   */
  adminUser = this.adminUserState.asReadonly();
  
  /**
   * Signal reactivo que indica si hay un administrador autenticado.
   */
  isAdminAuthenticated = computed(() => this.adminUserState() !== null);

  constructor() {
    this.loadAdminFromStorage();
  }

  private loadAdminFromStorage(): void {
    const token = sessionStorage.getItem(StorageKeys.ADMIN_TOKEN);
    const userJson = sessionStorage.getItem(StorageKeys.ADMIN_USER);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.adminUserState.set(user);
      } catch (error) {
        this.clearAdminSession();
      }
    }
  }

  /**
   * Inicia sesión de administrador y persiste la sesión en sessionStorage.
   * 
   * @param credentials - Usuario y contraseña del administrador
   * @returns Promise que resuelve true si login exitoso, false si credenciales inválidas
   * 
   * @todo Reemplazar con llamada HTTP real al backend
   */
  adminLogin(credentials: LoginCredentials): Promise<boolean> {
    // Simulación de login - reemplazar con llamada HTTP real
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const mockResponse: AuthResponse = {
            token: 'mock-admin-token-' + Date.now(),
            user: {
              id: '1',
              username: credentials.username,
              email: 'admin@davivienda.com',
              role: 'admin' as any
            }
          };

          sessionStorage.setItem(StorageKeys.ADMIN_TOKEN, mockResponse.token);
          sessionStorage.setItem(StorageKeys.ADMIN_USER, JSON.stringify(mockResponse.user));
          this.adminUserState.set(mockResponse.user);
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  }

  /**
   * Cierra la sesión del administrador y redirige al login.
   * Limpia token y datos de usuario de sessionStorage.
   */
  adminLogout(): void {
    this.clearAdminSession();
    this.router.navigate([AppRoutes.ADMIN_LOGIN]);
  }

  private clearAdminSession(): void {
    sessionStorage.removeItem(StorageKeys.ADMIN_TOKEN);
    sessionStorage.removeItem(StorageKeys.ADMIN_USER);
    this.adminUserState.set(null);
  }
}

