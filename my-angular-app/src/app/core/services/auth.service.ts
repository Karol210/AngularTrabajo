import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageKeys } from '../enums/storage-keys.enum';
import { AppRoutes } from '../enums/app-routes.enum';
import { User, LoginCredentials, AuthResponse, UserLoginCredentials, UserLoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

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
  private storage = inject(StorageService);
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
    const token = this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
    const user = this.storage.getItem<User>(StorageKeys.ADMIN_USER);
    
    if (token && user) {
      this.adminUserState.set(user);
    }
  }

  private loadUserFromStorage(): void {
    const token = this.storage.getItem<string>(StorageKeys.USER_TOKEN);
    const username = this.storage.getItem<string>(StorageKeys.USER_NAME);
    
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

          this.storage.setItem(StorageKeys.ADMIN_TOKEN, mockResponse.token);
          this.storage.setItem(StorageKeys.ADMIN_USER, mockResponse.user);
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
    this.storage.removeItem(StorageKeys.ADMIN_TOKEN);
    this.storage.removeItem(StorageKeys.ADMIN_USER);
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
        this.storage.setItem(StorageKeys.USER_TOKEN, response.token);
        this.storage.setItem(StorageKeys.USER_NAME, response.username);
        this.userState.set(response.username);
      })
    );
  }

  /**
   * Cierra la sesión del usuario regular.
   * Limpia token y datos de usuario.
   */
  userLogout(): void {
    this.storage.removeItem(StorageKeys.USER_TOKEN);
    this.storage.removeItem(StorageKeys.USER_NAME);
    this.userState.set(null);
  }

  /**
   * Obtiene el token del usuario regular autenticado.
   * @returns Token JWT del usuario o null si no está autenticado
   */
  getUserToken(): string | null {
    return this.storage.getItem<string>(StorageKeys.USER_TOKEN);
  }

  /**
   * Obtiene el token del administrador autenticado.
   * @returns Token JWT del administrador o null si no está autenticado
   */
  getAdminToken(): string | null {
    return this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
  }
}

