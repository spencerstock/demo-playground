'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MobileContentContainer } from '@/components/demo/MobileContentContainer';
import { useConfig } from '@/lib/contexts/ConfigContext';
import { useSDK } from '@/lib/contexts/SDKContext';
import type { ProductConfig } from '@/lib/types';

import { encodeFunctionData, numberToHex, parseUnits } from 'viem';
import { base } from '@base-org/account';
import { erc20Abi, randomColorNftAbi } from '@/lib/abis/randomColorNft';

type MintStage = 'idle' | 'minting' | 'success';
type TransferStage = 'idle' | 'sending' | 'success';
type DemoMode = 'mint' | 'transfer';

const NFT_NAME = 'RandomColorNFT';
const NFT_SYMBOL = 'RCNFT';
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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// USDT contract address on Base Sepolia (replace with the canonical address when available)
const USDT_ADDRESS = ZERO_ADDRESS;

const TOKENS = [
  {
    symbol: 'USDC',
    label: 'USDC (Base Sepolia)',
    address: USDC_ADDRESS,
    decimals: 6,
    type: 'erc20' as const,
  },
  {
    symbol: 'USDT',
    label: 'USDT (Base Sepolia)',
    address: USDT_ADDRESS,
    decimals: 6,
    type: 'erc20' as const,
  },
  {
    symbol: 'ETH',
    label: 'ETH (Base Sepolia)',
    address: null,
    decimals: 18,
    type: 'native' as const,
  },
] as const;

type TokenSymbol = (typeof TOKENS)[number]['symbol'];

export default function TransactProductPage() {
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const { provider } = useSDK();
  const viewMode = (searchParams.get('viewMode') || 'mobile') as 'mobile' | 'desktop';

  const [mintStage, setMintStage] = useState<MintStage>('idle');
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintQuantityInput, setMintQuantityInput] = useState<string>('1');
  const [lastMintQuantity, setLastMintQuantity] = useState<number | null>(null);
  const [mintedColors, setMintedColors] = useState<string[]>([]);
  const [transferStage, setTransferStage] = useState<TransferStage>('idle');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<TokenSymbol>('USDC');
  const [transferAmountInput, setTransferAmountInput] = useState<string>('1');
  const [recipientAddress, setRecipientAddress] = useState<string>(
    '0x000000000000000000000000000000000000dead'
  );
  const [lastTransferSummary, setLastTransferSummary] = useState<{
    tokenSymbol: TokenSymbol;
    amount: string;
    recipient: string;
  } | null>(null);
  const isDark = config.theme === 'dark';
  const productConfig = config as ProductConfig;
  const demoMode = (productConfig.transactDemoMode ?? 'mint') as DemoMode;

  const mintQuantity = useMemo(() => {
    const parsed = Number.parseInt(mintQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return 1;
    }
    return Math.min(parsed, MAX_MINT_QUANTITY);
  }, [mintQuantityInput]);
  const mintQuantityLabel = mintQuantity > 1 ? `${mintQuantity} NFTs` : '1 NFT';
  const mintedSummaryQuantity = lastMintQuantity ?? mintQuantity;
  const mintedSummaryLabel =
    mintedSummaryQuantity > 1 ? `${mintedSummaryQuantity} ${NFT_NAME} tokens` : `1 ${NFT_NAME}`;
  const selectedToken = useMemo(
    () => TOKENS.find((token) => token.symbol === selectedTokenSymbol)!,
    [selectedTokenSymbol]
  );

  const mintButtonLabel =
    mintStage === 'minting'
      ? `Minting ${mintQuantityLabel}...`
      : mintStage === 'success'
        ? 'Mint Again'
        : `Mint ${mintQuantityLabel}`;

  const transferButtonLabel =
    transferStage === 'sending'
      ? `Sending ${selectedToken.symbol}...`
      : transferStage === 'success'
        ? 'Send Again'
        : `Send ${selectedToken.symbol}`;

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
    setLastMintQuantity(null);
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
      setLastMintQuantity(mintQuantity);
      setMintStage('success');
    } catch (mintError) {
      console.error('Mint failed:', mintError);
      setMintError('Mint failed. Please try again.');
      setMintStage('idle');
    }
  };

  const handleTokenChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTokenSymbol(event.target.value as TokenSymbol);
  };

  const handleTransfer = async () => {
    if (transferStage === 'sending') {
      return;
    }
    if (!provider) {
      setTransferError('Wallet provider not available.');
      return;
    }
    if (!recipientAddress || !recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      setTransferError('Enter a valid recipient address.');
      return;
    }
    let amountInBaseUnits: bigint;
    try {
      amountInBaseUnits = parseUnits(transferAmountInput, selectedToken.decimals);
    } catch (parseError) {
      console.error('Failed to parse amount:', parseError);
      setTransferError('Enter a valid amount.');
      return;
    }
    if (amountInBaseUnits <= BigInt(0)) {
      setTransferError('Amount must be greater than 0.');
      return;
    }
    if (selectedToken.type === 'erc20' && selectedToken.address === ZERO_ADDRESS) {
      setTransferError(`${selectedToken.symbol} address is not configured for this demo.`);
      return;
    }
    setTransferError(null);
    setTransferStage('sending');

    try {
      const transferCall =
        selectedToken.type === 'erc20'
          ? {
              to: selectedToken.address,
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'transfer',
                args: [recipientAddress as `0x${string}`, amountInBaseUnits],
              }),
            }
          : {
              to: recipientAddress as `0x${string}`,
              value: numberToHex(amountInBaseUnits),
              data: '0x',
            };

      await provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            version: '2.0.0',
            chainId: numberToHex(base.constants.CHAIN_IDS.baseSepolia),
            atomicRequired: true,
            calls: [transferCall],
          },
        ],
      });

      setLastTransferSummary({
        tokenSymbol: selectedToken.symbol,
        amount: transferAmountInput,
        recipient: recipientAddress,
      });
      setTransferStage('success');
    } catch (transferError) {
      console.error('Transfer failed:', transferError);
      setTransferError('Transfer failed. Please try again.');
      setTransferStage('idle');
    }
  };

  return (
    <MobileContentContainer
      key={demoMode}
      viewMode={viewMode}
      variant="scrollable"
      className={isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}
    >
      <div className="w-full max-w-md mx-auto py-6">
        <div
          className={`${cardClass} rounded-3xl ${viewMode === 'desktop' ? 'p-8' : 'p-6'} flex flex-col gap-6`}
        >
          {demoMode === 'mint' ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <svg
                    viewBox="0 0 120 120"
                    className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <defs>
                      <linearGradient id="animatedGloss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="120"
                      height="120"
                      rx="16"
                      fill={currentAnimatedColor}
                    />
                    <rect x="0" y="0" width="120" height="120" rx="16" fill="url(#animatedGloss)" />
                  </svg>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white shadow-md backdrop-blur-sm">
                    {currentAnimatedColor}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold mb-0.5 break-words">{NFT_NAME}</h1>
                  <p className={`${secondaryText} text-sm font-medium`}>{NFT_SYMBOL}</p>
                </div>
              </div>

              <p className={`${secondaryText} text-sm leading-relaxed`}>
                Each mint generates a unique on-chain color stored directly in the NFT contract.
                Powered by Base Sepolia testnet.
              </p>

              <div className="w-full">
                <label
                  htmlFor="mint-quantity"
                  className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
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
                  className={`w-full px-4 py-3 text-base font-medium rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="1"
                />
                <p className={`${secondaryText} text-xs mt-2 font-medium`}>
                  1-{MAX_MINT_QUANTITY} NFTs • 0.01 USDC each
                </p>
              </div>

              <Button onClick={handleMint} className="w-full" disabled={mintStage === 'minting'}>
                {mintButtonLabel}
              </Button>

              {mintError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-700 font-medium" role="alert">
                    {mintError}
                  </p>
                </div>
              )}

              {mintStage === 'minting' && !mintError && (
                <div
                  className={`rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'} p-4`}
                >
                  <p
                    className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-blue-700'}`}
                  >
                    Minting {mintQuantityLabel}…
                  </p>
                </div>
              )}

              {mintStage === 'success' && (
                <div
                  className={`rounded-xl ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'} p-4 space-y-3`}
                >
                  <p
                    className={`text-sm font-semibold ${isDark ? 'text-green-200' : 'text-green-800'}`}
                  >
                    Success! Minted {mintedSummaryLabel}
                  </p>
                  {mintedColors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mintedColors.map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          className="w-14 h-14 rounded-xl shadow-md border-2 border-white/50 transition-transform hover:scale-105"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-xs font-medium ${isDark ? 'text-green-300/80' : 'text-green-700/80'}`}
                  >
                    Each token displays its unique on-chain generated color
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold mb-1.5">Send Tokens</h1>
                <p className={`${secondaryText} text-sm leading-relaxed`}>
                  Transfer USDC, USDT, or ETH with a single transaction powered by Transact.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="token-select"
                    className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                  >
                    Token
                  </label>
                  <select
                    id="token-select"
                    value={selectedTokenSymbol}
                    onChange={handleTokenChange}
                    className={`w-full px-4 py-3 text-base font-medium rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-gray-100 focus:ring-blue-400 focus:border-blue-400'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    {TOKENS.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="recipient-address"
                    className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                  >
                    Recipient Address
                  </label>
                  <input
                    id="recipient-address"
                    type="text"
                    value={recipientAddress}
                    onChange={(event) => setRecipientAddress(event.target.value)}
                    className={`w-full px-4 py-3 text-sm font-mono rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-400 focus:border-blue-400'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="0x000000000000000000000000000000000000dead"
                  />
                </div>

                <div>
                  <label
                    htmlFor="transfer-amount"
                    className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                  >
                    Amount
                  </label>
                  <input
                    id="transfer-amount"
                    type="text"
                    value={transferAmountInput}
                    onChange={(event) => setTransferAmountInput(event.target.value)}
                    inputMode="decimal"
                    className={`w-full px-4 py-3 text-base font-medium rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-400 focus:border-blue-400'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder={selectedToken.symbol === 'ETH' ? '0.1' : '10'}
                  />
                  <p className={`${secondaryText} text-xs mt-2 font-medium`}>
                    {selectedToken.type === 'native'
                      ? '18 decimals precision'
                      : `${selectedToken.decimals} decimals precision`}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleTransfer}
                className="w-full"
                disabled={transferStage === 'sending'}
              >
                {transferButtonLabel}
              </Button>

              {transferError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-700 font-medium" role="alert">
                    {transferError}
                  </p>
                </div>
              )}

              {transferStage === 'sending' && !transferError && (
                <div
                  className={`rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'} p-4`}
                >
                  <p
                    className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-blue-700'}`}
                  >
                    Sending {transferAmountInput} {selectedToken.symbol}…
                  </p>
                </div>
              )}

              {transferStage === 'success' && lastTransferSummary && (
                <div
                  className={`rounded-xl ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'} p-4 space-y-2`}
                >
                  <p
                    className={`text-sm font-semibold ${isDark ? 'text-green-200' : 'text-green-800'}`}
                  >
                    Transfer Complete!
                  </p>
                  <p className={`text-sm ${isDark ? 'text-green-300/90' : 'text-green-700/90'}`}>
                    Sent {lastTransferSummary.amount} {lastTransferSummary.tokenSymbol}
                  </p>
                  <p
                    className={`text-xs font-mono ${isDark ? 'text-green-300/70' : 'text-green-700/70'} break-all`}
                  >
                    to {lastTransferSummary.recipient}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`mt-6 text-center ${secondaryText} text-xs font-medium leading-relaxed max-w-sm mx-auto`}
        >
          {demoMode === 'mint'
            ? 'Powered by wallet_sendCalls — batch USDC approval and multiple NFT mints in a single atomic transaction.'
            : 'Powered by wallet_sendCalls — orchestrate ERC-20 or native token transfers in a single atomic transaction.'}
        </div>
      </div>
    </MobileContentContainer>
  );
}
