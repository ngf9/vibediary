'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Placeholder logos - replace with actual company logos
const logos = [
  { id: 1, name: 'Y Combinator', placeholder: 'YC' },
  { id: 2, name: 'Meta', placeholder: 'META' },
  { id: 3, name: 'Deel', placeholder: 'DEEL' },
  { id: 4, name: 'Google', placeholder: 'GOOGLE' },
  { id: 5, name: 'Stripe', placeholder: 'STRIPE' },
  { id: 6, name: 'OpenAI', placeholder: 'OPENAI' },
  { id: 7, name: 'Anthropic', placeholder: 'ANTHROPIC' },
  { id: 8, name: 'Microsoft', placeholder: 'MSFT' },
];

// Duplicate the array for seamless scrolling
const duplicatedLogos = [...logos, ...logos];

export default function LogoCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div className="flex items-center">
        <motion.div
          className="flex gap-12"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0"
            >
              <div className="w-32 h-16 flex items-center justify-center">
                <div className="px-6 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300 hover:shadow-md group cursor-pointer">
                  <span className="text-gray-700 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                    {logo.placeholder}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Alternative version with image placeholders - uncomment when you have actual logos */}
      {/*
      <motion.div
        className="flex gap-12"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0"
          >
            <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <img
                src={`/logos/${logo.id}.png`}
                alt={logo.name}
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        ))}
      </motion.div>
      */}
    </div>
  );
}