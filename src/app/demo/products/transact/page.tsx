'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer } from '@/components/demo/MobileContentContainer';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { useSDK } from '@/lib/contexts/SDKContext';

import { encodeFunctionData, numberToHex } from 'viem';
import { base } from '@base-org/account';
import { erc20Abi, randomColorNftAbi } from '@/lib/abis/randomColorNft';

type MintStage = 'idle' | 'minting' | 'success';

const NFT_NAME = 'RandomColorNFT';
const COST_PER_MINT_USDC = BigInt(10_000); // 0.01 USDC with 6 decimals
const MAX_MINT_QUANTITY = 10;

const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = '0xcA83C88aEa63f714432950F14Fafc9af51FCb74E';

export default function TransactProductPage() {
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const { provider } = useSDK();
  const viewMode = (searchParams.get('viewMode') || 'mobile') as 'mobile' | 'desktop';

  const [mintStage, setMintStage] = useState<MintStage>('idle');
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintQuantityInput, setMintQuantityInput] = useState<string>('1');
  const [mintedColors, setMintedColors] = useState<string[]>([]);
  const isDark = config.theme === 'dark';

  const mintQuantity = useMemo(() => {
    const parsed = Number.parseInt(mintQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return 1;
    }
    return Math.min(parsed, MAX_MINT_QUANTITY);
  }, [mintQuantityInput]);

  const mintButtonLabel =
    mintStage === 'minting' ? 'Minting...' : mintStage === 'success' ? 'Mint Again' : 'Mint NFT';

  const animatedColors = useMemo(
    () => ['#F97316', '#FACC15', '#4ADE80', '#22D3EE', '#60A5FA', '#C084FC'],
    []
  );
  const [animatedColorIndex, setAnimatedColorIndex] = useState(0);
  const currentAnimatedColor = animatedColors[animatedColorIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAnimatedColorIndex((prev) => (prev + 1) % animatedColors.length);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [animatedColors.length]);

  const cardClass = isDark
    ? 'bg-gray-900 text-white border border-gray-700'
    : 'bg-white text-gray-900 border border-gray-200';
  const secondaryText = isDark ? 'text-gray-300' : 'text-gray-600';

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === '') {
      setMintQuantityInput('');
      return;
    }
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    const clamped = Math.min(Math.max(parsed, 1), MAX_MINT_QUANTITY);
    setMintQuantityInput(clamped.toString());
  };

  const handleMint = async () => {
    if (mintStage === 'minting') {
      return;
    }
    if (!provider) {
      setMintError('Wallet provider not available.');
      return;
    }
    setMintError(null);
    setMintedColors([]);
    setMintStage('minting');

    try {
      const approvalAmount = COST_PER_MINT_USDC * BigInt(mintQuantity);
      const call1Data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [NFT_CONTRACT_ADDRESS, approvalAmount],
      });

      const call2Data = encodeFunctionData({
        abi: randomColorNftAbi,
        functionName: 'mint',
      });

      const mintCalls = Array.from({ length: mintQuantity }, () => ({
        to: NFT_CONTRACT_ADDRESS,
        data: call2Data,
      }));

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
              ...mintCalls,
            ],
          },
        ],
      });

      const mintedColorsForSession = Array.from({ length: mintQuantity }, () =>
        generateRandomHexColor()
      );
      setMintedColors(mintedColorsForSession);
      setMintStage('success');
    } catch (mintError) {
      console.error('Mint failed:', mintError);
      setMintError('Mint failed. Please try again.');
      setMintStage('idle');
    }
  };

  return (
    <MobileContentContainer
      viewMode={viewMode}
      variant="scrollable"
      className={isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}
    >
      <div className="w-full max-w-md mx-auto py-6">
        <div
          className={`${cardClass} rounded-3xl ${viewMode === 'desktop' ? 'p-8' : 'p-6'} flex flex-col`}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-6">
              <div
                className="w-52 h-52 rounded-3xl shadow-xl overflow-hidden relative"
                style={{ backgroundColor: currentAnimatedColor }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-black/70 text-white shadow-lg backdrop-blur-sm">
                  {currentAnimatedColor}
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{NFT_NAME}</h1>
            <p className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {(0.01 * mintQuantity).toFixed(2)} USDC
            </p>
            <p className={`${secondaryText} text-sm`}>${(0.01 * mintQuantity * 1).toFixed(2)}</p>
          </div>

          {mintStage === 'idle' && (
            <div className="mb-6">
              <label
                htmlFor="mint-quantity"
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}
              >
                Quantity
              </label>
              <input
                id="mint-quantity"
                type="number"
                min={1}
                max={MAX_MINT_QUANTITY}
                value={mintQuantityInput}
                onChange={handleQuantityChange}
                inputMode="numeric"
                className={`w-full px-4 py-2.5 text-base font-medium rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-400 focus:border-blue-400'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="1"
              />
              <p className={`${secondaryText} text-xs mt-1.5 font-medium`}>
                Max {MAX_MINT_QUANTITY} NFTs
              </p>
            </div>
          )}

          <Button
            onClick={handleMint}
            className="w-full text-base font-semibold py-4 rounded-xl"
            disabled={mintStage === 'minting'}
          >
            {mintButtonLabel}
          </Button>

          {mintError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 mt-4">
              <p className="text-sm text-red-700 font-medium text-center" role="alert">
                {mintError}
              </p>
            </div>
          )}

          {mintStage === 'success' && mintedColors.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p
                className={`text-sm font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Successfully minted {mintedColors.length}{' '}
                {mintedColors.length === 1 ? 'NFT' : 'NFTs'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {mintedColors.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="w-16 h-16 rounded-xl shadow-md border-2 border-white/50 transition-transform hover:scale-105"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileContentContainer>
  );
}
