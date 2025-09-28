'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  description: string;
  number: string;
}

interface GridCardsProps {
  cards: Card[];
}

export default function GridCards({ cards }: GridCardsProps) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto px-8 w-full">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="relative h-[400px] lg:h-[calc(100vh-320px)] max-h-[500px] rounded-3xl overflow-hidden cursor-pointer group"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleCardClick(card.href)}
          onHoverStart={() => setHoveredCard(card.id)}
          onHoverEnd={() => setHoveredCard(null)}
          whileHover={{ y: -10 }}
        >
          {/* Background with overlay */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: card.color }}
          >
            {/* Background Image */}
            {card.hoverImage && (
              <div className="absolute inset-0">
                <Image 
                  src={card.hoverImage} 
                  alt=""
                  fill
                  className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 text-white z-10">
            {/* Number */}
            <motion.div
              className="text-5xl lg:text-6xl font-light opacity-50"
              animate={{ opacity: hoveredCard === card.id ? 0.8 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {card.number}
            </motion.div>

            {/* Bottom content */}
            <div>
              <motion.p 
                className="text-xs lg:text-sm uppercase tracking-wider mb-2 opacity-80"
                animate={{ opacity: hoveredCard === card.id ? 1 : 0.8 }}
              >
                {card.subtitle}
              </motion.p>
              <motion.h3 
                className="text-2xl lg:text-3xl font-bold mb-2 leading-tight"
                animate={{ opacity: hoveredCard === card.id ? 1 : 0.95 }}
              >
                {card.title}
              </motion.h3>
              <motion.p 
                className="text-sm lg:text-base opacity-90 leading-relaxed"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: hoveredCard === card.id ? 0.9 : 0,
                  height: hoveredCard === card.id ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {card.description}
              </motion.p>
              {card.cohortDate && (
                <motion.p 
                  className="text-xs lg:text-sm mt-2 opacity-80"
                  animate={{ opacity: hoveredCard === card.id ? 1 : 0.8 }}
                >
                  {card.cohortDate}
                </motion.p>
              )}
            </div>
          </div>

          {/* Hover effect border */}
          <motion.div
            className="absolute inset-0 border-2 border-white/20 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredCard === card.id ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}