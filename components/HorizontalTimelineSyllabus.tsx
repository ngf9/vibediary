'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Week {
  week: string;
  weekNumber: string;
  title: string;
  description: string;
  goal: string;
  color: string;
  tools?: string[];
}

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

interface HorizontalTimelineSyllabusProps {
  serverSyllabus: SyllabusItem[];
}

export default function HorizontalTimelineSyllabus({ serverSyllabus }: HorizontalTimelineSyllabusProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const weekRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Transform server data to component format
  const weeks: Week[] = serverSyllabus.map(week => ({
    week: week.weekName || `Week ${week.weekNumber}`,
    weekNumber: week.weekNumber.toString(),
    title: week.title,
    description: week.description || '',
    goal: week.learningOutcome || week.goals || '',
    color: week.color || '#FFB343',
    tools: Array.isArray(week.tools) ? week.tools : []
  }));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && selectedWeek < weeks.length - 1) {
        setSelectedWeek(selectedWeek + 1);
      } else if (e.key === 'ArrowLeft' && selectedWeek > 0) {
        setSelectedWeek(selectedWeek - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWeek, weeks.length]);

  // Auto-scroll to selected week on mobile
  useEffect(() => {
    if (weekRefs.current[selectedWeek] && timelineRef.current) {
      const button = weekRefs.current[selectedWeek];
      const container = timelineRef.current;

      if (button && window.innerWidth < 768) {
        const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedWeek]);

  const currentWeek = weeks[selectedWeek];

  return (
    <div className="w-full">
      {/* Timeline Container */}
      <div className="relative mb-6 md:mb-12 pt-2 md:pt-4 pb-24 md:pb-32 overflow-x-hidden overflow-y-visible">
        {/* Weeks Timeline */}
        <div
          ref={timelineRef}
          className="relative flex justify-between items-center px-8 md:px-20 py-8 md:py-20 overflow-x-auto overflow-y-visible hide-scrollbar"
        >
          {/* Horizontal Line - positioned to go through middle of circles */}
          <div className="absolute top-1/2 transform -translate-y-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full z-0" />
          {weeks.map((week, index) => (
            <motion.button
              key={week.week}
              ref={(el) => { weekRefs.current[index] = el; }}
              className="flex-shrink-0 relative md:flex-shrink md:flex-grow-0 mx-2 first:ml-8 last:mr-8 md:mx-0 md:first:ml-0 md:last:mr-0"
              style={{
                scrollSnapAlign: 'center',
              }}
              onClick={() => setSelectedWeek(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Week Circle */}
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl cursor-pointer transition-all duration-300 relative z-10 ${
                  selectedWeek === index
                    ? `${week.color} text-white scale-110 dark:bg-black dark:border-2 dark:border-white dark:text-white`
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700 dark:bg-black dark:border-2 dark:border-white dark:text-white dark:hover:bg-gray-900'
                }`}
                style={{
                  boxShadow: selectedWeek === index
                    ? (() => {
                        const colorMap: {[key: string]: string} = {
                          'bg-yellow-orange': '255, 179, 67',
                          'bg-yellow': '255, 219, 88',
                          'bg-mint': '66, 234, 255',
                          'bg-coral': '253, 94, 83',
                          'bg-blue': '84, 51, 255',
                          'bg-purple-600': '147, 51, 234',
                          'bg-green-500': '34, 197, 94'
                        };
                        const rgb = colorMap[week.color] || '255, 179, 67';
                        return `0 0 0 4px rgba(${rgb}, 0.3), 0 0 15px rgba(${rgb}, 0.5), 0 0 30px rgba(${rgb}, 0.3)`;
                      })()
                    : '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                animate={{
                  scale: selectedWeek === index ? 1.1 : 1,
                }}
              >
                {week.weekNumber}
              </motion.div>


              {/* Active Indicator */}
              {selectedWeek === index && (
                <motion.div
                  className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-40`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: `12px solid ${week.color === 'bg-yellow-orange' ? '#FFB343' : week.color === 'bg-yellow' ? '#FFDB58' : week.color === 'bg-mint' ? '#42EAFF' : week.color === 'bg-coral' ? '#FD5E53' : week.color === 'bg-blue' ? '#5433FF' : week.color === 'bg-purple-600' ? '#9333EA' : '#10B981'}`,
                  }}
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>

      </div>

      {/* Selected Week Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWeek}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl px-6 md:px-12 pt-8 pb-8 shadow-lg border border-gray-100 mt-6 mb-16 md:mb-24"
        >
          {/* Header */}
          <div className="mb-8 mt-12">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${currentWeek.color} rounded-full flex items-center justify-center font-bold text-xl text-white`}>
                {currentWeek.weekNumber}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {currentWeek.week}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">{currentWeek.title}</h3>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">{currentWeek.description}</p>
          </div>

          <div className="border-t border-gray-100 my-8"></div>

          {/* Goal Section */}
          <div className="mb-8 p-8 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Learning Outcome
            </h4>
            <p className="text-gray-800 leading-relaxed">{currentWeek.goal}</p>
          </div>

          {/* Tools Section */}
          {currentWeek.tools && currentWeek.tools.length > 0 && (
            <div className="mb-12">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                Tools & Technologies
              </h4>
              <div className="flex flex-wrap gap-3">
                {currentWeek.tools.map((tool) => (
                  <span
                    key={tool}
                    className={`px-4 py-2 ${currentWeek.color} text-white text-sm rounded-full font-medium shadow-sm`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Hint */}
          <div className="mt-12 mb-4 text-center text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Use arrow keys or click weeks to navigate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}