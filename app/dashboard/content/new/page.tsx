'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

type ContentType = {
  id: string
  name: string
  slug: string
}

/* ---------------- Page ---------------- */

export default function CreateContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  const [form, setForm] = useState({
    content_type: '',
    title: '',
    slug: '',
    excerpt: '',
    status: 'draft',
  })

  /* ---------------- Fetch Content Types ---------------- */

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const res = await api.get<ContentType[]>('/content-types')
        setContentTypes(res.data)
      } catch {
        toast.error('Failed to load content types')
      }
    }

    fetchContentTypes()
  }, [])

  /* ---------------- Handlers ---------------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.content_type) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)

      await api.post('/contents', {
        ...form,
      })

      toast.success('Content created')
      router.push('/dashboard/content')
    } catch {
      toast.error('Failed to create content')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Content</h1>
        <p className="text-sm text-muted-foreground">
          Create a new content entry
        </p>
      </div>

      {/* Content Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Content Type</label>
        <Select
          value={form.content_type}
          onValueChange={(v) => handleChange('content_type', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type.id} value={type.slug}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter title"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input
          value={form.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
          placeholder="my-content-slug"
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <Textarea
          value={form.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          placeholder="Short summary (optional)"
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
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Create'}
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
