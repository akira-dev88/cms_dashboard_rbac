export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  mfa_enabled: boolean;
  last_login_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

// Helper type for form data
export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}