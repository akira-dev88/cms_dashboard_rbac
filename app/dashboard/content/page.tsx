'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
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
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

/* ---------------- Types ---------------- */

type Content = {
  id: string
  title: string
  slug: string
  status: string
  updated_at: string
  author?: {
    username: string
  } | null
}

/* ---------------- Page ---------------- */

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

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
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      await api.delete(`/contents/${id}`)
      toast.success('Content deleted')
      fetchContents()
    } catch {
      toast.error('Failed to delete content')
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
            Manage your content entries
          </p>
        </div>

        <Link href="/dashboard/content/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-25" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && contents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No content found
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              contents.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>

                  <TableCell>
                    {item.author?.username ?? '—'}
                  </TableCell>

                  <TableCell>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Link href={`/dashboard/content/${item.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
