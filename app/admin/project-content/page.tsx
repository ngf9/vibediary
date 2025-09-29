'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { motion } from 'framer-motion';

export default function ProjectContentPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Content fields
  const [overview, setOverview] = useState('');
  const [challenges, setChallenges] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [learnings, setLearnings] = useState<string[]>([]);
  const [techDetails, setTechDetails] = useState({
    architecture: '',
    stack: '',
    deployment: '',
    performance: ''
  });
  const [gallery, setGallery] = useState<string[]>([]);

  // New item inputs
  const [newChallenge, setNewChallenge] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newLearning, setNewLearning] = useState('');
  const [newImage, setNewImage] = useState('');

  // Fetch projects for dropdown
  const { data: projectsData } = db.useQuery({
    projects: {
      $: {
        order: { sortOrder: 'asc' }
      }
    }
  });

  const projects = projectsData?.projects || [];

  // Fetch project content for selected project
  const { data: contentData } = db.useQuery(
    selectedProjectId ? {
      projectContent: {}
    } : {}
  );

  // Set initial values when content loads
  useEffect(() => {
    if (contentData?.projectContent && selectedProjectId) {
      // Find content for the selected project
      const content = contentData.projectContent.find((c: any) => c.projectId === selectedProjectId);
      if (content) {
        setOverview(content.overview || '');
        setChallenges(content.challenges || []);
        setSolutions(content.solutions || []);
        setLearnings(content.learnings || []);
        setTechDetails(content.techDetails || {
          architecture: '',
          stack: '',
          deployment: '',
          performance: ''
        });
        setGallery(content.gallery || []);
      } else {
        // Reset fields when switching to a project without content
        setOverview('');
        setChallenges([]);
        setSolutions([]);
        setLearnings([]);
        setTechDetails({
          architecture: '',
          stack: '',
          deployment: '',
          performance: ''
        });
        setGallery([]);
      }
    } else if (selectedProjectId) {
      // Reset fields when switching to a project without content
      setOverview('');
      setChallenges([]);
      setSolutions([]);
      setLearnings([]);
      setTechDetails({
        architecture: '',
        stack: '',
        deployment: '',
        performance: ''
      });
      setGallery([]);
    }
  }, [contentData, selectedProjectId]);

  // List management functions
  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, newChallenge.trim()]);
      setNewChallenge('');
    }
  };

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const addSolution = () => {
    if (newSolution.trim()) {
      setSolutions([...solutions, newSolution.trim()]);
      setNewSolution('');
    }
  };

  const removeSolution = (index: number) => {
    setSolutions(solutions.filter((_, i) => i !== index));
  };

  const addLearning = () => {
    if (newLearning.trim()) {
      setLearnings([...learnings, newLearning.trim()]);
      setNewLearning('');
    }
  };

  const removeLearning = (index: number) => {
    setLearnings(learnings.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setGallery([...gallery, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  // Save content
  const saveContent = async () => {
    if (!selectedProjectId) {
      setStatus('Please select a project first');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    try {
      setIsUpdating(true);
      setStatus('Saving project content...');

      const existingContent = contentData?.projectContent?.[0];

      if (existingContent) {
        // Update existing content
        await db.transact(
          db.tx.projectContent[existingContent.id].update({
            overview,
            challenges,
            solutions,
            learnings,
            techDetails,
            gallery,
            updatedAt: Date.now()
          })
        );
      } else {
        // Create new content
        await db.transact(
          db.tx.projectContent[id()].update({
            projectId: selectedProjectId,
            overview,
            challenges,
            solutions,
            learnings,
            techDetails,
            gallery,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
      }

      setStatus('Project content saved successfully!');
    } catch (error) {
      console.error('Failed to save project content:', error);
      setStatus('Error saving content. Please try again.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Project Content</h1>
        <p className="mt-2 text-gray-600 font-light">Manage detailed content for your projects</p>
      </div>

      {/* Project Selector */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-8">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.slug}>
                {project.title} ({project.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProjectId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Overview */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Overview</h2>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Provide a detailed overview of the project..."
            />
          </div>

          {/* Challenges */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Challenges Faced</h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChallenge())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe a challenge you faced..."
                />
                <button
                  onClick={addChallenge}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {challenges.length > 0 ? (
              <div className="space-y-2">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1">{challenge}</span>
                    <button
                      onClick={() => removeChallenge(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No challenges added yet</p>
            )}
          </div>

          {/* Solutions */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Solutions Implemented</h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSolution())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe a solution you implemented..."
                />
                <button
                  onClick={addSolution}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {solutions.length > 0 ? (
              <div className="space-y-2">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1">{solution}</span>
                    <button
                      onClick={() => removeSolution(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No solutions added yet</p>
            )}
          </div>

          {/* Key Learnings */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Learnings</h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearning())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What did you learn from this project?"
                />
                <button
                  onClick={addLearning}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {learnings.length > 0 ? (
              <div className="space-y-2">
                {learnings.map((learning, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1">{learning}</span>
                    <button
                      onClick={() => removeLearning(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No learnings added yet</p>
            )}
          </div>

          {/* Technical Details */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Architecture
                </label>
                <textarea
                  value={techDetails.architecture}
                  onChange={(e) => setTechDetails({ ...techDetails, architecture: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the architecture..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack
                </label>
                <textarea
                  value={techDetails.stack}
                  onChange={(e) => setTechDetails({ ...techDetails, stack: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="List the technologies used..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment
                </label>
                <textarea
                  value={techDetails.deployment}
                  onChange={(e) => setTechDetails({ ...techDetails, deployment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="How is it deployed?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance
                </label>
                <textarea
                  value={techDetails.performance}
                  onChange={(e) => setTechDetails({ ...techDetails, performance: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Performance considerations..."
                />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Image Gallery</h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  onClick={addImage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Image
                </button>
              </div>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtc2l6ZToxNHB4O2ZvbnQtZmFtaWx5OkFyaWFsIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No images added yet</p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            {status && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                  status.includes('Error') || status.includes('Please')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {status}
              </motion.div>
            )}

            <button
              onClick={saveContent}
              disabled={isUpdating || !selectedProjectId}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]"
            >
              {isUpdating ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}