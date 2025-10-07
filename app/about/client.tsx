'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Essay {
  id: string;
  slug: string;
  title: string;
}

interface AboutPageClientProps {
  philosophyContent?: string[];
  milestones?: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>;
  essays?: Essay[];
  timelineImage?: string;
}

export default function AboutPageClient({
  philosophyContent = [
    "I believe that AI education should be accessible, practical, and transformative. My approach breaks down complex concepts into intuitive understanding, then builds them back up through hands-on experience.",
    "I'm not just teaching tools—I'm cultivating a mindset. I want you to think like a builder, understand like an engineer, and create with the confidence of someone who truly grasps the technology you're wielding."
  ],
  timelineImage = "/artofconversation.png",
  milestones = [
    {
      id: '1',
      title: "The Spark",
      date: "2023",
      description: "After YC, realized the gap between technical and non-technical builders needed bridging"
    },
    {
      id: '2',
      title: "First Cohort",
      date: "Early 2024",
      description: "Launched with 8 passionate learners ready to master AI fundamentals"
    },
    {
      id: '3',
      title: "Building Curriculum",
      date: "Mid 2024",
      description: "Refined our approach: 30% theory, 70% hands-on vibe coding practice"
    },
    {
      id: '4',
      title: "Growing Community",
      date: "Late 2024",
      description: "100+ builders shipped real products using our vibe coding methodology"
    },
    {
      id: '5',
      title: "Looking Forward",
      date: "2025",
      description: "Expanding with new courses, tools, and a thriving builder community"
    }
  ],
  essays = []
}: AboutPageClientProps) {
  // Refs for scroll animations
  const philosophyRef = useRef(null);
  const timelineRef = useRef(null);

  // Track if sections are in view
  const philosophyInView = useInView(philosophyRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-strip aurora-1" />
        <div className="aurora-strip aurora-2" />
        <div className="aurora-strip aurora-3" />
        <div className="aurora-strip aurora-4" />
        <div className="aurora-strip aurora-5" />
      </div>

      <Navigation essays={essays} />

      <div className="relative z-10 pt-32">
        {/* Our Philosophy Section */}
        <motion.div
          ref={philosophyRef}
          className="max-w-7xl mx-auto px-8 mb-24"
          initial={{ opacity: 0 }}
          animate={philosophyInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={philosophyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                About Me
              </h1>
              <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed">
                {philosophyContent.map((paragraph, index) => (
                  <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Making AI Study Camp Timeline Section */}
        <div className="bg-gray-50 mt-32" style={{ paddingTop: '4rem', paddingBottom: '8rem' }}>
          <motion.div
            ref={timelineRef}
            className="max-w-7xl mx-auto px-8"
            initial={{ opacity: 0 }}
            animate={timelineInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="text-4xl font-bold text-center mb-16 mt-8 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              My Journey
            </motion.h2>

            {/* Desktop Layout with row-based grid */}
            <div className="hidden lg:grid grid-cols-12 gap-8 max-w-7xl mx-auto">
              {/* Left side: Milestones with timeline */}
              <div className="col-span-6 relative">
                {/* Vertical timeline line */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/50 z-0">
                  <motion.div
                    className="w-full h-full bg-gray-300/50"
                    initial={{ scaleY: 0 }}
                    animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "top" }}
                  />
                </div>

                {/* Milestone rows */}
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className={`relative flex items-center ${index < milestones.length - 1 ? 'mb-24' : ''}`}>
                    {/* Card */}
                    <motion.div
                      style={{ width: 'calc(100% - 5rem)' }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                    >
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
                        <h3 className="font-bold text-xl mb-2 text-gray-900">{milestone.title}</h3>
                        <p className="text-blue font-semibold text-sm mb-3">{milestone.date}</p>
                        <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      </div>
                    </motion.div>

                    {/* Horizontal connecting line */}
                    <motion.div
                      className="absolute h-0.5 bg-gray-300 z-0"
                      style={{ width: '3.75rem', right: '1.25rem' }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={timelineInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.15, ease: "easeOut" }}
                    />

                    {/* Circle on timeline */}
                    <motion.div
                      className="absolute transform translate-x-1/2 z-10"
                      style={{ right: '0' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={timelineInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                    >
                      <div className="relative w-10 h-10 rounded-full bg-blue text-white flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-300 hover:scale-110 group">
                        <div
                          className="absolute inset-0 rounded-full bg-blue"
                          style={{
                            boxShadow: '0 0 0 3px rgba(84, 51, 255, 0.2), 0 0 10px rgba(84, 51, 255, 0.3)'
                          }}
                        />
                        <span className="relative z-10">{index + 1}</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Right Column - Image (6 columns) */}
              <div className="col-span-6">
                <motion.div
                  className="sticky top-32 max-w-md mx-auto"
                  initial={{ opacity: 0, x: 30 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={timelineImage}
                      alt="Timeline"
                      fill
                      className="object-cover rounded-3xl"
                      sizes="(max-width: 1024px) 100vw, 500px"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile/Tablet Timeline without image */}
            <div className="lg:hidden">
              {/* Vertical Timeline Container */}
              <div className="relative">
                {/* Left Line - Mobile */}
                <div className="absolute left-12 w-px h-full bg-gray-200/50">
                  <motion.div
                    className="w-full h-full bg-gray-300/50"
                    initial={{ scaleY: 0 }}
                    animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "top" }}
                  />
                </div>

                {/* Milestones */}
                <div className="relative">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={`mobile-${milestone.id}`}
                      className="relative mb-16 flex items-center"
                      initial={{ opacity: 0, x: -30 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                    >
                      {/* Mobile: Dot on Left */}
                      <div className="flex-shrink-0">
                        <motion.div
                          className="relative ml-8 group"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {/* Circle with number */}
                          <div className="relative w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-bold text-xs shadow-lg">
                            <div
                              className="absolute inset-0 rounded-full bg-blue"
                              style={{
                                boxShadow: '0 0 0 2px rgba(84, 51, 255, 0.2), 0 0 8px rgba(84, 51, 255, 0.3)'
                              }}
                            />
                            <span className="relative z-10">{index + 1}</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Mobile: Card on Right */}
                      <div className="flex-1 ml-6">
                        <div className="bg-white rounded-xl p-4 shadow-lg">
                          <h3 className="font-bold text-lg mb-1 text-gray-900">{milestone.title}</h3>
                          <p className="text-blue font-semibold text-sm mb-2">{milestone.date}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}