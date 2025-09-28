import { getEssayBySlug, getEssays } from '@/lib/instant-server-portfolio';
import EssayClient from './client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all essays
export async function generateStaticParams() {
  const essays = await getEssays();

  return essays.map((essay) => ({
    slug: essay.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const essay = await getEssayBySlug(resolvedParams.slug);

  if (!essay) {
    return {
      title: 'Essay Not Found | Diary of a Vibe Coder',
    };
  }

  return {
    title: `${essay.title} | Diary of a Vibe Coder`,
    description: essay.excerpt || essay.description || 'Read this essay on Diary of a Vibe Coder',
  };
}

export default async function EssayPage({ params }: PageProps) {
  const resolvedParams = await params;
  // Fetch essay data server-side
  const [essay, allEssays] = await Promise.all([
    getEssayBySlug(resolvedParams.slug),
    getEssays() // For navigation dropdown
  ]);

  // Return 404 if essay not found
  if (!essay) {
    notFound();
  }

  // Pass data to client component
  return (
    <EssayClient
      essay={essay}
      allEssays={allEssays}
    />
  );
}