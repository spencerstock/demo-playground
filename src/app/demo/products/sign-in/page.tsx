'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';

export default function SignInProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { config } = useConfig();
  const [logoError, setLogoError] = useState(false);
  const viewMode = searchParams.get('viewMode') || 'mobile';

  const handleSignIn = () => {
    // Pass config and viewMode to auth page
    router.push(`/demo/auth?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
  };

  // Show authenticated state
  if (isAuthenticated && user) {
    return (
      <MobileContentContainer viewMode={viewMode as 'mobile' | 'desktop'} variant="centered">
        <div className="flex flex-col items-center justify-center">
          {/* App Logo */}
          <div className={spacing.section.lg}>
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

          {/* Greeting */}
          <div className="text-center max-w-sm">
            <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.lg}`}>
              Hello, {user.username}!
            </h1>
          </div>
        </div>
      </MobileContentContainer>
    );
  }

  // Show sign-in state
  return (
    <MobileContentContainer viewMode={viewMode as 'mobile' | 'desktop'} variant="centered">
      <div className="flex flex-col items-center justify-center relative">
        {/* Help link */}
        <div className="absolute -top-12 right-0">
          <Link href="#" className="text-blue-600 text-sm font-medium">
            Help
          </Link>
        </div>

        {/* Base Logo */}
        <div className={spacing.section.lg}>
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/base-logo-blue.svg"
              alt="Base"
              width={96}
              height={96}
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className={`text-center ${spacing.section.lg} max-w-sm`}>
          <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.md}`}>
            Sign in with Base
          </h1>
          <p className="text-gray-600">
            A fast and secure way to sign into apps and make payments onchain
          </p>
        </div>

        {/* Sign In Button - Using real SDK component */}
        <div className="w-full max-w-sm">
          <SignInWithBaseButton
            onClick={handleSignIn}
            variant="solid"
            colorScheme={config.theme || 'light'}
          />
        </div>
      </div>
    </MobileContentContainer>
  );
}

