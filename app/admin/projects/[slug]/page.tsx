'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { motion } from 'framer-motion';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const isNew = slug === 'new';

  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [projectStatus, setProjectStatus] = useState('planned');
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [color, setColor] = useState('');
  const [newTech, setNewTech] = useState('');

  // Fetch existing project if editing
  const { data: projectData } = db.useQuery(
    !isNew ? {
      projects: {
        $: {
          where: { slug: slug }
        }
      }
    } : {}
  );

  // Set initial values when data loads
  useEffect(() => {
    if (!isNew && projectData?.projects?.[0]) {
      const project = projectData.projects[0];
      setTitle(project.title || '');
      setSubtitle(project.subtitle || '');
      setProjectSlug(project.slug || '');
      setDescription(project.description || '');
      setThumbnail(project.thumbnail || '');
      setCoverImage(project.coverImage || '');
      setTechnologies(project.technologies || []);
      setGithubUrl(project.githubUrl || '');
      setLiveUrl(project.liveUrl || '');
      setProjectStatus(project.status || 'planned');
      setFeatured(project.featured || false);
      setSortOrder(project.sortOrder || 0);
      setColor(project.color || '');
    }
  }, [isNew, projectData]);

  const handleAddTech = () => {
    if (newTech.trim()) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatus('Saving project...');

    try {
      if (isNew) {
        // Create new project
        await db.transact(
          db.tx.projects[id()].update({
            slug: projectSlug,
            title,
            subtitle: subtitle || null,
            description,
            thumbnail: thumbnail || null,
            coverImage: coverImage || null,
            technologies,
            githubUrl: githubUrl || null,
            liveUrl: liveUrl || null,
            status: projectStatus,
            featured,
            sortOrder,
            color: color || null,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
        setStatus('Project created successfully!');
        setTimeout(() => router.push('/admin/projects'), 1500);
      } else {
        // Update existing project
        const project = projectData?.projects?.[0];
        if (project) {
          await db.transact(
            db.tx.projects[project.id].update({
              slug: projectSlug,
              title,
              subtitle: subtitle || null,
              description,
              thumbnail: thumbnail || null,
              coverImage: coverImage || null,
              technologies,
              githubUrl: githubUrl || null,
              liveUrl: liveUrl || null,
              status: projectStatus,
              featured,
              sortOrder,
              color: color || null,
              updatedAt: Date.now()
            })
          );
          setStatus('Project updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      setStatus('Error saving project. Please try again.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const generateSlug = () => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setProjectSlug(slug);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/projects">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {isNew ? 'New Project' : 'Edit Project'}
          </h1>
        </div>
        <p className="text-gray-600 font-light">
          {isNew ? 'Create a new portfolio project' : `Editing: ${title}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Project Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={projectSlug}
                      onChange={(e) => setProjectSlug(e.target.value)}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="project-slug"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional project subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your project..."
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="#FFB343 or rgb(255, 179, 67)"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Technologies</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Technology
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="React, Next.js, TypeScript..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(index)}
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
              </div>
            </div>

            {/* Links */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Links</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Project</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]"
                >
                  {isUpdating ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
                </button>

                <Link href="/admin/projects">
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </Link>
              </div>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {status}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}