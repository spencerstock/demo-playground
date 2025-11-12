'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { woodenChair } from '@/lib/data/products';
import { useConfig } from '@/lib/contexts/ConfigContext';

export default function WoodenChairProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const viewMode = searchParams.get('viewMode') || 'mobile';

  const handleCheckout = () => {
    // Navigate to Base Pay info page with config
    router.push(`/demo/base-pay/info?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}`);
  };

  return (
    <MobileContentContainer viewMode={viewMode as 'mobile' | 'desktop'} variant="default">
      {/* Product Image */}
      <div className={`relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden ${spacing.section.lg}`}>
        <Image
          src={woodenChair.image}
          alt={woodenChair.name}
          fill
          className="object-contain p-8"
        />
      </div>

      {/* Product Info */}
      <div className={spacing.section.md}>
        <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.xs}`}>
          {woodenChair.name}
        </h1>
        <p className="text-lg text-gray-600">{woodenChair.subtitle}</p>
      </div>

      {/* Price */}
      <div className={spacing.section.md}>
        <p className="text-3xl font-bold text-gray-900">${woodenChair.price}</p>
      </div>

      {/* Description */}
      <div className={spacing.section.md}>
        <p className="text-gray-600 leading-relaxed">{woodenChair.description}</p>
      </div>

      {/* Checkout Button */}
      <div className={spacing.section.lg}>
        <Button 
          onClick={handleCheckout}
          className="w-full"
        >
          Checkout with Base Pay
        </Button>
      </div>
    </MobileContentContainer>
  );
}
