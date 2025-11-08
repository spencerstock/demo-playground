'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { BasePayConfig } from '@/lib/types';
import { defaultBasePayConfig } from '@/lib/data/products';

export default function BasePayInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<BasePayConfig>(defaultBasePayConfig);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const viewMode = searchParams.get('viewMode') || 'mobile';
  const mockAddress = '0xAB37...Fc50';

  // Load config from URL
  useEffect(() => {
    const configParam = searchParams.get('config');
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse config:', error);
      }
    }
  }, [searchParams]);

  // Mock payer info data
  const payerInfo = {
    name: 'Spencer Stock',
    email: 'spencerstock@gmail.com',
    phoneNumber: '+13858001070',
    physicalAddress: '123 Main St, New York, NY 10001',
    onchainAddress: mockAddress,
  };

  // Build requests from config
  const enabledRequests = Object.entries(config.payerInfo.requests)
    .filter(([_, req]) => req.enabled)
    .map(([type, req]) => ({ 
      type, 
      optional: req.optional 
    }));

  const requiredRequests = enabledRequests.filter(r => !r.optional);
  const optionalRequests = enabledRequests.filter(r => r.optional);

  const handleContinue = () => {
    router.push(`/demo/base-pay/confirm?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setIsScrolledToBottom(isAtBottom);
  };

  const getFieldLabel = (type: string) => {
    switch (type) {
      case 'email': return 'Email address';
      case 'name': return 'Name';
      case 'phoneNumber': return 'Phone number';
      case 'physicalAddress': return 'Physical address';
      case 'onchainAddress': return 'Onchain address';
      default: return type;
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'name':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      case 'phoneNumber':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        );
      case 'onchainAddress':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Connected indicator header
  const header = (
    <div className="flex items-center justify-between">
      <div className={`flex items-center ${spacing.gap.sm} text-sm text-gray-600`}>
        <div className="w-3 h-3 bg-blue-600 rounded-full" />
        <span>Signed in as {mockAddress}</span>
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
        onClick={handleContinue}
        disabled={!isScrolledToBottom && (requiredRequests.length + optionalRequests.length) > 3}
        className="flex-1"
      >
        {!isScrolledToBottom && (requiredRequests.length + optionalRequests.length) > 3 ? 'Scroll to continue' : 'Continue'}
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
      <div onScroll={handleScroll}>
        {/* Title */}
        <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.sm}`}>
          Share information
        </h1>
        
        {/* Description */}
        <p className={`text-gray-600 ${spacing.section.lg}`}>
          This information will be shared directly with{' '}
          <a href="#" className="text-blue-600 underline">https://base.github.io</a>{' '}
          and be subject to their own privacy policies.
        </p>

        {/* Required Information */}
        {requiredRequests.length > 0 && (
          <div className={spacing.section.lg}>
            <h2 className={`text-lg font-semibold text-gray-900 ${spacing.element.lg}`}>
              Required information
            </h2>
            <div className="space-y-3">
              {requiredRequests.map((request) => (
                <div key={request.type} className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="text-gray-700">
                    {getFieldIcon(request.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{getFieldLabel(request.type)}</div>
                    <div className="text-sm text-gray-600">
                      {payerInfo[request.type as keyof typeof payerInfo] || 'Not provided'}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Information */}
        {optionalRequests.length > 0 && (
          <div className={spacing.section.lg}>
            <h2 className={`text-lg font-semibold text-gray-900 ${spacing.element.lg}`}>
              Optional information
            </h2>
            <div className="space-y-3">
              {optionalRequests.map((request) => (
                <div key={request.type} className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-gray-700 rounded-sm">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{getFieldLabel(request.type)}</div>
                    <div className="text-sm text-gray-600">
                      {payerInfo[request.type as keyof typeof payerInfo] || 'Not provided'}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extra space for scrolling */}
        <div className="h-20"></div>
      </div>
    </MobileContentContainer>
  );
}

