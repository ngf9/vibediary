'use client';

import React from 'react';
import TestimonialCarousel from './TestimonialCarousel';
import LogoCarousel from './LogoCarousel';

export default function TestimonialsSection() {
  return (
    <section className="w-full pt-20 pb-20 px-8 relative" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-800">
          ... most important, we have happy students
        </h2>
        <div className="mb-8">
          <TestimonialCarousel />
        </div>

        {/* Logo Carousel Section */}
        <div className="mt-12">
          <p className="text-center text-gray-600 mb-8">
            Our students work at leading companies
          </p>
          <LogoCarousel />
        </div>
      </div>
    </section>
  );
}