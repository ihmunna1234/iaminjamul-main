import { knowledgeBase, type KnowledgeDoc } from './knowledgeBase';

// Simple list of stop words to filter out from query
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent',
  'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its',
  'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than',
  'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these',
  'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'weve', 'were', 'werent', 'what', 'whats',
  'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with',
  'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself',
  'yourselves'
]);

/**
 * Normalizes and tokenizes a text string into keywords, filtering stop words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Retrieves the top relevant knowledge documents from the local knowledge base.
 * Combines term overlap scoring with category-based boosts.
 */
export function retrieveRelevantKnowledge(query: string, limit = 5): KnowledgeDoc[] {
  if (!query || !query.trim()) {
    // Fallback: return general profile and services
    return knowledgeBase.filter(doc => doc.id === 'profile-injamul' || doc.id === 'services-overview');
  }

  const queryTerms = tokenize(query);
  
  if (queryTerms.length === 0) {
    // If no searchable terms remain (e.g. "hi there"), return general profile
    return knowledgeBase.filter(doc => doc.id === 'profile-injamul');
  }

  const scoredDocs = knowledgeBase.map(doc => {
    let score = 0;
    
    // Normalize fields
    const docTitle = doc.title.toLowerCase();
    const docContent = doc.content.toLowerCase();
    
    // 1. Keyword overlap scoring
    queryTerms.forEach(term => {
      // Substring check in title (highest weight)
      if (docTitle.includes(term)) {
        score += 5;
      }
      
      // Match in tags
      const tagMatchCount = doc.tags.filter(tag => tag.toLowerCase().includes(term)).length;
      score += tagMatchCount * 3;
      
      // Term occurrence in content
      const regex = new RegExp(term, 'gi');
      const contentMatches = docContent.match(regex);
      if (contentMatches) {
        score += contentMatches.length * 1.5;
      }
    });

    // 2. Category-based context boosts
    const lowerQuery = query.toLowerCase();
    
    // If asking about projects / work
    if (doc.category === 'projects' && (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built') || lowerQuery.includes('made') || lowerQuery.includes('portfolio'))) {
      score += 4;
    }
    
    // If asking about cost / rates / prices
    if (doc.category === 'faqs' && (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('rate') || lowerQuery.includes('charge') || lowerQuery.includes('fee') || lowerQuery.includes('quote'))) {
      score += 4;
    }

    // If asking about certifications
    if (doc.category === 'certifications' && (lowerQuery.includes('cert') || lowerQuery.includes('degree') || lowerQuery.includes('qualify') || lowerQuery.includes('credential'))) {
      score += 4;
    }

    // If asking about contact details
    if (doc.category === 'contact' && (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('phone') || lowerQuery.includes('whatsapp') || lowerQuery.includes('reach') || lowerQuery.includes('hire'))) {
      score += 5;
    }

    return { doc, score };
  });

  // Sort by score descending and filter out docs with 0 score
  return scoredDocs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.doc)
    .slice(0, limit);
}
