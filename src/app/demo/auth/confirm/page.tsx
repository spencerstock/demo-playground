'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const { config } = useConfig();
  const [logoError, setLogoError] = useState(false);
  const viewMode = searchParams.get('viewMode') || 'mobile';

  const handleConfirm = () => {
    // Sign in the user
    signIn({
      username: 'skyr.base.eth',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    });
    
    // Check if we need to show permissions
    if (config.requests.spendPermission?.enabled) {
      router.push(`/demo/auth/permissions?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
    } else {
      // Go directly to authenticated state
      router.push(`/demo/products/sign-in?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Connected indicator header
  const header = (
    <div className="flex items-center justify-between">
      <div className={`flex items-center ${spacing.gap.sm} text-sm text-gray-600`}>
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
  );

  // Action buttons footer
  const footer = (
    <div className={`flex ${spacing.gap.md}`}>
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
  );

  return (
    <MobileContentContainer 
      viewMode={viewMode as 'mobile' | 'desktop'} 
      variant="scrollable"
      showHeader={true}
      header={header}
      footer={footer}
    >
      {/* App Logo */}
      <div className={`flex justify-center ${spacing.section.md}`}>
        <div className="relative w-16 h-16">
          {config.formAppearance.logoUrl && !logoError ? (
            <Image
              key={config.formAppearance.logoUrl}
              src={
                config.formAppearance.logoUrl.startsWith('http://') || config.formAppearance.logoUrl.startsWith('https://') 
                  ? config.formAppearance.logoUrl 
                  : `https://${config.formAppearance.logoUrl}/favicon.ico`
              }
              alt={config.formAppearance.appName || 'App Logo'}
              width={64}
              height={64}
              className="rounded-2xl object-contain"
              unoptimized
              onError={() => setLogoError(true)}
            />
          ) : (
            <Image
              src="/base-logo-blue.svg"
              alt="Base Logo"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.sm} text-left`}>
        {config.formAppearance.appName ? `Sign into ${config.formAppearance.appName}` : 'Sign in with Base'}
      </h1>
      
      {/* Description */}
      <p className={`text-gray-600 ${spacing.section.lg} text-left`}>
        By continuing, you allow {config.formAppearance.appName || 'this app'} to:
      </p>

      {/* Permission Details */}
      <div className={spacing.section.lg}>
        {config.capabilities.signInWithEthereum && (
          <div className={`flex items-start ${spacing.gap.md} ${spacing.element.lg}`}>
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                See your onchain address, balance and activity.
              </p>
            </div>
          </div>
        )}

        {config.requests.appAccount?.enabled && (
          <div className={`flex items-start ${spacing.gap.md} ${spacing.element.lg}`}>
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Create a dedicated app account for your use with {config.formAppearance.appName}.
              </p>
            </div>
          </div>
        )}
      </div>
    </MobileContentContainer>
  );
}
