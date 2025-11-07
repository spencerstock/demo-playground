'use client';

import { DemoSettings } from '@/components/demo/DemoSettings';

export default function AuthConfirmPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Settings icon */}
        <div className="absolute top-20 right-6">
          <button className="p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Connected indicator */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          <span>Signed in as skyr.base.eth</span>
        </div>

        {/* Morpho Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
        </div>

        {/* Title and Message */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hello, skyr.base.eth!
          </h1>
          <p className="text-gray-600">
            You can trigger a standalone request from the demo settings panel
          </p>
        </div>
      </div>

      {/* Demo Settings */}
      <DemoSettings />
    </div>
  );
}

