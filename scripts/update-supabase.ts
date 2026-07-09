import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Upserting blog posts into Supabase...');

  for (const post of blogPosts) {
    const postData = {
      // Assuming 'id' is a UUID in the database, we can try to just insert it.
      // If we don't have UUIDs in blogData, we can let Supabase generate them,
      // but blogPosts in blogData.ts has string ids ('1', '2', '3').
      // Let's match by slug if we can, or just insert new ones.
      // Wait, let's look at the schema again.
      // schema: id (uuid), title, slug, excerpt, content (jsonb), category, tags, image, author, author_role, read_time
      
      title: post.title,
      slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags,
      image: post.image,
      author: post.author,
      author_role: post.authorRole,
      read_time: post.readTime,
      published_at: new Date(post.date).toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(postData, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error upserting "${post.title}":`, error.message);
    } else {
      console.log(`Successfully upserted: "${post.title}"`);
    }
  }

  console.log('Done.');
}

main();
