import SimpleLayout from '@/components/SimpleLayout';
import { getEssays } from '@/lib/instant-server-portfolio';

export default async function Home() {
  // Fetch all essays for both the list and navigation
  const allEssays = await getEssays();

  // Transform essays to match client component types
  const transformedEssays = allEssays.map(e => ({
    ...e,
    editorMode: e.editorMode as 'simple' | 'advanced' | undefined,
    publishedAt: e.publishedAt ? new Date(e.publishedAt).toISOString() : undefined
  }));

  return (
    <main>
      <SimpleLayout essays={transformedEssays} allEssays={transformedEssays} />
    </main>
  );
}