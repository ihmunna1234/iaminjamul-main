-- 1. Open your Supabase Dashboard
-- 2. Go to the SQL Editor
-- 3. Paste this code, update the values with your actual blog details, and click "Run"

INSERT INTO blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  category, 
  tags, 
  image, 
  author, 
  author_role, 
  read_time
)
VALUES (
  'Your New Blog Title Here', 
  'your-new-blog-slug-here', 
  'A short 1-2 sentence summary of your new blog post.', 
  '[
    {"type":"paragraph","text":"Your first paragraph goes here. Replace this text."},
    {"type":"heading","text":"Your First Heading"},
    {"type":"paragraph","text":"Your second paragraph goes here."}
  ]'::jsonb, 
  'Marketing', -- Change category if needed
  ARRAY['Tag1', 'Tag2', 'Tag3'], -- Change tags
  '/images/blog/your-new-image.png', -- Change to the path of your new image
  'Injamul Hoque', 
  'Digital Marketing Expert', 
  '5 min read'
);
