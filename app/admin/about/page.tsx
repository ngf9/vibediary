'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { parseMarkdownToJson } from '@/lib/markdown-parser';

// Dynamically import SimpleMarkdownEditor to avoid SSR issues
const SimpleMarkdownEditor = dynamic(
  () => import('@/components/admin/SimpleMarkdownEditor'),
  { ssr: false, loading: () => <div className="h-64 bg-gray-50 rounded-lg animate-pulse" /> }
);

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<'bio' | 'journey' | 'skills' | 'contact'>('bio');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Bio fields
  const [bio, setBio] = useState('');
  const [currentFocus, setCurrentFocus] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [timelineImage, setTimelineImage] = useState('');

  // Journey fields (milestones)
  const [journey, setJourney] = useState<Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>>([]);

  // Skills fields
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Contact fields
  const [contact, setContact] = useState({
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  });

  // Fetch current about content
  const { data: aboutData } = db.useQuery({
    aboutContent: {
      $: {
        where: { pageId: 'about' }
      }
    }
  });

  // Set initial values when data loads
  useEffect(() => {
    if (aboutData?.aboutContent?.[0]) {
      const content = aboutData.aboutContent[0];
      setBio(content.bio || '');
      setCurrentFocus(content.currentFocus || '');
      setProfileImage(content.profileImage || '');
      setTimelineImage(content.timelineImage || '');

      // Ensure journey items have IDs
      const journeyWithIds = (content.journey || []).map((item: any, index: number) => ({
        ...item,
        id: item.id || `journey-${Date.now()}-${index}`
      }));
      setJourney(journeyWithIds);

      setSkills(content.skills || []);
      setContact(content.contact || {
        email: '',
        github: '',
        linkedin: '',
        twitter: '',
        website: ''
      });
    }
  }, [aboutData]);

  // Journey management
  const addJourneyItem = () => {
    const newItem = {
      id: `journey-${Date.now()}`,
      title: '',
      date: '',
      description: ''
    };
    setJourney([...journey, newItem]);
  };

  const removeJourneyItem = (id: string) => {
    setJourney(journey.filter(item => item.id !== id));
  };

  const updateJourneyItem = (id: string, field: string, value: string) => {
    setJourney(journey.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Skills management
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setIsUpdating(true);
      setStatus('Updating about page...');

      // Parse markdown to JSON
      const bioJson = await parseMarkdownToJson(bio);
      const focusJson = currentFocus ? await parseMarkdownToJson(currentFocus) : null;

      const aboutRecord = aboutData?.aboutContent?.[0];
      if (aboutRecord) {
        await db.transact(
          db.tx.aboutContent[aboutRecord.id].update({
            bio,
            bioJson,
            currentFocus: currentFocus || null,
            currentFocusJson: focusJson,
            profileImage: profileImage || null,
            timelineImage: timelineImage || null,
            journey: journey.filter(item => item.title && item.date),
            skills,
            contact,
            updatedAt: Date.now()
          })
        );
      } else {
        // Create new record if none exists
        await db.transact(
          db.tx.aboutContent[id()].update({
            pageId: 'about',
            bio,
            bioJson,
            currentFocus: currentFocus || null,
            currentFocusJson: focusJson,
            profileImage: profileImage || null,
            timelineImage: timelineImage || null,
            journey: journey.filter(item => item.title && item.date),
            skills,
            contact,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
      }

      setStatus('About page updated successfully!');
    } catch (error) {
      console.error('Failed to update about page:', error);
      setStatus('Error updating. Please try again.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">About Page</h1>
        <p className="mt-2 text-gray-600 font-light">Manage your portfolio about section</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { key: 'bio', label: 'Bio & Focus', icon: '👤' },
              { key: 'journey', label: 'Journey', icon: '🚀' },
              { key: 'skills', label: 'Skills', icon: '🛠️' },
              { key: 'contact', label: 'Contact', icon: '📬' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200
                  ${activeTab === tab.key
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Bio Tab */}
            {activeTab === 'bio' && (
              <div className="space-y-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Image URL (e.g., /profile.jpg or https://...)"
                    />
                    {profileImage && (
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32">
                          <Image
                            src={profileImage}
                            alt="Profile preview"
                            fill
                            className="rounded-lg object-cover border border-gray-200"
                            unoptimized={profileImage.startsWith('data:')}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Preview of your profile image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Write your bio using Markdown for rich formatting
                  </p>
                  <SimpleMarkdownEditor
                    value={bio}
                    onChange={setBio}
                    placeholder="Tell your story... Who are you? What drives you?

You can use **bold**, *italic*, lists, and more!"
                    height={300}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This is the main bio text that appears on your about page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Focus
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    What are you currently working on or excited about?
                  </p>
                  <SimpleMarkdownEditor
                    value={currentFocus}
                    onChange={setCurrentFocus}
                    placeholder="Share what you're currently working on...

- Building something cool?
- Learning new skills?
- Exploring new technologies?"
                    height={200}
                  />
                </div>
              </div>
            )}

            {/* Journey Tab */}
            {activeTab === 'journey' && (
              <div className="space-y-6">
                {/* Timeline Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Section Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={timelineImage}
                      onChange={(e) => setTimelineImage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Image URL (e.g., /artofconversation.png or https://...)"
                    />
                    {timelineImage && (
                      <div className="flex items-center gap-4">
                        <div className="relative w-48 h-32">
                          <Image
                            src={timelineImage}
                            alt="Timeline preview"
                            fill
                            className="rounded-lg object-cover border border-gray-200"
                            unoptimized={timelineImage.startsWith('data:')}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Preview of your timeline image
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This image appears next to your journey timeline on the about page
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Journey Milestones</h3>
                  <button
                    onClick={addJourneyItem}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Milestone
                  </button>
                </div>

                {journey.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No milestones yet. Add your first journey milestone!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {journey.map((item, index) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-6 relative">
                        <button
                          onClick={() => removeJourneyItem(item.id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateJourneyItem(item.id, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Milestone title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              value={item.date}
                              onChange={(e) => updateJourneyItem(item.id, 'date', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., 2024"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateJourneyItem(item.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="What happened? Why was it important?"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Skill or Tool
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., React, TypeScript, Claude Code..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {skills.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No skills added yet. Add your technical skills and tools!
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={contact.github}
                    onChange={(e) => setContact({ ...contact, github: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={contact.linkedin}
                    onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={contact.twitter}
                    onChange={(e) => setContact({ ...contact, twitter: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Website
                  </label>
                  <input
                    type="url"
                    value={contact.website}
                    onChange={(e) => setContact({ ...contact, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        {status && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center px-4 py-2 rounded-lg text-sm ${
              status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {status}
          </motion.div>
        )}

        <button
          onClick={saveChanges}
          disabled={isUpdating}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}