'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { db } from '@/lib/instant';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { id } from '@instantdb/react';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'order'>('order');

  const { isLoading, error, data } = db.useQuery({
    projects: {
      $: {
        order: { sortOrder: 'asc' }
      }
    }
  });

  const projects = useMemo(() => data?.projects || [], [data?.projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.technologies?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Sort
    if (sortBy === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else {
      filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return filtered;
  }, [projects, searchTerm, filterStatus, sortBy]);

  const handleToggleFeatured = async (project: any) => {
    try {
      await db.transact(
        db.tx.projects[project.id].update({
          featured: !project.featured,
          updatedAt: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    try {
      await db.transact(
        db.tx.projects[projectId].update({
          status: newStatus,
          updatedAt: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await db.transact(
          db.tx.projects[projectId].delete()
        );
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500">Error loading projects</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600 font-light">Manage your portfolio projects</p>
          </div>
          <Link href="/admin/projects/new">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
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
              placeholder="Search projects..."
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
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'order')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="order">Sort Order</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500">No projects found</p>
            <Link href="/admin/projects/new">
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create your first project
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      {project.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>

                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(project.technologies as string[]).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>Slug: {project.slug}</span>
                      <span>Sort Order: {project.sortOrder}</span>
                      {project.createdAt && (
                        <span>Created: {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.featured ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      } hover:bg-purple-200`}
                      title="Toggle Featured"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>

                    <Link href={`/admin/projects/${project.slug}`}>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteProject(project.id)}
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