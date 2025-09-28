'use client';

import React from 'react';
import GridCards from './GridCards';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import OurStorySection from './OurStorySection';
import TestimonialsSection from './TestimonialsSection';
import WhyItWorksSection from './WhyItWorksSection';
import StudentAchievementsSection from './StudentAchievementsSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';

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

interface CohortDate {
  id: string;
  courseId: string;
  startDate: string;
  title?: string;
  subtitle?: string;
  description?: string;
  isActive: boolean;
  createdAt?: number;
}

interface OurStoryStat {
  id: string;
  label: string;
  value: string;
  description: string;
  iconName: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: number;
  updatedAt?: number;
}

interface WhyItWorksFeature {
  id: string;
  iconName: string;
  title: string;
  description: string;
  highlightWords?: string[];
  sortOrder: number;
  isActive: boolean;
  color?: string;
}

interface VanGoghLayoutProps {
  cohortDates: CohortDate[];
  ourStoryStats?: OurStoryStat[];
  whyItWorksFeatures?: WhyItWorksFeature[];
}

export default function VanGoghLayout({ cohortDates, ourStoryStats = [], whyItWorksFeatures = [] }: VanGoghLayoutProps) {
  // Create a map for easy lookup
  const cohortDateMap = cohortDates?.reduce((acc, item) => {
    acc[item.courseId] = {
      startDate: item.startDate,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description
    };
    return acc;
  }, {} as Record<string, { startDate: string; title?: string; subtitle?: string; description?: string }>) || {};
  
  const sections: Section[] = [
    {
      id: 'ai-fundamentals',
      title: cohortDateMap['ai-fundamentals']?.title || '',
      subtitle: cohortDateMap['ai-fundamentals']?.subtitle || '',
      color: '#5433FF',
      href: '/ai-fundamentals',
      hoverImage: '/aifront2.png',
      cohortDate: cohortDateMap['ai-fundamentals']?.startDate || '',
      description: cohortDateMap['ai-fundamentals']?.description || '',
      number: '01'
    },
    {
      id: 'vibe-coding',
      title: cohortDateMap['vibe-coding']?.title || '',
      subtitle: cohortDateMap['vibe-coding']?.subtitle || '',
      color: '#FFB343',
      href: '/vibe-coding',
      hoverImage: '/vibefront2.png',
      cohortDate: cohortDateMap['vibe-coding']?.startDate || '',
      description: cohortDateMap['vibe-coding']?.description || '',
      number: '02'
    },
  ];
  
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
      
      <Navigation cohortDates={cohortDates} />
      
      {/* Main Content */}
      <div className="flex flex-col pt-32 relative z-10 pb-8">
        <HeroSection />

        {/* Grid Cards Section */}
        <div className="flex-1 flex items-start lg:items-center py-8">
          <GridCards cards={sections} />
        </div>
      </div>

      <OurStorySection stats={ourStoryStats} />

      <TestimonialsSection />

      <WhyItWorksSection features={whyItWorksFeatures} />

      <StudentAchievementsSection />

      <CTASection cohortDates={cohortDates} />

      <FooterSection />
    </div>
  );
}