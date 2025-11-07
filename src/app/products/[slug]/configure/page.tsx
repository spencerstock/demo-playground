'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobilePreview } from '@/components/builder/MobilePreview';
import { FormAppearanceSection } from '@/components/builder/FormAppearanceSection';
import { CapabilitiesSection } from '@/components/builder/CapabilitiesSection';
import { RequestsSection } from '@/components/builder/RequestsSection';
import { ConfigProvider } from '@/lib/contexts/ConfigContext';

function ConfigurePageContent() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">
              <Image 
                src="/export-logo.png" 
                alt=""
                width={16}
                height={16}
                className="mr-2 inline"
              />
              Share preview
            </Button>
            <Button>
              Start building
              <svg className="ml-2 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel - Configuration */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="p-8">
            <div className="mb-8">
              <Link href="/" className="flex items-center gap-2 text-[15px] font-medium text-gray-900 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Sign in with Base
              </Link>
              <p className="text-sm text-gray-500 mt-1 ml-6">Sign in form</p>
            </div>

            <div className="space-y-8">
              <FormAppearanceSection />
              <div className="border-t border-gray-200 pt-8">
                <CapabilitiesSection />
              </div>
              <div className="border-t border-gray-200 pt-8">
                <RequestsSection />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="p-8">
            {/* Tab buttons */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-5 py-2 rounded-lg text-[15px] font-medium transition-all duration-150 ${
                  activeTab === 'preview' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-5 py-2 rounded-lg text-[15px] font-medium transition-all duration-150 ${
                  activeTab === 'code' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Code
              </button>
            </div>

            {activeTab === 'preview' && (
              <MobilePreview>
                <iframe
                  src="/demo/products/sign-in"
                  className="w-full h-full border-0"
                  title="Preview"
                />
              </MobilePreview>
            )}

            {activeTab === 'code' && (
              <div className="bg-[#1a1a1a] text-gray-100 p-6 rounded-xl">
                <pre className="text-[13px] leading-relaxed overflow-x-auto font-mono">
                  <code>{`import { SignInWithBaseButton } from '@base-org/account-ui/react';

function App() {
  return (
    <SignInWithBaseButton 
      onClick={() => console.log('Sign in')}
      variant="solid"
      colorScheme="light"
    />
  );
}`}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <ConfigProvider>
      <ConfigurePageContent />
    </ConfigProvider>
  );
}

