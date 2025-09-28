'use client';

import { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SeedCohorts() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  const seedCohortDates = async () => {
    try {
      setStatus('Seeding cohort dates...');
      
      const now = Date.now();
      
      // Create cohort date records
      const cohortDates = [
        {
          id: id(),
          courseId: 'ai-fundamentals',
          title: 'AI For Builders',
          subtitle: 'Class 1',
          description: 'Master the fundamentals of LLMs and AI through hands-on building and theoretical understanding.',
          startDate: 'Next Cohort Starts Feb 3',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          title: 'Vibe Coding 101',
          subtitle: 'Class 2',
          description: 'Learn to build and ship real products using AI tools and modern development practices.',
          startDate: 'Next Cohort Starts Feb 3',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ];

      // Use transact to write the data
      for (const cohortDate of cohortDates) {
        await db.transact(
          db.tx.cohortDates[cohortDate.id].update(cohortDate)
        );
      }
      
      setStatus('Success! Cohort dates have been added. Redirecting to home...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error seeding cohort dates:', error);
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seed Cohort Dates</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What this will do:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>AI Fundamentals: <strong>AI For Builders (Class 1)</strong> - Starts Feb 3</li>
            <li>Vibe Coding: <strong>Vibe Coding 101 (Class 2)</strong> - Starts Feb 3</li>
          </ul>
        </div>

        <button
          onClick={seedCohortDates}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={status.includes('Seeding') || status.includes('Success')}
        >
          Seed Cohort Dates
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
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}