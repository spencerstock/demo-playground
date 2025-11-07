'use client';

import Link from 'next/link';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { DemoSettings } from '@/components/demo/DemoSettings';

export default function SignInProductPage() {
  const handleSignIn = () => {
    console.log('Sign in clicked');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Help link */}
        <div className="absolute top-20 right-6">
          <Link href="#" className="text-blue-600 text-sm font-medium">
            Help
          </Link>
        </div>

        {/* Base Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#0000FF] rounded-2xl" />
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8 max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Sign in with Base
          </h1>
          <p className="text-gray-600">
            A fast and secure way to sign into apps and make payments onchain
          </p>
        </div>

        {/* Sign In Button */}
        <div className="w-full max-w-sm">
          <SignInWithBaseButton
            onClick={handleSignIn}
            variant="solid"
            colorScheme="light"
          />
        </div>
      </div>

      {/* Demo Settings */}
      <DemoSettings />
    </div>
  );
}

