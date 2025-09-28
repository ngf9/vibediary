'use client';

import { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { useRouter } from 'next/navigation';
import { defaultVibeCodingContent } from '@/lib/vibe-coding-content';
import Link from 'next/link';

export default function SeedVibeContent() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  const seedContent = async () => {
    try {
      setStatus('Checking for existing content...');
      
      // First, check if there's existing content
      const { data: existingData } = await db.queryOnce({
        coursePageContent: {
          $: {
            where: {
              pageId: 'vibe-coding'
            }
          }
        }
      });
      
      const now = Date.now();
      
      if (existingData?.coursePageContent && existingData.coursePageContent.length > 0) {
        // Update existing record
        setStatus('Updating existing content...');
        const existingRecord = existingData.coursePageContent[0];
        
        await db.transact(
          db.tx.coursePageContent[existingRecord.id].update({
            heroTitle: defaultVibeCodingContent.heroTitle,
            heroSubtitle: defaultVibeCodingContent.heroSubtitle,
            letterContent: defaultVibeCodingContent.letterContent,
            isActive: true,
            updatedAt: now,
          })
        );
      } else {
        // Create new record
        setStatus('Creating new content...');
        const contentData = {
          id: id(),
          pageId: 'vibe-coding',
          heroTitle: defaultVibeCodingContent.heroTitle,
          heroSubtitle: defaultVibeCodingContent.heroSubtitle,
          letterContent: defaultVibeCodingContent.letterContent,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };

        await db.transact(
          db.tx.coursePageContent[contentData.id].update(contentData)
        );
      }
      
      setStatus('Success! Vibe Coding content has been seeded. Redirecting...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/vibe-coding');
      }, 2000);
      
    } catch (error) {
      console.error('Error seeding content:', error);
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seed Vibe Coding Page Content</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What this will do:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Create/Update content for the Vibe Coding page</li>
            <li>Hero Title: &quot;Learn the Craft of Vibe Coding&quot;</li>
            <li>Hero Subtitle: &quot;Transform your ideas into reality with AI-powered development&quot;</li>
            <li>Full letter content with navigable sections:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                <li>Opening</li>
                <li>What Vibe Coding Really Is</li>
                <li>Who This Is For</li>
                <li>Why Claude Code</li>
                <li>What Makes This Different</li>
                <li>The Journey</li>
                <li>Your Transformation</li>
              </ul>
            </li>
          </ul>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This will replace any existing content with the default 
              structured content. If you have custom content you want to preserve, use the admin page instead.
            </p>
          </div>
        </div>

        <button
          onClick={seedContent}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={status.includes('Seeding') || status.includes('Success')}
        >
          Seed Vibe Coding Content
        </button>

        {status && (
          <div className={`mt-6 p-4 rounded-lg ${
            status.includes('Success') ? 'bg-green-100 text-green-800' : 
            status.includes('Error') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-8">
          <Link href="/admin/vibe-coding-content" className="text-blue-600 hover:underline mr-4">
            ← Go to Admin Page
          </Link>
          <Link href="/vibe-coding" className="text-blue-600 hover:underline">
            View Vibe Coding Page →
          </Link>
        </div>
      </div>
    </div>
  );
}