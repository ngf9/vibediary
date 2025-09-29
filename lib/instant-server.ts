import { adminDb } from '@/lib/instant-admin';

// Fetch about page content
export async function getAboutPageContent() {
  const data = await adminDb.query({
    aboutContent: {
      $: {
        where: {
          pageId: 'about',
          isActive: true
        }
      }
    }
  });

  return data.aboutContent?.[0] || null;
}

