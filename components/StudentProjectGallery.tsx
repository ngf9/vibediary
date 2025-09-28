'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  studentName: string;
  company?: string;
  projectName: string;
  tagline: string;
  description: string;
  keyAchievement: string;
  achievements?: string[];
  demoLink?: string;
  secondaryDemoLink?: string;
  technologies?: string[];
  background?: string;
  isYC?: boolean;
  isProductHunt?: boolean;
}

const projects: Project[] = [
  {
    id: 'paloma',
    studentName: 'Founder of Paloma',
    company: 'Y Combinator',
    projectName: 'Paloma',
    tagline: 'Built first product demo for YC application',
    description: 'Built first product demo for YC application and successfully got accepted into the program',
    keyAchievement: 'Accepted into Y Combinator',
    background: 'Non-technical founder',
    achievements: ['Accepted into Y Combinator', 'Built functional MVP']
  },
  {
    id: 'elevate-talk',
    studentName: 'Jev Topunov',
    company: 'Booking.com',
    projectName: 'Elevate Talk',
    tagline: 'AI role-play simulator that boosts sales skills',
    description: 'Built and launched Elevate Talk - an AI role-play simulator that boosts sales skills',
    keyAchievement: 'Deployed at Booking.com',
    demoLink: 'https://youtu.be/ePK7vgtoIbM?t=2905',
    technologies: ['LLMs', 'Voice AI', 'Web App'],
    background: 'Product Manager at Booking.com'
  },
  {
    id: 'ruffo-copilot',
    studentName: 'Luis Pellerano',
    company: 'Ruffo',
    projectName: 'WhatsApp Sales Copilot',
    tagline: 'Sales & customer success copilot integrated with WhatsApp',
    description: 'Created a sales & customer success copilot integrated with WhatsApp for real estate agents',
    keyAchievement: 'Automated real estate sales',
    technologies: ['WhatsApp API', 'LLMs', 'Automation']
  },
  {
    id: 'ruffo-tools',
    studentName: 'Francis & Laura',
    company: 'Ruffo',
    projectName: 'Contract Simplifier & Translator',
    tagline: 'Two internal tools for real estate operations',
    description: 'Built two internal tools for real estate operations: contract simplifier and translator',
    keyAchievement: 'Streamlined operations',
    demoLink: 'https://youtu.be/yfnofHmIOsI?t=1803',
    technologies: ['Document Processing', 'Translation API']
  },
  {
    id: 'i1-bot',
    studentName: 'Aliona Vozna',
    company: 'YouTeam',
    projectName: 'i1 Vetting Bot',
    tagline: 'AI bot for custom vetting processes',
    description: 'Shipped i1 - an AI bot that creates custom vetting processes for hiring contract software developers',
    keyAchievement: 'Revolutionized hiring process',
    technologies: ['Custom LLM', 'Hiring Automation'],
    background: 'With Yura Riphyak'
  },
  {
    id: 'gift-advisor',
    studentName: 'Lior Grossman',
    company: 'Openbase',
    projectName: 'Gift Advisor & Shopping Assistant',
    tagline: 'Two LLM-powered consumer apps',
    description: 'Launched two LLM-powered consumer apps: a gift advisor and shopping assistant on Product Hunt',
    keyAchievement: 'Launched on Product Hunt',
    demoLink: 'https://www.producthunt.com/products/dreamgift#dreamgift',
    secondaryDemoLink: 'https://www.producthunt.com/products/shop-wisely?launch=shop-wisely',
    technologies: ['Product Hunt Launch', 'Consumer AI']
  },
  {
    id: 'travelmaster',
    studentName: 'Peter Harrington',
    projectName: 'TravelMaster AI',
    tagline: 'ChatGPT-powered trip planning assistant',
    description: 'Built TravelMaster AI - a ChatGPT-powered trip planning assistant',
    keyAchievement: 'Full-stack AI app built',
    demoLink: 'https://youtu.be/ePK7vgtoIbM?t=510',
    technologies: ['ChatGPT API', 'Travel Planning']
  },
  {
    id: 'fda-intel',
    studentName: 'Bala Raja',
    company: 'Former Clip Health',
    projectName: 'FDA Intel',
    tagline: 'Semantic search + RAG for FDA.gov medtech guides',
    description: 'Built v1 of FDA Intel - a semantic search + RAG interface for FDA.gov medtech guides',
    keyAchievement: 'Simplified FDA research',
    technologies: ['RAG', 'Semantic Search', 'FDA Data']
  },
  {
    id: 'constructable',
    studentName: 'John Yoder & Molly Abbott',
    company: 'Constructable',
    projectName: 'Construction Doc Q&A',
    tagline: 'RAG Q&A for construction documents',
    description: 'Prototyped RAG Q&A feature using vector embeddings to analyze thousands of construction documents',
    keyAchievement: 'Processed 1000s of docs',
    technologies: ['Vector Embeddings', 'Document RAG']
  },
  {
    id: 'together-ai',
    studentName: 'Nathan Goldstein',
    company: 'Together Software',
    projectName: 'AI Mentoring Features',
    tagline: 'Personalized conversation suggestions and agenda generation',
    description: 'Prototyped two LLM features for mentoring software: personalized conversation suggestions and session agenda generation',
    keyAchievement: 'Enhanced mentoring platform',
    technologies: ['Conversation AI', 'Agenda Generation']
  },
  {
    id: 'exadel',
    studentName: 'Alexey Girzhadovich',
    company: 'Exadel',
    projectName: 'GenAI Strategy',
    tagline: 'Enterprise GenAI offering and marketing strategy',
    description: "Drafted Exadel's GenAI offering and marketing messaging strategy",
    keyAchievement: 'Deployed to 1500+ engineers',
    background: 'Chief Delivery Officer (1500+ engineers)'
  },
  {
    id: 'inspirations-app',
    studentName: 'Nicole Garcia Fischer',
    projectName: 'Inspirations App',
    tagline: 'Mobile app to track and understand what moves you',
    description: 'Built Inspirations App, a mobile app to track and understand what moves you (inclusive of an AI generated newsletter!)',
    keyAchievement: 'Launched mobile app with AI features',
    demoLink: 'https://www.inspirationsapp.com/home',
    technologies: ['Mobile App', 'AI Newsletter', 'Personal Analytics']
  }
];

export default function StudentProjectGallery() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Project List */}
      <div className="space-y-1">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                {/* Left Side - Project Details */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue transition-colors">
                      {project.projectName}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      {project.isYC && (
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">YC</span>
                      )}
                      {project.isProductHunt && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">PH</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.studentName}
                    {project.company && ` • ${project.company}`}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Right Side - Key Achievement */}
                <div className="flex flex-col lg:items-end gap-3 lg:text-right">
                  <div className="bg-gray-50 group-hover:bg-white px-4 py-2 rounded-lg inline-block">
                    <p className="font-medium text-gray-900">
                      {project.keyAchievement}
                    </p>
                  </div>
                  {project.demoLink && !project.secondaryDemoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-blue hover:text-blue/80 text-sm font-medium transition-colors"
                    >
                      View Demo
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.demoLink && project.secondaryDemoLink && (
                    <div className="flex flex-col gap-2 lg:items-end">
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-blue hover:text-blue/80 text-sm font-medium transition-colors"
                      >
                        View Gift Advisor
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={project.secondaryDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-blue hover:text-blue/80 text-sm font-medium transition-colors"
                      >
                        View Shopping Assistant
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}