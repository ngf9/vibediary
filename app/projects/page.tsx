import { getProjects } from '@/lib/instant-server-portfolio';
import ProjectsClient from './client';

export const metadata = {
  title: 'Projects | Diary of a Vibe Coder',
  description: 'Explore my portfolio of projects built with AI tools and vibe coding.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}