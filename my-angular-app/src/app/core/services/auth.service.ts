import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageKeys } from '../enums/storage-keys.enum';
import { AppRoutes } from '../enums/app-routes.enum';
import { User, LoginCredentials, AuthResponse, UserLoginCredentials, UserLoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar la autenticación de administradores y usuarios.
 * Maneja login, logout y persistencia de sesión en sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private adminUserState = signal<User | null>(null);
  private userState = signal<string | null>(null);
  
  /**
   * Signal reactivo con el usuario administrador actual.
   * Null si no hay sesión activa.
   */
  adminUser = this.adminUserState.asReadonly();
  
  /**
   * Signal reactivo con el nombre del usuario regular autenticado.
   * Null si no hay sesión activa.
   */
  currentUser = this.userState.asReadonly();
  
  /**
   * Signal reactivo que indica si hay un administrador autenticado.
   */
  isAdminAuthenticated = computed(() => this.adminUserState() !== null);
  
  /**
   * Signal reactivo que indica si hay un usuario regular autenticado.
   */
  isUserAuthenticated = computed(() => this.userState() !== null);

  constructor() {
    this.loadAdminFromStorage();
    this.loadUserFromStorage();
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

  private loadUserFromStorage(): void {
    const token = sessionStorage.getItem(StorageKeys.USER_TOKEN);
    const username = sessionStorage.getItem(StorageKeys.USER_NAME);
    
    if (token && username) {
      this.userState.set(username);
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

  /**
   * Inicia sesión de usuario regular y persiste la sesión en sessionStorage.
   * 
   * @param credentials - Email y contraseña del usuario
   * @returns Observable con la respuesta del login
   */
  userLogin(credentials: UserLoginCredentials): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(
      `${environment.apiUrl}/api/v1/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        sessionStorage.setItem(StorageKeys.USER_TOKEN, response.token);
        sessionStorage.setItem(StorageKeys.USER_NAME, response.username);
        this.userState.set(response.username);
      })
    );
  }

  /**
   * Cierra la sesión del usuario regular.
   * Limpia token y datos de usuario de sessionStorage.
   */
  userLogout(): void {
    sessionStorage.removeItem(StorageKeys.USER_TOKEN);
    sessionStorage.removeItem(StorageKeys.USER_NAME);
    this.userState.set(null);
  }
}

