'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface OurStoryStat {
  id: string;
  label: string;
  value: string;
  description: string;
  iconName: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: number;
  updatedAt?: number;
}

interface OurStorySectionProps {
  stats?: OurStoryStat[];
}

export default function OurStorySection({ stats = [] }: OurStorySectionProps) {
  // Function to get icon component by name
  const getIconComponent = (iconName: string) => {
    // @ts-expect-error - Dynamic icon access
    const IconComponent = LucideIcons[iconName];
    return IconComponent || LucideIcons.HelpCircle;
  };
  return (
    <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Our Story (TL;DR)
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.length === 0 ? (
            // Fallback for when no stats are loaded yet
            <div className="col-span-full text-center text-gray-500">
              Loading statistics...
            </div>
          ) : (
            stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.iconName);
              return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div
                className="relative p-6 rounded-2xl border-2 bg-white/60 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: stat.color }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <IconComponent className="w-8 h-8" style={{ color: stat.color }} />
                </div>

                {/* Value */}
                <div
                  className="text-4xl font-bold mb-2 transition-all duration-300"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-gray-600">
                  {stat.description}
                </div>
              </div>
            </motion.div>
            );
          })
        )}
        </div>

        {/* Read More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 relative z-20"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold text-lg rounded-full hover:bg-gray-200 hover:shadow-lg transition-all duration-300"
          >
            Read our full story
            <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}