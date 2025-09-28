'use client';

import React, { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { Trash2, Plus, Edit2, Save, X, GripVertical } from 'lucide-react';

export default function OurStoryAdminPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    label: '',
    value: '',
    description: '',
    iconName: '',
    color: '',
    sortOrder: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch stats
  const { data } = db.useQuery({
    ourStoryStats: {
      $: {
        order: { sortOrder: 'asc' }
      }
    }
  });

  const stats = data?.ourStoryStats || [];

  // Handle edit
  const handleEdit = (stat: {
    id: string;
    label: string;
    value: string;
    description: string;
    iconName: string;
    color: string;
    sortOrder: number;
  }) => {
    setEditingId(stat.id);
    setEditForm({
      label: stat.label,
      value: stat.value,
      description: stat.description,
      iconName: stat.iconName,
      color: stat.color,
      sortOrder: stat.sortOrder
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!editingId) return;

    await db.transact(
      db.tx.ourStoryStats[editingId].update({
        ...editForm,
        updatedAt: Date.now()
      })
    );

    setEditingId(null);
  };

  // Handle delete
  const handleDelete = async (statId: string) => {
    if (confirm('Are you sure you want to delete this stat?')) {
      await db.transact(
        db.tx.ourStoryStats[statId].delete()
      );
    }
  };

  // Handle add new
  const handleAddNew = async () => {
    const newStat = {
      id: id(),
      ...editForm,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.transact(
      db.tx.ourStoryStats[newStat.id].update(newStat)
    );

    setIsAdding(false);
    setEditForm({
      label: '',
      value: '',
      description: '',
      iconName: '',
      color: '',
      sortOrder: 0
    });
  };

  // Toggle active status
  const toggleActive = async (statId: string, currentStatus: boolean) => {
    await db.transact(
      db.tx.ourStoryStats[statId].update({
        isActive: !currentStatus,
        updatedAt: Date.now()
      })
    );
  };

  const iconOptions = [
    'Calendar', 'GraduationCap', 'Users', 'Trophy',
    'Award', 'Target', 'TrendingUp', 'Star',
    'Heart', 'Zap', 'Rocket', 'Globe'
  ];

  const colorPresets = [
    { name: 'Yellow-Orange', value: '#FFB343' },
    { name: 'Mint', value: '#42EAFF' },
    { name: 'Blue', value: '#5433FF' },
    { name: 'Coral', value: '#FD5E53' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Green', value: '#10B981' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Story Statistics</h1>
          <p className="mt-2 text-gray-600">Manage the statistics displayed on the homepage</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditForm({
              label: '',
              value: '',
              description: '',
              iconName: 'Trophy',
              color: '#5433FF',
              sortOrder: stats.length
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Stat
        </button>
      </div>

      {/* Add New Form */}
      {isAdding && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-purple-200">
          <h3 className="text-lg font-semibold mb-4">Add New Statistic</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label</label>
              <input
                type="text"
                value={editForm.label}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="text"
                value={editForm.value}
                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Building the future of education"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select
                value={editForm.iconName}
                onChange={(e) => setEditForm({ ...editForm, iconName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="#5433FF"
                />
                <div className="flex gap-1">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => setEditForm({ ...editForm, color: preset.value })}
                      className="w-8 h-10 rounded border-2 hover:scale-110 transition-transform"
                      style={{ backgroundColor: preset.value, borderColor: editForm.color === preset.value ? '#333' : 'transparent' }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input
                type="number"
                value={editForm.sortOrder}
                onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Statistic
            </button>
          </div>
        </div>
      )}

      {/* Stats Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.map((stat) => (
              <tr key={stat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    {editingId === stat.id ? (
                      <input
                        type="number"
                        value={editForm.sortOrder}
                        onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) })}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{stat.sortOrder}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === stat.id ? (
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium">{stat.label}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === stat.id ? (
                    <input
                      type="text"
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === stat.id ? (
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{stat.description}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === stat.id ? (
                    <select
                      value={editForm.iconName}
                      onChange={(e) => setEditForm({ ...editForm, iconName: e.target.value })}
                      className="px-2 py-1 border rounded"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm">{stat.iconName}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === stat.id ? (
                    <input
                      type="text"
                      value={editForm.color}
                      onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: stat.color }} />
                      <span className="text-xs">{stat.color}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(stat.id, stat.isActive)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      stat.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {stat.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {editingId === stat.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(stat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}