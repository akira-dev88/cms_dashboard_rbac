import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginData, RegisterData, AuthResponse, ApiError, User } from '@/types';
import { api } from '@/lib/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback(async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      const { access_token, user: userData } = response.data; // Updated to match backend response
      
      localStorage.setItem('access_token', access_token);
      setUser(userData); // Set user from login response
      
      router.push('/dashboard');
      toast.success('Logged in successfully!');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      // Send password, not password_hash - backend will hash it
      const response = await api.post('/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password, // Changed from password_hash
      });
      
      toast.success('Account created successfully!');
      
      // Auto-login after registration
      await login({ email: data.email, password: data.password });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
    toast.info('You have been logged out');
    router.push('/login');
  }, [router]);

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me'); // Changed from POST to GET
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (err: any) {
      console.error('Failed to get user:', err);
      setUser(null);
      return null;
    }
  }, []);

  // Function to update user state
  const updateUser = useCallback((userData: User | null) => {
    setUser(userData);
  }, []);

  return {
    // State
    user,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    
    // Utility
    clearError: () => setError(null),
  };
};