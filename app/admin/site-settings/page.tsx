'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { motion } from 'framer-motion';

export default function SiteSettingsPage() {
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'theme'>('general');

  // General settings
  const [siteTitle, setSiteTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [copyrightText, setCopyrightText] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // SEO settings
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [analyticsId, setAnalyticsId] = useState('');

  // Social media settings
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    github: '',
    linkedin: '',
    instagram: '',
    youtube: ''
  });

  // Theme settings
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [accentColor, setAccentColor] = useState('#10B981');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [darkModeDefault, setDarkModeDefault] = useState(false);

  // Fetch existing settings
  const { data: settingsData } = db.useQuery({
    siteSettings: {}
  });

  // Load settings into state
  useEffect(() => {
    if (settingsData?.siteSettings) {
      const settings = settingsData.siteSettings;

      // Find and set each setting
      settings.forEach((setting: any) => {
        switch (setting.key) {
          case 'siteTitle':
            setSiteTitle(setting.value || '');
            break;
          case 'tagline':
            setTagline(setting.value || '');
            break;
          case 'copyrightText':
            setCopyrightText(setting.value || '');
            break;
          case 'maintenanceMode':
            setMaintenanceMode(setting.value || false);
            break;
          case 'metaDescription':
            setMetaDescription(setting.value || '');
            break;
          case 'metaKeywords':
            setMetaKeywords(setting.value || '');
            break;
          case 'ogImage':
            setOgImage(setting.value || '');
            break;
          case 'analyticsId':
            setAnalyticsId(setting.value || '');
            break;
          case 'socialLinks':
            setSocialLinks(setting.value || {
              twitter: '',
              github: '',
              linkedin: '',
              instagram: '',
              youtube: ''
            });
            break;
          case 'primaryColor':
            setPrimaryColor(setting.value || '#8B5CF6');
            break;
          case 'accentColor':
            setAccentColor(setting.value || '#10B981');
            break;
          case 'fontFamily':
            setFontFamily(setting.value || 'Inter');
            break;
          case 'darkModeDefault':
            setDarkModeDefault(setting.value || false);
            break;
        }
      });
    }
  }, [settingsData]);

  // Save a single setting
  const saveSetting = async (key: string, value: any) => {
    try {
      const existingSetting = settingsData?.siteSettings?.find((s: any) => s.key === key);

      if (existingSetting) {
        await db.transact(
          db.tx.siteSettings[existingSetting.id].update({
            value,
            updatedAt: Date.now()
          })
        );
      } else {
        await db.transact(
          db.tx.siteSettings[id()].update({
            key,
            value,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
      }
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error);
      throw error;
    }
  };

  // Save all settings
  const saveAllSettings = async () => {
    try {
      setIsUpdating(true);
      setStatus('Saving settings...');

      // Save each setting
      const settings = [
        { key: 'siteTitle', value: siteTitle },
        { key: 'tagline', value: tagline },
        { key: 'copyrightText', value: copyrightText },
        { key: 'maintenanceMode', value: maintenanceMode },
        { key: 'metaDescription', value: metaDescription },
        { key: 'metaKeywords', value: metaKeywords },
        { key: 'ogImage', value: ogImage },
        { key: 'analyticsId', value: analyticsId },
        { key: 'socialLinks', value: socialLinks },
        { key: 'primaryColor', value: primaryColor },
        { key: 'accentColor', value: accentColor },
        { key: 'fontFamily', value: fontFamily },
        { key: 'darkModeDefault', value: darkModeDefault }
      ];

      await Promise.all(
        settings.map(setting => saveSetting(setting.key, setting.value))
      );

      setStatus('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setStatus('Error saving settings. Please try again.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Site Settings</h1>
        <p className="mt-2 text-gray-600 font-light">Configure global settings for your portfolio</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { key: 'general', label: 'General', icon: '⚙️' },
              { key: 'seo', label: 'SEO', icon: '🔍' },
              { key: 'social', label: 'Social Media', icon: '🔗' },
              { key: 'theme', label: 'Theme', icon: '🎨' }
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
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Diary of a Vibe Coder"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Building with vibes and code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="© 2024 Your Name. All rights reserved."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    Show a maintenance page to visitors
                  </p>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="A portfolio showcasing vibe coded projects and essays..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="vibe coding, portfolio, web development, AI tools"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Comma-separated keywords
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended: 1200x630px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={analyticsId}
                    onChange={(e) => setAnalyticsId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter/X
                  </label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
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
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="#8B5CF6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Merriweather">Merriweather</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkModeDefault}
                      onChange={(e) => setDarkModeDefault(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Dark Mode by Default</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    Set dark mode as the default theme
                  </p>
                </div>

                {/* Color Preview */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
                  <div className="flex gap-4 items-center">
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-lg shadow-md mb-2"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <p className="text-xs text-gray-600">Primary</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-lg shadow-md mb-2"
                        style={{ backgroundColor: accentColor }}
                      />
                      <p className="text-xs text-gray-600">Accent</p>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily }} className="text-lg mb-1">
                        Sample Text in {fontFamily}
                      </p>
                      <p style={{ fontFamily }} className="text-sm text-gray-600">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  </div>
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
          onClick={saveAllSettings}
          disabled={isUpdating}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500/20 hover:ring-offset-2 transform active:scale-[0.98]"
        >
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}