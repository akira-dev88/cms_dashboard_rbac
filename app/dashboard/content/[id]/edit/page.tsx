'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

/* ---------------- Types ---------------- */

type Content = {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: string
}

/* ---------------- Page ---------------- */

export default function EditContentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    status: 'draft',
  })

  /* ---------------- Fetch Content ---------------- */

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get<Content>(`/contents/${id}`)
        setForm({
          title: res.data.title,
          slug: res.data.slug,
          excerpt: res.data.excerpt ?? '',
          status: res.data.status,
        })
      } catch {
        toast.error('Failed to load content')
        router.push('/dashboard/content')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchContent()
  }, [id, router])

  /* ---------------- Handlers ---------------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      await api.patch(`/contents/${id}`, {
        ...form,
      })

      toast.success('Content updated')
      router.push('/dashboard/content')
    } catch {
      toast.error('Failed to update content')
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Content</h1>
        <p className="text-sm text-muted-foreground">
          Update your content entry
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input
          value={form.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <Textarea
          value={form.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={form.status}
          onValueChange={(v) => handleChange('status', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/content')}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
