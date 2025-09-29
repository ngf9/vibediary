'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  preview?: 'live' | 'edit' | 'preview';
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing your essay in markdown...',
  height = 500,
  preview = 'live',
}: MarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="markdown-editor-wrapper">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview={preview}
        height={isFullscreen ? '100vh' : height}
        data-color-mode="light"
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder,
        }}
        previewOptions={{
          className: 'prose prose-lg max-w-none',
        }}
        commands={[
          // Add custom toolbar commands if needed
        ]}
      />

      {/* Custom styles for the editor */}
      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .markdown-editor-wrapper .w-md-editor-toolbar {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
        }

        .markdown-editor-wrapper .w-md-editor-content {
          background-color: white;
        }

        .markdown-editor-wrapper .w-md-editor-preview {
          padding: 20px;
          background-color: white;
        }

        .markdown-editor-wrapper .w-md-editor-text-pre,
        .markdown-editor-wrapper .w-md-editor-text-input,
        .markdown-editor-wrapper .w-md-editor-text {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          padding: 20px !important;
        }

        /* Prose styles for preview */
        .markdown-editor-wrapper .prose {
          color: #374151;
        }

        .markdown-editor-wrapper .prose h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .markdown-editor-wrapper .prose h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }

        .markdown-editor-wrapper .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .markdown-editor-wrapper .prose p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
        }

        .markdown-editor-wrapper .prose ul,
        .markdown-editor-wrapper .prose ol {
          margin-bottom: 1.25rem;
        }

        .markdown-editor-wrapper .prose li {
          margin-bottom: 0.5rem;
        }

        .markdown-editor-wrapper .prose img {
          border-radius: 0.5rem;
          margin: 1.5rem auto;
        }

        .markdown-editor-wrapper .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .markdown-editor-wrapper .prose pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }

        .markdown-editor-wrapper .prose blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}