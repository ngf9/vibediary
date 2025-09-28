import VanGoghLayout from '@/components/VanGoghLayout';
import { adminDb } from '@/lib/instant-admin';
import { getOurStoryStats, getWhyItWorksFeatures } from '@/lib/instant-server';

async function getCohortDates() {
  const data = await adminDb.query({
    cohortDates: {
      $: {
        where: { isActive: true }
      }
    }
  });

  return data.cohortDates || [];
}

export default async function Home() {
  // Fetch cohort dates, Our Story stats, and Why It Works features server-side
  const [cohortDates, ourStoryStats, whyItWorksFeatures] = await Promise.all([
    getCohortDates(),
    getOurStoryStats(),
    getWhyItWorksFeatures()
  ]);

  return (
    <main>
      <VanGoghLayout
        cohortDates={cohortDates}
        ourStoryStats={ourStoryStats}
        whyItWorksFeatures={whyItWorksFeatures}
      />
    </main>
  );
}