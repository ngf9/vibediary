import { getAboutPageContent } from '@/lib/instant-server';
import AboutPageClient from './client';

export default async function AboutPage() {
  // Fetch data server-side for SEO
  const aboutContent = await getAboutPageContent();

  // Parse the JSON data or use defaults
  const philosophyContent = aboutContent?.philosophyContent || [
    "I believe that AI education should be accessible, practical, and transformative. My approach breaks down complex concepts into intuitive understanding, then builds them back up through hands-on experience.",
    "I'm not just teaching tools—I'm cultivating a mindset. I want you to think like a builder, understand like an engineer, and create with the confidence of someone who truly grasps the technology you're wielding."
  ];

  const milestones = aboutContent?.milestones || [
    {
      id: '1',
      title: "The Spark",
      date: "2023",
      description: "After YC, realized the gap between technical and non-technical builders needed bridging"
    },
    {
      id: '2',
      title: "First Cohort",
      date: "Early 2024",
      description: "Launched with 8 passionate learners ready to master AI fundamentals"
    },
    {
      id: '3',
      title: "Building Curriculum",
      date: "Mid 2024",
      description: "Refined our approach: 30% theory, 70% hands-on vibe coding practice"
    },
    {
      id: '4',
      title: "Growing Community",
      date: "Late 2024",
      description: "100+ builders shipped real products using our vibe coding methodology"
    },
    {
      id: '5',
      title: "Looking Forward",
      date: "2025",
      description: "Expanding with new courses, tools, and a thriving builder community"
    }
  ];

  return (
    <AboutPageClient
      philosophyContent={philosophyContent}
      milestones={milestones}
    />
  );
}