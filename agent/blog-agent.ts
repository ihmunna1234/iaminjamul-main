/**
 * blog-agent.ts — Main entry point for the AI blog agent
 *
 * Usage:
 *   node blog-agent.ts           → Generate and save 3 blog posts
 *   node blog-agent.ts --dry-run → Generate but don't save (preview only)
 *   node blog-agent.ts --count=5 → Generate 5 posts instead of 3
 *
 * Required environment variables:
 *   GEMINI_API_KEY              → Get free at https://aistudio.google.com
 *   SUPABASE_URL                → From your Supabase project settings
 *   SUPABASE_SERVICE_ROLE_KEY   → From Supabase → Settings → API
 *   NEWS_API_KEY                → Get free at https://newsapi.org (optional)
 */

import { fetchTrendingTopics } from './src/trends.js';
import { writeBlogPost } from './src/writer.js';
import { saveBlogPost, getRecentPostTitles } from './src/storage.js';

// ─── Parse CLI flags ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const countArg = args.find((a) => a.startsWith('--count='));
const POSTS_TO_GENERATE = countArg ? parseInt(countArg.split('=')[1]) : 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function log(msg: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
}

function separator() {
  console.log('\n' + '─'.repeat(60) + '\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🤖  AI Blog Agent Starting...');
  console.log(`📝  Mode: ${isDryRun ? 'DRY RUN (no saves)' : 'LIVE'}`);
  console.log(`📊  Posts to generate: ${POSTS_TO_GENERATE}`);
  separator();

  // Step 1: Check existing posts to avoid duplicates
  log('📚 Fetching recent post titles to avoid duplicates...');
  const recentTitles = await getRecentPostTitles(20);
  log(`   Found ${recentTitles.length} recent posts`);

  // Step 2: Fetch trending topics
  log('📰 Fetching trending topics...');
  const topics = await fetchTrendingTopics(POSTS_TO_GENERATE + 2); // fetch extras in case of duplicates
  log(`   Found ${topics.length} relevant topics`);

  separator();

  // Step 3: Filter out topics similar to recent posts
  const filteredTopics = topics.filter((topic) => {
    const isNew = !recentTitles.some(
      (existing) =>
        existing.toLowerCase().includes(topic.category.toLowerCase()) &&
        levenshteinSimilarity(existing, topic.title) > 0.6
    );
    return isNew;
  });

  const topicsToProcess = filteredTopics.slice(0, POSTS_TO_GENERATE);
  log(`✅ Selected ${topicsToProcess.length} unique topics to write about`);

  // Step 4: Generate and save each blog post
  const results: Array<{ title: string; id?: string; status: 'success' | 'error'; error?: string }> = [];

  for (let i = 0; i < topicsToProcess.length; i++) {
    const topic = topicsToProcess[i];
    separator();
    log(`📝 [${i + 1}/${topicsToProcess.length}] Processing: "${topic.title}"`);
    log(`   Category: ${topic.category} | Source: ${topic.source}`);

    try {
      // Generate with Gemini
      const post = await writeBlogPost(topic);
      log(`   ✅ Generated: "${post.title}"`);
      log(`   📖 Read time: ${post.readTime} | Tags: ${post.tags.join(', ')}`);

      if (isDryRun) {
        // Preview the first section of content
        const firstParagraph = post.content.find((s) => s.type === 'paragraph');
        if (firstParagraph?.text) {
          log(`   📄 Preview: "${firstParagraph.text.slice(0, 120)}..."`);
        }
        results.push({ title: post.title, status: 'success' });
      } else {
        // Save to Supabase
        log('   💾 Saving to Supabase...');
        const id = await saveBlogPost(post);
        log(`   ✅ Saved! ID: ${id}`);
        results.push({ title: post.title, id, status: 'success' });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      log(`   ❌ Failed: ${errorMsg}`);
      results.push({ title: topic.title, status: 'error', error: errorMsg });
    }

    // Small delay between API calls to be respectful
    if (i < topicsToProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Step 5: Summary report
  separator();
  console.log('📊 SUMMARY REPORT');
  console.log('─'.repeat(60));

  const succeeded = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'error');

  console.log(`✅ Success: ${succeeded.length}/${results.length} posts`);
  succeeded.forEach((r, i) => {
    console.log(`   ${i + 1}. "${r.title}"${r.id ? ` (ID: ${r.id})` : ' (dry run)'}`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length} posts`);
    failed.forEach((r) => console.log(`   - ${r.title}: ${r.error}`));
  }

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN — no posts were saved to Supabase');
    console.log('   Remove --dry-run flag to save posts\n');
  } else {
    console.log('\n🎉 All done! New posts are now live on your portfolio.\n');
  }

  process.exit(failed.length > 0 && succeeded.length === 0 ? 1 : 0);
}

/**
 * Simple string similarity check (0 = different, 1 = identical)
 * Used to detect near-duplicate blog topics.
 */
function levenshteinSimilarity(a: string, b: string): number {
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  const editDistance = levenshtein(shorter, longer);
  return 1 - editDistance / longer.length;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

main().catch((err) => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
