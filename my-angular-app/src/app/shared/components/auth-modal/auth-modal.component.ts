import { Component, inject, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { DocumentTypeService } from '../../../core/services/document-type.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { RegisterRequest } from '../../../core/models/register.model';
import { Messages, MessageTitles } from '../../constants/messages.constants';

/**
 * Componente modal para autenticación de usuarios.
 * Maneja tanto login como registro de usuarios.
 */
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  /** Signal que controla la visibilidad del modal */
  readonly visible = signal(false);
  
  /** Signal que controla qué vista se muestra (login o registro) */
  readonly isLoginView = signal(true);
  
  /** Signal que indica si se está procesando una petición */
  readonly loading = signal(false);

  /** Tipos de documentos disponibles */
  readonly documentTypes = this.documentTypeService.documentTypes;
  
  /** Indica si los tipos de documentos están cargando */
  readonly documentTypesLoading = this.documentTypeService.loading;

  /** Evento emitido cuando el login es exitoso */
  readonly loginSuccess = output<void>();

  /** Formulario de login */
  readonly loginForm: FormGroup;
  
  /** Formulario de registro */
  readonly registerForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      documentTypeId: [null, [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan.
   */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Abre el modal en la vista de login.
   */
  show(): void {
    this.visible.set(true);
    this.isLoginView.set(true);
    this.resetForms();
  }

  /**
   * Cierra el modal.
   */
  hide(): void {
    this.visible.set(false);
    this.resetForms();
  }

  /**
   * Cambia a la vista de registro.
   */
  switchToRegister(): void {
    this.isLoginView.set(false);
    this.resetForms();
  }

  /**
   * Cambia a la vista de login.
   */
  switchToLogin(): void {
    this.isLoginView.set(true);
    this.resetForms();
  }

  /**
   * Resetea ambos formularios.
   */
  private resetForms(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  /**
   * Maneja el submit del formulario de login.
   * Encadena: login → cargar carrito
   */
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      
      // Encadenar operaciones en el componente
      this.authService.userLogin(this.loginForm.value).pipe(
        tap(() => {
          // Después del login exitoso, cargar el carrito del usuario
          this.cartService.refreshCart();
        })
      ).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'success',
            summary: MessageTitles.SUCCESS,
            detail: response.message,
            life: 3000
          });
          this.hide();
          this.loginSuccess.emit();
        },
        error: (error) => {
          this.loading.set(false);
          const errorMessage = error.error?.message || Messages.ERROR.LOGIN_FAILED;
          this.messageService.add({
            severity: 'error',
            summary: MessageTitles.ERROR,
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  /**
   * Maneja el submit del formulario de registro.
   */
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      
      const { confirmPassword, ...registerData } = this.registerForm.value;
      
      // El roleId se asigna por defecto a 2 (usuario normal)
      const request: RegisterRequest = {
        ...registerData,
        roleIds: [2]
      };

      this.userService.register(request).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'success',
            summary: MessageTitles.SUCCESS,
            detail: Messages.SUCCESS.REGISTER_SUCCESS,
            life: 5000
          });
          this.hide();
        },
        error: (error) => {
          this.loading.set(false);
          const errorMessage = error.error?.message || Messages.ERROR.REGISTER_FAILED;
          this.messageService.add({
            severity: 'error',
            summary: MessageTitles.ERROR,
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  /**
   * Marca todos los controles de un formulario como touched para mostrar validaciones.
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

