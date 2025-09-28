'use client';

import { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SeedSyllabus() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  const seedSyllabusData = async () => {
    try {
      setStatus('Seeding syllabus data...');
      
      const now = Date.now();
      
      const syllabusWeeks = [
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 0,
          weekName: 'Week 0',
          title: 'Prepare Your PRD',
          description: 'Define and scope your project with a Product Requirements Document',
          learningOutcome: 'Develop a solid project brief and gain a foundational understanding of how to translate creative concepts into technical specs.',
          color: 'bg-yellow-orange',
          tools: ['PRD Template', 'AI Assistant'],
          sortOrder: 0,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 1,
          weekName: 'Week 1',
          title: 'AI Fundamentals',
          description: 'Develop a theoretical foundation of Large Language Models',
          learningOutcome: 'Gain a conceptual and theoretical grasp of LLMs and AI, learn the baseline vocabulary.',
          color: 'bg-mint',
          tools: ['OpenAI Playground', 'Research Papers'],
          sortOrder: 1,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 2,
          weekName: 'Week 2',
          title: 'Vibe Coding Foundations + Sprint 1',
          description: 'Set up your dev environment and build your first web app',
          learningOutcome: 'Build and deploy your first web-based app while becoming comfortable with essential development tools and processes.',
          color: 'bg-blue',
          tools: ['VS Code', 'GitHub', 'Claude Code', 'Instant DB', 'Vercel'],
          sortOrder: 2,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 3,
          weekName: 'Week 3',
          title: 'Deep Dive with Claude Code',
          description: 'Master AI-powered development with Claude Code',
          learningOutcome: 'Deepen your expertise with Claude Code, begin building your project using Claude Code.',
          color: 'bg-coral',
          tools: ['Claude Code'],
          sortOrder: 3,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 4,
          weekName: 'Week 4',
          title: 'LLM APIs & Automation + Sprint 2',
          description: 'Integrate APIs and build an AI-powered newsletter bot',
          learningOutcome: 'Build a robust, AI-driven application by integrating powerful APIs and automation tools.',
          color: 'bg-yellow-orange',
          tools: ['LLM APIs', 'Lovable', 'n8n', 'Resend'],
          sortOrder: 4,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 5,
          weekName: 'Week 5',
          title: 'Production-Ready Vibe Coding',
          description: 'Turn your prototype into a production-ready application',
          learningOutcome: 'Master the challenges of taking a product from prototype to production.',
          color: 'bg-mint',
          tools: ['Claude Code', 'Best Practices'],
          sortOrder: 5,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: id(),
          courseId: 'vibe-coding',
          weekNumber: 6,
          weekName: 'Week 6',
          title: 'Launch & Demo Your Project',
          description: 'Ship your prototype and present to the cohort',
          learningOutcome: 'Deliver a polished, launch-ready product and reflect on all you\'ve learned!',
          color: 'bg-blue',
          tools: ['Presentation Tools'],
          sortOrder: 6,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ];

      // Use transact to write the data
      for (const week of syllabusWeeks) {
        await db.transact(
          db.tx.syllabus[week.id].update(week)
        );
      }
      
      setStatus('Success! Syllabus data has been seeded. Redirecting...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/syllabus');
      }, 2000);
      
    } catch (error) {
      console.error('Error seeding syllabus:', error);
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seed Vibe Coding Syllabus</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What this will do:</h2>
          <p className="text-gray-700 mb-4">
            This will create all 7 weeks of the Vibe Coding syllabus with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Week 0: Prepare Your PRD</li>
            <li>Week 1: AI Fundamentals</li>
            <li>Week 2: Vibe Coding Foundations + Sprint 1</li>
            <li>Week 3: Deep Dive with Claude Code</li>
            <li>Week 4: LLM APIs & Automation + Sprint 2</li>
            <li>Week 5: Production-Ready Vibe Coding</li>
            <li>Week 6: Launch & Demo Your Project</li>
          </ul>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This will create new syllabus entries. If entries already exist, 
              you should use the admin page to update them instead.
            </p>
          </div>
        </div>

        <button
          onClick={seedSyllabusData}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={status.includes('Seeding') || status.includes('Success')}
        >
          Seed Syllabus Data
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
          <Link href="/admin/syllabus" className="text-blue-600 hover:underline mr-4">
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