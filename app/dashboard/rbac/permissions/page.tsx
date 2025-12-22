'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, RefreshCw, Key } from 'lucide-react';
import { PermissionTable } from '@/components/rbac/permission-table';
import { PermissionForm } from '@/components/rbac/permission-form';
import { useRbac } from '@/hooks/use-rbac';
import { Permission } from '@/types/rbac';

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const { permissions, loading, error, fetchPermissions, createPermission, updatePermission, deletePermission } = useRbac();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const filteredPermissions = permissions.filter(permission =>
    permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await createPermission(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedPermission) {
      await updatePermission(selectedPermission.id, data);
      setSelectedPermission(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePermission(id);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedPermission(null);
  };

  if (showForm || selectedPermission) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPermission ? 'Edit Permission' : 'Create New Permission'}
            </CardTitle>
            <CardDescription>
              {selectedPermission 
                ? 'Update permission details'
                : 'Define a new permission for role-based access control'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionForm
              permission={selectedPermission}
              onSubmit={selectedPermission ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isSubmitting={loading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Key className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
        </div>
        <p className="text-muted-foreground">
          Define and manage granular permissions for role-based access control
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-10 w-full md:w-75"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchPermissions()}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Permission
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/15 text-destructive">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Permissions ({filteredPermissions.length})</CardTitle>
          <CardDescription>
            All permissions grouped by module for role assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && permissions.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PermissionTable
              permissions={filteredPermissions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}