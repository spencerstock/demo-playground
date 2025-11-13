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
          {/* Content area */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
