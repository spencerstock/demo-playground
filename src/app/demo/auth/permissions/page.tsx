'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';

export default function PermissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { config } = useConfig();
  const viewMode = searchParams.get('viewMode') || 'mobile';
  const spendPermission = 'requests' in config ? config.requests.spendPermission : undefined;

  const handleConfirm = () => {
    // Navigate back to the sign-in page showing authenticated state
    router.push(
      `/demo/products/sign-in?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (!spendPermission?.enabled) {
    // If spend permission is not enabled, redirect
    router.push(
      `/demo/products/sign-in?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`
    );
    return null;
  }

  // Connected indicator header
  const header = (
    <div className="flex items-center justify-between">
      <div className={`flex items-center ${spacing.gap.sm} text-sm text-gray-600`}>
        <div className="w-3 h-3 bg-blue-600 rounded-full" />
        <span>Signed in as {user?.username || 'skyr.base.eth'}</span>
      </div>
      <button className="p-2 text-gray-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );

  // Action buttons footer
  const footer = (
    <div className={`flex ${spacing.gap.md}`}>
      <Button variant="secondary" onClick={handleCancel} className="flex-1">
        Cancel
      </Button>
      <Button onClick={handleConfirm} className="flex-1">
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
      {/* Title */}
      <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.sm}`}>
        Allow spend permission
      </h1>

      {/* Description */}
      <p className={`text-gray-600 ${spacing.section.lg}`}>
        By continuing, you allow{' '}
        {('formAppearance' in config && config.formAppearance.appName) || 'this app'} to:
      </p>

      {/* Permission Details */}
      <div className={`${spacing.section.lg} p-4 bg-gray-50 rounded-lg space-y-3`}>
        <div className={`flex items-start ${spacing.gap.md}`}>
          <svg
            className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-900 font-medium">
              Transfer up to {spendPermission.allowance} ETH{' '}
              {spendPermission.frequency.toLowerCase()}, until revoked.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Manage your spend permissions in account settings.{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Learn more.
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Settings Display */}
      <div className={`space-y-4 ${spacing.section.lg}`}>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Allowance (ETH)</span>
          <span className="font-medium text-gray-900">{spendPermission.allowance}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Frequency</span>
          <span className="font-medium text-gray-900">{spendPermission.frequency}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Ends</span>
          <span className="font-medium text-gray-900">{spendPermission.ends}</span>
        </div>
      </div>
    </MobileContentContainer>
  );
}
