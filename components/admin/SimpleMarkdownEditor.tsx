'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number | string;
}

export default function SimpleMarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing in markdown...',
  height = 500,
}: SimpleMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('split');
  const [showImageHelper, setShowImageHelper] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Available images in public folder
  const availableImages = [
    { name: 'Inspirations 1', path: '/Inspirations1.png', type: 'content' },
    { name: 'Inspirations 2', path: '/inspirations2.png', type: 'content' },
    { name: 'CMS 1', path: '/CMS1.png', type: 'screenshot' },
    { name: 'CMS 2', path: '/CMS2.png', type: 'screenshot' },
    { name: 'Go Deeper', path: '/godeeper.png', type: 'content' },
    { name: 'Vibes', path: '/Vibes.png', type: 'content' },
  ];

  // Insert text at cursor position
  const insertAtCursor = (textBefore: string, textAfter: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) +
      textBefore +
      selectedText +
      textAfter +
      value.substring(end);

    onChange(newText);

    // Reset cursor position after React re-render
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textBefore.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert image with size and caption
  const insertImage = (imagePath: string, altText: string = 'Image', caption?: string) => {
    let markdown = `\n![${altText}](${imagePath})\n`;

    if (caption) {
      markdown += `*${caption}*\n`;
    }

    markdown += '\n';
    insertAtCursor(markdown);
    setShowImageHelper(false);
  };

  // Toolbar actions
  const toolbarActions = [
    { icon: 'B', label: 'Bold', action: () => insertAtCursor('**', '**') },
    { icon: 'I', label: 'Italic', action: () => insertAtCursor('*', '*') },
    { icon: 'H1', label: 'Heading 1', action: () => insertAtCursor('# ', '') },
    { icon: 'H2', label: 'Heading 2', action: () => insertAtCursor('## ', '') },
    { icon: 'H3', label: 'Heading 3', action: () => insertAtCursor('### ', '') },
    { icon: '"', label: 'Quote', action: () => insertAtCursor('> ', '') },
    { icon: '•', label: 'Bullet List', action: () => insertAtCursor('- ', '') },
    { icon: '1.', label: 'Numbered List', action: () => insertAtCursor('1. ', '') },
    { icon: '[]', label: 'Link', action: () => insertAtCursor('[', '](url)') },
    { icon: '< >', label: 'Code', action: () => insertAtCursor('`', '`') },
    { icon: '{ }', label: 'Code Block', action: () => insertAtCursor('```\n', '\n```') },
    { icon: '🖼', label: 'Image', action: () => setShowImageHelper(!showImageHelper), special: true },
  ];

  // Handle Tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('  ');
    }
  };

  const editorHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="markdown-editor-simple bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center justify-between">
        <div className="flex gap-1">
          {toolbarActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              title={action.label}
              className={`px-3 py-1.5 text-sm font-mono rounded transition-all duration-150 ${
                action.special && showImageHelper
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              {action.icon}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-150 ${
              activeTab === 'write'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-150 ${
              activeTab === 'preview'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-150 ${
              activeTab === 'split'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Image Helper Panel */}
      {showImageHelper && (
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Insert Image</h3>
              <button
                type="button"
                onClick={() => setShowImageHelper(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                id="image-url-input"
                placeholder="Image URL or path (e.g., /image.png or https://...)"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    if (input.value) {
                      const altText = prompt('Enter image description (for accessibility):', 'Image');
                      insertImage(input.value, altText || 'Image');
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('image-url-input') as HTMLInputElement;
                  if (input?.value) {
                    const altText = prompt('Enter image description (for accessibility):', 'Image');
                    insertImage(input.value, altText || 'Image');
                    input.value = '';
                  }
                }}
                className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
              >
                Insert
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Available Images:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableImages.map((img) => (
                <button
                  key={img.path}
                  type="button"
                  onClick={() => {
                    const altText = prompt('Enter image description (for accessibility):', img.name);
                    const caption = prompt('Enter caption (optional):');
                    insertImage(img.path, altText || img.name, caption || undefined);
                  }}
                  className="group relative aspect-square border border-gray-200 rounded overflow-hidden hover:border-purple-500 transition-colors"
                  title={img.name}
                >
                  <Image
                    src={img.path}
                    alt={img.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="absolute bottom-1 left-1 right-1 text-white text-xs truncate">
                      {img.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-3 space-y-1 border-t border-gray-100 pt-3">
              <p className="font-medium">Quick tips:</p>
              <ul className="ml-4 space-y-0.5">
                <li>• Insert at cursor: Click image or paste URL above</li>
                <li>• Manual insert: <code className="bg-gray-100 px-1 rounded">![description](url)</code></li>
                <li>• Add caption: Type <code className="bg-gray-100 px-1 rounded">*caption text*</code> on next line</li>
                <li>• Center image: Put image on its own line</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative" style={{ height: editorHeight }}>
        <div className={`flex h-full ${activeTab === 'split' ? 'divide-x divide-gray-200' : ''}`}>
          {/* Writing Area */}
          {(activeTab === 'write' || activeTab === 'split') && (
            <div className={activeTab === 'split' ? 'w-1/2' : 'w-full'}>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm text-gray-800 leading-relaxed"
                style={{
                  lineHeight: '1.7',
                  tabSize: 2,
                }}
              />
            </div>
          )}

          {/* Preview Area */}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div className={`${activeTab === 'split' ? 'w-1/2' : 'w-full'} overflow-auto bg-gray-50`}>
              <div className="p-4 prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-purple-500 prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-4">
                {value ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">Preview will appear here...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {value.split(/\s+/).filter(word => word.length > 0).length} words • {value.length} characters
        </div>
        <div className="text-xs text-gray-500">
          Markdown supported
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .markdown-editor-simple textarea {
          font-family: 'SF Mono', Monaco, 'Inconsolata', 'Fira Code', 'Courier New', monospace;
        }

        .markdown-editor-simple textarea::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        .markdown-editor-simple .prose h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .markdown-editor-simple .prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .markdown-editor-simple .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .markdown-editor-simple .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .markdown-editor-simple .prose ul,
        .markdown-editor-simple .prose ol {
          margin-bottom: 1rem;
        }

        .markdown-editor-simple .prose li {
          margin-bottom: 0.25rem;
        }

        .markdown-editor-simple .prose pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .markdown-editor-simple .prose code {
          font-size: 0.875rem;
        }

        .markdown-editor-simple .prose blockquote {
          border-left: 3px solid #8b5cf6;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }

        .markdown-editor-simple .prose img {
          border-radius: 0.5rem;
          margin: 1rem auto;
          max-width: 100%;
          height: auto;
        }

        /* Scrollbar styling */
        .markdown-editor-simple ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .markdown-editor-simple ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .markdown-editor-simple ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .markdown-editor-simple ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}