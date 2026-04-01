// types/index.ts
export * from './users';
export * from './rbac';

// Import User type from the exported module
import { User } from './users';

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}