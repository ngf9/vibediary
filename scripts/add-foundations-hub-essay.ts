/**
 * One-off script to add the "Launching a Vibe Coding Topics Hub" essay to
 * InstantDB. Re-runnable: upserts on slug `foundations-hub`.
 *
 * Run with:  npx tsx scripts/add-foundations-hub-essay.ts
 *
 * Images live in /public/vcf-foundations/.
 */
import { init, id } from '@instantdb/admin';
import { parseMarkdownToJson } from '../lib/markdown-parser';
import fs from 'fs';
import path from 'path';

// --- load env from .env.local (tsx does not auto-load Next env) ---
const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const getEnv = (key: string) => {
  const m = envRaw.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (!m) throw new Error(`Missing ${key} in .env.local`);
  return m[1].trim();
};
const appId = getEnv('NEXT_PUBLIC_INSTANT_APP_ID');
const adminToken = getEnv('INSTANT_ADMIN_TOKEN');

const db = init({ appId, adminToken });

const SLUG = 'foundations-hub';
const TITLE = 'Launching a Vibe Coding Topics Hub';
// Fixed publish date (noon UTC so it renders as May 10 in Western time zones).
const PUBLISHED_AT = new Date('2026-05-10T12:00:00Z').getTime();
// Intentionally empty: no description shown on the home page for this essay.
const EXCERPT = '';

const content = `**I've been creating a [Vibe Coding Foundational topics hub](https://vibe-coding-foundations-hub.vercel.app/) – from GitHub 101 to terminal use to AI tools by use case.**

This is a work-in-progress, and I've primarily used it for teaching foundational topics at AI Study Camp.

For a taste of what's included, check out the topics and slides below.

Understanding the AI tool ecosystem

![Understanding the AI tool ecosystem](/vcf-foundations/aitools.png)

![AI tools by your goal](/vcf-foundations/aitoolsyourgoal.png)

Using an analogy to describe an LLM's memory.

![An analogy for an LLM's memory](/vcf-foundations/memory.png)

Explaining GitHub 101: Local v Remote

![GitHub 101: local vs remote](/vcf-foundations/gitgithub.png)

Comparing Claude Desktop app products.

![Comparing Claude's products](/vcf-foundations/claudeproducts.png)

Reviewing mental models for vibe coding / agentic coding.

![Mental models for vibe coding and agentic coding](/vcf-foundations/mentalmodels.png)`;

async function main() {
  const parsed = await parseMarkdownToJson(content);

  // Each topic is a fully-bold label sitting right above its image(s) — render
  // those slightly larger.
  const secs = parsed.sections;
  for (let i = 0; i < secs.length; i++) {
    const s = secs[i];
    if (s.type === 'paragraph' && secs[i + 1]?.type === 'image') {
      s.emphasis = true;
    }
  }

  const wordCount = parsed.metadata?.wordCount ?? 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Upsert on slug so the script is re-runnable.
  const existing = await db.query({ essays: { $: { where: { slug: SLUG } } } });
  const prior = existing.essays[0];
  const essayId = prior?.id ?? id();
  const now = Date.now();

  await db.transact(
    db.tx.essays[essayId].update({
      slug: SLUG,
      title: TITLE,
      excerpt: EXCERPT,
      content,
      contentJson: parsed,
      heroImage: '/vcf-foundations/hero.png',
      tags: ['vibe-coding', 'foundations', 'teaching', 'ai-tools', 'github'],
      featured: false,
      published: true,
      readTime,
      createdAt: prior?.createdAt ?? now,
      publishedAt: PUBLISHED_AT,
      updatedAt: now,
    })
  );

  console.log(`${prior ? 'Updated' : 'Created'} essay "${TITLE}"`);
  console.log(`  id: ${essayId}`);
  console.log(`  slug: ${SLUG}`);
  console.log(`  sections: ${parsed.sections.length}`);
  console.log(`  images: ${parsed.sections.filter((s) => s.type === 'image').length}`);
  console.log(`  wordCount: ${wordCount}  readTime: ${readTime} min`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
