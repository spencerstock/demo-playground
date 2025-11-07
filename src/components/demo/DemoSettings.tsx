'use client';

import { useState } from 'react';

export function DemoSettings() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700"
      >
        Demo settings
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4">
          <p className="text-sm text-gray-600">
            Configure demo settings and behavior here
          </p>
        </div>
      )}
    </div>
  );
}

