'use client';

import { ColorSelector } from '@/components/demo/ColorSelector';
import { woodenChair, defaultBasePayConfig } from '@/lib/data/products';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BasePayConfig } from '@/lib/types';
import { BasePayButton } from '@base-org/account-ui/react';

export default function WoodenChairPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<BasePayConfig>(defaultBasePayConfig);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error' | 'cancelled'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  // Load config and status from URL
  useEffect(() => {
    const configParam = searchParams.get('config');
    const statusParam = searchParams.get('status');
    const txIdParam = searchParams.get('txId');
    
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse config:', error);
      }
    }

    // Handle return from payment flow
    if (statusParam === 'success' && txIdParam) {
      setPaymentStatus('success');
      setTransactionId(txIdParam);
      console.log('Payment successful!', txIdParam);
    } else if (statusParam === 'cancelled') {
      setPaymentStatus('cancelled');
      setErrorMessage('Payment cancelled by user');
    }
  }, [searchParams]);

  const handlePayment = () => {
    // Reset status
    setPaymentStatus('idle');
    setErrorMessage('');
    setTransactionId('');

    // Get viewMode from current URL or default to mobile
    const viewMode = searchParams.get('viewMode') || 'mobile';

    // Check if we need to collect payer info
    const enabledRequests = Object.entries(config.payerInfo.requests)
      .filter(([_, req]) => req.enabled);

    // Navigate to appropriate Base Pay flow page
    if (enabledRequests.length > 0) {
      router.push(`/demo/base-pay/info?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
    } else {
      router.push(`/demo/base-pay/confirm?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
    }
  };

  // Use config values for display
  const productName = config.product.name;
  const productSubtitle = config.product.subtitle;
  const productPrice = config.product.price;
  const productImage = config.product.imageUrl;
  const colorScheme = config.buttonStyle?.colorScheme || 'light';

  return (
    <MobileContentContainer viewMode="mobile" variant="default">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{productName}</h1>
        <p className={`text-gray-500 ${spacing.element.xs}`}>{productSubtitle}</p>
        <p className={`text-xl font-semibold text-gray-900 ${spacing.element.sm}`}>${productPrice}</p>
      </div>

      {/* Product Image */}
      <div className={spacing.section.md}>
        <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
          {productImage ? (
            <img 
              src={productImage} 
              alt={productName}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <svg className={`w-32 h-32 mx-auto ${spacing.element.lg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-sm">{productName}</div>
            </div>
          )}
        </div>
      </div>

      {/* Color Selector */}
      <div className={spacing.section.md}>
        <ColorSelector />
      </div>

      {/* Payment Status Messages */}
      {paymentStatus === 'success' && (
        <div className={`bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded ${spacing.section.md}`}>
          <p className="text-sm font-medium">Payment successful!</p>
          {transactionId && (
            <p className="text-xs mt-1 font-mono break-all">
              Transaction: {transactionId}
            </p>
          )}
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className={`bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded ${spacing.section.md}`}>
          <p className="text-sm font-medium">Payment failed</p>
          {errorMessage && (
            <p className="text-xs mt-1">{errorMessage}</p>
          )}
        </div>
      )}

      {paymentStatus === 'cancelled' && (
        <div className={`bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded ${spacing.section.md}`}>
          <p className="text-sm font-medium">Payment cancelled</p>
        </div>
      )}

      {/* Base Pay Button - Real SDK Button */}
      <div className={spacing.section.md}>
        <BasePayButton
          onClick={handlePayment}
          colorScheme={colorScheme}
        />
      </div>

      {/* Product Description */}
      <div className={spacing.section.md}>
        <p className="text-sm text-gray-600 leading-relaxed">
          {config.product.name === 'Wooden Chair' ? woodenChair.description : 'A great product for your needs.'}
        </p>
      </div>
    </MobileContentContainer>
  );
}

