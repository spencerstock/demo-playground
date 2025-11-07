'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { DemoSettings } from '@/components/demo/DemoSettings';

export default function PermissionsPage() {
  const router = useRouter();
  const [allowance] = useState('0.01');
  const [frequency] = useState('Daily');
  const [ends] = useState('Never');

  const handleConfirm = () => {
    router.push('/demo/auth/confirm');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        {/* Connected indicator */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span>Signed in as skyr.base.eth</span>
          </div>
          <button className="p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Morpho Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Allow spend permission
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            By continuing, you allow Morpho to:
          </p>

          {/* Permission Details */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  Transfer up to {allowance} ETH a day, until revoked.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your spend permissions in account settings.{' '}
                  <a href="#" className="text-blue-600 hover:underline">Learn more.</a>
                </p>
              </div>
            </div>
          </div>

          {/* Settings Display */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Allowance (ETH)</span>
              <span className="font-medium text-gray-900">{allowance}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Frequency</span>
              <span className="font-medium text-gray-900">{frequency}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Ends</span>
              <span className="font-medium text-gray-900">{ends}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Settings */}
      <DemoSettings />
    </div>
  );
}

