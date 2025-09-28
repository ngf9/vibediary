'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { motion, AnimatePresence } from 'framer-motion';

interface SyllabusWeek {
  id: string;
  courseId: string;
  weekNumber: number;
  weekName: string;
  title: string;
  description: string;
  learningOutcome: string;
  tools: string[];
  color: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: number;
  createdAt: number;
}

export default function AdminSyllabus() {
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<Record<string, SyllabusWeek>>({});
  const [newTool, setNewTool] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedWeek, setDraggedWeek] = useState<string | null>(null);

  // Fetch syllabus data
  const { data: syllabusData, isLoading } = db.useQuery({
    syllabus: {
      $: {
        where: {
          courseId: 'vibe-coding',
          isActive: true
        },
        order: {
          weekNumber: 'asc'
        }
      }
    }
  });

  // Initialize local state when data loads
  useEffect(() => {
    if (syllabusData?.syllabus) {
      const weekMap: Record<string, SyllabusWeek> = {};
      syllabusData.syllabus.forEach(week => {
        weekMap[week.id] = {
          ...week,
          tools: Array.isArray(week.tools) ? week.tools : []
        };
      });
      setWeeks(weekMap);
    }
  }, [syllabusData, isLoading]);

  const updateWeek = async (weekId: string) => {
    try {
      setStatus('Updating...');
      const week = weeks[weekId];
      const now = Date.now();

      await db.transact(
        db.tx.syllabus[weekId].update({
          weekNumber: week.weekNumber,
          weekName: week.weekName,
          title: week.title,
          description: week.description,
          learningOutcome: week.learningOutcome,
          tools: week.tools,
          color: week.color,
          updatedAt: now,
        })
      );

      setEditingWeek(null);
      setStatus('Successfully updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error updating week:', error);
      setStatus(`Error: ${error}`);
    }
  };

  const handleLocalUpdate = (weekId: string, field: keyof SyllabusWeek, value: string | number | boolean | string[]) => {
    setWeeks(prev => ({
      ...prev,
      [weekId]: {
        ...prev[weekId],
        [field]: value
      }
    }));
  };

  const addTool = (weekId: string) => {
    const toolName = newTool[weekId];
    if (toolName && toolName.trim()) {
      handleLocalUpdate(weekId, 'tools', [...weeks[weekId].tools, toolName.trim()]);
      setNewTool(prev => ({ ...prev, [weekId]: '' }));
    }
  };

  const removeTool = (weekId: string, toolIndex: number) => {
    const updatedTools = weeks[weekId].tools.filter((_, index) => index !== toolIndex);
    handleLocalUpdate(weekId, 'tools', updatedTools);
  };

  const deleteWeek = async (weekId: string) => {
    try {
      setStatus('Deleting week...');

      // Delete from database
      await db.transact(
        db.tx.syllabus[weekId].delete()
      );

      // Remove from local state
      const newWeeks = { ...weeks };
      delete newWeeks[weekId];

      // Renumber remaining weeks
      const sortedWeeks = Object.values(newWeeks).sort((a, b) => a.sortOrder - b.sortOrder);
      sortedWeeks.forEach((week, index) => {
        week.weekNumber = index + 1;
        week.sortOrder = index;
      });

      // Update state
      const updatedWeeks: Record<string, SyllabusWeek> = {};
      sortedWeeks.forEach(week => {
        updatedWeeks[week.id] = week;
      });
      setWeeks(updatedWeeks);

      // Update all weeks in database
      for (const week of sortedWeeks) {
        await db.transact(
          db.tx.syllabus[week.id].update({
            weekNumber: week.weekNumber,
            sortOrder: week.sortOrder,
            updatedAt: Date.now()
          })
        );
      }

      setDeleteConfirm(null);
      setStatus('Week deleted successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error deleting week:', error);
      setStatus(`Error: ${error}`);
    }
  };

  const addNewWeek = async () => {
    try {
      const weekCount = Object.keys(weeks).length;
      const newWeekNumber = weekCount + 1;
      const newWeekId = `week-${Date.now()}`;

      const newWeek: SyllabusWeek = {
        id: newWeekId,
        courseId: 'vibe-coding',
        weekNumber: newWeekNumber,
        weekName: `Week ${newWeekNumber}`,
        title: 'New Week Title',
        description: 'Add your week description here',
        learningOutcome: 'What students will learn this week',
        tools: [],
        color: 'bg-purple-600',
        sortOrder: weekCount,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // Add to database
      await db.transact(
        db.tx.syllabus[newWeekId].update(newWeek)
      );

      // Update local state
      setWeeks(prev => ({
        ...prev,
        [newWeekId]: newWeek
      }));

      // Open in edit mode
      setEditingWeek(newWeekId);
      setStatus('New week added!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error adding week:', error);
      setStatus(`Error: ${error}`);
    }
  };

  const moveWeek = async (fromIndex: number, toIndex: number) => {
    try {
      const weekArray = Object.values(weeks).sort((a, b) => a.sortOrder - b.sortOrder);
      const [movedWeek] = weekArray.splice(fromIndex, 1);
      weekArray.splice(toIndex, 0, movedWeek);

      // Update sort order and week numbers
      const updatedWeeks: Record<string, SyllabusWeek> = {};
      for (let i = 0; i < weekArray.length; i++) {
        const week = weekArray[i];
        week.sortOrder = i;
        week.weekNumber = i + 1;
        updatedWeeks[week.id] = week;

        // Update in database
        await db.transact(
          db.tx.syllabus[week.id].update({
            sortOrder: i,
            weekNumber: i + 1,
            updatedAt: Date.now()
          })
        );
      }

      setWeeks(updatedWeeks);
      setStatus('Weeks reordered!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error reordering weeks:', error);
      setStatus(`Error: ${error}`);
    }
  };

const colorOptions = [
    { value: 'bg-yellow-orange', label: 'Yellow Orange', preview: '#FFB343' },
    { value: 'bg-mint', label: 'Mint', preview: '#42EAFF' },
    { value: 'bg-blue', label: 'Blue', preview: '#5433FF' },
    { value: 'bg-coral', label: 'Coral', preview: '#FD5E53' },
    { value: 'bg-purple-600', label: 'Purple', preview: '#8B5CF6' },
    { value: 'bg-green-600', label: 'Green', preview: '#10B981' },
  ];

  const getColorStyle = (colorClass: string) => {
    const color = colorOptions.find(c => c.value === colorClass);
    return color ? color.preview : '#8B5CF6';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading syllabus data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vibe Coding Syllabus</h1>
        <p className="mt-2 text-gray-600">Manage your Vibe Coding course curriculum</p>
      </div>

      {!isLoading && Object.keys(weeks).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 mb-4">No syllabus data found.</p>
          <a href="/seed-syllabus" className="text-purple-600 hover:text-purple-700 font-medium">
            Click here to seed initial data →
          </a>
        </div>
      ) : (
        <>
          {/* Add New Week Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Course Weeks</h2>
            <button
              onClick={addNewWeek}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Week
            </button>
          </div>

          {/* Week Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {Object.values(weeks)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((week, index) => (
                <motion.div
                  key={week.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative"
                  draggable
                  onDragStart={() => setDraggedWeek(week.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedWeek && draggedWeek !== week.id) {
                      const fromIndex = Object.values(weeks).sort((a, b) => a.sortOrder - b.sortOrder).findIndex(w => w.id === draggedWeek);
                      const toIndex = index;
                      moveWeek(fromIndex, toIndex);
                      setDraggedWeek(null);
                    }
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="p-6 border-b border-gray-100"
                    style={{
                      background: `linear-gradient(135deg, ${getColorStyle(week.color)}15 0%, ${getColorStyle(week.color)}05 100%)`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                          style={{ backgroundColor: getColorStyle(week.color) }}
                        >
                          {week.weekNumber}
                        </div>
                        <div>
                          {editingWeek === week.id ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-500 w-16">Name:</label>
                                <input
                                  type="text"
                                  value={week.weekName}
                                  onChange={(e) => handleLocalUpdate(week.id, 'weekName', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                                  placeholder="Week name"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-500 w-16">Number:</label>
                                <input
                                  type="number"
                                  value={week.weekNumber}
                                  onChange={(e) => handleLocalUpdate(week.id, 'weekNumber', parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                  min="0"
                                  max="99"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold text-gray-900">{week.weekName}</h3>
                              <p className="text-sm text-gray-500">Week {week.weekNumber}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Drag handle */}
                        <button
                          className="cursor-move text-gray-400 hover:text-gray-600 transition-colors"
                          title="Drag to reorder"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => setEditingWeek(editingWeek === week.id ? null : week.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {editingWeek === week.id ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteConfirm(week.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete week"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {editingWeek === week.id ? (
                      <input
                        type="text"
                        value={week.title}
                        onChange={(e) => handleLocalUpdate(week.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                        placeholder="Week title"
                      />
                    ) : (
                      <h4 className="font-medium text-gray-900">{week.title}</h4>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Description */}
                    <div className="mb-4">
                      {editingWeek === week.id ? (
                        <textarea
                          value={week.description}
                          onChange={(e) => handleLocalUpdate(week.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                          rows={3}
                          placeholder="Week description"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 line-clamp-3">{week.description}</p>
                      )}
                    </div>

                    {/* Tools */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</p>
                      <div className="flex flex-wrap gap-3">
                        {week.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getColorStyle(week.color) }}
                          >
                            {tool}
                            {editingWeek === week.id && (
                              <button
                                onClick={() => removeTool(week.id, idx)}
                                className="ml-1.5 hover:opacity-75"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {editingWeek === week.id && (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={newTool[week.id] || ''}
                              onChange={(e) => setNewTool(prev => ({ ...prev, [week.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && addTool(week.id)}
                              placeholder="Add tool"
                              className="px-2 py-1 border border-gray-300 rounded text-xs w-20"
                            />
                            <button
                              onClick={() => addTool(week.id)}
                              className="text-purple-600 hover:text-purple-700 font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Learning Outcome */}
                    <div>
                      <button
                        onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                      >
                        Learning Outcome
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedWeek === week.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {expandedWeek === week.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3"
                          >
                            {editingWeek === week.id ? (
                              <textarea
                                value={week.learningOutcome}
                                onChange={(e) => handleLocalUpdate(week.id, 'learningOutcome', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                rows={2}
                                placeholder="Learning outcome"
                              />
                            ) : (
                              <p className="text-sm text-gray-600">{week.learningOutcome}</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Color Picker (Edit Mode) */}
                    {editingWeek === week.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Color Theme
                        </label>
                        <div className="flex gap-2">
                          {colorOptions.map(color => (
                            <button
                              key={color.value}
                              onClick={() => handleLocalUpdate(week.id, 'color', color.value)}
                              className={`w-8 h-8 rounded-full border-2 ${
                                week.color === color.value ? 'border-gray-400' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color.preview }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions (Edit Mode) */}
                    {editingWeek === week.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => updateWeek(week.id)}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingWeek(null);
                            // Reset to original data
                            if (syllabusData?.syllabus) {
                              const original = syllabusData.syllabus.find(w => w.id === week.id);
                              if (original) {
                                setWeeks(prev => ({
                                  ...prev,
                                  [week.id]: {
                                    ...original,
                                    tools: original.tools || []
                                  }
                                }));
                              }
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Timeline Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Timeline</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline Items */}
              <div className="space-y-6">
                {Object.values(weeks)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((week, index) => (
                    <motion.div
                      key={week.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                        style={{ backgroundColor: getColorStyle(week.color) }}
                      >
                        W{week.weekNumber}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900">{week.weekName}: {week.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{week.learningOutcome}</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Week?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete {weeks[deleteConfirm]?.weekName}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteWeek(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Status Message */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg ${
            status.includes('Success') ? 'bg-green-500 text-white' :
            status.includes('Error') ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          {status}
        </motion.div>
      )}
    </div>
  );
}