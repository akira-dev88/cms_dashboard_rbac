'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search, RefreshCw } from 'lucide-react';
import { UserTable } from '@/components/users/user-table';
import { UserForm } from '@/components/users/user-form';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/users';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, toggleUserStatus } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await createUser(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
      setSelectedUser(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    await toggleUserStatus(id, isActive);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  if (showForm || selectedUser) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>{selectedUser ? 'Edit User' : 'Create New User'}</CardTitle>
            <CardDescription>
              {selectedUser ? 'Update user information' : 'Add a new user to the system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              user={selectedUser}
              onSubmit={selectedUser ? handleUpdate : handleCreate}
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
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users and their permissions in the system
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchUsers()}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => setShowForm(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
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
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            All users in the system with their roles and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}