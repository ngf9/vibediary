'use client';

import React, { useState } from 'react';

interface Week {
  week: string;
  title: string;
  description: string;
  goal: string;
  color: string;
  icon: string;
  tools?: string[];
}

export default function InteractiveTimeline() {
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  
  const weeks: Week[] = [
    { 
      week: 'Week 0', 
      title: 'Prepare Your PRD', 
      description: 'Kickstart your journey by defining and scoping your project. You\'ll craft a Product Requirements Document (PRD), leveraging an AI assistant to refine the technical language and approach, which is the cornerstone of any successful project. Get ready to give a 2-min pitch of your project during our cohort Intro call!',
      goal: 'Develop a solid project brief and gain a foundational understanding of how to translate creative concepts into technical specs.',
      color: 'bg-yellow-orange',
      icon: '',
      tools: ['Claude', 'Notion']
    },
    { 
      week: 'Week 1', 
      title: 'AI Fundamentals', 
      description: 'Before we get tactical, we\'ll develop a theoretical foundation of Large Language Models (LLMs): what\'s their architecture, how do they work, what\'s the evolution of base to agents to reasoning models? This week\'s focus will be on core AI concepts, from tokens to context windows and agentic behavior. You\'ll read cutting-edge research papers and geek out on how LLMs are trained.',
      goal: 'Gain a conceptual and theoretical grasp of LLMs and AI, learn the baseline vocabulary.',
      color: 'bg-mint',
      icon: '',
      tools: ['Research Papers', 'Claude']
    },
    { 
      week: 'Week 2', 
      title: 'Vibe Coding Foundations + Sprint 1', 
      description: 'You\'ll set up your development environment, learning the essentials of VS Code, GitHub, and Claude Code to start building your first product—a simple, functional web-based to-do app. By the end of this week, you\'ll have completed Sprint 1 and have hands-on experience using tools that will become your foundation for future projects.',
      goal: 'Build and deploy your first web-based app while becoming comfortable with essential development tools and processes.',
      color: 'bg-blue',
      icon: '',
      tools: ['VS Code', 'GitHub', 'Claude Code']
    },
    { 
      week: 'Week 3', 
      title: 'Deep Dive with Claude Code', 
      description: 'This week is all about getting deep with Claude Code—an AI-powered platform that empowers you to build and control your projects. You\'ll experiment with the tool and use it to build your project, learning best practices to bring your project to life. The goal is to push your limits with practical, hands-on experimentation.',
      goal: 'Deepen your expertise with Claude Code, begin building your project using Claude Code.',
      color: 'bg-coral',
      icon: '',
      tools: ['Claude Code']
    },
    { 
      week: 'Week 4', 
      title: 'Integrating LLM APIs & Automation', 
      description: 'Integrate LLM APIs and learn automation with tools like n8n and Resend. You\'ll apply your newfound skills to create a real-world, AI-powered newsletter bot, incorporating Lovable for the frontend and Supabase for backend functionality and automation. This week focuses on understanding the power of API integrations and automating workflows to streamline your development process.',
      goal: 'Build a robust, AI-driven application by integrating powerful APIs and automation tools, elevating your projects to the next level.',
      color: 'bg-yellow-orange',
      icon: '',
      tools: ['n8n', 'Resend', 'Lovable', 'Supabase']
    },
    { 
      week: 'Week 5', 
      title: 'Production-Ready Vibe Coding', 
      description: 'As you refine your project, this week focuses on turning your prototype into a production-ready application. You\'ll think through real-world challenges such as security, technical debt, and best practices for scalability. By the end of the week, you\'ll be prepared to launch your product.',
      goal: 'Master the challenges of taking a product from prototype to production, with an emphasis on scalability, security, and refinement.',
      color: 'bg-mint',
      icon: '',
      tools: ['Vercel', 'GitHub Actions']
    },
    { 
      week: 'Week 6', 
      title: 'Launch and Demo', 
      description: 'In the final week, you\'ll ship your prototype. You\'ll present your work to your cohort mates and celebrate all you\'ve learned. You\'ll also develop a video, case study, or one-pager on your experience that you can share with the world.',
      goal: 'Deliver a polished, launch-ready product and reflect on all you\'ve learned!',
      color: 'bg-blue',
      icon: '',
      tools: ['Loom', 'Canva']
    }
  ];

  return (
    <div className="space-y-2">
      {/* Week Sections */}
      <div className="space-y-2">
          {weeks.map((week) => {
            const isExpanded = expandedWeek === week.week;
            
            return (
              <div
                key={week.week}
                className="border border-gray-200 rounded-xl overflow-hidden hover_border-gray-300 transition-colors"
              >
                {/* Week Header */}
                <div
                  className="p-6 cursor-pointer bg-gray-50 hover_bg-gray-100 transition-colors"
                  onClick={() => {
                    setExpandedWeek(expandedWeek === week.week ? null : week.week);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Week Number Circle */}
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-lg">
                        {week.week.split(' ')[1]}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {week.title}
                        </h3>
                      </div>
                    </div>
                    
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {week.description}
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Goal</h4>
                      <p className="text-gray-600">
                        {week.goal}
                      </p>
                    </div>
                    
                    {week.tools && week.tools.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tools You&apos;ll Use</h4>
                        <div className="flex flex-wrap gap-2">
                          {week.tools.map((tool, i) => (
                            <span 
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}