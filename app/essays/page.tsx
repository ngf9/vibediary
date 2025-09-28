import { getEssays } from '@/lib/instant-server-portfolio';
import EssaysClient from './client';

export const metadata = {
  title: 'Essays | Diary of a Vibe Coder',
  description: 'Thoughts and reflections on coding, creativity, and technology.',
};

export default async function EssaysPage() {
  const essays = await getEssays();

  return <EssaysClient essays={essays} />;
}