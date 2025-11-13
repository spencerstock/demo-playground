'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { pay } from '@base-org/account';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { woodenChair } from '@/lib/data/products';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { generateBasePayParams } from '@/lib/utils/generateBasePayParams';
import { BasePayConfig } from '@/lib/types';
import { useSDK } from '@/lib/contexts';

export default function WoodenChairProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const { walletUrl } = useSDK();
  const viewMode = searchParams.get('viewMode') || 'mobile';

  // Type-cast config to BasePayConfig to access product properties
  const basePayConfig = config as BasePayConfig;

  // Use config values if available, otherwise fallback to hardcoded woodenChair data
  const productName = basePayConfig?.product?.name || woodenChair.name;
  const productSubtitle = basePayConfig?.product?.subtitle || woodenChair.subtitle;

  const productImage = basePayConfig?.product?.imageUrl || woodenChair.image;

  const handleCheckout = async () => {
    try {
      // Generate Base Pay parameters from config
      const payParams = generateBasePayParams(basePayConfig);
      console.log('Payment params:', payParams);

      // Call the pay function from the SDK
      const result = await pay({ ...payParams, walletUrl: walletUrl ?? undefined });

      console.log('Payment result:', result);

      if (result.success) {
        console.log('Payment successful!', result.id);
        // Navigate to success page
        router.push(
          `/demo/base-pay/success?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${viewMode}&txId=${result.id || ''}`
        );
      }
    } catch (error) {
      console.error('Payment failed:', error);
      // You could show an error message to the user here
    }
  };

  return (
    <MobileContentContainer viewMode={viewMode as 'mobile' | 'desktop'} variant="default">
      {/* Product Image */}
      <div
        className={`relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden ${spacing.section.lg}`}
      >
        <Image src={productImage} alt={productName} fill className="object-contain p-8" />
      </div>

      {/* Product Info */}
      <div className={spacing.section.md}>
        <h1 className={`text-2xl font-bold text-gray-900 ${spacing.element.xs}`}>{productName}</h1>
        <p className="text-lg text-gray-600">{productSubtitle}</p>
      </div>

      {/* Price */}
      <div className={spacing.section.md}>
        <p className="text-3xl font-bold text-gray-900">{`${basePayConfig?.product?.price ? `$${basePayConfig?.product?.price}` : ''}`}</p>
      </div>

      {/* Description */}
      <div className={spacing.section.md}>
        <p className="text-gray-600 leading-relaxed">{woodenChair.description}</p>
      </div>

      {/* Checkout Button */}
      <div className={`${spacing.section.lg} pb-8`}>
        <Button onClick={handleCheckout} className="w-full">
          Checkout with Base Pay
        </Button>
      </div>
    </MobileContentContainer>
  );
}
