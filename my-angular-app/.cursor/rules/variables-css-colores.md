# Variables CSS de Colores

## Regla General
**NUNCA usar valores hexadecimales, RGB o nombres de colores directamente.** Siempre usar las variables CSS definidas en `src/styles.scss`.

## Variables Disponibles

### Colores Primarios

**Rojo (Red)**
- `--red-dark: #B70412`
- `--red-main: #E1111C`
- `--red-light: #FF3A44`
- `--red-extralight: #FBE7E8`

**Azul (Blue)**
- `--blue-dark: #063C85`
- `--blue-main: #005EDC`
- `--blue-light: #3186F8`
- `--blue-extralight: #E5EEFB`

**Verde (Green)**
- `--green-dark: #04592F`
- `--green-main: #028846`
- `--green-light: #16BD6B`
- `--green-extralight: #E5F3EC`

**Naranja (Orange)**
- `--orange-dark: #BF5300`
- `--orange-main: #E96A08`
- `--orange-light: #FF872A`
- `--orange-extralight: #FEEEE5`

### Colores Secundarios

**Amarillo (Yellow)**
- `--yellow-dark: #FFAF05`
- `--yellow-main: #FDBB11`
- `--yellow-light: #FFD979`
- `--yellow-extralight: #FEF8E7`

**Violeta (Violet)**
- `--violet-dark: #520DB1`
- `--violet-main: #7E21FF`
- `--violet-light: #9261FF`
- `--violet-extralight: #F2E8FF`

**Turquesa (Turquoise)**
- `--turquoise-dark: #008988`
- `--turquoise-main: #05C3C1`
- `--turquoise-light: #3BFAF8`
- `--turquoise-extralight: #E5F9F8`

**Dorado (Gold)**
- `--gold-dark: #A86900`
- `--gold-main: #D18800`
- `--gold-light: #D8AB58`
- `--gold-extralight: #FBEECE`

### Colores Neutros

**Negro (Black)**
- `--black-dark: #1D1D1D`
- `--black-main: #404040`
- `--black-light: #6E6E6E`
- `--black-extralight: #8C8C8C`
- `--black-thin: #D9D9D9`

**Gris (Gray)**
- `--gray-dark-1: #E0E1E3`
- `--gray-main: #EDEEF0`
- `--gray-light: #F2F3F5`
- `--gray-extralight: #F7F7F7`

**Gris Azulado (Gray Blue)**
- `--gray-blue-dark: #21262E`
- `--gray-blue-main: #343A45`
- `--gray-blue-light: #4B5C6F`
- `--gray-blue-extralight: #C7D2DA`
- `--gray-blue-thin: #F4F6F7`

**Blanco y Fondo**
- `--white: #FFFFFF`
- `--background-body: #ebecf0`

### Tipografías

- `--font-family: Davivienda, sans-serif`
- `--font-family-condensed: Davivienda Condensed, sans-serif`
- `--roboto: Roboto, sans-serif`
- `--roboto-condensed: Roboto Condensed, sans-serif`

## Uso en Componentes

### ❌ INCORRECTO - Colores Hardcodeados

```scss
// component.scss
.button {
  background-color: #E1111C;
  color: #FFFFFF;
  border: 1px solid #B70412;
}

.card {
  background: rgb(255, 255, 255);
  color: rgba(64, 64, 64, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: 'Roboto', sans-serif;
  color: black;
}
```

### ✅ CORRECTO - Variables CSS

```scss
// component.scss
.button {
  background-color: var(--red-main);
  color: var(--white);
  border: 1px solid var(--red-dark);
}

.card {
  background: var(--white);
  color: var(--black-main);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Transparencias son permitidas
}

h1 {
  font-family: var(--roboto);
  color: var(--black-dark);
}
```

## Uso en Templates

### ❌ INCORRECTO

```html
<div style="background-color: #E1111C; color: white;">
  Content
</div>

<p-button 
  [style]="{'background-color': '#005EDC', 'color': '#FFFFFF'}">
</p-button>
```

### ✅ CORRECTO

```html
<div [style.background-color]="'var(--red-main)'" 
     [style.color]="'var(--white)'">
  Content
</div>

<!-- Mejor aún: usar clases -->
<div class="primary-button">Content</div>
```

```scss
.primary-button {
  background-color: var(--red-main);
  color: var(--white);
}
```

## Uso en TypeScript (Cuando sea Necesario)

### ❌ INCORRECTO

```typescript
@Component({...})
export class MyComponent {
  backgroundColor = '#E1111C';
  textColor = '#FFFFFF';
}
```

### ✅ CORRECTO

```typescript
@Component({...})
export class MyComponent {
  // Referenciar variables CSS
  backgroundColor = 'var(--red-main)';
  textColor = 'var(--white)';
  
  // O mejor, usar clases CSS
  buttonClass = 'primary-button';
}
```

## Estados de Componentes

Usar diferentes tonalidades para estados:

```scss
.button {
  background-color: var(--blue-main);
  
  &:hover {
    background-color: var(--blue-light);
  }
  
  &:active {
    background-color: var(--blue-dark);
  }
  
  &:disabled {
    background-color: var(--gray-main);
    color: var(--black-extralight);
  }
}
```

## Mensajes y Alertas

Usar colores semánticos:

```scss
.alert {
  &--success {
    background-color: var(--green-extralight);
    color: var(--green-dark);
    border-left: 4px solid var(--green-main);
  }
  
  &--error {
    background-color: var(--red-extralight);
    color: var(--red-dark);
    border-left: 4px solid var(--red-main);
  }
  
  &--warning {
    background-color: var(--orange-extralight);
    color: var(--orange-dark);
    border-left: 4px solid var(--orange-main);
  }
  
  &--info {
    background-color: var(--blue-extralight);
    color: var(--blue-dark);
    border-left: 4px solid var(--blue-main);
  }
}
```

## Jerarquía de Tonalidades

Cada familia de color tiene 4 niveles:
1. **dark**: Elementos activos, bordes, textos sobre fondos claros
2. **main**: Color principal del componente
3. **light**: Hover states, elementos secundarios
4. **extralight**: Fondos, badges, highlights

```scss
// Ejemplo: Card con estado
.card {
  background: var(--white);
  border: 1px solid var(--blue-main);
  
  &__header {
    background: var(--blue-extralight);
    color: var(--blue-dark);
  }
  
  &__badge {
    background: var(--blue-light);
    color: var(--white);
  }
}
```

## Temas con PrimeNG

Mapear variables de PrimeNG a nuestras variables:

```scss
// En styles.scss después de importar PrimeNG
:root {
  // Sobrescribir variables de PrimeNG
  --primary-color: var(--red-main);
  --primary-color-text: var(--white);
  --text-color: var(--black-main);
  --surface-ground: var(--background-body);
}
```

## Transparencias

Las transparencias se pueden combinar con variables:

```scss
.overlay {
  // Permitido: agregar alpha a variables
  background-color: rgba(var(--red-main-rgb), 0.8);
}

// Definir versión RGB si es necesario
:root {
  --red-main-rgb: 225, 17, 28;
}
```

## Excepción: Transparencias

Solo permitido usar valores sin variables para transparencias:

```scss
.element {
  background: transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // Negro transparente OK
}
```

## Regla Crítica

**NUNCA hardcodear colores. Siempre usar variables CSS del proyecto.**

