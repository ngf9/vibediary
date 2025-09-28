'use client';

import React from 'react';
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
  coverImage?: string;
  color?: string;
  technologies?: string[];
  status: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: number;
}

interface ProjectContent {
  overview: string;
  challenges?: string[];
  solutions?: string[];
  learnings?: string[];
  techDetails?: {
    architecture?: string;
    stack?: string;
    deployment?: string;
    performance?: string;
  };
  gallery?: string[];
}

interface ProjectDetailClientProps {
  project: Project;
  content: ProjectContent | null;
}

export default function ProjectDetailClient({ project, content }: ProjectDetailClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <div
        className="relative h-[60vh] min-h-[400px] pt-20"
        style={{
          background: project.coverImage
            ? `url(${project.coverImage}) center/cover`
            : project.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative h-full flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{project.title}</h1>
            {project.subtitle && (
              <p className="text-xl md:text-2xl mb-6 opacity-90">{project.subtitle}</p>
            )}
            <div className="flex items-center justify-center gap-6">
              {project.status === 'completed' && (
                <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Live Project
                </span>
              )}
              {project.status === 'in-progress' && (
                <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                  Work in Progress
                </span>
              )}
              {project.featured && (
                <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Links */}
      {(project.githubUrl || project.liveUrl) && (
        <div className="bg-white border-b">
          <div className="max-w-screen-xl mx-auto px-8 py-6">
            <div className="flex justify-center gap-6">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content?.overview || project.description}
              </p>
            </motion.section>

            {/* Challenges */}
            {content?.challenges && content.challenges.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Challenges</h2>
                <ul className="space-y-4">
                  {content.challenges.map((challenge, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="text-purple-600 mt-1">▸</span>
                      <span className="text-gray-600">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Solutions */}
            {content?.solutions && content.solutions.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Solutions</h2>
                <ul className="space-y-4">
                  {content.solutions.map((solution, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-600">{solution}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Key Learnings */}
            {content?.learnings && content.learnings.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Learnings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.learnings.map((learning, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{learning}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Gallery */}
            {content?.gallery && content.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="rounded-lg shadow-lg w-full"
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Technical Details */}
            {content?.techDetails && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Details</h3>
                <dl className="space-y-4">
                  {content.techDetails.architecture && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Architecture</dt>
                      <dd className="mt-1 text-gray-700">{content.techDetails.architecture}</dd>
                    </div>
                  )}
                  {content.techDetails.stack && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Stack</dt>
                      <dd className="mt-1 text-gray-700">{content.techDetails.stack}</dd>
                    </div>
                  )}
                  {content.techDetails.deployment && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Deployment</dt>
                      <dd className="mt-1 text-gray-700">{content.techDetails.deployment}</dd>
                    </div>
                  )}
                  {content.techDetails.performance && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Performance</dt>
                      <dd className="mt-1 text-gray-700">{content.techDetails.performance}</dd>
                    </div>
                  )}
                </dl>
              </motion.div>
            )}

            {/* Back to Projects */}
            <Link href="/projects">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
              >
                ← Back to Projects
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}