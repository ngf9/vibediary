'use client';

import React from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import EssayList from './EssayList';

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
  readTime?: number;
}

interface SimpleLayoutProps {
  essays: Essay[];
  allEssays: Essay[];
}

export default function SimpleLayout({ essays, allEssays }: SimpleLayoutProps) {
  // Sort essays by publishedAt date (newest first)
  const sortedEssays = [...essays].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation essays={allEssays} />

      {/* Main Content */}
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Subtle divider */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Essay List */}
        <EssayList essays={sortedEssays} />
      </div>
    </div>
  );
}