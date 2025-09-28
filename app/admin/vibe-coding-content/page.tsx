'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/instant';
import { defaultVibeCodingContent } from '@/lib/vibe-coding-content';
import Link from 'next/link';
import SectionEditor from '@/components/admin/SectionEditor';

export default function AdminVibeCodingContent() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [letterContentJson, setLetterContentJson] = useState('');
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  // Use any[] for sections to simplify type compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sections, setSections] = useState<any[]>([]);

  // Fetch current content
  const { data: pageData } = db.useQuery({
    coursePageContent: {
      $: {
        where: {
          pageId: 'vibe-coding',
          isActive: true
        }
      }
    }
  });

  // Set initial values when data loads
  useEffect(() => {
    if (pageData?.coursePageContent?.[0]) {
      const content = pageData.coursePageContent[0];
      setHeroTitle(content.heroTitle || '');
      setHeroSubtitle(content.heroSubtitle || '');
      const letterContent = content.letterContent || defaultVibeCodingContent.letterContent;
      setLetterContentJson(JSON.stringify(letterContent, null, 2));
      
      // Extract sections for visual editor
      if (letterContent.sections) {
        setSections(letterContent.sections);
      }
    } else {
      // Use default content
      const defaultContent = defaultVibeCodingContent.letterContent;
      setLetterContentJson(JSON.stringify(defaultContent, null, 2));
      setSections(defaultContent.sections || []);
    }
  }, [pageData]);

  const updateContent = async () => {
    try {
      setStatus('Updating...');
      
      const now = Date.now();
      
      // Prepare letter content based on view mode
      let letterContent;
      if (viewMode === 'json') {
        // Parse the JSON content
        try {
          letterContent = JSON.parse(letterContentJson);
        } catch (e) {
          console.error('JSON parse error:', e);
          setStatus('Error: Invalid JSON format');
          return;
        }
      } else {
        // Use visual editor content
        letterContent = {
          greeting: "Dear Future Vibe Coder,",
          sections: sections
        };
      }

      // Update or create the record
      const existingRecord = pageData?.coursePageContent?.[0];
      
      if (existingRecord) {
        await db.transact(
          db.tx.coursePageContent[existingRecord.id].update({
            heroTitle: heroTitle || existingRecord.heroTitle,
            heroSubtitle: heroSubtitle || existingRecord.heroSubtitle,
            letterContent: letterContent,
            updatedAt: now,
          })
        );
      } else {
        // Create new record
        const { id: idFn } = await import('@instantdb/react');
        const newId = idFn();
        
        await db.transact(
          db.tx.coursePageContent[newId].update({
            pageId: 'vibe-coding',
            heroTitle: heroTitle || defaultVibeCodingContent.heroTitle,
            heroSubtitle: heroSubtitle || defaultVibeCodingContent.heroSubtitle,
            letterContent: letterContent,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          })
        );
      }
      
      setStatus('Successfully updated content!');
      setTimeout(() => setStatus(''), 3000);
      
    } catch (error) {
      console.error('Error updating content:', error);
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
        <h1 className="text-4xl font-bold mb-8">Update Vibe Coding Page Content</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Learn the Craft of\nVibe Coding"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Use \n for line breaks</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Transform your ideas into reality with AI-powered development"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Letter Content
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (viewMode === 'json') {
                        // Switching from JSON to visual
                        try {
                          const parsed = JSON.parse(letterContentJson);
                          setSections(parsed.sections || []);
                        } catch {
                          alert('Invalid JSON. Please fix before switching to visual mode.');
                          return;
                        }
                      } else {
                        // Switching from visual to JSON
                        const content = { greeting: "Dear Future Vibe Coder,", sections };
                        setLetterContentJson(JSON.stringify(content, null, 2));
                      }
                      setViewMode(viewMode === 'visual' ? 'json' : 'visual');
                    }}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                  >
                    {viewMode === 'visual' ? 'Switch to JSON' : 'Switch to Visual'}
                  </button>
                </div>
              </div>
              
              {viewMode === 'json' ? (
                <>
                  <textarea
                    value={letterContentJson}
                    onChange={(e) => setLetterContentJson(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Edit the JSON structure to modify letter sections. Be careful with syntax!
                  </p>
                </>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <SectionEditor
                    sections={sections}
                    onSectionsChange={setSections}
                  />
                </div>
              )}
            </div>

            <button
              onClick={updateContent}
              className="w-full px-6 py-4 bg-purple-600 text-white text-base font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={status === 'Updating...'}
            >
              Save All Changes
            </button>

            {status && (
              <div className={`p-4 rounded-lg text-center ${
                status.includes('Success') ? 'bg-green-100 text-green-800' : 
                status.includes('Error') ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {status}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/vibe-coding" className="text-blue-600 hover:underline mr-4">
            ← View Vibe Coding Page
          </Link>
          <Link href="/admin/cohorts" className="text-blue-600 hover:underline">
            Go to Cohort Admin →
          </Link>
        </div>

        {/* Current Values Display */}
        {pageData?.coursePageContent?.[0] && (
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Current Database Values:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>Page ID:</strong> {pageData.coursePageContent[0].pageId}</div>
              <div><strong>Hero Title:</strong> {pageData.coursePageContent[0].heroTitle || '(using default)'}</div>
              <div><strong>Hero Subtitle:</strong> {pageData.coursePageContent[0].heroSubtitle || '(using default)'}</div>
              <div><strong>Letter Content:</strong> {pageData.coursePageContent[0].letterContent ? 'Custom content' : 'Using default'}</div>
              <div><strong>Last Updated:</strong> {new Date(pageData.coursePageContent[0].updatedAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
  );
}