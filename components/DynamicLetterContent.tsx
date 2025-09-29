import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  src?: string;
  alt?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right' | 'full';
  images?: Array<{ src: string; alt?: string; caption?: string }>;
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
  title?: string;
  navLabel?: string;
  content: string | ContentSection[] | any;
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

  // Check if content looks like markdown (contains common markdown patterns)
  const isMarkdown = (text: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s+/m, // Headers
      /\*\*[^*]+\*\*/,  // Bold
      /\*[^*]+\*/,      // Italic
      /\[.*\]\(.*\)/,   // Links
      /^[\*\-\+]\s+/m,  // Lists
      /^>\s+/m,         // Blockquotes
      /```[\s\S]*?```/, // Code blocks
      /`[^`]+`/,        // Inline code
      /!\[.*\]\(.*\)/,  // Images
    ];

    return markdownPatterns.some(pattern => pattern.test(text));
  };

  // Render markdown content with proper styling
  const renderMarkdownContent = (content: string, index: number) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.02 }}
        className="prose prose-lg max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>,
            h3: ({ children }) => <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900">{children}</h3>,
            h4: ({ children }) => <h4 className="text-xl font-medium mt-4 mb-2 text-gray-800">{children}</h4>,
            p: ({ children }) => <p className="text-base leading-relaxed text-gray-700 mb-4">{children}</p>,
            ul: ({ children }) => <ul className="space-y-2 mb-6 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="space-y-2 mb-6 text-gray-700 list-decimal list-inside">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-gray-600">
                {children}
              </blockquote>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;

              if (isInline) {
                return (
                  <code className="bg-gray-100 text-purple-600 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <code className={`${className} block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4`} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="bg-gray-900 rounded-lg overflow-hidden my-4">{children}</pre>,
            img: ({ src, alt }) => (
              <span className="block my-6">
                <Image
                  src={src || ''}
                  alt={alt || ''}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ objectFit: 'cover' }}
                  unoptimized={src?.startsWith('data:')}
                />
              </span>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-purple-600 hover:text-purple-700 underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => <hr className="my-8 border-gray-300" />,
            table: ({ children }) => (
              <table className="w-full my-4 border-collapse">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-2">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    );
  };

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
        const paragraphContent = typeof section.content === 'string' ? section.content : '';
        // Check if paragraph content is markdown
        if (paragraphContent && isMarkdown(paragraphContent)) {
          return renderMarkdownContent(paragraphContent, index);
        }
        return (
          <p key={index} className="text-base leading-relaxed text-gray-700 mb-4">
            {paragraphContent}
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

      case 'image':
        const alignmentClasses = {
          left: 'mr-auto',
          center: 'mx-auto',
          right: 'ml-auto',
          full: 'w-full'
        };

        const containerClasses = {
          left: 'float-left mr-6 mb-4 max-w-md',
          center: 'my-8',
          right: 'float-right ml-6 mb-4 max-w-md',
          full: 'my-8'
        };

        const imageWidth = section.alignment === 'full' ? 'w-full' :
                          section.alignment === 'center' ? 'max-w-3xl' : 'max-w-md';

        return (
          <div key={index} className={containerClasses[section.alignment || 'center']}>
            <motion.div
              className={`${alignmentClasses[section.alignment || 'center']} ${imageWidth}`}
              initial={{ opacity: 0, y: 20 }}
              animate={letterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {section.src && (
                <div className="relative">
                  <Image
                    src={section.src}
                    alt={section.alt || ''}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-lg"
                    style={{ objectFit: 'cover' }}
                    unoptimized={section.src.startsWith('data:')}
                  />
                  {section.caption && (
                    <p className="text-sm text-gray-600 italic text-center mt-3">
                      {section.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        );

      case 'gallery':
        return (
          <motion.div
            key={index}
            className="my-12"
            initial={{ opacity: 0 }}
            animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.images?.map((image, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={letterInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {image.src && (
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={image.src}
                        alt={image.alt || ''}
                        width={400}
                        height={300}
                        className="w-full h-auto"
                        style={{ objectFit: 'cover' }}
                        unoptimized={image.src.startsWith('data:')}
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-sm">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
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
        if ('id' in section && 'content' in section) {
          const sectionData = section as Section | SimplifiedSection;
          const contentArray = Array.isArray(sectionData.content) ? sectionData.content : [sectionData.content];

          return (
            <div key={sectionData.id || sectionIndex}>
              {/* Render divider if not the first section */}
              {sectionIndex > 0 && renderDivider(sectionData.dividerStyle)}

              {/* Section anchor - positioned after divider for proper scroll targeting */}
              <div id={sectionData.id ? `section-${sectionData.id}` : `section-${sectionIndex}`} className="scroll-mt-32">
                {/* Render section content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={letterInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.02 }}
                  className="mb-12"
                >
                  {contentArray.length > 0 ? (
                    contentArray.map((contentItem, contentIndex) => (
                      <div key={contentIndex}>
                        {typeof contentItem === 'string' ? (
                          // Check if the string content is markdown
                          isMarkdown(contentItem) ? (
                            renderMarkdownContent(contentItem, contentIndex)
                          ) : (
                            <p className="text-base leading-relaxed text-gray-700 mb-4">{contentItem}</p>
                          )
                        ) : (
                          renderContentSection(contentItem as ContentSection, contentIndex)
                        )}
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
          // Direct content item (not a section with id)
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