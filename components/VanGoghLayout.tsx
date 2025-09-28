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

interface Essay {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  color?: string;
  published: boolean;
  featured: boolean;
  publishedAt?: string;
  tags?: string[];
}

interface VanGoghLayoutProps {
  essays: Essay[];
  allEssays: Essay[];
}

export default function VanGoghLayout({ essays, allEssays }: VanGoghLayoutProps) {
  // Transform essays into card sections
  const sections: Section[] = essays.map((essay, index) => ({
    id: essay.slug,
    title: essay.title,
    subtitle: essay.subtitle || '',
    color: essay.color || '#9CA3AF',
    href: `/essays/${essay.slug}`,
    hoverImage: essay.thumbnail || '/vibefront2.png',
    cohortDate: '',
    description: essay.excerpt || essay.description || '',
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
      
      <Navigation essays={allEssays} />
      
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