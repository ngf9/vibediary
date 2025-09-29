import { getProjectBySlug, getProjectContent, getProjects } from '@/lib/instant-server-portfolio';
import ProjectDetailClient from './client';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Diary of a Vibe Coder`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);
  const content = await getProjectContent(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} content={content} />;
}