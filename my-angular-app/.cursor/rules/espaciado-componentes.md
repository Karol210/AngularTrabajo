# Espaciado y Alineación en Componentes

## Regla General
El contenedor padre es un **cuadrado** que controla todo el espaciado lateral. Los componentes internos nunca deben tener padding lateral.

## Principio del Cuadrado

```
┌─────────────────────────────────┐
│ Padre (controla padding)        │
│  ┌──────────────────────────┐   │
│  │ Hijo 1 (sin padding)     │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ Hijo 2 (sin padding)     │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

**Solo el padre tiene padding lateral → Todos los hijos se alinean automáticamente.**

## Principios

### 1. Control de Padding
El contenedor padre aplica padding lateral consistente. Los hijos NUNCA aplican su propio padding lateral.

**✅ CORRECTO - Padre controla los lados:**
```scss
.card {
  padding: 1.5rem;  // ✅ Solo el padre tiene padding lateral

  &__header {
    padding-top: 0.5rem;    // ✅ Solo espaciado vertical
    padding-bottom: 1rem;
  }

  &__body {
    // Sin padding lateral, hereda del padre
  }

  &__icon,
  &__title,
  &__content {
    // Sin padding lateral, todos alineados por el padre
  }
}
```

**❌ INCORRECTO - Hijos con padding lateral:**
```scss
.card {
  &__header {
    padding: 2rem 1.5rem 1rem 1.5rem;  // ❌ Hijo controla sus lados
  }

  &__icon {
    padding-left: 1rem;   // ❌ Cada elemento con su padding
  }

  &__title {
    padding: 0 1.5rem;    // ❌ Diferentes paddings laterales
  }

  &__body {
    padding: 0 2rem;      // ❌ Padding diferente = desalineación
  }
}
```

### 2. PrimeNG Cards - Enfoque del Cuadrado

Eliminar padding por defecto de PrimeNG:

```scss
// styles.scss - Global
.p-card .p-card-header,
.p-card .p-card-body {
  padding: 0;
}
```

**Aplicar padding solo en el contenedor padre (la card):**

```scss
// component.scss
.my-card {
  padding: 1.5rem;  // ✅ Solo el padre (cuadrado) controla los lados

  &__header {
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    // Sin padding lateral
  }

  &__form {
    padding-top: 0.5rem;
    // Sin padding lateral
  }

  &__footer {
    padding-top: 1rem;
    // Sin padding lateral
  }
}
```

**Resultado:** Todos los elementos internos (header, form, footer) están perfectamente alineados porque el padre controla el espaciado lateral.

### 3. Solo Espaciado Vertical en Hijos

Los hijos solo deben controlar su espaciado vertical (arriba/abajo), nunca lateral:

```scss
.container {
  padding: 1.5rem;  // ✅ Padre = cuadrado con padding lateral

  &__section-1 {
    padding-bottom: 1rem;  // ✅ Solo espaciado vertical
  }

  &__section-2 {
    padding-top: 0.5rem;
    padding-bottom: 1rem;  // ✅ Solo espaciado vertical
  }

  &__section-3 {
    padding-top: 1rem;     // ✅ Solo espaciado vertical
  }
}
```

### 4. Visualización del Cuadrado

**Todos los elementos deben estar dentro del "cuadrado" del padre:**

```
❌ INCORRECTO - Elementos tocando bordes:
┌─────────────────────────────────┐
│Título aquí                      │
│Contenido aquí                   │
└─────────────────────────────────┘

✅ CORRECTO - Padding del cuadrado padre:
┌─────────────────────────────────┐
│  ┌──────────────────────────┐   │
│  │ Título aquí             │   │
│  │ Contenido aquí          │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

```html
<!-- ✅ Padre controla los bordes -->
<div class="card">
  <div class="card__header">
    <i class="pi pi-shield"></i>
    <h2>Título</h2>
  </div>
  <div class="card__content">
    <p>Contenido</p>
  </div>
</div>
```

```scss
.card {
  padding: 1.5rem;  // ✅ Cuadrado con espacio lateral

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;  // ✅ Solo espaciado vertical
  }

  &__content {
    // Sin padding, alineado por el padre
  }
}
```

## Valores de Espaciado Estándar

Usar sistema consistente de espaciado:

```scss
:root {
  --spacing-xs: 0.25rem;   // 4px
  --spacing-sm: 0.5rem;    // 8px
  --spacing-md: 1rem;      // 16px
  --spacing-lg: 1.5rem;    // 24px
  --spacing-xl: 2rem;      // 32px
  --spacing-2xl: 3rem;     // 48px
}
```

### Uso Típico:

- **Padding de tarjetas:** `1.5rem - 2rem`
- **Gap entre elementos:** `1rem - 1.5rem`
- **Margen entre secciones:** `2rem - 3rem`
- **Espacio entre labels e inputs:** `0.5rem`

## Ejemplo Completo - Principio del Cuadrado

```html
<div class="login-card">
  <div class="login-card__header">
    <i class="pi pi-shield"></i>
    <h2>Iniciar Sesión</h2>
  </div>

  <form class="login-card__form">
    <div class="form-field">
      <label>Usuario</label>
      <input pInputText />
    </div>
    <div class="form-field">
      <label>Contraseña</label>
      <input pInputText type="password" />
    </div>
  </form>
</div>
```

```scss
.login-card {
  padding: 1.5rem;  // ✅ PADRE = CUADRADO (controla lados)

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 1rem;  // ✅ Solo espaciado vertical
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 0.5rem;   // ✅ Solo espaciado vertical
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  // Sin padding, alineado por el cuadrado padre
}
```

**Resultado:** 
- Ícono, título, inputs, labels → todos perfectamente alineados
- Un solo valor de padding lateral en toda la card (1.5rem)
- Fácil de modificar: cambiar 1 valor cambia todo

## Checklist - Principio del Cuadrado

- [ ] ✅ El padre es un "cuadrado" con padding lateral único
- [ ] ✅ Los hijos NO tienen padding lateral
- [ ] ✅ Los hijos solo usan padding vertical (top/bottom)
- [ ] ✅ Todos los elementos internos están alineados verticalmente
- [ ] ✅ Un solo valor de padding lateral en todo el componente
- [ ] ✅ Uso de `gap` para separar elementos hijos
- [ ] ✅ PrimeNG Cards con padding manual siguiendo este principio

## Regla de Oro

**1 Componente = 1 Cuadrado = 1 Padding Lateral**

Si tienes múltiples valores de padding lateral en un mismo componente, estás violando el principio del cuadrado.

