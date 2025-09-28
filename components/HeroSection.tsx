'use client';

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const additionalText = " Want to join?";
  const [displayedAdditionalText, setDisplayedAdditionalText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    // Wait 3.5 seconds before starting to type
    const delayTimer = setTimeout(() => {
      setStartTyping(true);
    }, 3500);

    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    if (startTyping) {
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < additionalText.length) {
          setDisplayedAdditionalText(additionalText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 60); // 60ms per character

      return () => clearInterval(typingInterval);
    }
  }, [startTyping]);

  return (
    <div className="text-center mb-4 px-8">
      <h1 className="text-6xl lg:text-8xl font-bold mb-6 text-gray-800">
        Welcome to <span className="text-blue">AI Study Camp</span>
      </h1>
      <p className="text-2xl lg:text-3xl font-semibold text-gray-900 max-w-4xl mx-auto leading-relaxed">
        We make and teach AI courses for Founders and Product Managers.
        {displayedAdditionalText}
        <span className="inline-block w-1 h-[1.2em] bg-gray-900 ml-1 animate-blink align-middle"></span>
      </p>
    </div>
  );
}