import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlPath = path.resolve(__dirname, '../agent/update-blog-images.sql');

let sql = `-- Run this in your Supabase SQL Editor to update the images\n\n`;

for (const post of blogPosts) {
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  sql += `UPDATE blog_posts SET image = '${post.image}' WHERE title = '${post.title.replace(/'/g, "''")}';\n`;
  
  // Alternatively, if the posts don't exist, we could insert them, but since we are just updating the image, 
  // let's do a full insert on conflict update.
  sql += `
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, image, author, author_role, read_time)
VALUES (
  '${post.title.replace(/'/g, "''")}',
  '${slug}',
  '${post.excerpt.replace(/'/g, "''")}',
  '${JSON.stringify(post.content).replace(/'/g, "''")}'::jsonb,
  '${post.category}',
  ARRAY[${post.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}],
  '${post.image}',
  '${post.author.replace(/'/g, "''")}',
  '${post.authorRole.replace(/'/g, "''")}',
  '${post.readTime}'
)
ON CONFLICT (slug) DO UPDATE SET 
  image = EXCLUDED.image,
  content = EXCLUDED.content;
\n`;
}

fs.writeFileSync(sqlPath, sql);
console.log('SQL generated at agent/update-blog-images.sql');
