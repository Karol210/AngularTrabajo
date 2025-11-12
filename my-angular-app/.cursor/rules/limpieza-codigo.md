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

### Todos los Elementos Públicos

```typescript
/**
 * Componente principal del landing page.
 * Muestra productos destacados y permite agregarlos al carrito.
 */
@Component({ /* ... */ })
export class LandingComponent {
  private readonly cartService = inject(CartService);

  /** Signal reactivo con la lista de productos */
  readonly products = this.productService.products;

  /**
   * Agrega un producto al carrito y muestra notificación.
   * @param product - Producto a agregar al carrito
   */
  addToCart(product: Product): void {
    // ...
  }
}
```

### Servicios y Guards

```typescript
/**
 * Servicio para gestionar productos de la tienda.
 * Proporciona signals reactivos y métodos para consultar productos.
 * 
 * @todo Reemplazar mock data con llamadas HTTP reales al backend
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  /**
   * Busca un producto por su ID.
   * @param id - ID del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}

/**
 * Guard para proteger rutas de administración.
 * Verifica que el usuario tenga una sesión de admin activa.
 * Si no está autenticado, redirige al login de admin.
 */
export const adminAuthGuard: CanActivateFn = () => {
  // ...
};
```

## 5. Comentarios en SCSS

### Encabezado de Archivo

```scss
/**
 * Landing Component Styles
 * Página principal con hero section y grid de productos
 */
```

### Secciones Principales

```scss
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--red-main) 0%, var(--red-dark) 100%);
}

/* Products Section */
.products {
  padding: 3rem 2rem;
}

/* Product Card - Principio del Cuadrado */
.product-card {
  // ✅ CUADRADO: Contenedor principal con padding lateral
  &__content {
    padding: 1.5rem;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  // ...
}
```

### Comentarios Inline

```scss
.admin-login {
  // ✅ CUADRADO: Contenedor principal con padding lateral único
  &__content {
    padding: 1.5rem;
  }

  // Header con ícono y título - solo espaciado vertical
  &__card-header {
    padding-top: 0.5rem;
    padding-bottom: 1rem;
  }

  // Botón centrado con ancho mínimo
  &__button {
    align-self: center;
    min-width: 200px;
  }

  // Ocultar badge cuando está vacío
  .cart-badge--empty {
    display: none;
  }
}
```

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

## Checklist de Limpieza

Antes de commit, verificar:

### TypeScript
- [ ] ✅ Todos los servicios inyectados son `readonly`
- [ ] ✅ Propiedades que no cambian son `readonly`
- [ ] ✅ No hay uso de `any` sin justificación
- [ ] ✅ Imports están ordenados y sin duplicados
- [ ] ✅ No hay imports no usados
- [ ] ✅ CommonModule solo si es necesario
- [ ] ✅ Componentes tienen JSDoc
- [ ] ✅ Servicios tienen JSDoc
- [ ] ✅ Métodos públicos tienen JSDoc
- [ ] ✅ Guards tienen JSDoc
- [ ] ✅ Uso de @todo para pendientes
- [ ] ✅ No hay código comentado sin explicación
- [ ] ✅ No hay console.log en producción

### SCSS
- [ ] ✅ Archivo tiene comentario de encabezado
- [ ] ✅ Secciones principales están comentadas
- [ ] ✅ Principio del Cuadrado está indicado
- [ ] ✅ No hay ::ng-deep
- [ ] ✅ No hay clases no usadas
- [ ] ✅ Comentarios útiles, no obvios
- [ ] ✅ Media queries comentados

### General
- [ ] ✅ 0 errores de linter
- [ ] ✅ 0 warnings sin justificar
- [ ] ✅ Nombres descriptivos y en español
- [ ] ✅ Código auto-explicativo

## Herramientas

### ESLint
```bash
# Verificar errores
npm run lint

# Arreglar automáticamente
npm run lint -- --fix
```

### Prettier
```bash
# Formatear código
npm run format
```

### VSCode Extensions Recomendadas
- ESLint
- Prettier
- Angular Language Service
- Better Comments

## Beneficios

1. **Mantenibilidad**: Código más fácil de entender y modificar
2. **Performance**: Menos imports = bundles más pequeños
3. **Type Safety**: Menos errores en runtime
4. **Colaboración**: Equipo entiende el código rápidamente
5. **Debugging**: Más fácil encontrar y solucionar bugs
6. **Refactoring**: Cambios más seguros con tipos estrictos

---

**Regla de Oro:** Si no estás seguro si algo es necesario, elimínalo. Es mejor agregar después que mantener código muerto.

