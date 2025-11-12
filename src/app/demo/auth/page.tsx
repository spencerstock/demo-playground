'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { useSDK } from '@/lib/contexts/SDKContext';
import { spacing } from '@/components/demo/MobileContentContainer';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useConfig();
  
  const [logoError, setLogoError] = useState(false);
  const viewMode = searchParams.get('viewMode') || 'mobile';


  const handleSignIn = () => {
    // Navigate to confirmation page with config and viewMode
    router.push(
      `/demo/auth/confirm?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`
    );
  };
  
  
  


  return (
    <div
      className={`min-h-screen flex flex-col ${viewMode === 'mobile' ? 'bg-gray-100' : 'bg-transparent'}`}
    >
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Modal Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          {/* App Logo */}
          <div className={`flex justify-center ${spacing.section.md}`}>
            <div className="relative w-16 h-16">
              {'formAppearance' in config && config.formAppearance.logoUrl && !logoError ? (
                <Image
                  key={config.formAppearance.logoUrl}
                  src={
                    config.formAppearance.logoUrl.startsWith('http://') ||
                    config.formAppearance.logoUrl.startsWith('https://')
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
          <h2 className={`text-2xl font-bold text-center text-gray-900 ${spacing.section.lg}`}>
            {'formAppearance' in config && config.formAppearance.appName
              ? `Sign into ${config.formAppearance.appName}`
              : 'Sign in with Base'}
          </h2>

          {/* Sign In Button */}
          <SignInWithBaseButton
            onClick={handleSignIn}
            variant="solid"
            colorScheme={config.theme || 'light'}
          />
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <AuthPageContent />
    </Suspense>
  );
}
