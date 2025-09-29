import AboutPageClient from './client';
import { getEssays } from '@/lib/instant-server-portfolio';

export default async function AboutPage() {
  // Fetch essays for navigation
  const essays = await getEssays();

  // Static content for the About page
  const philosophyContent = [
    "I'm a vibe coder who builds with AI. What started as curiosity about Claude Code has transformed into a passion for creating meaningful digital experiences.",
    "I believe in the power of AI to amplify human creativity. My approach combines intuitive design with practical functionality, always pushing the boundaries of what's possible when humans and AI collaborate."
  ];

  const milestones = [
    {
      id: '1',
      title: "The Beginning",
      date: "2024",
      description: "Started vibe coding and discovered the joy of building with AI"
    },
    {
      id: '2',
      title: "First Apps",
      date: "Mid 2024",
      description: "Launched two apps on the App Store using AI-assisted development"
    },
    {
      id: '3',
      title: "Building Websites",
      date: "Late 2024",
      description: "Created multiple websites, exploring the intersection of design and AI"
    },
    {
      id: '4',
      title: "AI Assistants",
      date: "2024",
      description: "Built several AI assistants, each solving unique problems"
    },
    {
      id: '5',
      title: "Teaching & Sharing",
      date: "2025",
      description: "Started teaching vibe coding, helping others discover this new way of building"
    }
  ];

  return (
    <AboutPageClient
      philosophyContent={philosophyContent}
      milestones={milestones}
      essays={essays}
    />
  );
}