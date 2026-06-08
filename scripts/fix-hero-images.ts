/**
 * Fix essays whose image fields point at expiring InstantDB `instant-storage`
 * presigned URLs. Those URLs are baked into the statically-generated pages at
 * build time and expire after 7 days, so the images vanish in production.
 *
 * This downloads the underlying files from InstantDB storage to /public and
 * repoints the image fields at stable /public paths (which never expire),
 * matching how every other essay stores its images.
 *
 * Re-runnable. Run with:  npx tsx scripts/fix-hero-images.ts
 */
import { init } from '@instantdb/admin';
import fs from 'fs';
import path from 'path';

const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const getEnv = (key: string) => {
  const m = envRaw.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (!m) throw new Error(`Missing ${key} in .env.local`);
  return m[1].trim();
};
const db = init({
  appId: getEnv('NEXT_PUBLIC_INSTANT_APP_ID'),
  adminToken: getEnv('INSTANT_ADMIN_TOKEN'),
});

const IMAGE_FIELDS = ['thumbnail', 'heroImage', 'coverImage'] as const;
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function isInstantStorageUrl(v: unknown): v is string {
  return typeof v === 'string' && v.includes('instant-storage');
}

async function main() {
  const [{ essays }, { $files }] = await Promise.all([
    db.query({ essays: {} }),
    db.query({ $files: {} }),
  ]);

  // Match an expiring URL to a fresh $files URL by comparing pathnames
  // (the query params differ between signings).
  const freshUrlFor = (expiringUrl: string): string | undefined => {
    try {
      const pn = new URL(expiringUrl).pathname;
      const file = ($files as Array<{ path: string; url: string }>).find((f) => {
        try {
          return new URL(f.url).pathname === pn;
        } catch {
          return false;
        }
      });
      return file?.url;
    } catch {
      return undefined;
    }
  };

  let fixed = 0;

  for (const essay of essays) {
    const updates: Record<string, string> = {};

    for (const field of IMAGE_FIELDS) {
      const val = (essay as Record<string, unknown>)[field];
      if (!isInstantStorageUrl(val)) continue;

      const freshUrl = freshUrlFor(val);
      if (!freshUrl) {
        console.warn(`  ! ${essay.slug}.${field}: no matching $files entry — skipped`);
        continue;
      }

      // Download the bytes and write to /public.
      const res = await fetch(freshUrl);
      if (!res.ok) {
        console.warn(`  ! ${essay.slug}.${field}: download failed (${res.status}) — skipped`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const fileName = `${essay.slug}-${field === 'heroImage' ? 'hero' : field}.png`;
      fs.writeFileSync(path.join(PUBLIC_DIR, fileName), buf);
      const publicPath = `/${fileName}`;
      updates[field] = publicPath;
      console.log(`  ✓ ${essay.slug}.${field} → ${publicPath} (${buf.length} bytes)`);
    }

    if (Object.keys(updates).length > 0) {
      await db.transact(
        db.tx.essays[essay.id].update({ ...updates, updatedAt: Date.now() })
      );
      fixed++;
    }
  }

  console.log(`\nDone. Updated ${fixed} essay(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
