'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';

interface SyllabusItem {
  id: string;
  courseId: string;
  weekNumber: number;
  weekName?: string;
  title: string;
  description?: string;
  content?: string;
  goals?: string;
  learningOutcome?: string;
  color?: string;
  sortOrder?: number;
  tools?: string[] | Record<string, unknown>;
  isActive: boolean;
  createdAt?: number;
  updatedAt?: number;
}

interface VerticalSyllabusCardsProps {
  serverSyllabus: SyllabusItem[];
  courseType: 'ai-fundamentals' | 'vibe-coding';
}

export default function VerticalSyllabusCards({ serverSyllabus, courseType }: VerticalSyllabusCardsProps) {
  // Sort syllabus by week number
  const sortedSyllabus = [...serverSyllabus].sort((a, b) => a.weekNumber - b.weekNumber);

  return (
    <div className="space-y-4">
      {sortedSyllabus.map((week, index) => (
        <WeekCard
          key={week.id}
          week={week}
          index={index}
          courseType={courseType}
        />
      ))}
    </div>
  );
}

interface WeekCardProps {
  week: SyllabusItem;
  index: number;
  courseType: 'ai-fundamentals' | 'vibe-coding';
}

function WeekCard({ week, index, courseType }: WeekCardProps) {
  const cardRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isInView = useInView(cardRef, {
    once: true,
    margin: "-100px",
    amount: 0.3
  });

  // Get the appropriate color class
  const getColorClass = (color?: string) => {
    if (!color) return courseType === 'ai-fundamentals' ? 'bg-blue' : 'bg-yellow-orange';

    // Handle color names that come from the database
    const colorMap: {[key: string]: string} = {
      'blue': 'bg-blue',
      'purple': 'bg-purple-600',
      'mint': 'bg-mint',
      'coral': 'bg-coral',
      'yellow-orange': 'bg-yellow-orange',
      'bg-blue': 'bg-blue',
      'bg-purple-600': 'bg-purple-600',
      'bg-mint': 'bg-mint',
      'bg-coral': 'bg-coral',
      'bg-yellow-orange': 'bg-yellow-orange'
    };

    return colorMap[color] || color;
  };

  const colorClass = getColorClass(week.color);
  const tools = Array.isArray(week.tools) ? week.tools : [];

  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      {/* Clickable Card Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Week Number Circle */}
          <motion.div
            className={`flex-shrink-0 w-14 h-14 ${colorClass} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            {week.weekNumber}
          </motion.div>

          {/* Week Title and Name */}
          <div className="flex-grow">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
              {week.weekName || `Week ${week.weekNumber}`}
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {week.title}
            </h3>
            {/* Description - Always visible */}
            {week.description && (
              <p className="text-gray-600 leading-relaxed">
                {week.description}
              </p>
            )}
          </div>

          {/* Expand/Collapse Chevron */}
          <motion.svg
            className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              {/* Learning Outcome */}
              {(week.learningOutcome || week.goals) && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                    Learning Outcome
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    {week.learningOutcome || week.goals}
                  </p>
                </div>
              )}

              {/* Tools Section */}
              {tools.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                    {courseType === 'ai-fundamentals' ? 'Topics Covered' : 'Tools You\'ll Use'}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {tools.map((tool, toolIndex) => (
                      <motion.span
                        key={toolIndex}
                        className={`px-4 py-2 ${colorClass} text-white text-sm rounded-full font-medium shadow-sm`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: toolIndex * 0.05
                        }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}