'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TeamMemberCardProps {
  name: string;
  role: string;
  funFacts: string[];
  favoriteResource: string;
  officeHours: string;
  bio?: string;
  mentorshipPhilosophy?: string;
  image?: string;
}

export default function TeamMemberCard({
  name,
  role,
  funFacts,
  favoriteResource,
  officeHours,
  bio = "Passionate about making AI accessible to everyone. Believes in learning by building and the power of community-driven education.",
  mentorshipPhilosophy = "Every debugging session is a learning opportunity. I'm here to help you think through problems, not just solve them for you.",
  image
}: TeamMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-md relative">
      {/* Social Media Icons */}
      <div className="absolute top-4 right-4 flex gap-3 z-10">
        {/* LinkedIn */}
        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue hover:text-white text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        {/* GitHub */}
        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        {/* Twitter */}
        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue hover:text-white text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        {/* Substack */}
        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-yellow-orange hover:text-white text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
          </svg>
        </a>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar with shadow */}
              <div className="relative w-16 h-16 rounded-full shadow-lg overflow-hidden">
                {image ? (
                  <Image 
                    src={image} 
                    alt={name} 
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white text-2xl font-semibold">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{name}</h3>
                {/* Thin accent line under name */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-orange to-transparent mt-1 mb-2"></div>
                <p className="text-gray-600">{role}</p>
              </div>
            </div>
            
            {/* Outlined pill badges */}
            <div className="flex flex-wrap gap-3 mt-4">
              {funFacts.map((fact, index) => (
                <span
                  key={index}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-full text-sm hover:border-yellow-orange hover:text-yellow-orange hover:bg-yellow-orange hover:bg-opacity-5 transition-all duration-200 cursor-pointer"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
          
          <svg 
            className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t-2 border-gray-100">
          <div className="px-12 pt-16 pb-10 space-y-8">
            {/* Bio section */}
            <div className="max-w-4xl">
              <p className="text-gray-700 text-lg leading-relaxed">{bio}</p>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Favorite Resource */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow" style={{border: '2px solid #5433FF'}}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(84, 51, 255, 0.1)' }}>
                    <svg className="w-8 h-8" fill="#5433FF" viewBox="0 0 24 24">
                      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Favorite AI Resource</h4>
                    <p className="text-gray-900 text-lg">{favoriteResource}</p>
                  </div>
                </div>
              </div>
              
              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow" style={{border: '2px solid #FFB343'}}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 179, 67, 0.1)' }}>
                    <svg className="w-8 h-8" fill="#FFB343" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Something I Vibe Coded</h4>
                    <p className="text-gray-900 text-lg">{officeHours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mentorship Philosophy - more prominent */}
            <div className="rounded-2xl p-10 pb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Life Perspective</h4>
              <p className="text-gray-700 italic font-serif text-xl leading-loose">
                &ldquo;{mentorshipPhilosophy}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}