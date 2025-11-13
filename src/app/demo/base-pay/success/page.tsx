'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { BasePayConfig } from '@/lib/types';
import { defaultBasePayConfig } from '@/lib/data/products';

export default function BasePaySuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<BasePayConfig>(defaultBasePayConfig);

  const viewMode = searchParams.get('viewMode') || 'mobile';
  const txId = searchParams.get('txId') || '0x...';

  // Load config from URL
  useEffect(() => {
    const configParam = searchParams.get('config');
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse config:', error);
      }
    }
  }, [searchParams]);

  const handleDone = () => {
    // Navigate back to product page
    router.push(
      `/demo/products/wooden-chair?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`
    );
  };

  const amount = config?.product?.price || '0';

  // Format transaction ID for display
  const displayTxId = txId.length > 12 ? `${txId.slice(0, 6)}...${txId.slice(-4)}` : txId;

  return (
    <MobileContentContainer viewMode={viewMode as 'mobile' | 'desktop'} variant="centered">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className={`${spacing.section.lg}`}>
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className={`text-3xl font-bold text-gray-900 ${spacing.element.md}`}>
          Payment Successful!
        </h1>
        <p className={`text-lg text-gray-600 ${spacing.section.md}`}>
          Your payment of <span className="font-semibold">${amount} USDC</span> has been processed
        </p>

        {/* Transaction Details */}
        <div className={`w-full bg-gray-50 rounded-2xl p-6 ${spacing.section.lg}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-semibold text-gray-900">${amount} USDC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <span className="text-sm font-mono text-gray-900">{displayTxId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-semibold text-green-600">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full">
          <Button onClick={handleDone} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </MobileContentContainer>
  );
}
