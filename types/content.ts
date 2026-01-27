// /types/content.ts or in your existing types file
export enum ContentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  TRASHED = 'trashed',
}

export interface ContentBody {
  lexical: Record<string, any>;
  html: string;
  plainText?: string;
}

export interface Content {
  id: string;
  content_type: {
    id: string;
    name: string;
    slug: string;
  };
  title: string;
  slug: string;
  excerpt?: string;
  body: ContentBody;
  status: ContentStatus;
  author: {
    id: string;
    username: string;
    email: string;
  };
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  featured_image?: {
    id: string;
    url: string;
    alt_text?: string;
  };
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: ContentStatus;
  views_count: number;
  likes_count: number;
  comments_count: number;
  author?: {
    username: string;
  };
  published_at?: string;
  updated_at: string;
  content_type?: {
    name: string;
    slug: string;
  };
}