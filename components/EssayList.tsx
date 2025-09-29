'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Essay {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  published: boolean;
  publishedAt?: string;
  tags?: string[];
  readTime?: number;
}

interface EssayListProps {
  essays: Essay[];
}

export default function EssayList({ essays }: EssayListProps) {
  const router = useRouter();

  // Format date to "SEP 28, 2025" format
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="px-8 md:px-12 lg:px-16 py-16 relative">
      <div className="max-w-screen-2xl mx-auto relative">
        {/* Essay List Container */}
        <div className="lg:w-3/5">
          {essays.map((essay, index) => (
        <motion.article
          key={essay.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="mb-16 lg:mb-20 group cursor-pointer"
          onClick={() => router.push(`/essays/${essay.slug}`)}
        >
          {/* Date */}
          {essay.publishedAt && (
            <motion.p
              className="text-xs lg:text-sm text-gray-500 font-medium tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            >
              {formatDate(essay.publishedAt)}
            </motion.p>
          )}

          {/* Title */}
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {essay.title}
          </motion.h2>

          {/* Divider Line */}
          <motion.div
            className="w-24 h-px bg-gray-300 mb-4 group-hover:w-32 group-hover:bg-blue-600 transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          />

          {/* Subtitle or Excerpt */}
          {(essay.subtitle || essay.excerpt) && (
            <motion.p
              className="text-base lg:text-lg text-gray-600 leading-relaxed mb-4 line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {essay.subtitle || essay.excerpt}
            </motion.p>
          )}

          {/* Tags and Read Time */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {essay.tags && essay.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {essay.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {essay.readTime && (
              <span className="text-xs text-gray-500">
                {essay.readTime} min read
              </span>
            )}
          </motion.div>
          </motion.article>
        ))}
        </div>

        {/* Faded Image on the Right - Fixed Position Behind Navigation */}
        <div className="hidden lg:block fixed right-0 top-0 w-1/2 h-screen pointer-events-none z-40">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full h-full"
          >
            <div
              className="relative w-full h-full"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
              }}
            >
              <Image
                src="/Vibes.png"
                alt="Vibes"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'left center',
                  transform: 'scale(1.3)',
                }}
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}