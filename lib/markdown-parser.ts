import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

export interface ContentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'code' | 'blockquote' | 'separator';
  content?: string;
  level?: number; // for headings
  src?: string; // for images
  alt?: string; // for images
  caption?: string; // for images
  items?: string[]; // for lists
  ordered?: boolean; // for lists
  language?: string; // for code blocks
}

export interface ParsedContent {
  sections: ContentSection[];
  metadata?: {
    wordCount: number;
    hasImages: boolean;
    headings: string[];
  };
}

/**
 * Parses markdown content into a structured JSON format
 * This gives us full control over spacing and rendering
 */
export async function parseMarkdownToJson(markdown: string): Promise<ParsedContent> {
  const sections: ContentSection[] = [];
  let sectionId = 0;

  // Split content by lines for easier parsing
  const lines = markdown.split('\n');
  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = '';
  let wordCount = 0;
  const headings: string[] = [];

  const createId = () => `section-${++sectionId}`;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join('\n').trim();
      if (content) {
        sections.push({
          id: createId(),
          type: 'paragraph',
          content
        });
        wordCount += content.split(/\s+/).length;
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeBlockLanguage = trimmedLine.slice(3).trim();
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        sections.push({
          id: createId(),
          type: 'code',
          content: codeBlockContent.join('\n'),
          language: codeBlockLanguage || 'plaintext'
        });
        codeBlockContent = [];
        codeBlockLanguage = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle horizontal rules
    if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
      flushParagraph();
      sections.push({
        id: createId(),
        type: 'separator'
      });
      continue;
    }

    // Handle headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      headings.push(text);
      sections.push({
        id: createId(),
        type: 'heading',
        level,
        content: text
      });
      continue;
    }

    // Handle images
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      const alt = imageMatch[1] || 'Image';
      const src = imageMatch[2];

      // Check if next line is a caption (italic text)
      let caption: string | undefined;
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const captionMatch = nextLine.match(/^\*([^*]+)\*$/);
        if (captionMatch) {
          caption = captionMatch[1];
          i++; // Skip the caption line
        }
      }

      sections.push({
        id: createId(),
        type: 'image',
        src,
        alt,
        caption
      });
      continue;
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('>')) {
      flushParagraph();
      const quoteLines: string[] = [trimmedLine.slice(1).trim()];

      // Collect all consecutive quote lines
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        quoteLines.push(lines[i].trim().slice(1).trim());
      }

      sections.push({
        id: createId(),
        type: 'blockquote',
        content: quoteLines.join('\n').trim()
      });
      continue;
    }

    // Handle unordered lists
    if (trimmedLine.match(/^[-*+]\s+/)) {
      flushParagraph();
      const items: string[] = [trimmedLine.replace(/^[-*+]\s+/, '')];

      // Collect all consecutive list items
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^[-*+]\s+/)) {
        i++;
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
      }

      sections.push({
        id: createId(),
        type: 'list',
        ordered: false,
        items
      });
      continue;
    }

    // Handle ordered lists
    if (trimmedLine.match(/^\d+\.\s+/)) {
      flushParagraph();
      const items: string[] = [trimmedLine.replace(/^\d+\.\s+/, '')];

      // Collect all consecutive list items
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^\d+\.\s+/)) {
        i++;
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
      }

      sections.push({
        id: createId(),
        type: 'list',
        ordered: true,
        items
      });
      continue;
    }

    // Handle empty lines
    if (!trimmedLine) {
      flushParagraph();
      continue;
    }

    // Everything else is part of a paragraph
    currentParagraph.push(line);
  }

  // Flush any remaining paragraph
  flushParagraph();

  return {
    sections,
    metadata: {
      wordCount,
      hasImages: sections.some(s => s.type === 'image'),
      headings
    }
  };
}

/**
 * Helper to find sections by type
 */
export function findSectionsByType(
  parsedContent: ParsedContent,
  type: ContentSection['type']
): ContentSection[] {
  return parsedContent.sections.filter(s => s.type === type);
}

/**
 * Helper to extract navigation items from headings
 */
export function extractNavigation(parsedContent: ParsedContent): Array<{
  id: string;
  label: string;
  level: number;
}> {
  return parsedContent.sections
    .filter(s => s.type === 'heading' && s.level === 2)
    .map(s => ({
      id: s.id,
      label: s.content || 'Section',
      level: s.level || 2
    }));
}