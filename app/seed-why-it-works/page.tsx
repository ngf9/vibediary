'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';

const features = [
  {
    iconName: 'FlaskConical',
    title: 'Scientific Foundation',
    description: 'Backed by over 2+ years of scientific research in effective learning.',
    highlightWords: ['2+ years', 'scientific research'],
    sortOrder: 0
  },
  {
    iconName: 'Users',
    title: 'Curated Study Groups',
    description: 'Learn in small, pre-vetted study groups (7-12 students) for personalized attention.',
    highlightWords: ['small, pre-vetted study groups', '7-12 students'],
    sortOrder: 1
  },
  {
    iconName: 'GraduationCap',
    title: 'Expert-Designed Curriculum',
    description: 'A structured curriculum developed by a YC founder ensures comprehensive learning.',
    highlightWords: ['structured curriculum', 'YC founder'],
    sortOrder: 2
  },
  {
    iconName: 'Mic',
    title: 'Insightful Weekly Speakers',
    description: 'Gain unique insights from industry leaders like Gordon Wintrob and Raza Habib.',
    highlightWords: ['Gordon Wintrob', 'Raza Habib'],
    sortOrder: 3
  },
  {
    iconName: 'Brain',
    title: 'SOTA Learning Practices',
    description: 'Utilize active recall, spaced repetition, and metacognition for deep understanding.',
    highlightWords: ['active recall, spaced repetition, and metacognition'],
    sortOrder: 4
  },
  {
    iconName: 'ClipboardCheck',
    title: 'Practical Assignments',
    description: 'Stay accountable and apply knowledge with targeted assignments.',
    highlightWords: ['targeted assignments'],
    sortOrder: 5
  },
  {
    iconName: 'Video',
    title: 'Collaborative Group Calls',
    description: 'Track progress and discuss challenges in supportive group calls.',
    highlightWords: ['supportive group calls'],
    sortOrder: 6
  },
  {
    iconName: 'Rocket',
    title: 'Real-World Project',
    description: 'Build a course project to apply everything you\'ve learned.',
    highlightWords: ['course project'],
    sortOrder: 7
  }
];

export default function SeedWhyItWorksPage() {
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const seedData = async () => {
    setSeeding(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if features already exist
      const { data } = await db.queryOnce({
        whyItWorks: {}
      });

      if (data?.whyItWorks && data.whyItWorks.length > 0) {
        setError('Why It Works features already exist. Clear existing data first if you want to re-seed.');
        setSeeding(false);
        return;
      }

      // Create all features
      const createPromises = features.map(feature => {
        const featureId = id();
        const featureData = {
          id: featureId,
          ...feature,
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        return db.transact(
          db.tx.whyItWorks[featureId].update(featureData)
        );
      });

      await Promise.all(createPromises);

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/why-it-works');
      }, 2000);
    } catch (err) {
      console.error('Error seeding data:', err);
      setError(err instanceof Error ? err.message : 'Failed to seed data');
    } finally {
      setSeeding(false);
    }
  };

  const clearData = async () => {
    setSeeding(true);
    setError(null);

    try {
      const { data } = await db.queryOnce({
        whyItWorks: {}
      });

      if (data?.whyItWorks && data.whyItWorks.length > 0) {
        const deletePromises = data.whyItWorks.map(feature =>
          db.transact(db.tx.whyItWorks[feature.id].delete())
        );
        await Promise.all(deletePromises);
        setError(null);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Error clearing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Seed Why It Works Data</h1>

        <p className="text-gray-600 mb-6">
          This will populate the Why It Works section with the initial 8 features.
        </p>

        <div className="space-y-4">
          <button
            onClick={seedData}
            disabled={seeding || success}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              seeding || success
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {seeding ? 'Seeding...' : success ? '✅ Seeded Successfully!' : '🌱 Seed Data'}
          </button>

          <button
            onClick={clearData}
            disabled={seeding}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              seeding
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {seeding ? 'Processing...' : '🗑️ Clear Existing Data'}
          </button>

          <button
            onClick={() => router.push('/admin/why-it-works')}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Admin Panel
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">
              Successfully seeded {features.length} features! Redirecting to admin panel...
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Features to be seeded:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            {features.map((feature, index) => (
              <li key={index}>• {feature.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}