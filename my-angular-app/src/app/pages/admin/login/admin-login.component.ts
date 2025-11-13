import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { LoginCredentials } from '../../../core/models/user.model';

/**
 * Componente de login para administradores.
 * Maneja autenticación y redirección al dashboard.
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  /** Signal que indica si el login está en proceso */
  readonly loading = signal(false);

  /** Formulario reactivo de login con validaciones */
  readonly loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  /**
   * Procesa el envío del formulario de login.
   * Valida credenciales y redirige al dashboard si es exitoso.
   */
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);

    try {
      const credentials = this.loginForm.value as LoginCredentials;
      const success = await this.authService.adminLogin(credentials);

      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: 'Bienvenido al panel de administración'
        });
        
        setTimeout(() => {
          this.router.navigate([AppRoutes.ADMIN_DASHBOARD]);
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: 'Usuario o contraseña incorrectos'
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al iniciar sesión'
      });
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Marca todos los campos del formulario como tocados.
   * Útil para mostrar errores de validación al intentar enviar.
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}

