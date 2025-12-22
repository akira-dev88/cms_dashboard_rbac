import { api } from './api';
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

export const rbacApi = {
  // --- Roles ---
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/rbac/roles');
    return response.data;
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await api.get(`/rbac/roles/${id}`);
    return response.data;
  },

  createRole: async (roleData: CreateRoleData): Promise<Role> => {
    const response = await api.post('/rbac/roles', roleData);
    return response.data;
  },

  updateRole: async (id: string, roleData: UpdateRoleData): Promise<Role> => {
    const response = await api.patch(`/rbac/roles/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/rbac/roles/${id}`);
  },

  // --- Permissions ---
  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/rbac/permissions');
    return response.data;
  },

  getPermission: async (id: string): Promise<Permission> => {
    const response = await api.get(`/rbac/permissions/${id}`);
    return response.data;
  },

  createPermission: async (permissionData: CreatePermissionData): Promise<Permission> => {
    const response = await api.post('/rbac/permissions', permissionData);
    return response.data;
  },

  updatePermission: async (id: string, permissionData: UpdatePermissionData): Promise<Permission> => {
    const response = await api.patch(`/rbac/permissions/${id}`, permissionData);
    return response.data;
  },

  deletePermission: async (id: string): Promise<void> => {
    await api.delete(`/rbac/permissions/${id}`);
  },

  // --- Role Assignment ---
  assignRole: async (assignData: AssignRoleData): Promise<UserRole> => {
    const response = await api.post('/rbac/assign-role', assignData);
    return response.data;
  },

  // Get user roles
  getUserRoles: async (userId: string): Promise<UserRole[]> => {
    const response = await api.get(`/users/${userId}/roles`); // You may need to create this endpoint
    return response.data;
  },
};