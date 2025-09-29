'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion, useScroll, useInView } from 'motion/react';
import { useRef } from 'react';
import DynamicLetterContent from '@/components/DynamicLetterContent';
import LetterSectionNav from '@/components/LetterSectionNav';
import JsonContentRenderer from '@/components/JsonContentRenderer';
import { ContentSection } from '@/lib/markdown-parser';

interface Essay {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  contentJson?: {
    sections: ContentSection[];
    metadata?: any;
  };
  sections?: any[]; // Legacy: Structured content sections
  editorMode?: 'simple' | 'advanced';
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  letterContent?: {
    title?: string;
    subtitle?: string;
    sections?: Array<{
      id: string;
      title: string;
      content: string;
      type?: string;
      dividerStyle?: string;
      navLabel?: string;
    }>;
  };
  published: boolean;
  featured?: boolean;
  publishedAt?: string;
  tags?: string[];
  thumbnail?: string;
  color?: string;
}

interface EssayClientProps {
  essay: Essay;
  allEssays: Essay[];
}

export default function EssayClient({ essay, allEssays }: EssayClientProps) {
  // Use essay content - prioritize letterContent structure, fall back to simple content
  const heroTitle = essay.heroTitle || essay.title;
  const heroSubtitle = essay.heroSubtitle || essay.subtitle || '';

  // Helper function to parse markdown headers and create sections
  const parseMarkdownSections = (markdown: string) => {
    // Match only h2 headers (##) in the markdown for navigation
    const headerRegex = /^(#{2})\s+(.+)$/gm;
    const headers: Array<{ level: number; text: string; position: number }> = [];

    let match;
    while ((match = headerRegex.exec(markdown)) !== null) {
      headers.push({
        level: match[1].length,
        text: match[2].trim(),
        position: match.index
      });
    }

    // If no headers found, return single section with all content
    if (headers.length === 0) {
      return [{
        id: 'main-content',
        title: '',
        content: markdown,
        type: 'paragraph',
        navLabel: 'Essay'
      }];
    }

    // Create sections from headers
    const sections = headers.map((header, index) => {
      const nextHeader = headers[index + 1];
      const startPos = header.position;
      const endPos = nextHeader ? nextHeader.position : markdown.length;

      // Extract content from current header to next header (or end)
      const sectionContent = markdown.substring(startPos, endPos).trim();

      // Create slug from header text for ID
      const id = header.text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return {
        id: id || `section-${index}`,
        title: header.text,
        content: sectionContent,
        type: 'paragraph',
        navLabel: header.text
      };
    });

    return sections;
  };

  // If essay has structured sections or letterContent, use it. Otherwise, create from markdown
  const letterContent = essay.letterContent ||
    (essay.sections && essay.sections.length > 0 ? {
      title: essay.title,
      subtitle: essay.subtitle,
      sections: essay.sections
    } : {
      title: essay.title,
      subtitle: essay.subtitle,
      sections: essay.content ? parseMarkdownSections(essay.content) : []
    });

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState('opening');

  // Refs for scroll animations
  const heroRef = useRef(null);
  const letterRef = useRef(null);

  // Track if sections are in view
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const letterInView = useInView(letterRef, { once: true, margin: "-100px" });

  // Extract sections for navigation
  const sections = useMemo(() => {
    // If we have JSON content, extract navigation from H2 headings
    if (essay.contentJson) {
      return essay.contentJson.sections
        .filter(section => section.type === 'heading' && section.level === 2)
        .map(section => ({
          id: section.id,
          navLabel: section.content || 'Section'
        }));
    }

    // Fall back to old navigation extraction
    return letterContent.sections
      ?.filter(section => 'id' in section)
      .map((section, index) => {
        const sectionWithId = section as { id: string; navLabel?: string; title?: string };
        // Use navLabel if available, otherwise use title, or create a default label
        const label = sectionWithId.navLabel ||
                     sectionWithId.title ||
                     `Section ${index + 1}`;
        return {
          id: sectionWithId.id,
          navLabel: label
        };
      }) || [];
  }, [essay.contentJson, letterContent.sections]);

  // Track current section using IntersectionObserver for better accuracy
  useEffect(() => {
    if (sections.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    const sectionStates = new Map<string, boolean>();

    const observerOptions = {
      rootMargin: '-15% 0px -75% 0px', // Adjusted for better detection
      threshold: [0, 0.5, 1]
    };

    const updateCurrentSection = () => {
      // Find the topmost visible section
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      let currentId = sections[0]?.id;
      let minDistance = Infinity;

      // Find section closest to top 25% of viewport
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const targetLine = viewportHeight * 0.25; // 25% from top
          const distance = Math.abs(rect.top - targetLine);

          // Update if this section is closer to our target line
          if (distance < minDistance && rect.top < viewportHeight * 0.7) {
            minDistance = distance;
            currentId = section.id;
          }
        }
      }

      setCurrentSection(currentId);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sectionStates.set(entry.target.id, entry.isIntersecting);
      });

      // Debounce the section update
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateCurrentSection, 50);
    }, observerOptions);

    // Observe all section headings
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        sectionStates.set(section.id, false);
      }
    });

    // Set initial section based on scroll position
    const checkInitialSection = () => {
      updateCurrentSection();
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkInitialSection, 100);

    // Also update on scroll for immediate feedback
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateCurrentSection, 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset based on fixed headers
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? 130 : 110; // Slightly more offset for better positioning

      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementPosition - offset;

      // Immediately update current section for instant feedback
      setCurrentSection(sectionId);

      // Smooth scroll
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Get publication date
  const publicationDate = essay.publishedAt ? new Date(essay.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen bg-white">
      <Navigation essays={allEssays} />

      {/* Hero Section with Image Background */}
      {essay.heroImage ? (
        <motion.div
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src={essay.heroImage}
              alt={heroTitle}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
            {publicationDate && (
              <motion.p
                className="text-sm font-medium text-white/90 mb-4 tracking-wider uppercase"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                {publicationDate}
              </motion.p>
            )}

            <motion.h1
              className="text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              {heroTitle}
            </motion.h1>

            {heroSubtitle && (
              <motion.p
                className="text-xl lg:text-2xl mb-8 font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              >
                {heroSubtitle}
              </motion.p>
            )}

            {essay.tags && essay.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              >
                {essay.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
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
      ) : (
        /* Fallback Hero Section without Image */
        <motion.section
          ref={heroRef}
          className="relative min-h-[60vh] flex items-center justify-center px-8 pt-32 pb-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroInView ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-yellow-100/20" />
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${essay.color || '#5433FF'}10 0%, transparent 50%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {publicationDate && (
                <p className="text-sm font-medium text-gray-600 mb-4 tracking-wider uppercase">
                  {publicationDate}
                </p>
              )}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                  {heroSubtitle}
                </p>
              )}
              {essay.tags && essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {essay.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Main Content Section */}
      <motion.section
        ref={letterRef}
        className="relative py-20 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: letterInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
            {/* Letter Content */}
            <div className="max-w-3xl mx-auto">

              {/* Use JSON renderer if contentJson is available, otherwise fall back to old renderer */}
              {essay.contentJson ? (
                <JsonContentRenderer
                  sections={essay.contentJson.sections}
                  inView={letterInView}
                />
              ) : (
                <DynamicLetterContent
                  letterContent={letterContent}
                  letterInView={letterInView}
                />
              )}
            </div>

            {/* Side Navigation - only show if there are multiple sections */}
            {sections.length > 1 && (
              <div className="hidden lg:block sticky top-32 h-fit">
                <LetterSectionNav
                  sections={sections}
                  currentSection={currentSection}
                  onSectionClick={scrollToSection}
                />
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}