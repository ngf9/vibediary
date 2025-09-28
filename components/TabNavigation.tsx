'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(activeTab || tabs[0]?.id);

  const handleTabClick = (tab: Tab) => {
    setSelected(tab.id);
    onTabChange?.(tab.id);
    
    if (tab.onClick) {
      tab.onClick();
    } else if (tab.href) {
      router.push(tab.href);
    }
  };

  return (
    <div className="tab-navigation-container">
      <ul className="tab-list">
        {tabs.map((tab) => (
          <li key={tab.id} className="tab-item">
            {selected === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="tab-indicator"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <motion.button
              className={`tab-button ${selected === tab.id ? 'selected' : ''}`}
              onClick={() => handleTabClick(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {tab.label}
            </motion.button>
          </li>
        ))}
      </ul>
      
      <style jsx>{`
        .tab-navigation-container {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .tab-list {
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .tab-item {
          position: relative;
          color: var(--gray-dark);
        }
        
        .tab-indicator {
          background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%);
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(84, 51, 255, 0.3);
        }
        
        .tab-button {
          z-index: 2;
          position: relative;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 500;
          color: var(--gray-dark);
          transition: color 0.2s ease;
          outline: none;
        }
        
        .tab-button:hover {
          color: var(--gray-medium);
        }
        
        .tab-button:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 2px;
        }
        
        .tab-button.selected {
          color: white;
          font-weight: 600;
        }
        
        @media (max-width: 640px) {
          .tab-button {
            padding: 8px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}