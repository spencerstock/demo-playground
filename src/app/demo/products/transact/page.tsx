'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { useSDK } from '@/lib/contexts/SDKContext';

type MintStage = 'idle' | 'minting' | 'success';

export default function TransactProductPage() {
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const { provider } = useSDK();
  const viewMode = (searchParams.get('viewMode') || 'mobile') as 'mobile' | 'desktop';
  const productConfig = 'formAppearance' in config ? config : undefined;
  const nftName = productConfig?.formAppearance.appName?.trim() || 'Explorer Pass NFT';

  const [stage, setStage] = useState<MintStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const isDark = config.theme === 'dark';

  const cardClass = isDark
    ? 'bg-gray-900 text-white border border-gray-700'
    : 'bg-white text-gray-900 border border-gray-200';
  const secondaryText = isDark ? 'text-gray-300' : 'text-gray-600';
  const buttonLabel =
    stage === 'minting' ? 'Minting...' : stage === 'success' ? 'Minted' : 'Mint NFT';

  const handleMint = async () => {
    if (stage === 'minting' || stage === 'success') {
      return;
    }
    setError(null);
    setStage('minting');

    try {
      const connection = await provider.request({
        method: 'wallet_connect',
        params: [{ version: '1', capabilities: {} }],
      });

      const [{ address }] = connection;

      if (!address) {
        throw new Error('Wallet connection failed');
      }

      await provider.request({
        method: 'wallet_sendTransaction',
        params: [
          {
            chainId: '0x14a34', // Base Sepolia
            to: '0x0000000000000000000000000000000000000000', // Demo NFT contract
            from: address,
            value: '0x6f05b59d3b2000', // 0.0005 ETH
            data: '0x', // Encoded mint data
          },
        ],
      });

      setStage('success');
    } catch (mintError) {
      console.error('Mint failed:', mintError);
      setError('Mint failed. Please try again.');
      setStage('idle');
    }
  };

  return (
    <MobileContentContainer
      viewMode={viewMode}
      variant="centered"
      className={isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}
    >
      <div className="w-full max-w-sm">
        <div className={`${cardClass} rounded-3xl p-6 flex flex-col items-center text-center`}>
          <div
            className={`w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 ${
              isDark ? 'bg-blue-500/20' : ''
            }`}
          >
            <Image src="/globe.svg" alt="Explorer Pass" width={64} height={64} />
          </div>

          <h1 className="text-2xl font-semibold mb-2">{nftName}</h1>
          <p className={`${secondaryText} mb-8`}>Token ID #2048</p>

          <Button
            onClick={handleMint}
            className="w-full"
            disabled={stage === 'minting' || stage === 'success'}
          >
            {buttonLabel}
          </Button>

          {error && (
            <p className="text-sm text-red-500 mt-4" role="alert">
              {error}
            </p>
          )}

          {stage === 'minting' && !error && (
            <p className={`${secondaryText} mt-4`}>Minting Explorer Pass on Base Sepolia…</p>
          )}

          {stage === 'success' && (
            <p className={`${secondaryText} mt-4`}>
              Mint successful! Explorer Pass #2048 is now in your wallet.
            </p>
          )}
        </div>

        <div className={`${spacing.section.lg} text-center ${secondaryText}`}>
          This demo shows a simple NFT mint flow using Transact.
        </div>
      </div>
    </MobileContentContainer>
  );
}
