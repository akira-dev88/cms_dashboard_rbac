import { api } from './api';
import { User, CreateUserData, UpdateUserData, PaginatedResponse } from '@/types/users';

export const userApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get single user
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  create: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Toggle user active status
  toggleStatus: async (id: string, isActive: boolean): Promise<User> => {
    return userApi.update(id, { is_active: isActive });
  },
};