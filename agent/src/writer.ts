/**
 * writer.ts — AI blog writer powered by Google Gemini
 *
 * Takes a trending topic and generates a full, structured blog post
 * in the exact format used by the portfolio site's blogData.ts.
 */import type { TrendingTopic } from './trends.js';

// Must match the BlogPost interface in src/data/blogData.ts
export interface GeneratedBlogPost {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  author: string;
  authorRole: string;
  content: ContentSection[];
}

interface ContentSection {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  text?: string;
  items?: string[];
}

// Curated Unsplash images by category (free, no API key needed)
const CATEGORY_IMAGES: Record<string, string[]> = {
  SEO: [
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  ],
  'Web Development': [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
  ],
  Marketing: [
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop',
  ],
  Education: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b6f59?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop',
  ],
  Freelancing: [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  ],
  Business: [
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
  ],
};

const AUTHOR_ROLES: Record<string, string> = {
  SEO: 'SEO Expert',
  'Web Development': 'Web Developer',
  Technology: 'Tech Professional',
  Marketing: 'Digital Marketing Expert',
  Education: 'Education Consultant',
  Freelancing: 'Freelance Professional',
  Business: 'Business Consultant',
};

function pickImage(category: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Technology'];
  return images[Math.floor(Math.random() * images.length)];
}

function estimateReadTime(content: ContentSection[]): string {
  const totalWords = content.reduce((acc, section) => {
    if (section.text) return acc + section.text.split(' ').length;
    if (section.items) return acc + section.items.join(' ').split(' ').length;
    return acc;
  }, 0);
  const minutes = Math.max(3, Math.round(totalWords / 200));
  return `${minutes} min read`;
}

const BLOG_PROMPT_TEMPLATE = (topic: TrendingTopic) => `
You are Injamul Hoque, a versatile professional specializing in sales, education consulting, SEO, and web development based in Makkah, Saudi Arabia. Write a professional, insightful blog post about the following trending topic.

TOPIC: "${topic.title}"
CONTEXT: ${topic.description}
CATEGORY: ${topic.category}

Write a comprehensive, practical blog post (600-900 words) that:
- Is written in first person where appropriate (share your perspective as an expert)
- Is engaging, informative, and action-oriented
- Includes practical tips your readers can apply immediately
- Is relevant to entrepreneurs, small business owners, students, and professionals

You MUST respond with ONLY valid JSON (no markdown, no code blocks, just raw JSON) in this exact structure:
{
  "title": "Compelling, SEO-friendly blog title (max 70 chars)",
  "excerpt": "A compelling 1-2 sentence summary that makes readers want to read more (max 160 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "content": [
    { "type": "paragraph", "text": "Opening paragraph..." },
    { "type": "heading", "text": "Section heading..." },
    { "type": "paragraph", "text": "Content paragraph..." },
    { "type": "list", "items": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"] },
    { "type": "heading", "text": "Another heading..." },
    { "type": "paragraph", "text": "More content..." },
    { "type": "quote", "text": "An insightful quote related to the topic" },
    { "type": "heading", "text": "Final thoughts heading..." },
    { "type": "paragraph", "text": "Conclusion paragraph..." }
  ]
}

Rules:
- content must have at least 8 sections (mix of paragraph, heading, list, quote)
- Include exactly 1 list and 1 quote
- tags must be 3-5 relevant keywords (no hashtags)
- title must be original and engaging, NOT just the news headline
`;

export async function writeBlogPost(topic: TrendingTopic): Promise<GeneratedBlogPost> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is not set');

  console.log(`  ✍️  Writing blog post using OpenAI about: "${topic.title}"`);

  const prompt = BLOG_PROMPT_TEMPLATE(topic);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are Injamul Hoque\'s blog writing assistant. You must output only a valid JSON object matching the requested schema.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API failed: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  const jsonText = result.choices[0]?.message?.content?.trim();

  if (!jsonText) {
    throw new Error('OpenAI returned an empty response');
  }

  let parsed: { title: string; excerpt: string; tags: string[]; content: ContentSection[] };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    console.error('❌ OpenAI returned invalid JSON:', jsonText.slice(0, 300));
    throw new Error('Failed to parse OpenAI response as JSON');
  }

  // Validate required fields
  if (!parsed.title || !parsed.excerpt || !parsed.content?.length) {
    throw new Error('OpenAI response missing required fields');
  }

  const blogPost: GeneratedBlogPost = {
    title: parsed.title,
    excerpt: parsed.excerpt,
    category: topic.category,
    tags: parsed.tags || [topic.category],
    image: pickImage(topic.category),
    readTime: estimateReadTime(parsed.content),
    author: 'Injamul Hoque',
    authorRole: AUTHOR_ROLES[topic.category] || 'Digital Professional',
    content: parsed.content,
  };

  return blogPost;
}
