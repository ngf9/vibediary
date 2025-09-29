'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ModernTabNavigation from './ModernTabNavigation';
import { motion, AnimatePresence } from 'motion/react';

interface Essay {
  id: string;
  slug: string;
  title: string;
}

interface NavigationProps {
  essays?: Essay[];
}

export default function Navigation({ essays = [] }: NavigationProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileEssaysOpen, setIsMobileEssaysOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const navigationTabs = [
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
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 md:px-12 lg:px-16 py-4 md:py-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div
            className="text-xl text-black cursor-pointer"
            onClick={() => router.push('/')}
          >
            <span className="hidden md:block">
              <span className="font-bold">Diary of a Vibe Coder,</span>
              <span className="font-normal italic"> a collection of essays on building with AI.</span>
            </span>
            <span className="md:hidden font-bold">Diary of a Vibe Coder</span>
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
                    <button
                      onClick={() => handleNavClick(tab.href)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-800"
                    >
                      {tab.label}
                    </button>
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