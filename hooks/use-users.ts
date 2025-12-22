import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { User, CreateUserData, UpdateUserData } from '@/types/users';
import { userApi } from '@/lib/users-api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getAll();
      setUsers(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData: CreateUserData) => {
    setLoading(true);
    try {
      const newUser = await userApi.create(userData);
      setUsers(prev => [newUser, ...prev]);
      toast.success('User created successfully');
      return newUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (id: string, userData: UpdateUserData) => {
    setLoading(true);
    try {
      const updatedUser = await userApi.update(id, userData);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast.success('User updated successfully');
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await userApi.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle user status
  const toggleUserStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      await updateUser(id, { is_active: isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      // Error is already handled in updateUser
    }
  }, [updateUser]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    clearError: () => setError(null),
  };
};