'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function PricingPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <Navigation />
      
      {/* Main Content - Blank for now */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}