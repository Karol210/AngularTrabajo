export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Credenciales de login de usuario (email y password).
 */
export interface UserLoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta del servicio de login de usuario.
 */
export interface UserLoginResponse {
  token: string;
  username: string;
  message: string;
  expiresIn: number;
}

