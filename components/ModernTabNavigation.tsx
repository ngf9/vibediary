'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useRouter, usePathname } from 'next/navigation';

interface SubItem {
  id: string;
  label: string;
  href: string;
}

interface Tab {
  id: string;
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface ModernTabNavigationProps {
  tabs: Tab[];
  activeTab?: string;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (open: boolean) => void;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ModernTabNavigation({
  tabs,
  activeTab: propActiveTab,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef
}: ModernTabNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active tab based on current route
  const getActiveTab = useCallback(() => {
    if (propActiveTab) return propActiveTab;

    // First check if pathname matches any subItem
    for (const tab of tabs) {
      if (tab.subItems) {
        const matchedSubItem = tab.subItems.find(subItem => subItem.href === pathname);
        if (matchedSubItem) {
          return tab.id; // Return parent tab id (e.g., 'courses')
        }
      }
    }

    // Then check direct tab href matches
    const matchedTab = tabs.find(tab => tab.href === pathname);
    if (matchedTab) return matchedTab.id;

    // Only default to home if on homepage, otherwise no active tab
    return pathname === '/' ? 'home' : '';
  }, [pathname, propActiveTab, tabs]);

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [getActiveTab]);

  const handleTabClick = (tab: Tab) => {
    if (tab.subItems && setIsDropdownOpen) {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (tab.href !== '#') {
      setActiveTab(tab.id);
      router.push(tab.href);
    }
  };

  const handleSubItemClick = (subItem: SubItem) => {
    router.push(subItem.href);
    setIsDropdownOpen?.(false);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center"
    >
      <ul className="flex items-center gap-8 list-none m-0 p-0">
        {tabs.map((tab) => (
          <li key={tab.id} className="relative">
            <button
              onClick={() => handleTabClick(tab)}
              className={`
                relative py-2 px-1 border-0 bg-transparent text-base font-medium
                cursor-pointer whitespace-nowrap transition-all duration-300 flex items-center gap-1
                ${(activeTab === tab.id || (tab.subItems && tab.subItems.some(item => pathname === item.href)))
                  ? 'text-blue opacity-100'
                  : 'text-gray-600 opacity-80 hover:text-gray-900 hover:opacity-100'
                }
              `}
              style={{
                outline: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.01em'
              }}
            >
              <span className="relative z-10">
                {tab.label}
              </span>
              {tab.subItems && (
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen && tab.id === 'essays' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-underline"
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    bottom: '-2px',
                    background: '#5433FF',
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {tab.subItems && isDropdownOpen && tab.id === 'essays' && (
              <div ref={dropdownRef}>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute left-0 min-w-[320px] bg-white/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden z-50"
                  style={{
                    top: 'calc(100% + 8px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {tab.subItems.map((subItem, index) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubItemClick(subItem)}
                        className={`
                          relative w-full text-left px-4 py-3 transition-all duration-150
                          ${isActive
                            ? 'font-bold text-black bg-white/30'
                            : 'text-gray-700 hover:bg-white/30'
                          }
                          ${index !== 0 ? 'border-t border-gray-200/20' : ''}
                        `}
                      >
                        <span className="block whitespace-nowrap">
                          {subItem.label}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}