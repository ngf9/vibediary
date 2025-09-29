'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { db } from '@/lib/instant';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Essay {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  publishedAt?: number;
  createdAt?: number;
  updatedAt?: number;
}

export default function EssaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const { isLoading, error, data } = db.useQuery({
    essays: {
      $: {
        order: { createdAt: 'desc' }
      }
    }
  });

  const essays = useMemo(() => data?.essays || [], [data?.essays]);

  // Filter and sort essays
  const filteredEssays = useMemo(() => {
    let filtered = [...essays];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.tags?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'published') {
      filtered = filtered.filter(e => e.published === true);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(e => e.published === false);
    } else if (filterStatus === 'featured') {
      filtered = filtered.filter(e => e.featured === true);
    }

    // Sort
    if (sortBy === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      filtered.sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
          return b.publishedAt - a.publishedAt;
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    }

    return filtered;
  }, [essays, searchTerm, filterStatus, sortBy]);

  const handleToggleFeatured = async (essay: Essay) => {
    try {
      await db.transact(
        db.tx.essays[essay.id].update({
          featured: !essay.featured,
          updatedAt: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const handleTogglePublished = async (essay: Essay) => {
    try {
      await db.transact(
        db.tx.essays[essay.id].update({
          published: !essay.published,
          publishedAt: !essay.published ? Date.now() : essay.publishedAt,
          updatedAt: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to toggle published:', error);
    }
  };

  const handleDeleteEssay = async (essayId: string) => {
    if (confirm('Are you sure you want to delete this essay?')) {
      try {
        await db.transact(
          db.tx.essays[essayId].delete()
        );
      } catch (error) {
        console.error('Failed to delete essay:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500">Loading essays...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500">Error loading essays</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Essays</h1>
            <p className="mt-2 text-gray-600 font-light">Manage your blog posts and essays</p>
          </div>
          <Link href="/admin/essays/new">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Essay
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search essays..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Essays</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSortBy('date');
              }}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Essays List */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'}
          </p>
        </div>

        {filteredEssays.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500">No essays found</p>
            <Link href="/admin/essays/new">
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Write your first essay
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEssays.map((essay) => (
              <motion.div
                key={essay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{essay.title}</h3>
                      {essay.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                      {essay.published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>

                    {essay.subtitle && (
                      <p className="text-gray-600 mb-2">{essay.subtitle}</p>
                    )}

                    <p className="text-gray-500 mb-3">{essay.excerpt}</p>

                    {essay.tags && essay.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(essay.tags as string[]).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>Slug: {essay.slug}</span>
                      {essay.readTime && <span>{essay.readTime} min read</span>}
                      {essay.publishedAt ? (
                        <span>Published: {format(new Date(essay.publishedAt), 'MMM d, yyyy')}</span>
                      ) : (
                        <span>Created: {format(new Date(essay.createdAt || Date.now()), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleFeatured(essay)}
                      className={`p-2 rounded-lg transition-colors ${
                        essay.featured ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      } hover:bg-purple-200`}
                      title="Toggle Featured"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleTogglePublished(essay)}
                      className={`p-2 rounded-lg transition-colors ${
                        essay.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      } hover:bg-green-200`}
                      title={essay.published ? 'Unpublish' : 'Publish'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {essay.published ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        )}
                      </svg>
                    </button>

                    <Link href={`/admin/essays/${essay.slug}`}>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteEssay(essay.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}