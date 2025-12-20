'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types';

export default function DashboardPage() {
  const { logout, getCurrentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, [getCurrentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, {user.username} ({user.email})
                </span>
              )}
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Content</CardTitle>
              <CardDescription>All published content items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">42</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users Online</CardTitle>
              <CardDescription>Active users now</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">18</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common dashboard actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Create New Post</Button>
                <Button variant="outline">Manage Users</Button>
                <Button variant="outline">View Analytics</Button>
                <Button variant="outline">Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}