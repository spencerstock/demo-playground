'use client';

import { ReactNode } from 'react';

interface MobilePreviewProps {
  children: ReactNode;
  viewMode?: 'mobile' | 'desktop';
}

export function MobilePreview({ children, viewMode = 'mobile' }: MobilePreviewProps) {
  if (viewMode === 'desktop') {
    return (
      <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[600px]">
        {/* Desktop content - full width container for iframe */}
        <div className="w-full max-w-4xl" style={{ height: '650px' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[600px]">
      <div className="relative">
        {/* Mobile frame */}
        <div className="w-[375px] h-[812px] bg-white rounded-[2.75rem] shadow-2xl border-[12px] border-gray-900 overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="bg-white px-6 pt-2 pb-1 flex items-center justify-between text-xs">
            <span className="font-semibold">3:18</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg className="w-6 h-3" fill="currentColor" viewBox="0 0 24 12">
                <rect
                  x="1"
                  y="1"
                  width="18"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <rect x="20" y="4" width="2" height="4" rx="1" />
              </svg>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
