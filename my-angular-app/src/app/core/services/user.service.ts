import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar operaciones de usuarios.
 * Proporciona métodos para registro y gestión de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/users`;

  /**
   * Genera los headers necesarios para las peticiones HTTP.
   * @returns HttpHeaders configurados
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param request - Datos del usuario a registrar
   * @returns Observable con la respuesta del registro
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}/create`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en registro de usuario:', error);
        return throwError(() => error);
      })
    );
  }
}

