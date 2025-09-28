'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardCard from '@/components/admin/DashboardCard';
import { db } from '@/lib/instant';
import { format } from 'date-fns';

export default function AdminDashboard() {
  // Fetch projects data
  const { data: projectsData } = db.useQuery({
    projects: {
      $: {
        order: { createdAt: 'desc' },
        limit: 5
      }
    }
  });

  // Fetch essays data
  const { data: essaysData } = db.useQuery({
    essays: {
      $: {
        order: { createdAt: 'desc' },
        limit: 5
      }
    }
  });

  const projects = projectsData?.projects || [];
  const essays = essaysData?.essays || [];

  const totalProjects = projects.length;
  const publishedEssays = essays.filter(e => e.published).length;

  // Calculate projects trend (mock data for now)
  const projectsTrend = {
    value: 12,
    isUp: true
  };

  const essaysTrend = {
    value: 8,
    isUp: true
  };


  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600 font-light">Monitor your portfolio and manage content</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <DashboardCard
          title="Total Projects"
          value={totalProjects}
          subtitle="All time"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          color="bg-blue-600"
          trend={projectsTrend}
        />

        <DashboardCard
          title="Published Essays"
          value={publishedEssays}
          subtitle="Live content"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="bg-green-600"
          trend={essaysTrend}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <Link href="/admin/projects" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all →
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects yet
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-gray-100 hover:to-gray-200/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === 'completed' ? 'bg-green-500' :
                        project.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-500">{project.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        {project.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        {project.createdAt && format(new Date(project.createdAt), 'MMM d')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Essays */}
        <div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Essays</h2>
              <Link href="/admin/essays" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all →
              </Link>
            </div>
            {essays.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No essays yet
              </div>
            ) : (
              <div className="space-y-3">
                {essays.slice(0, 5).map((essay) => (
                  <div key={essay.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{essay.title}</p>
                        <p className="text-sm text-gray-500">{essay.excerpt?.substring(0, 50)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {essay.published ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Published</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Draft</span>
                        )}
                        {essay.featured && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">Featured</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}