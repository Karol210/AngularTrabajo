# Uso de Enumeradores y Constantes

## Regla General
**Nunca hardcodear textos o valores mágicos en la aplicación.** Usar enumeradores, constantes o tipos específicos para todos los valores reutilizables.

## 1. Session Storage / Local Storage

**❌ INCORRECTO - Valores hardcodeados:**
```typescript
// NO hacer esto
sessionStorage.setItem('user_token', token);
sessionStorage.setItem('user_data', JSON.stringify(user));
localStorage.setItem('theme', 'dark');

const token = sessionStorage.getItem('user_token');
```

**✅ CORRECTO - Usar enum o constantes:**
```typescript
// storage-keys.enum.ts
export enum StorageKeys {
  USER_TOKEN = 'user_token',
  USER_DATA = 'user_data',
  USER_PREFERENCES = 'user_preferences',
  THEME = 'theme',
  LANGUAGE = 'language',
  LAST_LOGIN = 'last_login'
}

// Uso
sessionStorage.setItem(StorageKeys.USER_TOKEN, token);
sessionStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
localStorage.setItem(StorageKeys.THEME, 'dark');

const token = sessionStorage.getItem(StorageKeys.USER_TOKEN);
```

## 2. Rutas y Endpoints

**❌ INCORRECTO:**
```typescript
this.router.navigate(['/dashboard/users']);
this.http.get('/api/users/list');
```

**✅ CORRECTO:**
```typescript
// routes.enum.ts
export enum AppRoutes {
  HOME = '/',
  DASHBOARD = '/dashboard',
  USERS = '/dashboard/users',
  PROFILE = '/profile',
  LOGIN = '/auth/login',
  REGISTER = '/auth/register'
}

// api-endpoints.enum.ts
export enum ApiEndpoints {
  USERS_LIST = '/api/users/list',
  USERS_CREATE = '/api/users/create',
  USERS_UPDATE = '/api/users/update',
  USERS_DELETE = '/api/users/delete',
  AUTH_LOGIN = '/api/auth/login',
  AUTH_LOGOUT = '/api/auth/logout'
}

// Uso
this.router.navigate([AppRoutes.USERS]);
this.http.get(ApiEndpoints.USERS_LIST);
```

## 3. Estados y Tipos

**❌ INCORRECTO:**
```typescript
if (status === 'active') { }
if (role === 'admin') { }
```

**✅ CORRECTO:**
```typescript
// user-status.enum.ts
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

// user-role.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

// Uso
if (status === UserStatus.ACTIVE) { }
if (role === UserRole.ADMIN) { }
```

## 4. Mensajes y Textos de UI

**❌ INCORRECTO:**
```typescript
this.messageService.add({
  severity: 'success',
  summary: 'Éxito',
  detail: 'Usuario creado correctamente'
});
```

**✅ CORRECTO:**
```typescript
// messages.constants.ts
export const Messages = {
  SUCCESS: {
    USER_CREATED: 'Usuario creado correctamente',
    USER_UPDATED: 'Usuario actualizado correctamente',
    USER_DELETED: 'Usuario eliminado correctamente',
    DATA_SAVED: 'Datos guardados correctamente'
  },
  ERROR: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    SERVER_ERROR: 'Error del servidor',
    NETWORK_ERROR: 'Error de conexión'
  },
  WARNING: {
    UNSAVED_CHANGES: 'Tienes cambios sin guardar',
    SESSION_EXPIRING: 'Tu sesión está por expirar'
  }
} as const;

// Uso
this.messageService.add({
  severity: 'success',
  summary: 'Éxito',
  detail: Messages.SUCCESS.USER_CREATED
});
```

## 5. Configuración y Constantes de Aplicación

**❌ INCORRECTO:**
```typescript
const pageSize = 10;
const timeout = 30000;
const maxUploadSize = 5242880; // ¿Qué es esto?
```

**✅ CORRECTO:**
```typescript
// app.constants.ts
export const AppConstants = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
  },
  TIMEOUTS: {
    API_REQUEST: 30000,      // 30 segundos
    DEBOUNCE_SEARCH: 300,    // 300ms
    SESSION_WARNING: 60000   // 1 minuto
  },
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024,  // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    MAX_FILES: 10
  }
} as const;

// Uso
const pageSize = AppConstants.PAGINATION.DEFAULT_PAGE_SIZE;
```

## 6. Severidades y Colores de PrimeNG

**❌ INCORRECTO:**
```typescript
<p-button severity="primary" />
<p-message severity="success" />
```

**✅ CORRECTO:**
```typescript
// prime-ng.enums.ts
export enum PrimeNGSeverity {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  HELP = 'help',
  CONTRAST = 'contrast'
}

// Uso en componente
severity = PrimeNGSeverity.PRIMARY;
```

```html
<p-button [severity]="severity" />
```

## 7. Organización de Enums y Constantes

Estructura recomendada:

```
src/app/
├── core/
│   └── enums/
│       ├── storage-keys.enum.ts
│       ├── app-routes.enum.ts
│       ├── api-endpoints.enum.ts
│       ├── user-role.enum.ts
│       └── user-status.enum.ts
├── shared/
│   └── constants/
│       ├── app.constants.ts
│       ├── messages.constants.ts
│       └── validation.constants.ts
```

## 8. Tipos de Exportación

### Para valores que no cambian:
```typescript
export const Config = {
  API_URL: 'https://api.example.com',
  APP_NAME: 'My App'
} as const;
```

### Para valores de dominio:
```typescript
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### Para tipos de unión cuando no se necesita enum:
```typescript
export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'es' | 'en' | 'fr';
```

## 9. Validaciones

**❌ INCORRECTO:**
```typescript
Validators.minLength(3)
Validators.maxLength(50)
Validators.pattern(/^[a-zA-Z0-9]+$/)
```

**✅ CORRECTO:**
```typescript
// validation.constants.ts
export const ValidationConstants = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
  },
  EMAIL: {
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// Uso
Validators.minLength(ValidationConstants.USERNAME.MIN_LENGTH)
Validators.pattern(ValidationConstants.USERNAME.PATTERN)
```

## 10. HTTP Status Codes

**❌ INCORRECTO:**
```typescript
if (response.status === 200) { }
if (error.status === 404) { }
```

**✅ CORRECTO:**
```typescript
// http-status.enum.ts
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// Uso
if (response.status === HttpStatus.OK) { }
if (error.status === HttpStatus.NOT_FOUND) { }
```

## Beneficios

1. **Mantenibilidad**: Cambiar un valor en un solo lugar
2. **Autocomplete**: IDE sugiere valores válidos
3. **Type Safety**: TypeScript detecta errores en tiempo de compilación
4. **Refactoring**: Renombrar es seguro y fácil
5. **Documentación**: Valores centralizados son auto-documentados
6. **Búsqueda**: Encontrar uso de valores específicos es trivial

## Regla de Oro

**Si un valor se usa más de una vez, o representa un concepto del dominio, debe ser un enum o constante.**

---

**Última actualización:** Noviembre 2024

