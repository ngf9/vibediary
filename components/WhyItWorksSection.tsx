'use client';

import React from 'react';
import {
  FlaskConical,
  Users,
  GraduationCap,
  Mic,
  Brain,
  ClipboardCheck,
  Video,
  Rocket,
  LucideIcon
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  Users,
  GraduationCap,
  Mic,
  Brain,
  ClipboardCheck,
  Video,
  Rocket
};

interface WhyItWorksFeature {
  id: string;
  iconName: string;
  title: string;
  description: string;
  highlightWords?: string[];
  sortOrder: number;
  isActive: boolean;
}

interface WhyItWorksSectionProps {
  features?: WhyItWorksFeature[];
}

// Default features for fallback
const defaultFeatures = [
  {
    iconName: 'FlaskConical',
    title: 'Scientific Foundation',
    description: 'Backed by over 2+ years of scientific research in effective learning.',
    highlightWords: ['2+ years', 'scientific research']
  },
  {
    iconName: 'Users',
    title: 'Curated Study Groups',
    description: 'Learn in small, pre-vetted study groups (7-12 students) for personalized attention.',
    highlightWords: ['small, pre-vetted study groups', '7-12 students']
  },
  {
    iconName: 'GraduationCap',
    title: 'Expert-Designed Curriculum',
    description: 'A structured curriculum developed by a YC founder ensures comprehensive learning.',
    highlightWords: ['structured curriculum', 'YC founder']
  },
  {
    iconName: 'Mic',
    title: 'Insightful Weekly Speakers',
    description: 'Gain unique insights from industry leaders like Gordon Wintrob and Raza Habib.',
    highlightWords: ['Gordon Wintrob', 'Raza Habib']
  },
  {
    iconName: 'Brain',
    title: 'SOTA Learning Practices',
    description: 'Utilize active recall, spaced repetition, and metacognition for deep understanding.',
    highlightWords: ['active recall, spaced repetition, and metacognition']
  },
  {
    iconName: 'ClipboardCheck',
    title: 'Practical Assignments',
    description: 'Stay accountable and apply knowledge with targeted assignments.',
    highlightWords: ['targeted assignments']
  },
  {
    iconName: 'Video',
    title: 'Collaborative Group Calls',
    description: 'Track progress and discuss challenges in supportive group calls.',
    highlightWords: ['supportive group calls']
  },
  {
    iconName: 'Rocket',
    title: 'Real-World Project',
    description: 'Build a course project to apply everything you&apos;ve learned.',
    highlightWords: ['course project']
  }
];

export default function WhyItWorksSection({ features = [] }: WhyItWorksSectionProps) {
  // Use provided features or fall back to defaults
  const displayFeatures = features.length > 0
    ? features.filter(f => f.isActive)
    : defaultFeatures.map((f, index) => ({
        ...f,
        id: `default-${index}`,
        sortOrder: index,
        isActive: true
      }));

  // Function to highlight words in description
  const renderDescription = (description: string, highlightWords?: string[]) => {
    if (!highlightWords || highlightWords.length === 0) {
      return description;
    }

    // Create a regex pattern that matches any of the highlight words/phrases
    const pattern = highlightWords
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex characters
      .join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Split the description by the pattern and map to highlighted/normal spans
    const parts = description.split(regex);

    return parts.map((part, i) => {
      const isHighlight = highlightWords.some(
        word => part.toLowerCase() === word.toLowerCase()
      );

      if (isHighlight) {
        return (
          <span key={i} className="font-medium text-white">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="w-full bg-[#0f0d30] pt-20 pb-32 px-8 -mt-1">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-white">
          Why our classes work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayFeatures.map((feature) => {
            const Icon = iconMap[feature.iconName] || FlaskConical;

            return (
              <div
                key={feature.id}
                className="bg-[#1a1840]/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(255,179,67,0.15)] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#2a2850]/50 flex items-center justify-center text-xl flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {renderDescription(feature.description, feature.highlightWords)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Extra spacing at bottom */}
        <div className="h-32"></div>
      </div>
    </section>
  );
}