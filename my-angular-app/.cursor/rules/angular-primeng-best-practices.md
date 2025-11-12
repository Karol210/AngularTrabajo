# Angular 19 + PrimeNG - Reglas de Desarrollo

## Stack Tecnológico
- Angular v19 con características modernas
- PrimeNG como biblioteca UI principal

## 1. Sintaxis de Control de Flujo (Angular 19)

**Usar SOLO la nueva sintaxis, nunca directivas estructurales antiguas:**

```typescript
// Condicionales
@if (condition) {
  <div>Content</div>
} @else if (other) {
  <div>Other</div>
} @else {
  <div>Default</div>
}

// Iteraciones - siempre con track
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>Sin resultados</div>
}

// Switch
@switch (value) {
  @case ('A') { <div>Option A</div> }
  @case ('B') { <div>Option B</div> }
  @default { <div>Default</div> }
}

// Lazy loading de componentes
@defer (on viewport) {
  <heavy-component />
} @placeholder {
  <div>Loading...</div>
} @error {
  <div>Error</div>
}
```

**❌ NO usar:** `*ngIf`, `*ngFor`, `*ngSwitch` - están obsoletas

## 2. Componentes Standalone

Todos los componentes deben ser standalone:

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss'
})
export class MyComponentComponent {}
```

## 3. Signals - Reactividad

Preferir signals para estado reactivo:

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({...})
export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  
  constructor() {
    effect(() => console.log('Count:', this.count()));
  }
  
  increment() {
    this.count.update(v => v + 1);
  }
}
```

En templates usar con paréntesis: `{{ count() }}`

## 4. Inyección de Dependencias

Usar función `inject()`:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({...})
export class MyComponent {
  private router = inject(Router);
  private messageService = inject(MessageService);
}
```

## 5. PrimeNG - Configuración

### App Config
```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService, ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    MessageService,
    ConfirmationService
  ]
};
```

### Estilos y Temas

**PrimeNG v19** usa un sistema de temas basado en Design Tokens (JavaScript), NO CSS.

1. Instalar paquete de temas:
```bash
npm install @primeng/themes --save
```

2. Configurar en `app.config.ts`:
```typescript
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const DaviviendaPreset = definePreset(Aura, {
  semantic: {
    primary: { /* colores personalizados */ },
    colorScheme: { /* esquema de colores */ }
  }
});

providePrimeNG({
  theme: { preset: DaviviendaPreset }
})
```

3. Configurar `angular.json`:
```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

**Ver:** `primeng-v19-temas.md` para documentación completa del nuevo sistema de temas.

### Estilos Globales

**Inputs:**

Todos los inputs de PrimeNG deben ocupar el 100% del ancho de su contenedor:

```scss
// styles.scss
.p-inputtext,
.p-textarea,
.p-password,
.p-dropdown,
.p-calendar,
.p-inputnumber {
  width: 100%;
  
  input {
    width: 100%;
  }
}

.p-password-input {
  width: 100%;
}

.p-float-label,
.p-inputwrapper {
  width: 100%;
}
```

**Cards:**

Para mejor control del espaciado, eliminar padding por defecto y aplicar manualmente en cada componente:

```scss
// styles.scss
.p-card .p-card-header,
.p-card .p-card-body {
  padding: 0;
}
```

En cada componente aplicar padding consistente:

```scss
// component.scss
.my-card-header {
  padding: 2rem 1.5rem 1rem 1.5rem;
}

.my-card-body {
  padding: 0 1.5rem 1.5rem 1.5rem;
}
```

### Uso de Componentes

**Tablas:**
```html
<p-table [value]="products()" [tableStyle]="{'min-width': '50rem'}">
  <ng-template pTemplate="header">
    <tr><th>Code</th><th>Name</th></tr>
  </ng-template>
  <ng-template pTemplate="body" let-product>
    <tr><td>{{ product.code }}</td><td>{{ product.name }}</td></tr>
  </ng-template>
</p-table>
```

**Mensajes Toast:**
```typescript
private messageService = inject(MessageService);

showSuccess() {
  this.messageService.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Operación completada'
  });
}
```

**Diálogos con Signals:**
```typescript
visible = signal(false);
```
```html
<p-dialog [(visible)]="visible" [modal]="true" header="Título">
  <p>Contenido</p>
</p-dialog>
```

## 6. Formularios Reactivos

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule]
})
export class MyFormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]]
  });
  
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## 7. Routing y Lazy Loading

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
```

## 8. Servicios con Signals

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private state = signal<User | null>(null);
  
  user = this.state.asReadonly();
  isAuthenticated = computed(() => this.state() !== null);
  
  setUser(user: User) {
    this.state.set(user);
  }
}
```

## 9. Estructura de Proyecto

```
src/app/
├── core/           # Servicios singleton, guards, interceptors
├── shared/         # Componentes, directivas, pipes compartidos
├── features/       # Funcionalidades por dominio
│   └── users/
│       ├── components/
│       ├── services/
│       └── models/
└── pages/          # Páginas/rutas principales
```

## 10. Convenciones de Nomenclatura

- Componentes: `user-list.component.ts`
- Servicios: `user.service.ts`
- Directivas: `highlight.directive.ts`
- Guards: `auth.guard.ts`
- Interfaces: `User`, `Product` (PascalCase)

## 11. TypeScript

- Usar tipos explícitos siempre
- Interfaces para modelos de datos
- Evitar `any`, usar `unknown` si necesario
- Activar strict mode

## 12. Performance

- Usar `@defer` para componentes pesados
- Implementar `track` en todos los `@for`
- Aprovechar signals y computed para optimizar renders
- OnPush change detection cuando sea apropiado

## 13. Ejemplo Completo

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TableModule, ButtonModule, ToastModule],
  template: `
    <p-toast />
    
    @if (loading()) {
      <p>Cargando...</p>
    } @else {
      <p-table [value]="products()">
        <ng-template pTemplate="header">
          <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price | currency }}</td>
            <td>
              <p-button 
                icon="pi pi-trash" 
                (onClick)="delete(product.id)"
                severity="danger"
                [text]="true" />
            </td>
          </tr>
        </ng-template>
      </p-table>
      
      <p>Total: {{ totalPrice() | currency }}</p>
    }
  `
})
export class ProductsComponent {
  private messageService = inject(MessageService);
  
  products = signal<Product[]>([]);
  loading = signal(false);
  totalPrice = computed(() => 
    this.products().reduce((sum, p) => sum + p.price, 0)
  );
  
  delete(id: number) {
    this.products.update(list => list.filter(p => p.id !== id));
    this.messageService.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: 'Producto eliminado exitosamente'
    });
  }
}
```

---

**Versión:** Angular 19.x | PrimeNG Latest

