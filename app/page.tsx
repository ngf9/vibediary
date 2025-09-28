import SimpleLayout from '@/components/SimpleLayout';
import { getEssays } from '@/lib/instant-server-portfolio';

export default async function Home() {
  // Fetch all essays for both the list and navigation
  const allEssays = await getEssays();

  return (
    <main>
      <SimpleLayout essays={allEssays} allEssays={allEssays} />
    </main>
  );
}