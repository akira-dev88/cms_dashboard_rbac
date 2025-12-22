'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { AssignRoleForm } from '@/components/rbac/assign-role-form';
import { useRbac } from '@/hooks/use-rbac';

export default function AssignRolePage() {
  const [showForm, setShowForm] = useState(true);
  const { roles, loading, error, fetchRoles, assignRole } = useRbac();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleAssign = async (data: any) => {
    await assignRole(data);
    // Optionally clear form after successful assignment
    // form.reset();
  };

  const handleCancel = () => {
    // Navigate back or close form
    setShowForm(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Assign Role</h1>
        </div>
        <p className="text-muted-foreground">
          Assign roles to users by email address
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/15 text-destructive">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assign Role to User</CardTitle>
          <CardDescription>
            Select a user by email and assign them a role from the available roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && (
            <AssignRoleForm
              roles={roles}
              onSubmit={handleAssign}
              onCancel={handleCancel}
              isSubmitting={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}