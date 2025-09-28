'use client';

import React from 'react';
import StatsBox from './StatsBox';
import StudentProjectGallery from './StudentProjectGallery';

export default function StudentAchievementsSection() {
  return (
    <section className="w-full bg-white pt-20 pb-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-800">
          What our <span className="text-blue">(non-technical)</span> students achieve during the class
        </h2>
        
        <StatsBox />
        
        <StudentProjectGallery />
      </div>
    </section>
  );
}