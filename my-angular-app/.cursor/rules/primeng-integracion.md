# PrimeNG - Integración y Configuración

## Regla General
Usar PrimeNG v19+ con sistema de Design Tokens (JavaScript) y estilos globales CSS. NO usar `::ng-deep` en componentes individuales.

## 1. Instalación

```bash
npm install primeng @primeng/themes primeicons --save
```

## 2. Configuración en app.config.ts

### Imports Correctos

```typescript
// ✅ CORRECTO
import { providePrimeNG } from 'primeng/config';  // NO de 'primeng/api'
import Aura from '@primeng/themes/aura';           // Default import
import { definePreset } from '@primeng/themes';

// ❌ INCORRECTO
import { providePrimeNG } from 'primeng/api';
import { Aura } from '@primeng/themes/aura';      // No es named export
```

### Tema Personalizado con Design Tokens

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { MessageService, ConfirmationService } from 'primeng/api';

const DaviviendaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      // Definir escala de colores del 50 al 950
      // usando los valores del proyecto (ver variables-css-colores.md)
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '{surface.0}',
          hoverColor: '{primary.600}',
          activeColor: '{primary.600}'
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: DaviviendaPreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false
        }
      }
    })
  ]
};
```

### Temas Base Disponibles

```typescript
import Aura from '@primeng/themes/aura';        // Moderno y limpio (recomendado)
import Lara from '@primeng/themes/lara';        // Clásico de PrimeNG
import Material from '@primeng/themes/material'; // Material Design
import Nora from '@primeng/themes/nora';        // Alternativo
```

## 3. Configuración en angular.json

```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

**NO** incluir archivos CSS de temas porque no existen en v19.

## 4. Estilos Globales en styles.scss

### Variables CSS de PrimeNG

```scss
:root {
  /* Colores personalizados del proyecto */
  --red-main: #E1111C;
  --red-dark: #B70412;
  --white: #FFFFFF;
  
  /* Variables de PrimeNG */
  --primary-color: var(--red-main);
  --primary-color-text: var(--white);
  --primary-color-hover: var(--red-dark);
  --surface-ground: var(--background-body);
  --surface-card: var(--white);
  --text-color: var(--black-main);
}
```

### Inputs - Ancho 100%

**IMPORTANTE:** Todos los inputs de PrimeNG deben ocupar el 100% del contenedor:

```scss
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

### Cards - Sin Padding por Defecto

Para control manual del espaciado (Principio del Cuadrado):

```scss
.p-card .p-card-header,
.p-card .p-card-body {
  padding: 0;
}
```

### Componentes Personalizados

Aplicar estilos globales a componentes PrimeNG usando variables CSS:

```scss
/* Botones */
.p-button {
  font-family: var(--font-family);
  
  &.p-button-primary {
    background-color: var(--red-main);
    border-color: var(--red-main);
  }
}

/* Otros componentes (Cards, Inputs, Toast, Menús, Tablas) */
// Seguir el mismo patrón usando variables CSS del proyecto
```

## 5. Uso de Componentes

Importar módulos en componentes standalone:

```typescript
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  imports: [ButtonModule, TableModule]
})
```

**Ver:** `angular-componentes.md` para sintaxis completa de componentes.

## 6. Estilos Locales en Componentes

Usar solo para layout y estructura del componente, NO para estilar componentes de PrimeNG:

```scss
.my-component {
  padding: 2rem;  // Layout del componente
  // ✅ Layout específico (flex, grid, transitions)
  // ❌ NO sobrescribir .p-button, .p-card, etc.
}
```

## 7. Evitar ::ng-deep

**❌ NO USAR** en componentes individuales:

```scss
// component.scss - MAL
.my-component {
  ::ng-deep {
    .p-button {
      background-color: var(--red-main);
    }
  }
}
```

**Problemas:**
- Duplicación de código
- Difícil de mantener
- Deprecated
- Aumenta bundle size

**✅ USAR** tema global en `styles.scss`:

```scss
// styles.scss - BIEN
.p-button {
  font-family: var(--font-family);
  
  &.p-button-primary {
    background-color: var(--red-main);
  }
}
```

### Excepción (Último Recurso)

Solo si PrimeNG no expone la clase y es imposible de otra forma:

```scss
/**
 * Usando ::ng-deep porque PrimeNG no expone esta clase
 * y necesitamos este comportamiento específico solo aquí.
 * TODO: Reportar a PrimeNG o buscar alternativa.
 */
::ng-deep .p-internal-private-class {
  /* Estilos necesarios */
}
```

## 8. Checklist

Antes de commit, verificar:
- [ ] `@primeng/themes` instalado
- [ ] `providePrimeNG` configurado en app.config.ts
- [ ] Preset personalizado definido con colores del proyecto
- [ ] Primeicons.css importado en angular.json
- [ ] Inputs con width: 100% en styles.scss
- [ ] Cards sin padding en styles.scss
- [ ] Estilos globales en styles.scss, no en componentes
- [ ] Sin ::ng-deep en componentes individuales
- [ ] Variables CSS usadas consistentemente

## Regla de Oro

**Si necesitas `::ng-deep` para estilar un componente de PrimeNG, probablemente deberías agregarlo al tema global en su lugar.**

---

**Versión:** PrimeNG 19.x | Angular 19.x  
**Sistema:** Design Tokens (JavaScript) + Estilos Globales (CSS)

