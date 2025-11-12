# PrimeNG - Tema Personalizado

## Regla General
**Crear un tema global de PrimeNG en `styles.scss`.** NO sobrescribir estilos en componentes individuales con `::ng-deep`.

## Por Qué Usar Tema Global

### ❌ Problema con ::ng-deep
```scss
// component.scss - MAL
.my-component {
  ::ng-deep {
    .p-button {
      background-color: var(--red-main);
      border-color: var(--red-main);
    }
    
    .p-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }
}
```

**Problemas:**
- Duplicación de código en cada componente
- Difícil de mantener
- Inconsistencias entre componentes
- `::ng-deep` está deprecated
- Aumenta el bundle size

### ✅ Solución con Tema Global
```scss
// styles.scss - BIEN
:root {
  --primary-color: var(--red-main);
  --primary-color-text: var(--white);
}

.p-button {
  font-family: var(--font-family);
  
  &.p-button-primary {
    background-color: var(--red-main);
    border-color: var(--red-main);
  }
}
```

**Beneficios:**
- Un solo lugar para estilos globales
- Consistencia automática
- Fácil de mantener
- Mejor performance
- Menor bundle size

## Estructura del Tema

### 1. Variables CSS de PrimeNG

Sobrescribir variables de PrimeNG en `:root`:

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
  --primary-color-active: var(--red-dark);
  
  /* Superficies */
  --surface-ground: var(--background-body);
  --surface-card: var(--white);
  --surface-border: var(--gray-main);
  
  /* Texto */
  --text-color: var(--black-main);
  --text-color-secondary: var(--black-light);
  
  /* Colores semánticos */
  --green-500: var(--green-main);
  --red-500: var(--red-main);
  --blue-500: var(--blue-main);
}
```

### 2. Estilos Globales de Componentes

Después de importar temas de PrimeNG, sobrescribir estilos:

```scss
/* Botones */
.p-button {
  font-family: var(--font-family);
  
  &.p-button-primary {
    background-color: var(--red-main);
    border-color: var(--red-main);
    
    &:enabled:hover {
      background-color: var(--red-dark);
      border-color: var(--red-dark);
    }
  }
}

/* Cards */
.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .p-card-title {
    font-family: var(--font-family);
    color: var(--black-dark);
  }
}

/* Inputs */
.p-inputtext:enabled:focus {
  border-color: var(--red-main);
  box-shadow: 0 0 0 0.2rem var(--red-extralight);
}
```

## Configuración en angular.json

**Nota Importante:** PrimeNG 19+ no incluye temas CSS precompilados en `resources/themes/`.

Por lo tanto, creamos nuestro propio tema completo desde cero:

```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

## Estructura del Tema Personalizado

Crear archivo `src/themes/primeng-davivienda.scss`:

```scss
// Tema completo de PrimeNG con colores de Davivienda
.p-button {
  background: var(--red-main);
  // ... estilos completos
}

.p-inputtext {
  // ... estilos completos
}

// etc.
```

Importar en `src/styles.scss`:

```scss
@import 'themes/primeng-davivienda.scss';

:root {
  // Variables CSS
}
```

**Ver:** `src/themes/primeng-davivienda.scss` en el proyecto para el tema completo.

## Componentes Específicos por Tipo

### Botones
```scss
.p-button {
  font-family: var(--font-family);
  
  &.p-button-primary { /* Rojo */ }
  &.p-button-success { /* Verde */ }
  &.p-button-danger { /* Rojo oscuro */ }
  &.p-button-warning { /* Naranja */ }
  &.p-button-info { /* Azul */ }
}
```

### Mensajes Toast
```scss
.p-toast {
  .p-toast-message {
    &.p-toast-message-success {
      background-color: var(--green-extralight);
      border-left: 4px solid var(--green-main);
      color: var(--green-dark);
      
      .p-toast-message-icon {
        color: var(--green-main);
      }
    }
    
    &.p-toast-message-error {
      background-color: var(--red-extralight);
      border-left: 4px solid var(--red-main);
      color: var(--red-dark);
    }
  }
}
```

### Menús
```scss
.p-menu {
  .p-menuitem-link {
    &:hover {
      background-color: var(--gray-light);
      color: var(--red-main);
    }
    
    &.router-link-active {
      background-color: var(--red-extralight);
      color: var(--red-dark);
      font-weight: 600;
    }
  }
}
```

### Tablas
```scss
.p-datatable {
  .p-datatable-thead > tr > th {
    background-color: var(--gray-light);
    color: var(--black-dark);
    font-weight: 600;
  }
  
  .p-datatable-tbody > tr:hover {
    background-color: var(--gray-extralight);
  }
}
```

## Estilos Específicos de Componente

Solo usar estilos locales para layout o estilos únicos del componente:

```scss
// component.scss
.my-component {
  padding: 2rem;
  
  &__header {
    margin-bottom: 1rem;
  }
  
  // ✅ Solo layout y estructura
  // ❌ NO sobrescribir .p-button, .p-card, etc.
}
```

## Cuándo Usar Estilos Locales

Estilos locales son apropiados para:

```scss
.product-card {
  // Layout específico del componente
  display: flex;
  flex-direction: column;
  
  // Transiciones únicas
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  // Clases propias del componente
  &__image {
    width: 100%;
    height: 200px;
  }
  
  &__price {
    color: var(--red-main);
    font-size: 1.5rem;
  }
}
```

## Excepciones

Solo usar `::ng-deep` cuando sea **absolutamente necesario**:

```scss
// Casos excepcionales
.special-component {
  // Si PrimeNG no expone clase y es imposible hacer de otra forma
  ::ng-deep {
    .p-internal-private-class {
      /* Último recurso */
    }
  }
}
```

**Siempre documentar por qué es necesario:**
```scss
/**
 * Usando ::ng-deep porque PrimeNG no expone esta clase
 * y necesitamos este comportamiento específico solo aquí.
 * TODO: Reportar a PrimeNG o buscar alternativa.
 */
::ng-deep .p-some-class { }
```

## Checklist de Tema

Antes de commit, verificar:
- [ ] Variables de PrimeNG sobrescritas en `:root`
- [ ] Estilos globales en `styles.scss`
- [ ] Sin `::ng-deep` en componentes individuales
- [ ] Componentes PrimeNG usan estilos del tema
- [ ] Colores consistentes con variables CSS
- [ ] Fuentes tipográficas aplicadas globalmente

## Ejemplo Completo

```scss
// styles.scss
:root {
  /* Colores del proyecto */
  --red-main: #E1111C;
  --red-dark: #B70412;
  
  /* Variables de PrimeNG */
  --primary-color: var(--red-main);
  --primary-color-hover: var(--red-dark);
}

/* Tema global de componentes */
.p-component {
  font-family: var(--font-family);
}

.p-button {
  &.p-button-primary {
    background-color: var(--primary-color);
    
    &:enabled:hover {
      background-color: var(--primary-color-hover);
    }
  }
}

.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* etc... */
```

## Beneficios del Tema Global

1. **Mantenibilidad**: Cambios en un solo lugar
2. **Consistencia**: Todos los componentes lucen igual
3. **Performance**: Menos CSS duplicado
4. **Escalabilidad**: Fácil agregar nuevos componentes
5. **Profesionalismo**: Código limpio y organizado

## Regla de Oro

**Si necesitas `::ng-deep` para estilar un componente de PrimeNG, probablemente deberías agregarlo al tema global en su lugar.**

---

**Referencia:** `src/styles.scss`

