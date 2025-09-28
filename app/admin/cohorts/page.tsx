'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { motion } from 'framer-motion';

export default function AdminCohorts() {
  const [activeTab, setActiveTab] = useState<'ai' | 'vibe'>('ai');

  // AI Fundamentals fields
  const [aiFundamentalsTitle, setAiFundamentalsTitle] = useState('');
  const [aiFundamentalsSubtitle, setAiFundamentalsSubtitle] = useState('');
  const [aiFundamentalsDate, setAiFundamentalsDate] = useState('');
  const [aiFundamentalsDescription, setAiFundamentalsDescription] = useState('');

  // Vibe Coding fields
  const [vibeCodingTitle, setVibeCodingTitle] = useState('');
  const [vibeCodingSubtitle, setVibeCodingSubtitle] = useState('');
  const [vibeCodingDate, setVibeCodingDate] = useState('');
  const [vibeCodingDescription, setVibeCodingDescription] = useState('');

  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current cohort dates
  const { data: cohortData } = db.useQuery({
    cohortDates: {
      $: {
        where: { isActive: true }
      }
    }
  });

  // Set initial values when data loads
  useEffect(() => {
    if (cohortData?.cohortDates) {
      const aiDate = cohortData.cohortDates.find(d => d.courseId === 'ai-fundamentals');
      const vibeDate = cohortData.cohortDates.find(d => d.courseId === 'vibe-coding');

      if (aiDate) {
        setAiFundamentalsTitle(aiDate.title || '');
        setAiFundamentalsSubtitle(aiDate.subtitle || '');
        setAiFundamentalsDate(aiDate.startDate);
        setAiFundamentalsDescription(aiDate.description || '');
      }
      if (vibeDate) {
        setVibeCodingTitle(vibeDate.title || '');
        setVibeCodingSubtitle(vibeDate.subtitle || '');
        setVibeCodingDate(vibeDate.startDate);
        setVibeCodingDescription(vibeDate.description || '');
      }
    }
  }, [cohortData]);

  const updateDates = async () => {
    try {
      setIsUpdating(true);
      setStatus('Updating...');

      const now = Date.now();

      // Update AI Fundamentals
      const aiRecord = cohortData?.cohortDates?.find(d => d.courseId === 'ai-fundamentals');
      if (aiRecord) {
        await db.transact(
          db.tx.cohortDates[aiRecord.id].update({
            title: aiFundamentalsTitle || aiRecord.title,
            subtitle: aiFundamentalsSubtitle || aiRecord.subtitle,
            description: aiFundamentalsDescription || aiRecord.description,
            startDate: aiFundamentalsDate || aiRecord.startDate,
            updatedAt: now,
          })
        );
      }

      // Update Vibe Coding
      const vibeRecord = cohortData?.cohortDates?.find(d => d.courseId === 'vibe-coding');
      if (vibeRecord) {
        await db.transact(
          db.tx.cohortDates[vibeRecord.id].update({
            title: vibeCodingTitle || vibeRecord.title,
            subtitle: vibeCodingSubtitle || vibeRecord.subtitle,
            description: vibeCodingDescription || vibeRecord.description,
            startDate: vibeCodingDate || vibeRecord.startDate,
            updatedAt: now,
          })
        );
      }

      setStatus('Successfully updated cohort dates!');
      setTimeout(() => setStatus(''), 3000);

    } catch (error) {
      console.error('Error updating dates:', error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 'ai', label: 'AI for Builders', color: 'text-blue-600' },
    { id: 'vibe', label: 'Vibe Coding', color: 'text-orange-600' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Class Overview</h1>
        <p className="mt-2 text-gray-600 font-light">Update class details and start dates for the homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'ai' | 'vibe')}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? `${tab.color} border-current`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'ai' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={aiFundamentalsTitle}
                        onChange={(e) => setAiFundamentalsTitle(e.target.value)}
                        placeholder="e.g., AI For Builders"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Subtitle
                      </label>
                      <input
                        type="text"
                        value={aiFundamentalsSubtitle}
                        onChange={(e) => setAiFundamentalsSubtitle(e.target.value)}
                        placeholder="e.g., Class 1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cohort Start Date
                      </label>
                      <input
                        type="text"
                        value={aiFundamentalsDate}
                        onChange={(e) => setAiFundamentalsDate(e.target.value)}
                        placeholder="e.g., Next Cohort Starts March 15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Description
                      </label>
                      <textarea
                        value={aiFundamentalsDescription}
                        onChange={(e) => setAiFundamentalsDescription(e.target.value)}
                        placeholder="e.g., Master the fundamentals of LLMs and AI through hands-on building..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={vibeCodingTitle}
                        onChange={(e) => setVibeCodingTitle(e.target.value)}
                        placeholder="e.g., Vibe Coding 101"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Subtitle
                      </label>
                      <input
                        type="text"
                        value={vibeCodingSubtitle}
                        onChange={(e) => setVibeCodingSubtitle(e.target.value)}
                        placeholder="e.g., Class 2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cohort Start Date
                      </label>
                      <input
                        type="text"
                        value={vibeCodingDate}
                        onChange={(e) => setVibeCodingDate(e.target.value)}
                        placeholder="e.g., Next Cohort Starts March 15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Description
                      </label>
                      <textarea
                        value={vibeCodingDescription}
                        onChange={(e) => setVibeCodingDescription(e.target.value)}
                        placeholder="e.g., Learn to build and ship real products using AI tools..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={updateDates}
                  disabled={isUpdating}
                  className="w-full px-6 py-4 bg-purple-600 text-white text-base font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isUpdating ? 'Updating...' : 'Save All Changes'}
                </button>

                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-lg text-center ${
                      status.includes('Success') ? 'bg-green-50 text-green-800 border border-green-200' :
                      status.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {status}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Preview</h2>

            <div className="space-y-4">
              {/* AI for Builders Preview */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 ${
                  activeTab === 'ai' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {aiFundamentalsTitle || 'AI for Builders'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {aiFundamentalsSubtitle || 'Class 1'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {aiFundamentalsDescription || 'Master the fundamentals of LLMs and AI...'}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {aiFundamentalsDate || 'Next Cohort Starts Soon'}
                </p>
              </motion.div>

              {/* Vibe Coding Preview */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 ${
                  activeTab === 'vibe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {vibeCodingTitle || 'Vibe Coding 101'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vibeCodingSubtitle || 'Class 2'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {vibeCodingDescription || 'Learn to build and ship real products...'}
                </p>
                <p className="text-sm font-medium text-orange-600">
                  {vibeCodingDate || 'Next Cohort Starts Soon'}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Current Database Values */}
          {cohortData?.cohortDates && cohortData.cohortDates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Values</h3>
              <div className="space-y-3">
                {cohortData.cohortDates.map(date => (
                  <div key={date.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm text-gray-700">
                      {date.courseId === 'ai-fundamentals' ? 'AI for Builders' : 'Vibe Coding'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>Title: {date.title || '(not set)'}</div>
                      <div>Start: {date.startDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}