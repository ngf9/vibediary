'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { motion } from 'framer-motion';

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'milestones' | 'team'>('philosophy');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Philosophy fields
  const [philosophyItems, setPhilosophyItems] = useState<string[]>([]);
  const [newPhilosophyItem, setNewPhilosophyItem] = useState('');

  // Milestone fields
  const [milestones, setMilestones] = useState<Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>>([]);

  // Team fields
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    image?: string;
  }>>([]);

  // Fetch current about page content
  const { data: aboutData } = db.useQuery({
    aboutPageContent: {
      $: {
        where: { isActive: true }
      }
    }
  });

  // Set initial values when data loads
  useEffect(() => {
    if (aboutData?.aboutPageContent?.[0]) {
      const content = aboutData.aboutPageContent[0];
      setPhilosophyItems(content.philosophyContent || []);

      // Ensure milestones have IDs
      const milestonesWithIds = (content.milestones || []).map((m: {
        id?: string;
        title: string;
        date: string;
        description: string;
      }, index: number) => ({
        ...m,
        id: m.id || `milestone-${Date.now()}-${index}`
      }));
      setMilestones(milestonesWithIds);

      // Ensure team members have IDs
      const membersWithIds = (content.teamMembers || []).map((member: {
        id?: string;
        name: string;
        role: string;
        bio: string;
        image?: string;
      }, index: number) => ({
        ...member,
        id: member.id || `member-${Date.now()}-${index}`
      }));
      setTeamMembers(membersWithIds);
    }
  }, [aboutData]);

  const addPhilosophyItem = () => {
    if (newPhilosophyItem.trim()) {
      setPhilosophyItems([...philosophyItems, newPhilosophyItem.trim()]);
      setNewPhilosophyItem('');
    }
  };

  const removePhilosophyItem = (index: number) => {
    setPhilosophyItems(philosophyItems.filter((_, i) => i !== index));
  };

  const updatePhilosophyItem = (index: number, value: string) => {
    const updated = [...philosophyItems];
    updated[index] = value;
    setPhilosophyItems(updated);
  };

  const addMilestone = () => {
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      date: '',
      description: ''
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setMilestones(milestones.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const addTeamMember = () => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      bio: '',
      image: ''
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const updateTeamMember = (id: string, field: string, value: string) => {
    setTeamMembers(teamMembers.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const saveChanges = async () => {
    try {
      setIsUpdating(true);
      setStatus('Updating...');

      const aboutRecord = aboutData?.aboutPageContent?.[0];
      if (aboutRecord) {
        await db.transact(
          db.tx.aboutPageContent[aboutRecord.id].update({
            philosophyContent: philosophyItems,
            milestones: milestones,
            teamMembers: teamMembers,
            updatedAt: Date.now()
          })
        );
      } else {
        // Create new record if none exists
        const { id } = await import('@instantdb/react');
        const newId = id();
        await db.transact(
          db.tx.aboutPageContent[newId].update({
            philosophyContent: philosophyItems,
            milestones: milestones,
            teamMembers: teamMembers,
            isActive: true,
            updatedAt: Date.now()
          })
        );
      }

      setStatus('Successfully updated About page content!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error updating content:', error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 'philosophy', label: 'Philosophy', color: 'text-purple-600' },
    { id: 'milestones', label: 'Milestones', color: 'text-blue-600' },
    { id: 'team', label: 'Team', color: 'text-green-600' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
        <p className="mt-2 text-gray-600">Update the content displayed on the About page</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'philosophy' | 'milestones' | 'team')}
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

        {/* Tab Content */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Philosophy Tab */}
            {activeTab === 'philosophy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Philosophy Content</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Add key philosophy points that describe your company&apos;s values and approach.
                  </p>

                  {philosophyItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">No philosophy items yet. Add your first point below.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {philosophyItems.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <textarea
                              value={item}
                              onChange={(e) => updatePhilosophyItem(index, e.target.value)}
                              placeholder="Enter philosophy point..."
                              rows={2}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => removePhilosophyItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newPhilosophyItem}
                        onChange={(e) => setNewPhilosophyItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPhilosophyItem()}
                        placeholder="Type a new philosophy point..."
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={addPhilosophyItem}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Milestones</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Add important milestones in your company&apos;s journey.
                  </p>

                  <div className="space-y-6">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="p-6 bg-gray-50 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                              placeholder="e.g., Company Founded"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(milestone.id, 'date', e.target.value)}
                              placeholder="e.g., January 2024"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                            placeholder="Describe this milestone..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Milestone
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addMilestone}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Milestone
                  </button>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Add and manage team member profiles.
                  </p>

                  <div className="space-y-6">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-6 bg-gray-50 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                              placeholder="e.g., CEO, CTO, etc."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={member.bio}
                            onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                            placeholder="Brief bio or description..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={member.image}
                            onChange={(e) => updateTeamMember(member.id, 'image', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Team Member
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addTeamMember}
                    className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Add Team Member
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Save Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={saveChanges}
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
  );
}