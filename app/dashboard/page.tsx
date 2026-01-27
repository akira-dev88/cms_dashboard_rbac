'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { User } from '@/types';
import { FileText, Users, Eye, TrendingUp, Clock, Calendar, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

type DashboardStats = {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  totalUsers: number;
  recentActivity: number;
  topContent: Array<{
    id: string;
    title: string;
    views_count: number;
    status: string;
  }>;
  recentContent: Array<{
    id: string;
    title: string;
    status: string;
    updated_at: string;
  }>;
}

export default function DashboardPage() {
  const { logout, getCurrentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Fetch dashboard stats
        const statsRes = await api.get<DashboardStats>('/dashboard/stats');
        setStats(statsRes.data);
        
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getCurrentUser]);

  // If no /dashboard/stats endpoint exists yet, fall back to client-side calculations
  useEffect(() => {
    const fetchFallbackStats = async () => {
      try {
        const contentsRes = await api.get('/contents');
        const contents = contentsRes.data;
        
        // Calculate stats from content data
        const totalContent = contents.length;
        const publishedContent = contents.filter((c: any) => c.status === 'published').length;
        const draftContent = contents.filter((c: any) => c.status === 'draft').length;
        const totalViews = contents.reduce((sum: number, item: any) => sum + (item.views_count || 0), 0);
        
        // Get top content
        const topContent = [...contents]
          .sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))
          .slice(0, 5)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            views_count: item.views_count || 0,
            status: item.status
          }));
          
        // Get recent content
        const recentContent = [...contents]
          .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            updated_at: item.updated_at
          }));
        
        setStats({
          totalContent,
          publishedContent,
          draftContent,
          totalViews,
          totalUsers: 1, // Default - would need users endpoint
          recentActivity: recentContent.length,
          topContent,
          recentContent
        });
      } catch (error) {
        console.error('Failed to fetch fallback stats:', error);
      }
    };
    
    if (!stats && !loading) {
      fetchFallbackStats();
    }
  }, [stats, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.username || 'User'}! Here's what's happening with your content.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
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
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Content
              </CardTitle>
              <CardDescription>All content items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalContent || 0}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">
                  {stats?.publishedContent || 0} published
                </span>
                <span>•</span>
                <span>{stats?.draftContent || 0} drafts</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Total Views
              </CardTitle>
              <CardDescription>All-time views</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(stats?.totalViews || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>
                  Avg: {stats?.totalContent ? Math.round((stats.totalViews || 0) / stats.totalContent) : 0} per content
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.recentActivity || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>content updates</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </CardTitle>
              <CardDescription>Current date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Most viewed content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topContent && stats.topContent.length > 0 ? (
                  stats.topContent.map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm line-clamp-1">{content.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">{content.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="font-bold">{content.views_count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No content data available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentContent && stats.recentContent.length > 0 ? (
                  stats.recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <div className="font-medium text-sm line-clamp-1">{content.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            content.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : content.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {content.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(content.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link href={`/content/${content.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent content updates
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        {stats && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Overall content performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalContent > 0 
                        ? Math.round((stats.publishedContent / stats.totalContent) * 100)
                        : 0
                      }%
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Content Published</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalContent > 0 
                        ? Math.round((stats.totalViews || 0) / stats.totalContent)
                        : 0
                      }
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Average Views per Content</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalContent > 0 
                        ? stats.recentActivity
                        : 0
                      }
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Recent Updates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}