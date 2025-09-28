'use client';

import React, { useState } from 'react';
import { db, id } from '@/lib/instant';
import { motion } from 'motion/react';
import SectionEditor from '@/components/admin/SectionEditor';

export default function AIFundamentalsContentAdmin() {
  const [editMode, setEditMode] = useState<'visual' | 'json'>('visual');
  const [saveMessage, setSaveMessage] = useState('');
  
  // Fetch existing content
  const { data } = db.useQuery({
    coursePageContent: {
      $: {
        where: {
          pageId: 'ai-fundamentals'
        }
      }
    }
  });

  const pageContent = data?.coursePageContent?.[0];
  
  // Local state for editing
  const [heroTitle, setHeroTitle] = useState(pageContent?.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(pageContent?.heroSubtitle || '');
  const [letterContent, setLetterContent] = useState(pageContent?.letterContent || { greeting: '', sections: [] });
  const [jsonContent, setJsonContent] = useState('');

  // Update local state when data loads
  React.useEffect(() => {
    if (pageContent) {
      setHeroTitle(pageContent.heroTitle || '');
      setHeroSubtitle(pageContent.heroSubtitle || '');
      setLetterContent(pageContent.letterContent || { greeting: '', sections: [] });
      setJsonContent(JSON.stringify(pageContent.letterContent || { greeting: '', sections: [] }, null, 2));
    }
  }, [pageContent]);

  const handleSave = async () => {
    try {
      let contentToSave = letterContent;
      
      // If in JSON mode, parse the JSON
      if (editMode === 'json') {
        try {
          contentToSave = JSON.parse(jsonContent);
        } catch {
          setSaveMessage('Error: Invalid JSON format');
          return;
        }
      }
      
      if (pageContent?.id) {
        // Update existing
        await db.transact(
          db.tx.coursePageContent[pageContent.id].update({
            heroTitle,
            heroSubtitle,
            letterContent: contentToSave,
            updatedAt: Date.now()
          })
        );
      } else {
        // Create new
        const newId = id();
        await db.transact(
          db.tx.coursePageContent[newId].update({
            pageId: 'ai-fundamentals',
            heroTitle,
            heroSubtitle,
            letterContent: contentToSave,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
      }
      setSaveMessage('Content saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveMessage('Error saving content');
    }
  };

  const handleModeSwitch = (mode: 'visual' | 'json') => {
    if (mode === 'json') {
      // Switching to JSON mode - convert current content to JSON
      setJsonContent(JSON.stringify(letterContent, null, 2));
    } else {
      // Switching to visual mode - parse JSON and update letterContent
      try {
        const parsed = JSON.parse(jsonContent);
        setLetterContent(parsed);
      } catch {
        // If JSON is invalid, keep the current letterContent
        console.error('Invalid JSON, keeping current content');
      }
    }
    setEditMode(mode);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit AI Fundamentals Content</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleModeSwitch('visual')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  editMode === 'visual'
                    ? 'bg-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => handleModeSwitch('json')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  editMode === 'json'
                    ? 'bg-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                JSON Editor
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
        </div>

        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                  placeholder="AI for Builders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                  placeholder="Understand the foundations of AI to build with confidence"
                />
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Letter Content</h2>
            
            {editMode === 'visual' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Letter Greeting</label>
                  <input
                    type="text"
                    value={letterContent.greeting || ''}
                    onChange={(e) => setLetterContent({ ...letterContent, greeting: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                    placeholder="Dear Future AI Builder,"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Sections</label>
                  <SectionEditor
                    sections={letterContent.sections || []}
                    onSectionsChange={(newSections) => setLetterContent({ ...letterContent, sections: newSections })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">JSON Editor</label>
                <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="w-full h-96 px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue focus:border-blue"
                  placeholder="Enter JSON content here..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Edit the raw JSON structure for the letter content. Be careful with syntax!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="w-full px-6 py-4 bg-purple-600 text-white text-base font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Save All Changes
          </button>
        </div>
      </div>
  );
}