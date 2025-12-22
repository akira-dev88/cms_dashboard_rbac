import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Role,
  Permission,
  UserRole,
  AssignRoleData,
  CreateRoleData,
  UpdateRoleData,
  CreatePermissionData,
  UpdatePermissionData,
  AssignPermissionData,
} from '@/types/rbac';
import { rbacApi } from '@/lib/rbac-api';

export const useRbac = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Roles ---
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rbacApi.getRoles();
      setRoles(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch roles';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (roleData: CreateRoleData) => {
    setLoading(true);
    try {
      const newRole = await rbacApi.createRole(roleData);
      setRoles(prev => [newRole, ...prev]);
      toast.success('Role created successfully');
      return newRole;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (id: string, roleData: UpdateRoleData) => {
    setLoading(true);
    try {
      const updatedRole = await rbacApi.updateRole(id, roleData);
      setRoles(prev => prev.map(role => 
        role.id === id ? updatedRole : role
      ));
      toast.success('Role updated successfully');
      return updatedRole;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await rbacApi.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
      toast.success('Role deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Permissions ---
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rbacApi.getPermissions();
      setPermissions(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch permissions';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPermission = useCallback(async (permissionData: CreatePermissionData) => {
    setLoading(true);
    try {
      const newPermission = await rbacApi.createPermission(permissionData);
      setPermissions(prev => [newPermission, ...prev]);
      toast.success('Permission created successfully');
      return newPermission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePermission = useCallback(async (id: string, permissionData: UpdatePermissionData) => {
    setLoading(true);
    try {
      const updatedPermission = await rbacApi.updatePermission(id, permissionData);
      setPermissions(prev => prev.map(permission => 
        permission.id === id ? updatedPermission : permission
      ));
      toast.success('Permission updated successfully');
      return updatedPermission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePermission = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await rbacApi.deletePermission(id);
      setPermissions(prev => prev.filter(permission => permission.id !== id));
      toast.success('Permission deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Role Assignment ---
  const assignRole = useCallback(async (assignData: AssignRoleData) => {
    setLoading(true);
    try {
      const result = await rbacApi.assignRole(assignData);
      toast.success('Role assigned successfully');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to assign role';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    roles,
    permissions,
    loading,
    error,
    
    // Role actions
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    
    // Permission actions
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    
    // Role assignment
    assignRole,
    
    // Utility
    clearError: () => setError(null),
  };
};