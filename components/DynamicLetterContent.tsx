import React from 'react';
import { motion } from 'motion/react';

interface ContentItem {
  type: string;
  content: string;
}

interface ContentSection {
  type: string;
  content?: string | ContentItem[];
  level?: number;
  color?: string;
  bulletColor?: string;
  items?: string[];
  name?: string;
  title?: string;
}

interface Section {
  id: string;
  navLabel: string;
  type: string;
  dividerStyle?: string;
  content: ContentSection[];
}

interface SimplifiedSection {
  id: string;
  title: string;
  content: string;
  type?: string;
  dividerStyle?: string;
}

interface DynamicLetterContentProps {
  letterContent: {
    greeting?: string;
    title?: string;
    subtitle?: string;
    sections?: (ContentSection | Section | SimplifiedSection)[];
  };
  letterInView: boolean;
  onSectionInView?: (sectionId: string) => void;
}

export default function DynamicLetterContent({ letterContent, letterInView }: DynamicLetterContentProps) {
  // Handle missing or invalid letterContent
  if (!letterContent || !letterContent.sections) {
    return null;
  }

  const renderDivider = (style?: string) => {
    switch(style) {
      case 'dots':
        return (
          <div className="flex justify-center items-center py-12 text-gray-300">
            <span className="text-2xl tracking-[0.5em]">•••</span>
          </div>
        );
      case 'line':
        return (
          <div className="flex justify-center items-center py-12">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        );
      case 'asterisk':
        return (
          <div className="flex justify-center items-center py-12 text-gray-400">
            <span className="text-xl tracking-[0.3em] font-light">✦ ✦ ✦</span>
          </div>
        );
      default:
        return <div className="py-8" />;
    }
  };

  const renderContentSection = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-base leading-relaxed text-gray-700 mb-4">
            {typeof section.content === 'string' ? section.content : ''}
          </p>
        );
      
      case 'heading':
        const className = section.level === 3 ? "text-2xl font-bold mt-12 mb-4 text-gray-900" : "text-xl font-bold mt-8 mb-4 text-gray-900";
        const headingContent = typeof section.content === 'string' ? section.content : '';
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
          >
            {section.level === 3 ? (
              <h3 className={className}>{headingContent}</h3>
            ) : (
              <h4 className={className}>{headingContent}</h4>
            )}
          </motion.div>
        );
      
      case 'callout':
        const colorClasses = section.color === 'blue' 
          ? 'bg-blue/10 border-l-4 border-blue' 
          : `bg-gray-100 border-l-4 border-gray-400`;
        return (
          <motion.div 
            key={index}
            className={`${colorClasses} p-8 my-12 rounded-r-lg`}
            initial={{ opacity: 0, x: -20 }}
            animate={letterInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {Array.isArray(section.content) ? (
              section.content.map((item: ContentItem, i: number) => {
                if (item.type === 'strong') {
                  return (
                    <p key={i} className="text-lg font-medium text-gray-800 leading-relaxed mb-4">
                      <strong>{item.content}</strong>
                    </p>
                  );
                } else {
                  return (
                    <p key={i} className="text-base text-gray-700 leading-relaxed">
                      {item.content}
                    </p>
                  );
                }
              })
            ) : (
              <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>
            )}
          </motion.div>
        );
      
      case 'list':
        const bulletColorClass = section.bulletColor === 'yellow-orange' 
          ? 'text-yellow-orange' 
          : section.bulletColor === 'blue' 
          ? 'text-blue'
          : section.bulletColor === 'coral'
          ? 'text-coral'
          : 'text-gray-700';
        return (
          <ul key={index} className="space-y-2 mb-8 text-base text-gray-700">
            {section.items?.map((item, i) => (
              <li key={i} className="flex">
                <span className={`${bulletColorClass} mr-3 leading-relaxed`}>•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'strong':
        return (
          <p key={index} className="text-base leading-relaxed text-gray-700 mb-4">
            <strong>{typeof section.content === 'string' ? section.content : ''}</strong>
          </p>
        );
      
      case 'signature':
        return (
          <div key={index} className="mt-12">
            <p className="text-3xl text-gray-800" style={{ fontFamily: 'var(--font-signature)', letterSpacing: '0.02em' }}>
              {section.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {section.title}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="prose prose-lg max-w-none"
      initial={{ opacity: 0, y: 30 }}
      animate={letterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <motion.h2 
        className="text-4xl font-bold mb-8 text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {letterContent.greeting}
      </motion.h2>
      
      {letterContent.sections && letterContent.sections.length > 0 && letterContent.sections.map((section, sectionIndex) => {
        // Check if this is a new section structure with id and content array
        if ('id' in section && 'content' in section && Array.isArray(section.content)) {
          const sectionData = section as Section;
          return (
            <div key={sectionData.id}>
              {/* Render divider if not the first section */}
              {sectionIndex > 0 && renderDivider(sectionData.dividerStyle)}
              
              {/* Section anchor - positioned after divider for proper scroll targeting */}
              <div id={`section-${sectionData.id}`} className="scroll-mt-32">
                {/* Render section content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.02 }}
                  className="mb-12"
                >
                  {sectionData.content.length > 0 ? (
                    sectionData.content.map((contentItem, contentIndex) => (
                      <div key={contentIndex}>
                        {renderContentSection(contentItem, contentIndex)}
                      </div>
                    ))
                  ) : (
                    // Empty content for sections like syllabus that link to other components
                    <div className="h-0" />
                  )}
                </motion.div>
              </div>
            </div>
          );
        } else {
          // Legacy content structure support
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0 }}
              animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.02 }}
            >
              {renderContentSection(section as ContentSection, sectionIndex)}
            </motion.div>
          );
        }
      })}
    </motion.div>
  );
}