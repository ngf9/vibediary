'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardCard from '@/components/admin/DashboardCard';
import { db } from '@/lib/instant';
import { format } from 'date-fns';

export default function AdminDashboard() {
  // Fetch essays data
  const { data: essaysData } = db.useQuery({
    essays: {
      $: {
        order: { createdAt: 'desc' }
      }
    }
  });

  const essays = essaysData?.essays || [];

  const totalEssays = essays.length;
  const publishedEssays = essays.filter(e => e.published).length;
  const draftEssays = essays.filter(e => !e.published).length;

  // Calculate essays trend (mock data for now)
  const essaysTrend = {
    value: 8,
    isUp: true
  };

  const publishedTrend = {
    value: 5,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Essays"
          value={totalEssays}
          subtitle="All time"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="bg-purple-600"
          trend={essaysTrend}
        />

        <DashboardCard
          title="Published Essays"
          value={publishedEssays}
          subtitle="Live content"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-green-600"
          trend={publishedTrend}
        />

        <DashboardCard
          title="Draft Essays"
          value={draftEssays}
          subtitle="In progress"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          color="bg-yellow-600"
          trend={{ value: 2, isUp: false }}
        />
      </div>

      {/* Main Content - Full Width Essays */}
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
  );
}