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
                className="text-4xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-28 lg:scroll-mt-24"
              >
                {section.content}
              </h1>
            )}
            {section.level === 2 && (
              <h2
                id={section.id}
                className="text-3xl font-semibold mt-16 mb-4 text-gray-900 scroll-mt-28 lg:scroll-mt-24"
              >
                {section.content}
              </h2>
            )}
            {section.level === 3 && (
              <h3
                id={section.id}
                className="text-2xl font-semibold mt-4 mb-2 text-gray-900 scroll-mt-28 lg:scroll-mt-24"
              >
                {section.content}
              </h3>
            )}
            {section.level === 4 && (
              <h4
                id={section.id}
                className="text-xl font-medium mt-3 mb-2 text-gray-800 scroll-mt-28 lg:scroll-mt-24"
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
            className="prose prose-lg max-w-none mb-6"
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
            className="my-8"
          >
            <Image
              src={section.src || ''}
              alt={section.alt || 'Image'}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ objectFit: 'cover' }}
              unoptimized={section.src?.startsWith('data:')}
            />
            {section.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
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
            className="mb-8"
          >
            {section.ordered ? (
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                {section.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
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
            className="my-6"
          >
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">
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
            className="border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-gray-600"
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
            className="my-6 border-gray-300"
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