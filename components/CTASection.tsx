'use client';

import React, { useState } from 'react';
import FormModal from './FormModal';

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

interface CTASectionProps {
  cohortDates?: CohortDate[];
}

export default function CTASection({ cohortDates }: CTASectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-blue px-8">
        <div className="max-w-4xl mx-auto min-h-[300px] flex flex-col items-center justify-center text-center py-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
            Ready to build with AI?
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-block bg-white text-blue px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg cursor-pointer"
          >
            Apply for the Next Cohort
          </button>
        </div>
      </section>

      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} cohortDates={cohortDates} />
    </>
  );
}