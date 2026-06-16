/**
 * trends.ts — Fetches trending topics from NewsAPI
 * 
 * Gets the top headlines in technology, business, and general news,
 * then filters them to topics relevant to the portfolio niche:
 * SEO, web development, digital marketing, education, technology.
 */

export interface TrendingTopic {
  title: string;
  description: string;
  source: string;
  category: string;
}

// Maps niche keywords → blog category
const NICHE_CATEGORIES: Record<string, string> = {
  seo: 'SEO',
  'search engine': 'SEO',
  google: 'SEO',
  'web development': 'Web Development',
  'web design': 'Web Development',
  javascript: 'Web Development',
  react: 'Web Development',
  frontend: 'Web Development',
  website: 'Web Development',
  'artificial intelligence': 'Technology',
  'machine learning': 'Technology',
  ai: 'Technology',
  chatgpt: 'Technology',
  'digital marketing': 'Marketing',
  'social media': 'Marketing',
  marketing: 'Marketing',
  'e-commerce': 'Marketing',
  ecommerce: 'Marketing',
  education: 'Education',
  university: 'Education',
  student: 'Education',
  freelance: 'Freelancing',
  startup: 'Business',
  business: 'Business',
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(NICHE_CATEGORIES)) {
    if (lower.includes(keyword)) return category;
  }
  return 'Technology'; // default
}

function isRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  const relevantKeywords = [
    'seo', 'web', 'digital', 'marketing', 'ai', 'tech', 'software',
    'education', 'google', 'social media', 'startup', 'business',
    'freelance', 'developer', 'design', 'content', 'online',
  ];
  return relevantKeywords.some((kw) => lower.includes(kw));
}

export async function fetchTrendingTopics(count = 3): Promise<TrendingTopic[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  NEWS_API_KEY not set — using fallback topics');
    return getFallbackTopics(count);
  }

  try {
    // Fetch from multiple NewsAPI categories
    const categories = ['technology', 'business', 'general'];
    const allArticles: Array<{ title: string; description: string; source: { name: string } }> = [];

    for (const cat of categories) {
      const url = `https://newsapi.org/v2/top-headlines?category=${cat}&language=en&pageSize=20&apiKey=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NewsAPI error: ${res.statusText}`);
      const data = await res.json() as { articles: typeof allArticles };
      allArticles.push(...data.articles);
    }

    // Filter to niche-relevant articles and deduplicate
    const seen = new Set<string>();
    const relevant: TrendingTopic[] = [];

    for (const article of allArticles) {
      if (!article.title || !article.description) continue;
      const key = article.title.slice(0, 40);
      if (seen.has(key)) continue;
      seen.add(key);

      const fullText = `${article.title} ${article.description}`;
      if (!isRelevant(fullText)) continue;

      relevant.push({
        title: article.title,
        description: article.description,
        source: article.source?.name || 'News',
        category: detectCategory(fullText),
      });

      if (relevant.length >= count) break;
    }

    if (relevant.length < count) {
      console.warn(`⚠️  Only found ${relevant.length} relevant topics, padding with fallbacks`);
      const fallbacks = getFallbackTopics(count - relevant.length);
      relevant.push(...fallbacks);
    }

    return relevant.slice(0, count);
  } catch (err) {
    console.error('❌ Failed to fetch trends:', err);
    console.log('📋 Using fallback topics instead...');
    return getFallbackTopics(count);
  }
}

/**
 * Fallback topics used when NewsAPI is unavailable.
 * These are evergreen, high-value topics for the portfolio niche.
 */
function getFallbackTopics(count: number): TrendingTopic[] {
  const fallbacks: TrendingTopic[] = [
    {
      title: 'How AI is Transforming SEO Strategy in 2025',
      description: 'The rise of AI tools like ChatGPT and Gemini is fundamentally changing how marketers approach search engine optimization.',
      source: 'Evergreen',
      category: 'SEO',
    },
    {
      title: 'Top Web Development Trends Every Business Should Know',
      description: 'From edge computing to server components, the web development ecosystem is evolving faster than ever.',
      source: 'Evergreen',
      category: 'Web Development',
    },
    {
      title: 'The Future of Freelancing: Opportunities in the Digital Economy',
      description: 'Remote work and digital platforms are opening new doors for freelancers worldwide.',
      source: 'Evergreen',
      category: 'Freelancing',
    },
    {
      title: 'Digital Marketing Strategies That Actually Work in 2025',
      description: 'Cutting through the noise with proven, data-driven marketing approaches for modern businesses.',
      source: 'Evergreen',
      category: 'Marketing',
    },
    {
      title: 'Choosing the Right Tech Stack for Your Next Web Project',
      description: 'A practical guide to selecting frameworks, databases, and hosting platforms for different project types.',
      source: 'Evergreen',
      category: 'Web Development',
    },
    {
      title: 'How Students Can Build a Career in Tech Without a CS Degree',
      description: 'Self-taught paths, bootcamps, and certifications are creating new routes into the tech industry.',
      source: 'Evergreen',
      category: 'Education',
    },
  ];

  return fallbacks.slice(0, count);
}
