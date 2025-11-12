# PrimeNG v19 - Sistema de Temas

## Regla General
En PrimeNG v19+, los temas se configuran usando JavaScript/TypeScript con el nuevo sistema de Design Tokens, NO con CSS.

## Imports Importantes

```typescript
// ✅ CORRECTO
import { providePrimeNG } from 'primeng/config';  // NO de 'primeng/api'
import Aura from '@primeng/themes/aura';           // Default import, NO { Aura }

// ❌ INCORRECTO
import { providePrimeNG } from 'primeng/api';     // Error: no existe aquí
import { Aura } from '@primeng/themes/aura';      // Error: no es named export
```

## Propiedades de Color

```typescript
// ✅ CORRECTO
primary: {
  color: '#E1111C',
  contrastColor: '#ffffff',  // Color de contraste
  hoverColor: '#B70412',
  activeColor: '#B70412'
}

// ❌ INCORRECTO
primary: {
  color: '#E1111C',
  inverseColor: '#ffffff',   // Error: no existe, usar contrastColor
}
```

## Configuración del Tema

### 1. Instalar Paquete de Temas

```bash
npm install @primeng/themes --save
```

### 2. Configurar en app.config.ts

```typescript
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

// Definir preset personalizado basado en tema base
const DaviviendaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{red.50}',
      100: '{red.100}',
      // ... hasta 950
    },
    colorScheme: {
      light: {
        primary: {
          color: '#E1111C',
          contrastColor: '#ffffff',
          hoverColor: '#B70412',
          activeColor: '#B70412'
        },
        highlight: {
          background: '#FBE7E8',
          focusBackground: '#FBE7E8',
          color: '#B70412',
          focusColor: '#B70412'
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
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

### 3. Configurar angular.json

```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

**NO** incluir archivos CSS de temas porque no existen en v19.

## Temas Base Disponibles

PrimeNG v19 incluye estos temas base en `@primeng/themes`:

- **Aura** - Tema moderno y limpio (recomendado)
- **Lara** - Tema clásico de PrimeNG
- **Material** - Estilo Material Design
- **Nora** - Tema alternativo

**Nota:** Los temas se importan como default export:
```typescript
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
```

## Personalización con definePreset

```typescript
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomPreset = definePreset(Aura, {
  semantic: {
    // Colores primarios
    primary: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#E1111C', // Color principal
      600: '#B70412', // Color oscuro
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519'
    },
    
    // Esquema de colores
    colorScheme: {
      light: {
        primary: {
          color: '#E1111C',
          contrastColor: '#ffffff',
          hoverColor: '#B70412',
          activeColor: '#B70412'
        },
        highlight: {
          background: '#FBE7E8',
          focusBackground: '#FBE7E8',
          color: '#B70412',
          focusColor: '#B70412'
        },
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        }
      }
    }
  },
  
  // Componentes específicos
  components: {
    button: {
      // Personalización específica de botones si es necesario
    },
    inputtext: {
      // Personalización específica de inputs
    }
  }
});
```

## Tokens de Diseño Principales

### Semantic Tokens

```typescript
semantic: {
  primary: { /* Colores primarios (50-950) */ },
  formField: { /* Campos de formulario */ },
  colorScheme: {
    light: {
      primary: { /* Estados del primary */ },
      highlight: { /* Highlight/focus states */ },
      surface: { /* Superficies */ },
      content: { /* Contenido */ }
    }
  }
}
```

### Component Tokens

Personalizar componentes específicos:

```typescript
components: {
  button: {
    colorScheme: {
      light: {
        primary: {
          background: '#E1111C',
          hoverBackground: '#B70412',
          activeBackground: '#B70412'
        }
      }
    }
  }
}
```

## Diferencias con Versiones Anteriores

### ❌ ANTIGUO (v16 y anteriores)
```scss
// styles.scss - NO funciona en v19
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
```

### ✅ NUEVO (v19+)
```typescript
// app.config.ts
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

providePrimeNG({
  theme: {
    preset: Aura
  }
})
```

## Estilos Personalizados Adicionales

Si necesitas estilos CSS adicionales específicos:

```scss
// styles.scss

// Sobrescribir fuente si es necesario
.p-button {
  font-family: var(--font-family);
}

// IMPORTANTE: Inputs siempre 100% de ancho
.p-inputtext,
.p-textarea,
.p-password,
.p-dropdown,
.p-calendar {
  width: 100%;
  
  input {
    width: 100%;
  }
}

.p-password-input {
  width: 100%;
}

// IMPORTANTE: Cards sin padding por defecto para control manual
.p-card .p-card-header,
.p-card .p-card-body {
  padding: 0;
}
```

**Preferir:** Usar `definePreset` en lugar de CSS cuando sea posible.

## Dark Mode

```typescript
providePrimeNG({
  theme: {
    preset: DaviviendaPreset,
    options: {
      darkModeSelector: '.dark-mode', // Selector para dark mode
      cssLayer: false
    }
  }
})
```

## CSS Layers

Si usas `@layer` CSS:

```typescript
options: {
  cssLayer: {
    name: 'primeng',
    order: 'reset, primeng'
  }
}
```

## Debugging

Ver tokens aplicados en DevTools:

```typescript
options: {
  prefix: 'p',
  darkModeSelector: false,
  cssLayer: false
}
```

Los tokens se generan como variables CSS con prefijo `--p-`.

## Recursos

- [PrimeNG Theming Docs](https://primeng.org/theming)
- [Design Tokens](https://primeng.org/theming#tokens)
- [GitHub @primeng/themes](https://github.com/primefaces/primeng/tree/master/packages/themes)

## Checklist

- [ ] `@primeng/themes` instalado
- [ ] `providePrimeNG` configurado en app.config.ts
- [ ] Preset personalizado definido con colores del proyecto
- [ ] Sin imports de CSS de temas en angular.json
- [ ] Solo primeicons.css importado

---

**Versión:** PrimeNG 19.x  
**Sistema:** Design Tokens (JavaScript-based)

