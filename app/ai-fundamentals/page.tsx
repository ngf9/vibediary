import { getPageContent, getSyllabus, getCohortDates, getAllCohortDates } from '@/lib/instant-server';
import AIFundamentalsClient from './client';

export default async function AIFundamentalsPage() {
  // Fetch data server-side
  const [pageContent, syllabus, cohortDate, allCohortDates] = await Promise.all([
    getPageContent('ai-fundamentals'),
    getSyllabus('ai-fundamentals'),
    getCohortDates('ai-fundamentals'),
    getAllCohortDates()
  ]);

  // Throw error if required data is missing
  if (!pageContent) {
    throw new Error('Failed to fetch AI Fundamentals page content');
  }
  if (!syllabus || syllabus.length === 0) {
    throw new Error('Failed to fetch AI Fundamentals syllabus');
  }
  if (!cohortDate) {
    throw new Error('Failed to fetch AI Fundamentals cohort date');
  }

  // Pass data to client component
  return (
    <AIFundamentalsClient
      pageContent={pageContent}
      syllabus={syllabus}
      cohortDate={cohortDate}
      cohortDates={allCohortDates}
    />
  );
}