'use client';

import React, { useState } from 'react';
import FormModal from './FormModal';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

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

interface CourseCTASectionProps {
  cohortDates?: CohortDate[];
}

export default function CourseCTASection({ cohortDates }: CourseCTASectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <>
      <motion.section
        ref={sectionRef}
        className="w-full bg-blue px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto min-h-[300px] flex flex-col items-center justify-center text-center py-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Ready to join our next cohort?
          </motion.h2>
          <motion.button
            onClick={() => setIsFormOpen(true)}
            className="inline-block bg-white text-blue px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
          </motion.button>
        </div>
      </motion.section>

      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} cohortDates={cohortDates} />
    </>
  );
}