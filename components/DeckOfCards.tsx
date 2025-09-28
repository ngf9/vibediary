'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Card {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
  hoverImage?: string;
  cohortDate?: string;
}

interface DeckOfCardsProps {
  cards: Card[];
}

export default function DeckOfCards({ cards }: DeckOfCardsProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Preload all hover images when component mounts
  useEffect(() => {
    const preloadImages = () => {
      cards.forEach(card => {
        if (card.hoverImage) {
          // Try WebP first, fallback to PNG
          const webpImage = card.hoverImage.replace('.png', '-optimized.webp');
          const pngImage = card.hoverImage.replace('.png', '-optimized.png');

          // Preload WebP
          const imgWebP = new window.Image();
          imgWebP.onerror = () => {
            // If WebP fails, try optimized PNG
            const imgPNG = new window.Image();
            imgPNG.src = pngImage;
          };
          imgWebP.src = webpImage;
        }
      });
    };

    preloadImages();
  }, [cards]);

  const moveToNextCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, cards.length]);

  const moveToPrevCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, cards.length]);

  const handleCardClick = (card: Card, index: number) => {
    if (index === currentIndex) {
      // If clicking the top card, navigate to its page
      router.push(card.href);
    } else {
      // Otherwise, bring that card to the top
      setCurrentIndex(index);
    }
  };

  // Calculate visible cards (current + next 2)
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < Math.min(3, cards.length); i++) {
      const index = (currentIndex + i) % cards.length;
      visible.push({ card: cards[index], stackPosition: i, originalIndex: index });
    }
    return visible;
  };

  const visibleCards = getVisibleCards();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        moveToNextCard();
      } else if (e.key === 'ArrowLeft') {
        moveToPrevCard();
      } else if (e.key === 'Enter' && cards[currentIndex]) {
        router.push(cards[currentIndex].href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, cards, router, moveToNextCard, moveToPrevCard]);

  return (
    <div className="deck-container">
      {/* Card Stack */}
      <div className="relative w-[320px] md:w-[380px] h-[440px] md:h-[520px] mb-8">
        <AnimatePresence mode="popLayout">
          {visibleCards.map(({ card, stackPosition, originalIndex }) => (
            <motion.div
              key={`${card.id}-${originalIndex}`}
              className={`absolute inset-0 cursor-pointer rounded-[32px] overflow-hidden ${
                stackPosition === 0 ? 'shadow-2xl' : 'shadow-lg'
              }`}
              style={{
                backgroundColor: card.color,
                zIndex: 10 - stackPosition,
              }}
              initial={{ 
                scale: 0.8 + (0.1 * (2 - stackPosition)),
                y: 80 + (stackPosition * 25),
                opacity: 0 
              }}
              animate={{ 
                scale: 1 - (stackPosition * 0.05),
                y: stackPosition * 25,
                x: stackPosition * 15,
                opacity: 1 - (stackPosition * 0.15),
                rotateZ: stackPosition === 0 ? 0 : stackPosition * 3,
              }}
              exit={{ 
                x: -300,
                y: -100,
                opacity: 0,
                rotate: -45,
                scale: 0.8,
                transition: { duration: 0.4 }
              }}
              whileHover={stackPosition === 0 ? { 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              } : {}}
              onHoverStart={() => setHoveredCard(card.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleCardClick(card, originalIndex)}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Hover Image Overlay */}
              {card.hoverImage && hoveredCard === card.id && stackPosition === 0 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <picture>
                    <source
                      srcSet={card.hoverImage.replace('.png', '-optimized.webp')}
                      type="image/webp"
                    />
                    <Image
                      src={card.hoverImage.replace('.png', '-optimized.png')}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 320px, 380px"
                      priority={currentIndex === originalIndex}
                      loading="eager"
                    />
                  </picture>
                </motion.div>
              )}
              
              <div className="h-full p-8 md:p-12 flex flex-col justify-between text-white relative z-10">
                <div>
                  <motion.p 
                    className="text-sm uppercase tracking-widest mb-3 opacity-70"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {card.subtitle}
                  </motion.p>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {card.title}
                  </motion.h2>
                  {card.cohortDate && (
                    <motion.p 
                      className="text-lg mt-4 opacity-80"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.8, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {card.cohortDate}
                    </motion.p>
                  )}
                </div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm opacity-80">
                    {stackPosition === 0 ? 'Click to explore' : 'Click to bring forward'}
                  </span>
                  {stackPosition === 0 && (
                    <motion.svg 
                      className="w-6 h-6 opacity-80"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={moveToPrevCard}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
          disabled={isAnimating}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Progress Indicators */}
        <div className="flex gap-2">
          {cards.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full cursor-pointer"
              style={{
                backgroundColor: index === currentIndex ? '#5433FF' : '#E5E7EB'
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentIndex(index)}
              animate={{
                scale: index === currentIndex ? 1.2 : 1
              }}
            />
          ))}
        </div>

        <button
          onClick={moveToNextCard}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
          disabled={isAnimating}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <motion.p 
        className="text-center mt-2 text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click cards to explore or use arrow keys to navigate
      </motion.p>

      <style jsx>{`
        .deck-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          gap: 2rem;
        }
      `}</style>
    </div>
  );
}