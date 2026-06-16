-- ============================================================
-- Supabase Database Setup for AI Blog Agent
-- 
-- Run this in the Supabase SQL Editor:
-- https://app.supabase.com → Your Project → SQL Editor → New Query
-- ============================================================

-- 1. Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT NOT NULL,
  content     JSONB NOT NULL DEFAULT '[]',
  category    TEXT NOT NULL DEFAULT 'Technology',
  tags        TEXT[] NOT NULL DEFAULT '{}',
  image       TEXT NOT NULL DEFAULT '',
  author      TEXT NOT NULL DEFAULT 'Injamul Hoque',
  author_role TEXT NOT NULL DEFAULT 'Digital Professional',
  read_time   TEXT NOT NULL DEFAULT '5 min read',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category
  ON blog_posts (category);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug
  ON blog_posts (slug);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. Allow anyone to READ blog posts (public portfolio)
CREATE POLICY "Public can read blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Only service role (the agent) can INSERT / UPDATE / DELETE
--    (This is automatic — the service role bypasses RLS)

-- 6. Verify setup
SELECT 'blog_posts table created successfully!' AS status;
SELECT COUNT(*) AS existing_posts FROM blog_posts;
