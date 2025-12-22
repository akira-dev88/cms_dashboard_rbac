'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, RefreshCw, Shield } from 'lucide-react';
import { RoleTable } from '@/components/rbac/role-table';
import { RoleForm } from '@/components/rbac/role-form';
import { useRbac } from '@/hooks/use-rbac';
import { Role } from '@/types/rbac';

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { roles, loading, error, fetchRoles, createRole, updateRole, deleteRole } = useRbac();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await createRole(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedRole) {
      await updateRole(selectedRole.id, data);
      setSelectedRole(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRole(id);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  if (showForm || selectedRole) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole ? 'Edit Role' : 'Create New Role'}
            </CardTitle>
            <CardDescription>
              {selectedRole 
                ? 'Update role information and permissions'
                : 'Define a new role with specific permissions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleForm
              role={selectedRole}
              onSubmit={selectedRole ? handleUpdate : handleCreate}
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
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        </div>
        <p className="text-muted-foreground">
          Define and manage roles with specific permissions and hierarchy levels
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search roles..."
                  className="pl-10 w-full md:w-75"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchRoles()}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Role
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
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            All roles in the system with their hierarchy and type
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && roles.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <RoleTable
              roles={filteredRoles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}