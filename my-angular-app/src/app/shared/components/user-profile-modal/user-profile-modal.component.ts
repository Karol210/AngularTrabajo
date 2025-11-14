import { Component, signal, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Modal para mostrar el perfil completo del usuario autenticado.
 */
@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './user-profile-modal.component.html',
  styleUrl: './user-profile-modal.component.scss'
})
export class UserProfileModalComponent {
  private readonly authService = inject(AuthService);

  /** Signal que controla la visibilidad del modal */
  visible = signal(false);

  /** Perfil del usuario autenticado */
  readonly userProfile = this.authService.userProfile;

  /**
   * Muestra el modal de perfil.
   */
  show(): void {
    this.visible.set(true);
  }

  /**
   * Oculta el modal de perfil.
   */
  hide(): void {
    this.visible.set(false);
  }
}

