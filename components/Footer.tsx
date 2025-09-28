'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-24 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-sm">
            Vibe Coded with Love, by the AI Education Company
          </p>
          <p className="text-gray-500 text-xs">
            &copy; 2025 AI Study Camp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}