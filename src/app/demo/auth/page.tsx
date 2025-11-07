'use client';

import { useRouter } from 'next/navigation';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { DemoSettings } from '@/components/demo/DemoSettings';

export default function AuthPage() {
  const router = useRouter();

  const handleSignIn = () => {
    // Navigate to confirmation page
    router.push('/demo/auth/confirm');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Modal Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          {/* Morpho Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Sign into Morpho
          </h2>

          {/* Sign In Button */}
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

