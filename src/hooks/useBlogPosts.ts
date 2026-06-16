/**
 * useBlogPosts.ts — React Query hooks for blog data
 *
 * Fetches blog posts from Supabase if configured,
 * falls back to static blogData.ts if Supabase is not set up.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { blogPosts as staticBlogPosts, type BlogPost } from '@/data/blogData';

// ─── Supabase row → BlogPost mapper ─────────────────────────────────────────
function mapRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    title: String(row.title),
    excerpt: String(row.excerpt),
    date: String(row.published_at).split('T')[0],
    category: String(row.category),
    image: String(row.image),
    author: String(row.author),
    authorRole: String(row.author_role),
    readTime: String(row.read_time),
    tags: Array.isArray(row.tags) ? row.tags as string[] : [],
    content: Array.isArray(row.content) ? row.content as BlogPost['content'] : [],
  };
}

// ─── Fetch all posts ─────────────────────────────────────────────────────────
async function fetchAllPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticBlogPosts;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.warn('⚠️ Supabase fetch failed, using static fallback:', error.message);
    return staticBlogPosts;
  }

  // If Supabase has no posts yet, fall back to static data
  if (!data || data.length === 0) {
    return staticBlogPosts;
  }

  return data.map(mapRow);
}

// ─── Fetch single post by id ─────────────────────────────────────────────────
async function fetchPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured || !supabase) {
    return staticBlogPosts.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    // Try static fallback
    return staticBlogPosts.find((p) => p.id === id) ?? null;
  }

  return mapRow(data as Record<string, unknown>);
}

// ─── React Query hooks ───────────────────────────────────────────────────────

/** Hook to fetch all blog posts (with Supabase + static fallback) */
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchAllPosts,
    staleTime: 5 * 60 * 1000,    // 5 minutes — don't refetch too often
    gcTime: 30 * 60 * 1000,      // Keep in cache for 30 minutes
    retry: 1,
  });
}

/** Hook to fetch a single blog post by id */
export function useBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => (id ? fetchPostById(id) : null),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/** Indicates whether the app is using live Supabase data or static fallback */
export { isSupabaseConfigured };
