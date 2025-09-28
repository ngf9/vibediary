'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import VerticalSyllabusCards from '@/components/VerticalSyllabusCards';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion, useScroll, useInView } from 'motion/react';
import { useRef } from 'react';
import CourseCTASection from '@/components/CourseCTASection';
import DynamicLetterContent from '@/components/DynamicLetterContent';
import LetterSectionNav from '@/components/LetterSectionNav';

interface PageContent {
  id: string;
  pageId: string;
  heroTitle?: string;
  heroSubtitle?: string;
  letterContent?: {
    title?: string;
    subtitle?: string;
    sections?: Array<{
      id: string;
      title: string;
      content: string;
      type?: string;
      dividerStyle?: string;
    }>;
  };
  isActive: boolean;
  createdAt?: number;
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

interface VibeCodingClientProps {
  pageContent: PageContent;
  syllabus: SyllabusItem[];
  cohortDate: CohortDate;
  cohortDates?: CohortDate[];
}

export default function VibeCodingClient({ pageContent, syllabus, cohortDate, cohortDates }: VibeCodingClientProps) {
  // Use server-provided content
  const heroTitle = pageContent.heroTitle || '';
  const heroSubtitle = pageContent.heroSubtitle || '';
  const letterContent = pageContent.letterContent || { sections: [] };
  
  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState('opening');
  const [pastSyllabus, setPastSyllabus] = useState(false);
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const letterRef = useRef(null);
  const syllabusRef = useRef(null);
  
  // Track if sections are in view
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const letterInView = useInView(letterRef, { once: true, margin: "-100px" });
  const syllabusInView = useInView(syllabusRef, { once: true, margin: "-100px" });
  
  // Extract sections for navigation
  const sections = useMemo(() => {
    return letterContent.sections
      ?.filter(section => 'id' in section && 'navLabel' in section)
      .map(section => {
        const sectionWithNav = section as { id: string; navLabel: string };
        return {
          id: sectionWithNav.id,
          navLabel: sectionWithNav.navLabel
        };
      }) || [];
  }, [letterContent.sections]);

  // Handle section navigation click
  const handleSectionClick = useCallback((sectionId: string) => {
    if (sectionId === 'syllabus') {
      // Special handling for syllabus section
      const element = document.getElementById('section-syllabus');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 100; // Account for fixed navigation
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, []);

  // Track scroll progress and current section
  useEffect(() => {
    const handleScroll = () => {
      // Determine current section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(`section-${section.id}`)
      })).filter(item => item.element);

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Track when scrolled past syllabus section
  useEffect(() => {
    const handleScroll = () => {
      const syllabusSection = document.getElementById('section-syllabus');
      if (syllabusSection) {
        const rect = syllabusSection.getBoundingClientRect();
        const syllabusBottom = rect.bottom;
        // Hide nav when syllabus section is mostly out of view
        setPastSyllabus(syllabusBottom < 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-yellow-orange z-[60] origin-left"
        style={{ 
          scaleX: scrollYProgress
        }}
      />
      <Navigation cohortDates={cohortDates} />
      
      {/* Section Navigation */}
      <LetterSectionNav
        sections={sections}
        currentSection={currentSection}
        onSectionClick={handleSectionClick}
        shouldHide={pastSyllabus}
      />

      {/* Hero Section with Full-Width Image */}
      <motion.div 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Background Image with Overlay */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image 
            src="/Vibe_image3.png" 
            alt="Vibe Coding Visual"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </motion.div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {heroTitle && heroTitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < heroTitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-xl lg:text-2xl mb-16 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {heroSubtitle}
          </motion.p>
          
          <motion.button 
            className="px-12 py-6 bg-yellow-orange text-black font-semibold rounded-full text-lg hover:bg-yellow transition-all duration-300 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const letterSection = document.getElementById('letter-section');
              if (letterSection) {
                letterSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {cohortDate.startDate || 'Start Your Journey'}
          </motion.button>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Personal Letter Section */}
        <motion.div 
          id="letter-section"
          ref={letterRef}
          className="mb-24"
          initial={{ opacity: 0 }}
          animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <DynamicLetterContent 
            letterContent={letterContent} 
            letterInView={letterInView} 
            onSectionInView={setCurrentSection}
          />
        </motion.div>


        </div>

        {/* Syllabus Section with Gray Background */}
        <div id="section-syllabus" className="bg-gray-50 pt-16 pb-32 md:pb-40">
          <div className="max-w-4xl mx-auto px-8">
            <motion.div
              ref={syllabusRef}
              initial={{ opacity: 0 }}
              animate={syllabusInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="text-4xl font-bold mb-6 text-center text-gray-900 pt-8"
                initial={{ opacity: 0, y: -20 }}
                animate={syllabusInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                Your 5-Week Study Camp
              </motion.h2>
              <VerticalSyllabusCards serverSyllabus={syllabus} courseType="vibe-coding" />
            </motion.div>
          </div>
        </div>

      {/* Spacer between syllabus and CTA */}
      <div className="h-24 bg-gray-50"></div>

      {/* CTA Section */}
      <CourseCTASection cohortDates={cohortDates} />

      <Footer />
    </div>
  );
}