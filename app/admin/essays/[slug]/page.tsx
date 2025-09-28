'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { motion } from 'framer-motion';
import SectionEditor from '@/components/admin/SectionEditor';

export default function EditEssayPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const isNew = slug === 'new';

  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [essaySlug, setEssaySlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [readTime, setReadTime] = useState(5);
  const [newTag, setNewTag] = useState('');
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple');
  const [sections, setSections] = useState<any[]>([]);

  // Fetch existing essay if editing
  const { data: essayData } = db.useQuery(
    !isNew ? {
      essays: {
        $: {
          where: { slug: slug }
        }
      }
    } : {}
  );

  // Set initial values when data loads
  useEffect(() => {
    if (!isNew && essayData?.essays?.[0]) {
      const essay = essayData.essays[0];
      setTitle(essay.title || '');
      setSubtitle(essay.subtitle || '');
      setEssaySlug(essay.slug || '');
      setExcerpt(essay.excerpt || '');
      setContent(essay.content || '');
      setThumbnail(essay.thumbnail || '');
      setHeroImage(essay.heroImage || '');
      setCoverImage(essay.coverImage || '');
      setTags(essay.tags || []);
      setFeatured(essay.featured || false);
      setPublished(essay.published || false);
      setReadTime(essay.readTime || 5);
      setEditorMode(essay.editorMode || 'simple');
      if (essay.sections) {
        setSections(essay.sections);
      }
    }
  }, [isNew, essayData]);

  // Auto-calculate reading time based on content
  useEffect(() => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const estimatedTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setReadTime(estimatedTime);
  }, [content]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatus('Saving essay...');

    try {
      const now = Date.now();

      if (isNew) {
        // Create new essay
        await db.transact(
          db.tx.essays[id()].update({
            slug: essaySlug,
            title,
            subtitle: subtitle || null,
            excerpt,
            content,
            thumbnail: thumbnail || null,
            heroImage: heroImage || null,
            coverImage: coverImage || null,
            tags,
            featured,
            published,
            readTime,
            editorMode,
            sections: editorMode === 'advanced' ? sections : null,
            createdAt: now,
            publishedAt: published ? now : null,
            updatedAt: now
          })
        );
        setStatus('Essay created successfully!');
        setTimeout(() => router.push('/admin/essays'), 1500);
      } else {
        // Update existing essay
        const essay = essayData?.essays?.[0];
        if (essay) {
          const wasPublished = essay.published;
          await db.transact(
            db.tx.essays[essay.id].update({
              slug: essaySlug,
              title,
              subtitle: subtitle || null,
              excerpt,
              content,
              thumbnail: thumbnail || null,
              heroImage: heroImage || null,
              coverImage: coverImage || null,
              tags,
              featured,
              published,
              readTime,
              editorMode,
              sections: editorMode === 'advanced' ? sections : null,
              publishedAt: !wasPublished && published ? now : essay.publishedAt,
              updatedAt: now
            })
          );
          setStatus('Essay updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to save essay:', error);
      setStatus('Error saving essay. Please try again.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const generateSlug = () => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setEssaySlug(slug);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/essays">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {isNew ? 'New Essay' : 'Edit Essay'}
          </h1>
        </div>
        <p className="text-gray-600 font-light">
          {isNew ? 'Write a new essay or blog post' : `Editing: ${title}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Essay Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={essaySlug}
                      onChange={(e) => setEssaySlug(e.target.value)}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="essay-slug"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional essay subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Short description for cards and SEO..."
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Content</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('simple')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editorMode === 'simple'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Simple Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('advanced')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editorMode === 'advanced'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Advanced Editor
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {editorMode === 'simple' ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Essay Content <span className="text-red-500">*</span>
                      </label>
                      <span className="text-sm text-gray-500">
                        Estimated read time: {readTime} min
                      </span>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required={editorMode === 'simple'}
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      placeholder="Write your essay here... (Markdown supported)"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Supports Markdown formatting. Word count: {content.split(/\s+/).filter(word => word.length > 0).length}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Use the advanced editor to create structured content with multiple sections, images, and rich formatting.
                    </p>
                    <SectionEditor
                      sections={sections}
                      onSectionsChange={setSections}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image (Card Display)
                  </label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="/Inspirations1.png or https://example.com/thumbnail.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Image shown on homepage cards. Use relative path for public folder images.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image (Essay Page)
                  </label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="/inspirations2.png or https://example.com/hero.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Large image displayed on the essay page. Use relative path for public folder images.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Tag
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="vibe-coding, ai, tutorial..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Publishing</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Published</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    {published ? 'Essay is live and visible' : 'Essay is saved as draft'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Essay</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    Show prominently on homepage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={readTime}
                    onChange={(e) => setReadTime(parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Preview</h2>

              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-600">{title || 'Essay Title'}</p>
                <p className="text-xs text-green-700">
                  /essays/{essaySlug || 'essay-slug'}
                </p>
                <p className="text-sm text-gray-600">
                  {excerpt || 'Essay excerpt will appear here...'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]"
                >
                  {isUpdating ? 'Saving...' : isNew ? 'Create Essay' : 'Save Changes'}
                </button>

                <Link href="/admin/essays">
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </Link>
              </div>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {status}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}