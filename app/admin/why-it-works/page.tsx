'use client';

import React, { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import {
  Trash2,
  Plus,
  Edit2,
  Save,
  X,
  GripVertical,
  FlaskConical,
  Users,
  GraduationCap,
  Mic,
  Brain,
  ClipboardCheck,
  Video,
  Rocket,
  Eye,
  EyeOff
} from 'lucide-react';

// Available icons mapping
const iconOptions = [
  { name: 'FlaskConical', icon: FlaskConical, label: 'Flask' },
  { name: 'Users', icon: Users, label: 'Users' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Graduation Cap' },
  { name: 'Mic', icon: Mic, label: 'Microphone' },
  { name: 'Brain', icon: Brain, label: 'Brain' },
  { name: 'ClipboardCheck', icon: ClipboardCheck, label: 'Clipboard Check' },
  { name: 'Video', icon: Video, label: 'Video' },
  { name: 'Rocket', icon: Rocket, label: 'Rocket' },
];

export default function WhyItWorksAdminPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    iconName: 'FlaskConical',
    title: '',
    description: '',
    highlightWords: [] as string[],
    sortOrder: 0
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');

  // Fetch features
  const { data } = db.useQuery({
    whyItWorks: {
      $: {
        order: { sortOrder: 'asc' }
      }
    }
  });

  const features = data?.whyItWorks || [];

  // Handle edit
  const handleEdit = (feature: {
    id: string;
    iconName: string;
    title: string;
    description: string;
    highlightWords?: string[];
    sortOrder: number;
  }) => {
    setEditingId(feature.id);
    setEditForm({
      iconName: feature.iconName,
      title: feature.title,
      description: feature.description,
      highlightWords: feature.highlightWords || [],
      sortOrder: feature.sortOrder
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!editingId) return;

    await db.transact(
      db.tx.whyItWorks[editingId].update({
        ...editForm,
        updatedAt: Date.now()
      })
    );

    setEditingId(null);
  };

  // Handle delete
  const handleDelete = async (featureId: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      await db.transact(
        db.tx.whyItWorks[featureId].delete()
      );
    }
  };

  // Handle add new
  const handleAddNew = async () => {
    const newFeature = {
      id: id(),
      ...editForm,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.transact(
      db.tx.whyItWorks[newFeature.id].update(newFeature)
    );

    setIsAdding(false);
    setEditForm({
      iconName: 'FlaskConical',
      title: '',
      description: '',
      highlightWords: [],
      sortOrder: features.length
    });
  };

  // Toggle active status
  const toggleActive = async (featureId: string, currentStatus: boolean) => {
    await db.transact(
      db.tx.whyItWorks[featureId].update({
        isActive: !currentStatus,
        updatedAt: Date.now()
      })
    );
  };

  // Add highlight word
  const addHighlightWord = () => {
    if (newHighlight.trim()) {
      setEditForm({
        ...editForm,
        highlightWords: [...editForm.highlightWords, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  // Remove highlight word
  const removeHighlightWord = (index: number) => {
    setEditForm({
      ...editForm,
      highlightWords: editForm.highlightWords.filter((_, i) => i !== index)
    });
  };

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.name === iconName);
    return iconOption ? iconOption.icon : FlaskConical;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Why It Works Management</h1>
        <p className="text-gray-600">Manage the features displayed in the Why it Works section.</p>
      </div>

      {/* Add New Feature Button */}
      <div className="mb-6">
        {!isAdding ? (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({
                iconName: 'FlaskConical',
                title: '',
                description: '',
                highlightWords: [],
                sortOrder: features.length
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add New Feature
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>

            {/* Icon Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.name}
                      onClick={() => setEditForm({ ...editForm, iconName: option.name })}
                      className={`p-3 border rounded-lg flex flex-col items-center gap-1 ${
                        editForm.iconName === option.name
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Scientific Foundation"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                placeholder="e.g., Backed by over 2+ years of scientific research in effective learning."
              />
            </div>

            {/* Highlight Words */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Words/Phrases</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlightWord())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter word or phrase to highlight"
                />
                <button
                  onClick={addHighlightWord}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editForm.highlightWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {word}
                    <button
                      onClick={() => removeHighlightWord(index)}
                      className="hover:text-yellow-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={editForm.sortOrder}
                onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {features.map((feature) => {
          const Icon = getIconComponent(feature.iconName);
          const isEditing = editingId === feature.id;

          if (isEditing) {
            return (
              <div key={feature.id} className="bg-white border border-purple-400 rounded-lg p-6">
                {/* Edit Form (same as Add form) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => {
                      const OptionIcon = option.icon;
                      return (
                        <button
                          key={option.name}
                          onClick={() => setEditForm({ ...editForm, iconName: option.name })}
                          className={`p-3 border rounded-lg flex flex-col items-center gap-1 ${
                            editForm.iconName === option.name
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <OptionIcon className="w-5 h-5" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Words/Phrases</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlightWord())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter word or phrase to highlight"
                    />
                    <button
                      onClick={addHighlightWord}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.highlightWords.map((word, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {word}
                        <button
                          onClick={() => removeHighlightWord(index)}
                          className="hover:text-yellow-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewHighlight('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={feature.id}
              className={`bg-white border ${
                feature.isActive ? 'border-gray-200' : 'border-red-200 opacity-60'
              } rounded-lg p-6 flex items-start justify-between`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-600 mb-2">{feature.description}</p>
                  {feature.highlightWords && feature.highlightWords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-gray-500">Highlights:</span>
                      {feature.highlightWords.map((word: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Order: {feature.sortOrder}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleActive(feature.id, feature.isActive)}
                  className={`p-2 rounded-lg ${
                    feature.isActive
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={feature.isActive ? 'Active' : 'Inactive'}
                >
                  {feature.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(feature)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(feature.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}