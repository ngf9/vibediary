'use client';

import React, { useState } from 'react';
import FormModal from './FormModal';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  cohort: string;
  project: string;
}

export default function Testimonials() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "Tech Startup",
      quote: "I went from idea to MVP in just 6 weeks. The course gave me the confidence to build my own tools without waiting for engineering resources.",
      cohort: "Spring 2024",
      project: "AI Customer Support Bot"
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Director",
      company: "SaaS Company",
      quote: "This course transformed how I approach marketing campaigns. I can now prototype and test ideas independently using AI tools.",
      cohort: "Fall 2023",
      project: "Automated Content Generator"
    },
    {
      name: "Emma Rodriguez",
      role: "Operations Manager",
      company: "E-commerce",
      quote: "The hands-on approach and weekly sprints made learning fun and practical. I built real applications that I still use daily.",
      cohort: "Spring 2024",
      project: "Inventory Management System"
    }
  ];

  return (
    <div className="space-y-8 p-12">
      <h1 className="text-5xl font-bold mb-8">What Our Students Say</h1>
      
      <div className="grid gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
                <p className="text-sm text-gray-400 mt-1">{testimonial.cohort} Cohort</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-mint font-medium">Built:</p>
                <p className="text-sm text-gray-600">{testimonial.project}</p>
              </div>
            </div>
            
            <blockquote className="text-lg text-gray-700 italic leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-gradient-to-r from-coral via-yellow-orange to-mint rounded-3xl text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Join Our Next Cohort</h3>
        <p className="text-lg mb-6 opacity-90">
          Transform your career with the skills to build real products using AI
        </p>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-8 py-3 bg-white text-coral font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
          Apply Now
        </button>
      </div>
      
      {/* Form Modal */}
      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}