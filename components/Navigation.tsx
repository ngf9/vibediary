'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ModernTabNavigation from './ModernTabNavigation';
import { motion, AnimatePresence } from 'motion/react';

export default function Navigation() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const navigationTabs = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'essays', label: 'Essays', href: '/essays' },
    { id: 'about', label: 'About', href: '/about' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    if (href !== '#') {
      router.push(href);
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 md:px-12 lg:px-16 py-4 md:py-6 bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div 
            className="text-xl font-bold text-black cursor-pointer"
            onClick={() => router.push('/')}
          >
            Diary of a Vibe Coder
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <ModernTabNavigation
              tabs={navigationTabs}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[56px] md:top-[72px] left-0 right-0 z-[45] bg-white shadow-lg md:hidden"
          >
            <div className="px-4 py-4">
              <ul className="space-y-2">
                {navigationTabs.map((tab) => (
                  <li key={tab.id}>
                    {tab.subItems ? (
                      <>
                        <button
                          onClick={() => setIsMobileProjectsOpen(!isMobileProjectsOpen)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-800 flex items-center justify-between"
                        >
                          <span>{tab.label}</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${isMobileProjectsOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {isMobileProjectsOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {tab.subItems.map((subItem) => (
                                <li key={subItem.id}>
                                  <button
                                    onClick={() => handleNavClick(subItem.href)}
                                    className="w-full text-left px-8 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 text-sm"
                                  >
                                    {subItem.label}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(tab.href)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-800"
                      >
                        {tab.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}