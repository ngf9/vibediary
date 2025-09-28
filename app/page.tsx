import VanGoghLayout from '@/components/VanGoghLayout';
import { getFeaturedProjects } from '@/lib/instant-server-portfolio';

export default async function Home() {
  // Fetch featured projects server-side
  const projects = await getFeaturedProjects();

  return (
    <main>
      <VanGoghLayout projects={projects} />
    </main>
  );
}