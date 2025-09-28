'use client';

import React from 'react';
import GridCards from './GridCards';
import Navigation from './Navigation';
import HeroSection from './HeroSection';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
  hoverImage?: string;
  cohortDate?: string;
  description: string;
  number: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  color?: string;
  status: string;
  featured: boolean;
  sortOrder: number;
}

interface VanGoghLayoutProps {
  projects: Project[];
}

export default function VanGoghLayout({ projects }: VanGoghLayoutProps) {
  // Transform projects into card sections
  const sections: Section[] = projects.map((project, index) => ({
    id: project.slug,
    title: project.title,
    subtitle: project.subtitle || '',
    color: project.color || (index % 2 === 0 ? '#5433FF' : '#FFB343'),
    href: `/projects/${project.slug}`,
    hoverImage: project.thumbnail || '/vibefront2.png',
    cohortDate: '',
    description: project.description,
    number: String(index + 1).padStart(2, '0')
  }));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-strip aurora-1" />
        <div className="aurora-strip aurora-2" />
        <div className="aurora-strip aurora-3" />
        <div className="aurora-strip aurora-4" />
        <div className="aurora-strip aurora-5" />
      </div>
      
      <Navigation />
      
      {/* Main Content */}
      <div className="flex flex-col pt-32 relative z-10 pb-8">
        <HeroSection />

        {/* Grid Cards Section */}
        <div className="flex-1 flex items-start lg:items-center py-8">
          <GridCards cards={sections} />
        </div>
      </div>
    </div>
  );
}