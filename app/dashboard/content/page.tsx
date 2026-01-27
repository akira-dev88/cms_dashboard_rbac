'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Eye, Trash2, Heart, MessageSquare, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

/* ---------------- Types ---------------- */

type Content = {
  id: string
  title: string
  slug: string
  status: string
  views_count: number
  likes_count: number
  comments_count: number
  author?: {
    username: string
  } | null
  updated_at: string
  published_at?: string
}

/* ---------------- Page ---------------- */

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const { canDelete } = useAuth()

  const fetchContents = async () => {
    try {
      setLoading(true)
      const res = await api.get<Content[]>('/contents')
      setContents(res.data)
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      toast.error('You do not have permission to delete content')
      return
    }

    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return

    try {
      await api.delete(`/contents/${id}`)
      toast.success('Content deleted')
      fetchContents()
    } catch {
      toast.error('Failed to delete content')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'outline'
      case 'pending_review':
        return 'secondary'
      case 'archived':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your content
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Content</div>
          <div className="text-2xl font-bold">{contents.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold">
            {contents.filter(c => c.status === 'published').length}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Views</div>
          <div className="text-2xl font-bold">
            {contents.reduce((sum, item) => sum + (item.views_count || 0), 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && contents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No content found
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              contents.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link 
                          href={`/content/${item.slug}`} 
                          target="_blank"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Live
                        </Link>
                        {item.published_at && (
                          <>
                            <span>•</span>
                            <span>Published: {new Date(item.published_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {item.author?.username ?? '—'}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {item.views_count || 0}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 text-muted-foreground" />
                      {item.likes_count || 0}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      {item.comments_count || 0}
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {/* Delete Button (Only for Admins/Editors) */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={!canDelete}
                        title={!canDelete ? "Delete permission required" : "Delete content"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}