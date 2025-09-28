'use client';

import React, { useState } from 'react';

interface Week {
  week: string;
  weekNumber: string;
  title: string;
  description: string;
  goal: string;
  color: string;
  tools?: string[];
}

export default function CollapsibleSyllabus() {
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const weeks: Week[] = [
    {
      week: 'Week 0',
      weekNumber: '0',
      title: 'Prepare Your PRD',
      description: 'Kickstart your journey by defining and scoping your project. You\'ll craft a Product Requirements Document (PRD), leveraging an AI assistant to refine the technical language and approach, which is the cornerstone of any successful project. Get ready to give a 2-min pitch of your project during our cohort Intro call!',
      goal: 'Develop a solid project brief and gain a foundational understanding of how to translate creative concepts into technical specs.',
      color: 'bg-yellow-orange',
      tools: ['PRD Template']
    },
    {
      week: 'Week 1',
      weekNumber: '1',
      title: 'AI Fundamentals',
      description: 'Before we get tactical, we\'ll develop a theoretical foundation of Large Language Models (LLMs): what\'s their architecture, how do they work, what\'s the evolution of base to agents to reasoning models? This week\'s focus will be on core AI concepts, from tokens to context windows and agentic behavior. You\'ll read cutting-edge research papers and geek out on how LLMs are trained.',
      goal: 'Gain a conceptual and theoretical grasp of LLMs and AI, learn the baseline vocabulary.',
      color: 'bg-mint',
      tools: ['OpenAI Playground']
    },
    {
      week: 'Week 2',
      weekNumber: '2',
      title: 'Vibe Coding Foundations + Sprint 1',
      description: 'You\'ll set up your development environment, learning the essentials of VS Code, GitHub, and Claude Code to start building your first product—a simple, functional web-based to-do app. By the end of this week, you\'ll have completed Sprint 1 and have hands-on experience using tools that will become your foundation for future projects.',
      goal: 'Build and deploy your first web-based app while becoming comfortable with essential development tools and processes.',
      color: 'bg-blue',
      tools: ['VS Code', 'GitHub', 'Claude Code', 'Instant DB', 'Vercel']
    },
    {
      week: 'Week 3',
      weekNumber: '3',
      title: 'Deep Dive with Claude Code',
      description: 'This week is all about getting deep with Claude Code—an AI-powered platform that empowers you to build and control your projects. You\'ll experiment with the tool and use it to build your project, learning best practices to bring your project to life. The goal is to push your limits with practical, hands-on experimentation.',
      goal: 'Deepen your expertise with Claude Code, begin building your project using Claude Code.',
      color: 'bg-coral',
      tools: ['Claude Code']
    },
    {
      week: 'Week 4',
      weekNumber: '4',
      title: 'Integrating LLM APIs & Automation + Sprint 2',
      description: 'Integrate LLM APIs and learn automation with tools like n8n and Resend. You\'ll apply your newfound skills to create a real-world, AI-powered newsletter bot, incorporating Lovable for the frontend and Supabase for backend functionality and automation. This week focuses on understanding the power of API integrations and automating workflows to streamline your development process.',
      goal: 'Build a robust, AI-driven application by integrating powerful APIs and automation tools, elevating your projects to the next level.',
      color: 'bg-yellow-orange',
      tools: ['LLM APIs', 'Claude Code', 'Lovable', 'n8n', 'Resend']
    },
    {
      week: 'Week 5',
      weekNumber: '5',
      title: 'Production-Ready Vibe Coding',
      description: 'As you refine your project, this week focuses on turning your prototype into a production-ready application. You\'ll think through real-world challenges such as security, technical debt, and best practices for scalability. By the end of the week, you\'ll be prepared to launch your product.',
      goal: 'Master the challenges of taking a product from prototype to production, with an emphasis on scalability, security, and refinement.',
      color: 'bg-mint',
      tools: ['Claude Code']
    },
    {
      week: 'Week 6',
      weekNumber: '6',
      title: 'Launch & Demo Your Project',
      description: 'In the final week, you\'ll ship your prototype. You\'ll present your work to your cohort mates and celebrate all you\'ve learned. You\'ll also develop a video, case study, or one-pager on your experience that you can share with the world.',
      goal: 'Deliver a polished, launch-ready product and reflect on all you\'ve learned!',
      color: 'bg-blue'
    }
  ];

  const toggleWeek = (week: string) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {weeks.map((weekData) => (
          <div 
            key={weekData.week}
            className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
              expandedWeek === weekData.week ? 'shadow-lg' : ''
            }`}
          >
            <button
              onClick={() => toggleWeek(weekData.week)}
              className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-8">
                {/* Week Number Circle with Subtle Glow */}
                <div className="relative">
                  <div className={`w-16 h-16 ${weekData.color} rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-md relative z-10`}>
                    {weekData.weekNumber}
                  </div>
                  <div className={`absolute inset-0 ${weekData.color} rounded-full opacity-20 blur-xl scale-150`} />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{weekData.week}</p>
                  <h4 className="text-2xl font-semibold text-gray-900">{weekData.title}</h4>
                </div>
              </div>
              <svg 
                className={`w-6 h-6 text-gray-400 transition-transform ${expandedWeek === weekData.week ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedWeek === weekData.week && (
              <div className="bg-gray-50">
                <div className="px-8 py-8 space-y-8">
                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed text-lg">{weekData.description}</p>
                  
                  {/* Goal Section with Better Design */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${weekData.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Learning Outcome</h5>
                        <p className="text-gray-900 text-base leading-relaxed">{weekData.goal}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools Section with Better Pills */}
                  {weekData.tools && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tools You&apos;ll Use</h5>
                      <div className="flex flex-wrap gap-3">
                        {weekData.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}