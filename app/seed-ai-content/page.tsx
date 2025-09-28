'use client';

import React, { useState } from 'react';
import { db, id } from '@/lib/instant';
import { defaultAIFundamentalsContent } from '@/lib/ai-fundamentals-content';

export default function SeedAIContentPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if content already exists
  const { data: existingData } = db.useQuery({
    coursePageContent: {
      $: {
        where: {
          pageId: 'ai-fundamentals'
        }
      }
    }
  });

  const hasExistingContent = (existingData?.coursePageContent?.length ?? 0) > 0;

  const seedContent = async () => {
    setLoading(true);
    try {
      if (hasExistingContent && existingData?.coursePageContent?.[0]) {
        // Update existing content
        const existingId = existingData.coursePageContent[0].id;
        await db.transact(
          db.tx.coursePageContent[existingId].update({
            heroTitle: defaultAIFundamentalsContent.heroTitle,
            heroSubtitle: defaultAIFundamentalsContent.heroSubtitle,
            letterContent: defaultAIFundamentalsContent.letterContent,
            isActive: true,
            updatedAt: Date.now()
          })
        );
        setMessage('AI Fundamentals content updated successfully!');
      } else {
        // Create new content
        const newId = id();
        await db.transact(
          db.tx.coursePageContent[newId].update({
            pageId: 'ai-fundamentals',
            heroTitle: defaultAIFundamentalsContent.heroTitle,
            heroSubtitle: defaultAIFundamentalsContent.heroSubtitle,
            letterContent: defaultAIFundamentalsContent.letterContent,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        );
        setMessage('AI Fundamentals content seeded successfully!');
      }
    } catch (error) {
      console.error('Error seeding content:', error);
      setMessage('Error seeding content. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Generate sections list for display
  const sections = defaultAIFundamentalsContent.letterContent.sections
    .filter(section => 'id' in section && 'navLabel' in section)
    .map(section => {
      const typedSection = section as { id: string; navLabel: string };
      return {
        id: typedSection.id,
        navLabel: typedSection.navLabel
      };
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-8">
        <h1 className="text-3xl font-bold mb-8">Seed AI Fundamentals Content</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Content Status</h2>
          {hasExistingContent ? (
            <div className="text-green-600 mb-4">
              ✓ AI Fundamentals content already exists in database
              <p className="text-sm text-gray-600 mt-2">
                Clicking seed will update the existing content.
              </p>
            </div>
          ) : (
            <div className="text-yellow-600 mb-4">
              ⚠ No AI Fundamentals content found in database
              <p className="text-sm text-gray-600 mt-2">
                Clicking seed will create new content.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Content Preview</h2>
          <div className="space-y-2">
            <p><strong>Page ID:</strong> ai-fundamentals</p>
            <p><strong>Hero Title:</strong> {defaultAIFundamentalsContent.heroTitle}</p>
            <p><strong>Hero Subtitle:</strong> {defaultAIFundamentalsContent.heroSubtitle}</p>
            <p><strong>Letter Greeting:</strong> {defaultAIFundamentalsContent.letterContent.greeting}</p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Sections:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {sections.map(section => (
                  <li key={section.id}>
                    {section.navLabel} (ID: {section.id})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <button
            onClick={seedContent}
            disabled={loading}
            className="px-6 py-3 bg-blue text-white font-semibold rounded-full hover:bg-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Seeding...' : hasExistingContent ? 'Update AI Fundamentals Content' : 'Seed AI Fundamentals Content'}
          </button>
          
          {message && (
            <p className={`mt-4 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}