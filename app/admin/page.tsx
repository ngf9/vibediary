'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardCard from '@/components/admin/DashboardCard';
import { db } from '@/lib/instant';
import { format } from 'date-fns';

export default function AdminDashboard() {
  // Fetch submissions data
  const { data: submissionsData } = db.useQuery({
    formSubmissions: {
      $: {
        order: { submittedAt: 'desc' },
        limit: 5
      }
    }
  });

  // Fetch cohort data
  const { data: cohortData } = db.useQuery({
    cohortDates: {
      $: {
        where: { isActive: true }
      }
    }
  });

  const submissions = submissionsData?.formSubmissions || [];
  const totalSubmissions = submissions.length;

  // Calculate submissions trend (mock data for now)
  const submissionsTrend = {
    value: 12,
    isUp: true
  };


  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600 font-light">Monitor your course performance and manage content</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <DashboardCard
          title="Total Applications"
          value={totalSubmissions}
          subtitle="All time"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="bg-blue-600"
          trend={submissionsTrend}
        />

        <DashboardCard
          title="Active Classes"
          value={cohortData?.cohortDates?.length || 0}
          subtitle="Currently running"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="bg-green-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Link href="/admin/submissions" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all →
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No applications yet
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-gray-100 hover:to-gray-200/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{submission.fullName}</p>
                        <p className="text-sm text-gray-500">{submission.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">{submission.role}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(submission.submittedAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Classes */}
        <div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Classes</h2>
            {cohortData?.cohortDates && cohortData.cohortDates.length > 0 ? (
              <div className="space-y-3">
                {cohortData.cohortDates.map((cohort) => (
                  <div key={cohort.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {cohort.courseId === 'ai-fundamentals' ? 'AI Fundamentals' : 'Vibe Coding'}
                        </p>
                        <p className="text-sm text-gray-500">{cohort.startDate}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No active classes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}