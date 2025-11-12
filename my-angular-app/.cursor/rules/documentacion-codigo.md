# Documentación de Código

## Regla General
Documentar código complejo, APIs públicas y lógica no obvia. No documentar código auto-explicativo.

## TypeScript - Documentación

### Clases y Componentes

```typescript
/**
 * Servicio para gestionar la autenticación de administradores.
 * Maneja login, logout y persistencia de sesión.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private adminUserState = signal<User | null>(null);
  
  /**
   * Signal reactivo con el usuario administrador actual.
   * Null si no hay sesión activa.
   */
  adminUser = this.adminUserState.asReadonly();
}
```

### Métodos Públicos

**Documentar cuando:**
- La lógica no es obvia
- Tiene parámetros con significado no evidente
- Devuelve valores que requieren explicación
- Tiene efectos secundarios importantes

```typescript
/**
 * Inicia sesión de administrador y persiste la sesión.
 * 
 * @param credentials - Usuario y contraseña del administrador
 * @returns Promise que resuelve true si login exitoso, false si credenciales inválidas
 * @throws Error si hay problema de conexión
 */
async adminLogin(credentials: LoginCredentials): Promise<boolean> {
  // implementación
}

/**
 * Agrega un producto al carrito o incrementa cantidad si ya existe.
 * Persiste cambios en localStorage automáticamente.
 * 
 * @param product - Producto a agregar
 * @param quantity - Cantidad a agregar (default: 1)
 */
addToCart(product: Product, quantity: number = 1): void {
  // implementación
}
```

### Métodos Privados

**Solo documentar si la lógica es compleja:**

```typescript
/**
 * Calcula el descuento aplicable basado en categoría de usuario
 * y monto total. Aplica reglas de negocio especiales para fechas festivas.
 */
private calculateDiscount(total: number, userCategory: string): number {
  // lógica compleja
}

// Método simple - NO documentar
private clearCache(): void {
  this.cache.clear();
}
```

### Propiedades y Signals

**Documentar solo si no es obvio por el nombre:**

```typescript
// ❌ NO documentar - obvio por el nombre
products = signal<Product[]>([]);
loading = signal(false);

// ✅ SÍ documentar - comportamiento especial
/**
 * Total de items en el carrito.
 * Se recalcula automáticamente cuando cambia cartItems.
 */
totalItems = computed(() => 
  this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
);
```

### Interfaces y Types

```typescript
/**
 * Representa un producto en el catálogo.
 */
export interface Product {
  id: string;
  name: string;
  /** URL de la imagen del producto. Debe ser absoluta. */
  imageUrl: string;
  /** Precio en pesos colombianos (COP) */
  price: number;
  /** Cantidad disponible en inventario */
  stock: number;
}

/**
 * Credenciales para autenticación de administrador.
 */
export interface LoginCredentials {
  username: string;
  /** Mínimo 6 caracteres */
  password: string;
}
```

### Enums

```typescript
/**
 * Rutas principales de la aplicación.
 * Usar siempre estos valores en lugar de strings hardcodeados.
 */
export enum AppRoutes {
  HOME = '',
  ADMIN = 'admin',
  ADMIN_LOGIN = 'admin/login'
}

/**
 * Claves para almacenamiento en sessionStorage/localStorage.
 */
export enum StorageKeys {
  ADMIN_TOKEN = 'admin_token',
  CART_ITEMS = 'cart_items'
}
```

### Funciones Complejas

```typescript
/**
 * Formatea un número como moneda colombiana (COP).
 * 
 * @param amount - Monto a formatear
 * @param decimals - Número de decimales (default: 0)
 * @returns String formateado con símbolo $ y separadores de miles
 * 
 * @example
 * formatCurrency(1500000) // "$1.500.000"
 * formatCurrency(1500.50, 2) // "$1.500,50"
 */
function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: decimals
  }).format(amount);
}
```

## SCSS - Documentación

### Estructura de Componente

```scss
/**
 * Landing Component Styles
 * 
 * Página principal del marketplace con hero section y grid de productos.
 * Responsive: mobile-first con breakpoint en 768px.
 */

// Hero Section - Banner principal con gradiente
.hero {
  background: linear-gradient(135deg, var(--red-main) 0%, var(--red-dark) 100%);
  padding: 4rem 2rem;
  
  &__title {
    font-size: 2.5rem;
    font-weight: 700;
  }
}

// Products Grid - Layout adaptativo
.products {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
}
```

### Mixins y Funciones

```scss
/**
 * Mixin para cards con elevación y hover effect.
 * 
 * @param {number} $elevation - Nivel de elevación (1-5)
 */
@mixin card-elevation($elevation: 2) {
  box-shadow: 0 #{$elevation * 2}px #{$elevation * 8}px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 #{$elevation * 4}px #{$elevation * 16}px rgba(0, 0, 0, 0.12);
  }
}
```

### Secciones Complejas

```scss
.admin-layout {
  display: flex;
  min-height: 100vh;

  // Sidebar fijo con scroll independiente
  &__sidebar {
    width: 280px;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    
    // Customización de scrollbar
    &::-webkit-scrollbar {
      width: 6px;
    }
  }

  // Área principal con margen para sidebar
  &__main {
    flex: 1;
    margin-left: 280px;
    padding: 2rem;
  }
}
```

### Media Queries

```scss
// Tablet y menor - Layout vertical
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    
    &__sidebar {
      width: 100%;
      height: auto;
      position: relative;
    }
    
    &__main {
      margin-left: 0;
    }
  }
}
```

### Hacks o Soluciones No Obvias

```scss
.dropdown {
  position: relative;
  
  /**
   * Fix para Safari: z-index necesario para que el dropdown
   * se muestre sobre elementos con transform en iOS.
   */
  &__menu {
    position: absolute;
    z-index: 1000;
    transform: translateZ(0); // Hardware acceleration
  }
}

.truncate {
  /**
   * Trunca texto en una línea con ellipsis.
   * Requiere width definido en el elemento.
   */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Qué NO Documentar

### TypeScript

```typescript
// ❌ NO documentar - obvio
class UserService {
  /** Obtiene el usuario */
  getUser() { }
  
  /** Establece el usuario */
  setUser(user: User) { }
  
  /** Constructor del servicio */
  constructor() { }
}

// ✅ Mejor - sin comentarios innecesarios
class UserService {
  getUser() { }
  setUser(user: User) { }
  constructor() { }
}
```

### SCSS

```scss
// ❌ NO documentar - obvio
.button {
  // Color de fondo
  background-color: var(--red-main);
  
  // Color de texto
  color: var(--white);
  
  // Padding del botón
  padding: 0.75rem 1.5rem;
}

// ✅ Mejor - sin comentarios obvios
.button {
  background-color: var(--red-main);
  color: var(--white);
  padding: 0.75rem 1.5rem;
}
```

## JSDoc Tags Útiles

```typescript
/**
 * @deprecated Use `newMethod()` en su lugar. Se eliminará en v2.0
 */
oldMethod() { }

/**
 * @internal Método de uso interno, no usar desde fuera del servicio
 */
private internalMethod() { }

/**
 * @see {@link https://docs.example.com/api | Documentación API}
 */
callExternalAPI() { }

/**
 * @todo Implementar paginación cuando la API lo soporte
 */
loadAllProducts() { }
```

## Formato JSDoc

### Estructura Básica

```typescript
/**
 * Breve descripción en una línea.
 * 
 * Descripción extendida si es necesario.
 * Puede tener múltiples párrafos.
 * 
 * @param param1 - Descripción del parámetro
 * @param param2 - Descripción del parámetro
 * @returns Descripción del valor de retorno
 * @throws Error si ocurre X condición
 * 
 * @example
 * const result = myFunction('value', 123);
 */
```

### Ejemplos por Tipo

**Servicio:**
```typescript
/**
 * Gestiona el carrito de compras del usuario.
 * Sincroniza con localStorage y proporciona signals reactivos.
 */
@Injectable({ providedIn: 'root' })
export class CartService { }
```

**Componente:**
```typescript
/**
 * Componente de login para administradores.
 * Incluye validación de formulario y gestión de errores.
 */
@Component({ /* ... */ })
export class AdminLoginComponent { }
```

**Guard:**
```typescript
/**
 * Protege rutas de administrador verificando autenticación.
 * Redirige a /admin/login si no hay sesión activa.
 */
export const adminAuthGuard: CanActivateFn = () => { }
```

## Reglas de Oro

1. **El código debe explicarse por sí mismo** - usa nombres descriptivos
2. **Documenta el "por qué", no el "qué"** - el código muestra el qué
3. **Mantén la documentación actualizada** - código sin docs > docs obsoletas
4. **Documenta APIs públicas siempre** - servicios, componentes públicos
5. **Omite lo obvio** - `getName()` no necesita docs
6. **Explica workarounds** - hacks o soluciones no estándar requieren explicación

## Checklist

Antes de commit, verificar:
- [ ] ¿Métodos públicos complejos están documentados?
- [ ] ¿Interfaces tienen descripción de campos no obvios?
- [ ] ¿Hay @deprecated para métodos obsoletos?
- [ ] ¿Código complejo tiene comentarios explicativos?
- [ ] ¿Se eliminaron comentarios obvios?
- [ ] ¿Ejemplos están actualizados si cambia el código?

---

**Herramientas recomendadas:** Compodoc para generar documentación automática de proyectos Angular

