# Meta-Reglas: Cómo Escribir Buenas Reglas

## Propósito
Este documento define las buenas prácticas para crear y mantener reglas en `.cursor/rules/`.

## 0. Regla Crítica

### ❌ NUNCA Crear Archivos Innecesarios

**NO crear estos archivos a menos que se solicite explícitamente:**
- README.md en carpetas de reglas o configuración
- Archivos de índice o tabla de contenidos
- Documentación adicional no solicitada
- Archivos de ayuda o guías generadas automáticamente

**Razón:** Las reglas deben ser autoexplicativas por su nombre de archivo y contenido. Archivos adicionales de índice o documentación crean ruido y requieren mantenimiento innecesario.

**✅ CORRECTO:**
```
.cursor/rules/
├── angular-componentes.md
├── primeng-integracion.md
└── servicios-http-api.md
```

**❌ INCORRECTO:**
```
.cursor/rules/
├── README.md                    # ❌ Innecesario
├── INDEX.md                     # ❌ Innecesario
├── GUIDE.md                     # ❌ Innecesario
├── angular-componentes.md
├── primeng-integracion.md
└── servicios-http-api.md
```

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

### ❌ Ejemplos Completos Extensos
```markdown
<!-- MAL - Ejemplo completo que repite todo lo anterior -->
## Ejemplo Completo

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
// ... 60+ líneas de código completo
```

<!-- BIEN - Referencia concisa -->
**Ver:** otros archivos de reglas para ejemplos específicos.
```

### ❌ Checklists Extensos
```markdown
<!-- MAL - 30+ items en checklist -->
- [ ] Item 1
- [ ] Item 2
... 30 items más

<!-- BIEN - Reglas clave concisas -->
## Reglas Clave
- Usar readonly para servicios inyectados
- No usar any sin justificación
- Eliminar imports no usados
```

### ❌ Secciones de Beneficios Obvias
```markdown
<!-- MAL - Beneficios obvios -->
## Beneficios
1. Mantenibilidad: Código más fácil de mantener
2. Performance: Mejor rendimiento
3. Type Safety: Más seguro

<!-- BIEN - Omitir o hacer muy breve -->
Las reglas deben enfocarse en el "cómo", los beneficios son obvios.
```

### ❌ Comandos Operacionales
```markdown
<!-- MAL - Comandos que no aportan al modelo -->
## Herramientas
```bash
npm run lint
npm run format
```

<!-- BIEN - Omitir completamente -->
Comandos operacionales no ayudan al modelo a generar código.
```

### ❌ Valores Hardcodeados que Contradicen Otras Reglas
```markdown
<!-- MAL - Colores hardcodeados en ejemplos -->
const preset = {
  primary: {
    500: '#E1111C',  // ❌ Contradice regla de no hardcodear colores
    600: '#B70412'
  }
}

<!-- BIEN - Referencia o tokens -->
const preset = {
  primary: {
    // Usar variables del proyecto (ver variables-css-colores.md)
  }
}
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

### ✅ Referencias Cruzadas Entre Archivos
```markdown
<!-- Evitar duplicación usando referencias -->
**Ver:** `limpieza-codigo.md` para uso completo de readonly.
**Ver también:** `documentacion-codigo.md` para JSDoc.
```

### ✅ Reglas Clave en Lugar de Checklists
```markdown
## Reglas Clave
- Servicios inyectados: `readonly`
- No usar `any` sin justificación
- Eliminar imports no usados
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
- Una regla no debería exceder 300 líneas (ideal: 150-250)
- Si excede, dividir en múltiples archivos temáticos
- Eliminar redundancias antes de dividir

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

### Revisión Periódica (cada 3-6 meses)
**Buscar y eliminar:**
1. **Redundancias entre archivos**
   - Información duplicada en múltiples archivos
   - Conceptos explicados de formas diferentes
   
2. **Contradicciones**
   - Ejemplos que violan otras reglas del proyecto
   - Recomendaciones inconsistentes entre archivos
   
3. **Información innecesaria**
   - Ejemplos completos extensos (50+ líneas)
   - Checklists largos (10+ items)
   - Secciones de beneficios obvias
   - Comandos operacionales
   - Visualizaciones ASCII redundantes
   
4. **Oportunidades de consolidación**
   - Archivos que cubren temas solapados
   - Conceptos que se pueden referenciar en lugar de duplicar

### Organización
- Una regla = un tema específico
- Si dos reglas se relacionan mucho, fusionar
- Si una regla cubre muchos temas, dividir
- Usar referencias cruzadas en lugar de duplicar

## 8. Checklist para Nueva Regla

Antes de crear una regla, verificar:

### Archivos y Estructura
- [ ] ¿NO es un archivo README, INDEX o documentación innecesaria?
- [ ] ¿El nombre del archivo es descriptivo (kebab-case)?
- [ ] ¿Tiene menos de 300 líneas? (ideal: 150-250)

### Contenido
- [ ] ¿Es información que no es obvia para un dev profesional?
- [ ] ¿Contiene ejemplos prácticos de código?
- [ ] ¿Evita redundancia con reglas existentes?
- [ ] ¿Es específica a este proyecto/stack?

### Qué NO Incluir
- [ ] ¿NO tiene ejemplos completos extensos (50+ líneas)?
- [ ] ¿NO tiene checklists extensos (10+ items)?
- [ ] ¿NO tiene sección de "Beneficios" obvia?
- [ ] ¿NO tiene comandos operacionales (npm, git)?
- [ ] ¿NO tiene valores hardcodeados que contradicen otras reglas?
- [ ] ¿NO tiene múltiples ejemplos de lo mismo?

### Optimización
- [ ] ¿Usa referencias cruzadas en lugar de duplicar?
- [ ] ¿Tiene sección "Reglas Clave" en lugar de checklist?
- [ ] ¿Los ejemplos son concisos (5-15 líneas)?

## 9. Plantilla Básica

```markdown
# [Título de la Regla]

## Regla General
[1-2 líneas resumen]

## 1. [Concepto Principal]

**❌ INCORRECTO:**
```[lenguaje]
// código malo (5-10 líneas)
```

**✅ CORRECTO:**
```[lenguaje]
// código bueno (5-10 líneas)
```

## 2. [Otro Concepto]

**Ver:** `otro-archivo.md` para más detalles.

## Regla de Oro

**[Resumen en una línea]**

---
**Versión:** [Framework/Fecha]
```

**Notas sobre la plantilla:**
- Omitir sección "Beneficios" (son obvios)
- Usar "Regla de Oro" o "Reglas Clave" en lugar de checklist
- Referencias cruzadas para evitar duplicación
- Ejemplos concisos (5-15 líneas máximo)
- Sin comandos operacionales ni herramientas

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

## Reglas Finales

### 1. Claridad Inmediata
**Cada regla debe aportar valor inmediato sin requerir múltiples párrafos de contexto.**
- Si no se entiende en menos de 2 minutos, simplificar.

### 2. Sin Archivos Innecesarios
**NUNCA crear archivos README, INDEX o documentación adicional.**
- Las reglas son autoexplicativas por su nombre y contenido.

### 3. Sin Redundancias
**Si algo ya está en otro archivo, usar referencia cruzada.**
- Ejemplo: `**Ver:** limpieza-codigo.md`
- NO duplicar información entre archivos.

### 4. Sin Elementos Innecesarios
**Eliminar todo lo que no ayude al modelo a generar código correcto:**
- ❌ Ejemplos completos extensos (50+ líneas)
- ❌ Checklists largos (10+ items)
- ❌ Secciones de "Beneficios" obvias
- ❌ Comandos operacionales (npm, git)
- ❌ Múltiples ejemplos de lo mismo

### 5. Consistencia
**No contradecir otras reglas en los ejemplos.**
- Si existe una regla de "no hardcodear colores", los ejemplos NO deben tener colores hardcodeados.

### 6. Optimización Continua
**Revisar y optimizar cada 3-6 meses:**
- Eliminar redundancias
- Consolidar archivos solapados
- Reducir longitud sin perder claridad

---

**Meta-Regla:** Si estas reglas no se siguen, las otras reglas pierden efectividad y el contexto del modelo se llena de ruido innecesario.

