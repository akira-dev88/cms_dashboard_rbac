'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Heart, MessageSquare, TrendingUp, Calendar } from 'lucide-react'
import { toast } from 'sonner'

type ContentAnalytics = {
  content: {
    id: string
    title: string
    slug: string
    status: string
    published_at?: string
    created_at: string
  }
  stats: {
    total_views: number
    total_likes: number
    total_comments: number
    views_today: number
    views_this_week: number
    views_this_month: number
  }
  recent_views: Array<{
    date: string
    views: number
  }>
}

export default function ContentAnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<ContentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const res = await api.get<ContentAnalytics>(`/contents/${id}/analytics`)
        setData(res.data)
      } catch {
        toast.error('Failed to load analytics')
        router.push('/dashboard/content')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAnalytics()
  }, [id, router])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>
  }

  if (!data) {
    return <div>Analytics data not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/content')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Content Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Analytics for: <strong>{data.content.title}</strong>
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <Link 
              href={`/content/${data.content.slug}`}
              target="_blank"
              className="text-primary hover:underline"
            >
              View Live Content
            </Link>
            {data.content.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Published: {new Date(data.content.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats.total_views.toLocaleString()}</div>
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
            <div className="text-3xl font-bold">{data.stats.total_likes.toLocaleString()}</div>
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
            <div className="text-3xl font-bold">{data.stats.total_comments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">All-time comments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Views Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats.views_today}</div>
            <div className="text-xs text-muted-foreground mt-1">Last 24 hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly/Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Views This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.stats.views_this_week}</div>
            <div className="text-sm text-muted-foreground mt-1">Last 7 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Views This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.stats.views_this_month}</div>
            <div className="text-sm text-muted-foreground mt-1">Last 30 days</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Views */}
      <Card>
        <CardHeader>
          <CardTitle>Recent View Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_views.length > 0 ? (
            <div className="space-y-3">
              {data.recent_views.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                  <div className="text-sm">{day.date}</div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{day.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No view data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}