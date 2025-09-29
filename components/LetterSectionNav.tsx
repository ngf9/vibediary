'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  navLabel: string;
}

interface LetterSectionNavProps {
  sections: Section[];
  currentSection: string;
  onSectionClick: (sectionId: string) => void;
  shouldHide?: boolean;
}

export default function LetterSectionNav({
  sections,
  currentSection,
  onSectionClick,
  shouldHide = false
}: LetterSectionNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('LetterSectionNav - currentSection:', currentSection);
    console.log('LetterSectionNav - sections:', sections.map(s => ({ id: s.id, label: s.navLabel })));
  }, [currentSection, sections]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero section
      const heroHeight = window.innerHeight;
      const scrolled = window.scrollY > heroHeight - 100;
      // Hide if shouldHide is true, otherwise show based on scroll
      setIsVisible(scrolled && !shouldHide);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  // Auto-center active section in mobile scroll container
  useEffect(() => {
    if (scrollContainerRef.current && currentSection) {
      const container = scrollContainerRef.current;
      const activeButton = container.querySelector(`[data-section="${currentSection}"]`) as HTMLElement;

      if (activeButton) {
        const containerWidth = container.clientWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.clientWidth;
        const scrollTarget = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

        container.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [currentSection]);

  // Handle scroll container gradient indicators
  const handleScrollContainer = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Initialize gradient state when navigation becomes visible
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        handleScrollContainer();
      }, 100);
    }
  }, [isVisible, handleScrollContainer]);

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Navigation - Right Side */}
      <motion.div
        className={cn(
          "hidden lg:block fixed top-1/2 -translate-y-1/2 z-40",
          isCollapsed ? "right-2" : "right-8"
        )}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center">
          {/* Toggle Tab - Attached to Navigation */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-20 w-6 bg-white/70 backdrop-blur-md backdrop-saturate-150 hover:bg-white/80 transition-all",
              "rounded-l-xl border border-r-0 border-white/20",
              "flex items-center justify-center group",
              "shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]"
            )}
            title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <motion.div
              animate={{ opacity: isCollapsed ? 1 : 0.6 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </motion.div>
          </button>

          {/* Navigation Content */}
          <motion.div
            className={cn(
              "bg-white/75 backdrop-blur-md backdrop-saturate-150",
              "rounded-r-2xl border border-l-0 border-white/20",
              "overflow-hidden relative",
              "shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]",
              "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"
            )}
            animate={{
              width: isCollapsed ? 0 : 'auto',
              opacity: isCollapsed ? 0 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6" style={{ width: '240px' }}>
                <div className="relative">
                  {/* Section Title */}
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Sections</h3>
                  
                  {/* Navigation Items */}
                  <ul className="space-y-2">
                    {sections.map((section) => {
                      const isActive = currentSection === section.id;
                      if (isActive) {
                        console.log(`Active section match: "${currentSection}" === "${section.id}"`, isActive);
                      }

                      return (
                      <li key={section.id} className="relative">
                        <button
                          onClick={() => onSectionClick(section.id)}
                          className={cn(
                            "group flex items-center gap-3 transition-all duration-150 -ml-1 pl-2 pr-4 py-2 rounded-lg w-full",
                            isActive
                              ? "bg-gradient-to-r from-purple-50 to-blue-50"
                              : "hover:bg-gray-50"
                          )}
                        >
                          {/* Dot with pulsing effect */}
                          <div className="relative flex-shrink-0 flex items-center justify-center w-5 h-5">
                            {isActive ? (
                              <>
                                {/* Pulsing ring effect */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-60 animate-pulse-ring" />
                                </div>
                                {/* Solid center dot */}
                                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm" />
                              </>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-all duration-150" />
                            )}
                          </div>

                          {/* Label with clear active state */}
                          <span
                            className={cn(
                              "text-sm whitespace-nowrap max-w-[180px] transition-all duration-150",
                              isActive
                                ? "text-gray-900 font-bold"
                                : "text-gray-600 group-hover:text-gray-800"
                            )}
                            title={section.navLabel}
                          >
                            {section.navLabel.length > 25 ? section.navLabel.substring(0, 25) + '...' : section.navLabel}
                          </span>
                        </button>
                      </li>
                    );
                    })}
                  </ul>
                </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Navigation - Horizontal Scrollable Tabs */}
      <motion.nav
        className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md h-12 border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient Fade Left */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none transition-opacity duration-300",
            showLeftGradient ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Gradient Fade Right */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 to-transparent z-10 pointer-events-none transition-opacity duration-300",
            showRightGradient ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScrollContainer}
          className="flex items-center h-full overflow-x-auto scrollbar-hide scroll-smooth px-4 [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch]"
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              data-section={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "relative px-4 h-full flex items-center whitespace-nowrap transition-all duration-200",
                "[scroll-snap-align:center] active:scale-95",
                currentSection === section.id && "px-5",
                index === 0 && "ml-4",
                index === sections.length - 1 && "mr-4"
              )}
            >
              {/* Tab Label */}
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  currentSection === section.id
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 active:text-gray-800"
                )}
                title={section.navLabel}
              >
                {section.navLabel.length > 25 ? section.navLabel.substring(0, 25) + '...' : section.navLabel}
              </span>

              {/* Active Bar Indicator */}
              {currentSection === section.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  layoutId="mobile-active-indicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                >
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </motion.nav>

    </>
  );
}