'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Eye, Heart, MessageSquare, Calendar 
} from 'lucide-react'

/* ---------------- Types ---------------- */

type Content = {
  id: string
  title: string
  slug: string
  status: string
  views_count: number
  likes_count: number
  comments_count: number
  published_at?: string
  updated_at: string
}

/* ---------------- Page ---------------- */

export default function AnalyticsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Use the existing /contents endpoint to calculate analytics
        const res = await api.get<Content[]>('/contents')
        setContents(res.data)
      } catch (error) {
        toast.error('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Calculate analytics from content data
  const totalViews = contents.reduce((sum, item) => sum + (item.views_count || 0), 0)
  const totalLikes = contents.reduce((sum, item) => sum + (item.likes_count || 0), 0)
  const totalComments = contents.reduce((sum, item) => sum + (item.comments_count || 0), 0)
  const publishedContent = contents.filter(c => c.status === 'published').length
  const totalContent = contents.length
  const avgViewsPerContent = totalContent > 0 ? (totalViews / totalContent) : 0

  // Get top performing content
  const topContent = [...contents]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your content performance
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <Calendar className="inline h-4 w-4 mr-1" />
          Updated just now
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">All-time views</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">All-time likes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">All-time comments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Avg. Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgViewsPerContent.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">Per content</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Content</span>
                <span className="text-lg font-bold">{totalContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Published</span>
                <span className="text-lg font-bold">{publishedContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Draft</span>
                <span className="text-lg font-bold">
                  {contents.filter(c => c.status === 'draft').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Engagement Rate</span>
                <span className="text-lg font-bold">
                  {totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContent.length > 0 ? (
                topContent.map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium truncate max-w-45">{content.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{content.status}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Views</div>
                        <div className="text-sm font-bold">{content.views_count || 0}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No content data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Likes per 1000 Views</span>
                </div>
                <span className="text-lg font-bold">
                  {totalViews > 0 ? ((totalLikes / totalViews) * 1000).toFixed(1) : 0}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ 
                    width: `${Math.min(100, totalViews > 0 ? (totalLikes / totalViews * 1000) : 0)}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Comments per 1000 Views</span>
                </div>
                <span className="text-lg font-bold">
                  {totalViews > 0 ? ((totalComments / totalViews) * 1000).toFixed(1) : 0}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ 
                    width: `${Math.min(100, totalViews > 0 ? (totalComments / totalViews * 5000) : 0)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}