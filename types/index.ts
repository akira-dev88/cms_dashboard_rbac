export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

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
}

export interface ApiError {
  message: string;
  statusCode: number;
}