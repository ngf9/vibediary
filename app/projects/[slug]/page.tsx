import { getProjectBySlug, getProjectContent, getProjects } from '@/lib/instant-server-portfolio';
import ProjectDetailClient from './client';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

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

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  const content = await getProjectContent(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} content={content} />;
}