'use client';

import React, { useState, useEffect } from 'react';

export default function ColorModeToggle() {
  const [isColorMode, setIsColorMode] = useState(true);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode === 'bw') {
      setIsColorMode(false);
      document.body.classList.add('bw-mode');
    }
  }, []);

  const toggleMode = () => {
    const newMode = !isColorMode;
    setIsColorMode(newMode);
    
    if (newMode) {
      document.body.classList.remove('bw-mode');
      localStorage.setItem('colorMode', 'color');
    } else {
      document.body.classList.add('bw-mode');
      localStorage.setItem('colorMode', 'bw');
    }
  };

  return (
    <button
      onClick={toggleMode}
      className={`relative w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${
        isColorMode ? 'bg-gray-200' : 'bg-gray-700'
      }`}
      aria-label={isColorMode ? 'Switch to black and white mode' : 'Switch to color mode'}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isColorMode ? 'left-0.5' : 'left-6'
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isColorMode ? (
            // Sun icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              stroke="#f59e0b"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          ) : (
            // Moon icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              stroke="#374151"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          )}
        </svg>
      </div>
    </button>
  );
}