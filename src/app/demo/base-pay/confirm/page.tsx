'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { BasePayConfig } from '@/lib/types';
import { defaultBasePayConfig } from '@/lib/data/products';

export default function BasePayConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<BasePayConfig>(defaultBasePayConfig);
  const [isProcessing, setIsProcessing] = useState(false);

  const viewMode = searchParams.get('viewMode') || 'mobile';
  const mockAddress = '0xAB37...Fc50';
  const mockBalance = '7.09';

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

  const handlePayNow = () => {
    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      const mockTxId = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Navigate back to product page with success status
      router.push(
        `/demo/products/wooden-chair?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}&status=success&txId=${mockTxId}`
      );
    }, 1500);
  };

  const handleCancel = () => {
    // Navigate back to product page with cancel status
    router.push(
      `/demo/products/wooden-chair?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}&status=cancelled`
    );
  };

  const amount = config.product.price;
  const recipientAddress = config.payment.recipientAddress;

  // Format recipient address for display
  const displayRecipient = recipientAddress.includes('.')
    ? recipientAddress
    : `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`;

  // Connected indicator header
  const header = (
    <div className="flex items-center justify-between">
      <div className={`flex items-center ${spacing.gap.sm} text-sm text-gray-600`}>
        <div className="w-3 h-3 bg-blue-600 rounded-full" />
        <span>Signed in as {mockAddress}</span>
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

  // Action buttons footer with Base Pay branding
  const footer = (
    <div className="space-y-4">
      <div className={`flex ${spacing.gap.md}`}>
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayNow}
          className="flex-1 bg-black hover:bg-gray-900"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay now'}
        </Button>
      </div>

      {/* Base Pay branding */}
      <div className="flex items-center justify-center gap-1 pb-2">
        <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
        <span className="text-sm font-semibold text-gray-900">basepay</span>
      </div>
    </div>
  );

  return (
    <MobileContentContainer
      viewMode={viewMode as 'mobile' | 'desktop'}
      variant="default"
      showHeader={true}
      header={header}
      footer={footer}
    >
      <div className="flex flex-col items-center justify-center py-8">
        {/* Base Pay Icon */}
        <div className={spacing.section.md}>
          <ReactSVG
            src="/base-pay-logo.svg"
            beforeInjection={(svg) => {
              svg.setAttribute('width', '96');
              svg.setAttribute('height', '96');
              svg.querySelectorAll('path').forEach((path) => path.setAttribute('fill', '#2563eb'));
              svg
                .querySelectorAll('circle')
                .forEach((circle) => circle.setAttribute('stroke', '#2563eb'));
            }}
          />
        </div>

        {/* Payment Title */}
        <h1 className={`text-3xl font-bold text-gray-900 ${spacing.element.sm}`}>
          Pay {amount} USDC
        </h1>
        <p className={`text-gray-600 ${spacing.section.lg}`}>To {displayRecipient}</p>

        {/* Account Selection Box */}
        <div className={`w-full bg-gray-50 rounded-2xl p-4 ${spacing.section.md}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Pay with</div>
                <div className="text-sm font-semibold text-gray-900">{mockAddress}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{mockBalance} USDC</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Est. total */}
        <div className="w-full flex items-center justify-between py-4 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Est. total</span>
          <span className="text-lg font-semibold text-gray-900">{amount} USDC</span>
        </div>
      </div>
    </MobileContentContainer>
  );
}
