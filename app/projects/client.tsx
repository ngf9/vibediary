'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  color?: string;
  technologies?: string[];
  status: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      <div className="pt-32 pb-16 px-8 md:px-12 lg:px-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Projects</h1>
            <p className="text-xl text-gray-600">
              A collection of applications built with AI tools and vibe coding
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex gap-4">
              {['all', 'completed', 'in-progress'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    filter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Projects' :
                   status === 'in-progress' ? 'In Progress' :
                   'Completed'}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Project Thumbnail */}
                    <div
                      className="h-48 relative"
                      style={{
                        background: project.thumbnail
                          ? `url(${project.thumbnail}) center/cover`
                          : project.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                    </div>

                    {/* Project Info */}
                    <div className="p-6 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status === 'completed' ? 'Live' : 'WIP'}
                        </span>
                      </div>

                      {project.subtitle && (
                        <p className="text-sm text-gray-500 mb-3">{project.subtitle}</p>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}