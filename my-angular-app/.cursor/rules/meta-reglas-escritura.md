# Meta-Reglas: Cómo Escribir Buenas Reglas

## Propósito
Este documento define las buenas prácticas para crear y mantener reglas en `.cursor/rules/`.

## 1. Principios Fundamentales

### Ser Conciso
- Ir directo al punto
- Evitar explicaciones obvias
- No repetir información que un desarrollador profesional ya conoce

### Evitar Redundancia
- No explicar lo mismo de múltiples formas
- Un concepto = una explicación
- Si se repite, extraer a una regla separada

### Ser Práctico
- Mostrar ejemplos de código real
- Evitar teoría innecesaria
- Enfocarse en "cómo hacer", no en "por qué existe"

## 2. Estructura de una Regla

```markdown
# Título Descriptivo

## Regla General (opcional)
Resumen de 1-2 líneas del concepto principal

## 1. Primer Concepto

**❌ INCORRECTO:**
```código malo```

**✅ CORRECTO:**
```código bueno```

## 2. Segundo Concepto...
```

## 3. Qué NO Incluir

### ❌ Explicaciones Extensas del "Por Qué"
```markdown
<!-- MAL -->
Los enumeradores son importantes porque TypeScript es un lenguaje 
tipado y esto nos permite aprovechar el sistema de tipos para 
prevenir errores en tiempo de compilación...

<!-- BIEN -->
Usar enums para valores del dominio:
```typescript
enum UserRole { ADMIN = 'admin', USER = 'user' }
```
```

### ❌ Conceptos Básicos del Lenguaje
```markdown
<!-- NO INCLUIR -->
## Qué es un Enum
Un enum es una característica de TypeScript que...

<!-- SI el desarrollador no sabe qué es un enum, no debería estar aquí -->
```

### ❌ Múltiples Ejemplos de lo Mismo
```markdown
<!-- MAL - 5 ejemplos de lo mismo -->
❌ sessionStorage.setItem('token', x);
❌ sessionStorage.setItem('user', x);
❌ sessionStorage.setItem('theme', x);
❌ localStorage.setItem('data', x);
❌ localStorage.setItem('config', x);

<!-- BIEN - 1 o 2 ejemplos representativos -->
❌ sessionStorage.setItem('token', x);
✅ sessionStorage.setItem(StorageKeys.TOKEN, x);
```

### ❌ Warnings y Disclaimers Innecesarios
```markdown
<!-- NO HACER -->
Nota: Recuerda importar el módulo antes de usarlo
Importante: No olvides que esto requiere...
Advertencia: Ten cuidado de...
```

## 4. Qué SÍ Incluir

### ✅ Ejemplos Concretos de Código
```markdown
<!-- Código real que se puede copiar y usar -->
```typescript
export enum StorageKeys {
  USER_TOKEN = 'user_token',
  USER_DATA = 'user_data'
}
```
```

### ✅ Comparaciones Directas
```markdown
❌ INCORRECTO: `if (role === 'admin')`
✅ CORRECTO: `if (role === UserRole.ADMIN)`
```

### ✅ Estructura de Carpetas (si es relevante)
```markdown
src/app/
├── core/enums/
└── shared/constants/
```

### ✅ Una Sección de Beneficios Breve (opcional)
```markdown
## Beneficios
1. Type safety
2. Autocomplete
3. Refactoring seguro
```

## 5. Formato y Estilo

### Títulos
- Usar H1 para título principal
- Usar H2 para secciones principales
- Usar H3 para subsecciones (raramente necesario)

### Código
- Siempre especificar el lenguaje: ````typescript`, `html`, `scss`
- Incluir nombre de archivo cuando sea útil: `// storage-keys.enum.ts`
- Comentarios solo si agregan valor

### Emojis
- Usar solo `❌` y `✅` para ejemplos incorrecto/correcto
- Evitar emojis decorativos innecesarios

### Longitud
- Una regla no debería exceder 400 líneas
- Si excede, dividir en múltiples archivos temáticos

## 6. Nomenclatura de Archivos

Usar kebab-case descriptivo:

```
✅ angular-primeng-best-practices.md
✅ enumeradores-constantes.md
✅ servicios-http.md
✅ meta-reglas-escritura.md

❌ rules.md (muy genérico)
❌ best-practices.md (muy genérico)
❌ Angular_Best_Practices.md (formato incorrecto)
```

## 7. Mantenimiento

### Actualización
- Incluir versión o fecha al final: `**Versión:** Angular 19.x`
- Actualizar cuando cambien las prácticas del framework

### Revisión
- Cada 3-6 meses revisar vigencia
- Eliminar reglas obsoletas o redundantes
- Consolidar reglas que se solapan

### Organización
- Una regla = un tema específico
- Si dos reglas se relacionan mucho, fusionar
- Si una regla cubre muchos temas, dividir

## 8. Checklist para Nueva Regla

Antes de crear una regla, verificar:

- [ ] ¿Es información que no es obvia para un dev profesional?
- [ ] ¿Contiene ejemplos prácticos de código?
- [ ] ¿Evita redundancia con reglas existentes?
- [ ] ¿Es específica a este proyecto/stack?
- [ ] ¿Tiene menos de 400 líneas?
- [ ] ¿El nombre del archivo es descriptivo?
- [ ] ¿Usa formato consistente con otras reglas?

## 9. Plantilla Básica

```markdown
# [Título de la Regla]

## Regla General
[1-2 líneas resumen]

## 1. [Concepto Principal]

**❌ INCORRECTO:**
```[lenguaje]
// código malo
```

**✅ CORRECTO:**
```[lenguaje]
// código bueno
```

## 2. [Otro Concepto]

...

## Beneficios
1. Beneficio 1
2. Beneficio 2

---
**Versión:** [Framework/Fecha]
```

## 10. Ejemplo de Buena vs Mala Regla

### ❌ Regla Mal Escrita (Redundante y Obvia)

```markdown
# Uso de Variables en TypeScript

## ¿Qué es una Variable?
Una variable es un contenedor que almacena datos...

## Por Qué Usar Variables
Las variables son fundamentales en programación porque...

## Tipos de Variables
En TypeScript tenemos let, const y var...

## Cuándo Usar Let
Usa let cuando el valor va a cambiar...
Ejemplo 1: let x = 1;
Ejemplo 2: let y = 2;
Ejemplo 3: let z = 3;
...
```

### ✅ Regla Bien Escrita (Concisa y Práctica)

```markdown
# Constantes de Configuración

## Regla General
Centralizar configuración en constantes tipadas.

## Estructura

```typescript
// app.constants.ts
export const AppConfig = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
} as const;
```

## Uso

```typescript
this.http.get(AppConfig.API_URL, { 
  timeout: AppConfig.TIMEOUT 
});
```

## Beneficios
- Type safety
- Single source of truth
- Fácil de modificar
```

## Regla Final

**Cada regla debe aportar valor inmediato al desarrollador sin requerir leer múltiples párrafos de contexto.**

Si un desarrollador no puede entender y aplicar la regla en menos de 2 minutos, necesita ser simplificada.

---

**Meta-Regla:** Si esta regla no se sigue, las otras reglas pierden efectividad.

