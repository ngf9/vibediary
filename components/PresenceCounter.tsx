'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresence } from '@/hooks/usePresence';

export default function PresenceCounter() {
  const { visitorCount, isLoading, error } = usePresence();

  // Don't show anything while loading or if there's an error
  if (isLoading || error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          {/* Animated pulse dot */}
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>

          {/* Visitor count text */}
          <motion.span
            key={visitorCount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium"
          >
            {visitorCount} {visitorCount === 1 ? 'person' : 'people'} viewing
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Alternative minimal design - can be used instead of the above
export function PresenceCounterMinimal() {
  const { visitorCount, isLoading, error } = usePresence();

  if (isLoading || error) return null;

  return (
    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm">
        {visitorCount} online
      </span>
    </div>
  );
}