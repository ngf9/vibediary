import { getPageContent, getSyllabus, getCohortDates, getAllCohortDates } from '@/lib/instant-server';
import VibeCodingClient from './client';

export default async function VibeCodingPage() {
  // Fetch data server-side
  const [pageContent, syllabus, cohortDate, allCohortDates] = await Promise.all([
    getPageContent('vibe-coding'),
    getSyllabus('vibe-coding'),
    getCohortDates('vibe-coding'),
    getAllCohortDates()
  ]);

  // Throw error if required data is missing
  if (!pageContent) {
    throw new Error('Failed to fetch Vibe Coding page content');
  }
  if (!syllabus || syllabus.length === 0) {
    throw new Error('Failed to fetch Vibe Coding syllabus');
  }
  if (!cohortDate) {
    throw new Error('Failed to fetch Vibe Coding cohort date');
  }

  // Pass data to client component
  return (
    <VibeCodingClient
      pageContent={pageContent}
      syllabus={syllabus}
      cohortDate={cohortDate}
      cohortDates={allCohortDates}
    />
  );
}