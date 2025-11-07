'use client';

import { ColorSelector } from '@/components/demo/ColorSelector';
import { BasePayButton } from '@base-org/account-ui/react';
import { woodenChair } from '@/lib/data/products';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';

export default function WoodenChairPage() {
  const { config } = useConfig();
  const handlePayment = () => {
    console.log('Payment initiated');
  };

  return (
    <MobileContentContainer viewMode="mobile" variant="default">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{woodenChair.name}</h1>
        <p className={`text-gray-500 ${spacing.element.xs}`}>{woodenChair.subtitle}</p>
        <p className={`text-xl font-semibold text-gray-900 ${spacing.element.sm}`}>${woodenChair.price}</p>
      </div>

      {/* Product Image */}
      <div className={spacing.section.md}>
        <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className={`w-32 h-32 mx-auto ${spacing.element.lg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-sm">Blue wooden chair</div>
          </div>
        </div>
      </div>

      {/* Color Selector */}
      <div className={spacing.section.md}>
        <ColorSelector />
      </div>

      {/* Base Pay Button */}
      <div className={spacing.section.md}>
        <BasePayButton 
          onClick={handlePayment}
          colorScheme={config.theme || 'light'}
        />
      </div>

      {/* Product Description */}
      <div className={spacing.section.md}>
        <p className="text-sm text-gray-600 leading-relaxed">
          {woodenChair.description}
        </p>
      </div>
    </MobileContentContainer>
  );
}

