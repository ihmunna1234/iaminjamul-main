/**
 * storage.ts — Saves generated blog posts to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { GeneratedBlogPost } from './writer.js';

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export async function saveBlogPost(post: GeneratedBlogPost): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Generate a unique slug
  const baseSlug = createSlug(post.title);
  const slug = `${baseSlug}-${Date.now()}`;

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags,
      image: post.image,
      author: post.author,
      author_role: post.authorRole,
      read_time: post.readTime,
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) throw new Error(`Supabase insert error: ${error.message}`);

  return data.id as string;
}

export async function getRecentPostTitles(limit = 10): Promise<string[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase
    .from('blog_posts')
    .select('title')
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data || []).map((row: { title: string }) => row.title);
}
