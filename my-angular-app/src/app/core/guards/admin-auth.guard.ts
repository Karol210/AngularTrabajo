import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../enums/app-routes.enum';

/**
 * Guard para proteger rutas de administración.
 * Verifica que el usuario tenga una sesión de admin activa.
 * Si no está autenticado, redirige al login de admin.
 */
export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdminAuthenticated()) {
    return true;
  }

  router.navigate([AppRoutes.ADMIN_LOGIN]);
  return false;
};

