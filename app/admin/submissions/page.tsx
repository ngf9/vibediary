'use client';

import React, { useState, useMemo } from 'react';
import { db } from '@/lib/instant';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const { isLoading, error, data } = db.useQuery({
    formSubmissions: {
      $: {
        order: { submittedAt: 'desc' }
      }
    }
  });

  const submissions = useMemo(() => data?.formSubmissions || [], [data?.formSubmissions]);

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roles = new Set(submissions.map(s => s.role));
    return Array.from(roles);
  }, [submissions]);

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Search filter - includes class interest
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.whatYouWantToBuild?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.classInterest?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(s => s.role === filterRole);
    }

    // Class filter - handle both old format and new display names
    if (filterClass !== 'all') {
      filtered = filtered.filter(s => {
        // Handle old format (ai-fundamentals, vibe-coding) and new display names
        if (filterClass === 'ai-fundamentals') {
          return s.classInterest === 'ai-fundamentals' ||
                 s.classInterest?.toLowerCase().includes('ai for builders') ||
                 s.classInterest?.toLowerCase().includes('ai fundamentals');
        } else if (filterClass === 'vibe-coding') {
          return s.classInterest === 'vibe-coding' ||
                 s.classInterest?.toLowerCase().includes('vibe coding');
        }
        return false;
      });
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
    } else {
      filtered.sort((a, b) => b.submittedAt - a.submittedAt);
    }

    return filtered;
  }, [submissions, searchTerm, filterRole, filterClass, sortBy]);

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Role', 'Timezone', 'Class Interest', 'What They Want to Build'];
    const csvData = filteredSubmissions.map(s => [
      format(new Date(s.submittedAt), 'yyyy-MM-dd HH:mm'),
      s.fullName,
      s.email,
      s.role,
      s.timezone,
      s.classInterest === 'ai-fundamentals' ? 'AI for Builders' : s.classInterest === 'vibe-coding' ? 'Vibe Coding' : s.classInterest || 'Not specified',
      s.whatYouWantToBuild?.replace(/,/g, ';') // Replace commas to avoid CSV issues
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">Error loading submissions</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Applications</h1>
            <p className="mt-2 text-gray-600 font-light">Review and manage course applications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export CSV
            </button>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg font-medium shadow-sm">
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'application' : 'applications'}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, class, or project..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-transparent transition-all duration-200"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Class
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              <option value="ai-fundamentals">AI for Builders</option>
              <option value="vibe-coding">Vibe Coding</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Date (Newest First)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No applications found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role & Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Class Interest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Project Idea
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{submission.fullName}</p>
                        <p className="text-sm text-gray-500">{submission.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{submission.role}</p>
                      <p className="text-sm text-gray-500">{submission.timezone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
                        submission.classInterest === 'ai-fundamentals'
                          ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                          : submission.classInterest === 'vibe-coding'
                          ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                      }`}>
                        {submission.classInterest === 'ai-fundamentals'
                          ? 'AI for Builders'
                          : submission.classInterest === 'vibe-coding'
                          ? 'Vibe Coding'
                          : submission.classInterest || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                        {submission.whatYouWantToBuild}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(submission.submittedAt), 'h:mm a')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          // Create a modal or expand row to show full details
                          alert(`Full details:\n\nName: ${submission.fullName}\nEmail: ${submission.email}\nRole: ${submission.role}\nTimezone: ${submission.timezone}\nClass Interest: ${submission.classInterest === 'ai-fundamentals' ? 'AI for Builders' : submission.classInterest === 'vibe-coding' ? 'Vibe Coding' : submission.classInterest || 'Not specified'}\n\nProject Idea:\n${submission.whatYouWantToBuild}`);
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 shadow-md p-4 hover:shadow-lg transition-all duration-200">
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{submissions.length}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 shadow-md p-4 hover:shadow-lg transition-all duration-200">
            <p className="text-sm font-medium text-gray-600">This Week</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {submissions.filter(s => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(s.submittedAt) > weekAgo;
              }).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 shadow-md p-4 hover:shadow-lg transition-all duration-200">
            <p className="text-sm font-medium text-gray-600">Most Common Role</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {uniqueRoles[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 shadow-md p-4 hover:shadow-lg transition-all duration-200">
            <p className="text-sm font-medium text-gray-600">Latest Application</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {submissions[0] ? format(new Date(submissions[0].submittedAt), 'MMM d') : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}