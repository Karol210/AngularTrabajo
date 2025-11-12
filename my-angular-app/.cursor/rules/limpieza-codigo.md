# Limpieza de Código

## Regla General
El código debe ser limpio, mantenible y seguir las convenciones establecidas del proyecto.

## 1. Propiedades Readonly

Usar `readonly` para propiedades que no cambian después de la inicialización:

```typescript
// ✅ CORRECTO
export class MyComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  readonly products = this.productService.products;
  readonly loading = signal(false);
  readonly menuItems: MenuItem[] = [];
}

// ❌ INCORRECTO
export class MyComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  products = this.productService.products;
  loading = signal(false);
  menuItems: MenuItem[] = [];
}
```

**Cuándo usar readonly:**
- Servicios inyectados
- Signals que referencian otros signals
- Arrays/objetos de configuración que no cambian
- Propiedades que se inicializan una vez

## 2. Tipos Específicos

**Nunca usar `any`, siempre tipos específicos:**

```typescript
// ✅ CORRECTO
addToCart(product: Product): void {
  this.cartService.addToCart(product, 1);
}

onSubmit(): Promise<void> {
  const credentials = this.loginForm.value as LoginCredentials;
  return this.authService.login(credentials);
}

// ❌ INCORRECTO
addToCart(product: any): void {
  this.cartService.addToCart(product, 1);
}

onSubmit(): Promise<any> {
  const credentials = this.loginForm.value as any;
  return this.authService.login(credentials);
}
```

**Excepciones permitidas:**
- Tipos de terceros sin tipado
- JSON genérico que no se puede tipar
- Casos muy específicos con comentario justificando el uso

## 3. Imports Limpios

### Eliminar Imports No Usados

```typescript
// ✅ CORRECTO - Solo lo necesario
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../core/services/cart.service';

// ❌ INCORRECTO - Imports no usados
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
```

### CommonModule Solo Si Es Necesario

```typescript
// ✅ CORRECTO - Angular 19 standalone no necesita CommonModule
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonModule, CardModule],
  template: `
    @if (products()) {
      @for (product of products(); track product.id) {
        <div>{{ product.name }}</div>
      }
    }
  `
})

// ❌ INCORRECTO - CommonModule innecesario
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  // ...
})
```

**Cuándo sí usar CommonModule:**
- Cuando usas pipes comunes: `date`, `currency`, `uppercase`, etc.
- Directivas estructurales antiguas (pero deberías usar control flow moderno)

## 4. Documentación JSDoc

**Todos** los elementos públicos deben estar documentados con JSDoc.

**Ver:** `documentacion-codigo.md` para guía completa de documentación.

**Reglas básicas:**
- Componentes, servicios y guards siempre documentados
- Métodos públicos con parámetros o lógica compleja
- Propiedades solo si no es obvio por el nombre
- Usar @todo para pendientes
- Usar @deprecated para código obsoleto

## 5. Comentarios en SCSS

**Ver:** `documentacion-codigo.md` para guía completa de comentarios en SCSS.

**Reglas básicas:**
- Encabezado de archivo con descripción del componente
- Comentar secciones principales
- Indicar uso del Principio del Cuadrado
- Comentar media queries
- Comentar hacks o soluciones no obvias

## 6. Uso de @todo Tags

Para funcionalidad pendiente o mejoras futuras:

```typescript
/**
 * Servicio para gestionar productos.
 * 
 * @todo Reemplazar mock data con llamadas HTTP reales al backend
 * @todo Implementar caché de productos con TTL
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  /**
   * Carga los productos desde el backend.
   * Actualmente usa datos mock simulando un delay de red.
   */
  private loadProducts(): void {
    // Simulación de llamada HTTP con delay
    setTimeout(() => {
      // ...
    }, 1000);
  }

  /**
   * Navega a la página de login de usuario.
   * @todo Implementar modal de login
   */
  navigateToLogin(): void {
    console.log('Iniciar sesión');
  }
}
```

## 7. Organización de Imports

Orden recomendado:

```typescript
// 1. Angular core
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// 2. Librerías de terceros (PrimeNG, RxJS, etc.)
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

// 3. Servicios propios
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

// 4. Modelos y tipos
import { Product } from '../../../core/models/product.model';
import { LoginCredentials } from '../../../core/models/user.model';

// 5. Enums y constantes
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { StorageKeys } from '../../../core/enums/storage-keys.enum';
```

## 8. Código No Usado

### Eliminar

```typescript
// ❌ Código comentado sin explicación
// ngOnInit() {
//   this.loadData();
// }

// ❌ Métodos no usados
private unusedMethod(): void {
  // ...
}

// ❌ Propiedades no usadas
private unusedProperty = '';
```

### Mantener Solo Si

```typescript
// ✅ Código comentado temporalmente con explicación
/**
 * @todo Reactivar cuando la API de notificaciones esté lista
 */
// private sendNotification(): void {
//   this.notificationService.send();
// }

// ✅ Método de desarrollo temporal
/**
 * @internal Método de debugging, eliminar antes de producción
 */
private debugState(): void {
  console.log('State:', this.state());
}
```

## 9. Limpieza de CSS

### Eliminar Clases No Usadas

```scss
// ❌ Clases que no se usan en el HTML
.unused-class {
  color: red;
}

.another-unused {
  padding: 1rem;
}
```

### Evitar ::ng-deep

```scss
// ❌ INCORRECTO - Usar ::ng-deep rompe encapsulación
::ng-deep .p-button {
  background: red;
}

// ✅ CORRECTO - Usar tema personalizado en app.config.ts
// O aplicar estilos en styles.scss global
```

## Reglas Clave

- Servicios inyectados: `readonly`
- Propiedades que no cambian: `readonly`
- No usar `any` sin justificación
- Eliminar imports no usados
- CommonModule solo si usas pipes
- Código comentado debe tener explicación con @todo
- Sin console.log en producción
- Sin ::ng-deep (usar estilos globales)

**Ver:** `documentacion-codigo.md` para JSDoc completo.

