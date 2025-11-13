'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { useSDK } from '@/lib/contexts/SDKContext';

import { encodeFunctionData } from 'viem';
import { parseUnits } from 'viem';
import { numberToHex } from 'viem';
import { base, getCryptoKeyAccount } from '@base-org/account';

type MintStage = 'idle' | 'minting' | 'success';

// ERC-20 ABI for approve
const erc20Abi = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// ERC721 ABI for the mint function
const erc721Abi = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = '0x82039e7C37D7aAc98D0F4d0A762F4E0d8c8DC273';


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

      // Encode the first approve call - approve USDC to NFT contract
      const call1Data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          NFT_CONTRACT_ADDRESS,
          parseUnits('0.1', 6), // USDC has 6 decimals
        ],
      });

      // Encode the second call - mint NFT to the user's address
      const call2Data = encodeFunctionData({
        abi: erc721Abi,
        functionName: 'mint',
        args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045", BigInt('5')],
      });

      await provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            version: '2.0.0',
            //from: fromAddress,
            chainId: numberToHex(base.constants.CHAIN_IDS.baseSepolia),
            atomicRequired: true,
            calls: [
              {
                to: USDC_ADDRESS,
                data: call1Data,
              },
              {
                to: NFT_CONTRACT_ADDRESS,
                data: call2Data,
              },
            ],
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
