import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../core/services/cart.service';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentType, PaymentTypeOption, CardData } from '../../../core/models/payment.model';

/**
 * Modal de checkout para procesar el pago
 */
@Component({
  selector: 'app-checkout-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule
  ],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.scss'
})
export class CheckoutModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly paymentService = inject(PaymentService);
  private readonly messageService = inject(MessageService);

  /** Signal que controla la visibilidad del modal */
  visible = signal(false);

  /** Signal que indica si se está procesando el pago */
  processing = signal(false);

  /** Items del carrito */
  readonly cartItems = this.cartService.cartItems;

  /** Total del carrito */
  readonly totalPrice = this.cartService.totalPrice;

  /** Opciones de tipo de pago */
  paymentTypes: PaymentTypeOption[] = [
    { id: 'debito', label: 'Tarjeta Débito' },
    { id: 'credito', label: 'Tarjeta Crédito' }
  ];

  /** Opciones de cuotas (1-12) */
  installmentOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1} cuota${i > 0 ? 's' : ''}` }));

  /** Formulario de pago */
  paymentForm: FormGroup;

  /** Tipo de pago seleccionado */
  selectedPaymentType = signal<PaymentType>('credito');

  constructor() {
    this.paymentForm = this.fb.group({
      paymentType: ['credito', [Validators.required]],
      bankName: [{ value: 'Banco Davivienda', disabled: true }],
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      installments: [1, [Validators.required, Validators.min(1), Validators.max(12)]]
    });

    // Listener para cambiar cuotas cuando cambia el tipo de pago
    this.paymentForm.get('paymentType')?.valueChanges.subscribe((type: PaymentType) => {
      this.selectedPaymentType.set(type);
      
      if (type === 'debito') {
        this.paymentForm.patchValue({ installments: 1 });
        this.paymentForm.get('installments')?.disable();
      } else {
        this.paymentForm.get('installments')?.enable();
      }
    });
  }

  /**
   * Abre el modal de checkout
   */
  show(): void {
    this.visible.set(true);
    this.selectedPaymentType.set('credito');
    this.paymentForm.reset({
      paymentType: 'credito',
      bankName: 'Banco Davivienda',
      installments: 1
    });
  }

  /**
   * Cierra el modal
   */
  hide(): void {
    this.visible.set(false);
    this.paymentForm.reset();
  }

  /**
   * Procesa el pago
   */
  onPaymentSubmit(): void {
    if (this.paymentForm.valid) {
      this.processing.set(true);

      const formValue = this.paymentForm.getRawValue();
      const cardData: CardData = {
        cardNumber: formValue.cardNumber.replace(/\s/g, ''), // Eliminar espacios
        cardHolderName: formValue.cardHolderName,
        expirationDate: formValue.expirationDate,
        cvv: formValue.cvv,
        installments: formValue.paymentType === 'debito' ? 0 : formValue.installments,
        paymentType: formValue.paymentType
      };

      this.paymentService.processPayment(cardData).subscribe({
        next: (response) => {
          this.processing.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Pago Exitoso',
            detail: `${response.message}. Referencia: ${response.body.referenceNumber}`,
            life: 5000
          });
          this.hide();
          // Limpiar el carrito después del pago exitoso
          this.cartService.clearCart();
        },
        error: (error) => {
          this.processing.set(false);
          const errorMessage = error.error?.message || 'Error al procesar el pago. Intente nuevamente.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el Pago',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.paymentForm);
    }
  }

  /**
   * Formatea el precio en pesos colombianos
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Marca todos los controles como touched para mostrar validaciones
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
