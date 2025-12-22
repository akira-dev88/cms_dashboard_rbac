import { User } from ".";

// RBAC Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role: boolean;
  hierarchy_level: number;
  user_roles?: UserRole[];
  role_permissions?: RolePermission[];
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  module: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  context_type: string;
  context_id?: string;
  assigned_at: string;
  assigned_by?: string;
  expires_at?: string;
  role?: Role;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  granted_at: string;
  granted_by?: string;
  permission?: Permission;
}

export interface AssignRoleData {
  email: string;
  roleName: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  is_system_role?: boolean;
  hierarchy_level?: number;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  is_system_role?: boolean;
  hierarchy_level?: number;
}

export interface CreatePermissionData {
  code: string;
  name: string;
  description?: string;
  module: string;
}

export interface UpdatePermissionData {
  code?: string;
  name?: string;
  description?: string;
  module?: string;
}

export interface AssignPermissionData {
  roleId: string;
  permissionId: string;
}

// User with roles
export interface UserWithRoles extends User {
  user_roles?: UserRole[];
}