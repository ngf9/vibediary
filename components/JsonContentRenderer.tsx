'use client';

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { ContentSection } from '@/lib/markdown-parser';

interface JsonContentRendererProps {
  sections: ContentSection[];
  inView?: boolean;
}

export default function JsonContentRenderer({ sections, inView = true }: JsonContentRendererProps) {
  const renderSection = (section: ContentSection, index: number) => {
    const baseDelay = 0.1 + index * 0.02;

    switch (section.type) {
      case 'heading':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
          >
            {section.level === 1 && (
              <h1
                id={section.id}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-gray-900 scroll-mt-[130px] lg:scroll-mt-[110px]"
              >
                {section.content}
              </h1>
            )}
            {section.level === 2 && (
              <h2
                id={section.id}
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 scroll-mt-[130px] lg:scroll-mt-[110px]"
                style={{ marginTop: '2rem', marginBottom: '2rem' }}
              >
                {section.content}
              </h2>
            )}
            {section.level === 3 && (
              <h3
                id={section.id}
                className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3 text-gray-900 scroll-mt-[130px] lg:scroll-mt-[110px]"
              >
                {section.content}
              </h3>
            )}
            {section.level === 4 && (
              <h4
                id={section.id}
                className="text-base sm:text-lg md:text-xl font-medium mt-4 sm:mt-5 mb-2 text-gray-800 scroll-mt-[130px] lg:scroll-mt-[110px]"
              >
                {section.content}
              </h4>
            )}
          </motion.div>
        );

      case 'paragraph':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-4 sm:mb-6"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.content || ''}
            </ReactMarkdown>
          </motion.div>
        );

      case 'image':
        return (
          <motion.figure
            key={section.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className="mt-4 mb-8 sm:mt-6 sm:mb-10 lg:mt-8 lg:mb-12 -mx-4 sm:mx-0"
          >
            <Image
              src={section.src || ''}
              alt={section.alt || 'Image'}
              width={800}
              height={600}
              className="w-full h-auto rounded-none sm:rounded-lg shadow-md sm:shadow-lg"
              style={{ objectFit: 'cover' }}
              unoptimized={section.src?.startsWith('data:')}
            />
            {section.caption && (
              <figcaption className="text-center text-xs sm:text-sm text-gray-600 mt-2 italic px-4 sm:px-0">
                {section.caption}
              </figcaption>
            )}
          </motion.figure>
        );

      case 'list':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="mb-6 sm:mb-8"
          >
            {section.ordered ? (
              <ol className="space-y-2 text-sm sm:text-base text-gray-700 list-decimal list-inside pl-1">
                {section.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside pl-1">
                {section.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            )}
          </motion.div>
        );

      case 'code':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="my-4 sm:my-6 -mx-4 sm:mx-0"
          >
            <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-none sm:rounded-lg overflow-x-auto">
              <code className="text-xs sm:text-sm font-mono">
                {section.content}
              </code>
            </pre>
          </motion.div>
        );

      case 'blockquote':
        return (
          <motion.blockquote
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="border-l-3 sm:border-l-4 border-purple-500 pl-3 sm:pl-4 py-2 my-4 sm:my-6 italic text-sm sm:text-base text-gray-600"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.content || ''}
            </ReactMarkdown>
          </motion.blockquote>
        );

      case 'separator':
        return (
          <motion.hr
            key={section.id}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: baseDelay }}
            className="my-4 sm:my-6 border-gray-300"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-none">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}