'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobilePreview } from '@/components/builder/MobilePreview';
import { PreviewControls } from '@/components/builder/PreviewControls';
import { ConfigProvider, useConfig } from '@/lib/contexts/ConfigContext';
import { defaultTransactConfig } from '@/lib/data/products';
import { ProductConfig } from '@/lib/types';
import { USDCFaucetModal, USDCFaucetButton } from '@/components/faucet';

function ConfigurePageContent() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFaucetModal, setShowFaucetModal] = useState(false);
  const { config, updateTheme, updateViewMode, updateConfig } = useConfig();

  const productConfig = config as ProductConfig;
  const demoMode = productConfig.transactDemoMode ?? 'mint';

  const renderedCode = useMemo(() => {
    const lines: string[] = [];

    lines.push(`import { createBaseAccountSDK } from '@base-org/account';`);
    lines.push(`import { encodeFunctionData } from 'viem';`);
    lines.push(`import { erc20Abi, randomColorNftAbi } from '@/lib/abis/randomColorNft';`);
    lines.push('');
    lines.push('const sdk = createBaseAccountSDK({ appChainIds: [84532] }); // Base Sepolia');
    lines.push('const provider = sdk.getProvider();');
    lines.push('');
    if (demoMode === 'mint') {
      lines.push('export async function runMintDemo(quantity = 1) {');
      lines.push('  const COST_PER_MINT_USDC = BigInt(10_000); // 0.01 USDC (6 decimals)');
      lines.push("  const NFT_CONTRACT_ADDRESS = '0xcA83C88aEa63f714432950F14Fafc9af51FCb74E';");
      lines.push("  const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';");
      lines.push('');
      lines.push('  const approvalAmount = COST_PER_MINT_USDC * BigInt(quantity);');
      lines.push('  const approveCall = {');
      lines.push('    to: USDC_ADDRESS,');
      lines.push("    data: encodeFunctionData({ abi: erc20Abi, functionName: 'approve', args: [");
      lines.push('      NFT_CONTRACT_ADDRESS,');
      lines.push('      approvalAmount,');
      lines.push('    ] }),');
      lines.push('  };');
      lines.push('  const mintCall = {');
      lines.push('    to: NFT_CONTRACT_ADDRESS,');
      lines.push("    data: encodeFunctionData({ abi: randomColorNftAbi, functionName: 'mint' }),");
      lines.push('  };');
      lines.push('');
      lines.push('  await provider.request({');
      lines.push("    method: 'wallet_sendCalls',");
      lines.push('    params: [{');
      lines.push("      version: '2.0.0',");
      lines.push("      chainId: '0x14a34', // Base Sepolia");
      lines.push('      atomicRequired: true,');
      lines.push(
        '      calls: [approveCall, ...Array.from({ length: quantity }, () => mintCall)],'
      );
      lines.push('    }],');
      lines.push('  });');
      lines.push('}');
    } else {
      lines.push('export async function runTransferDemo({ token, amount, recipient }) {');
      lines.push("  const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';");
      lines.push(
        "  const USDT_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: replace with live address"
      );
      lines.push('  const ERC20_TRANSFER_ABI = [{');
      lines.push("    name: 'transfer',");
      lines.push("    type: 'function',");
      lines.push(
        "    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],"
      );
      lines.push('  }];');
      lines.push('');
      lines.push('  const transferCall = token === "ETH"');
      lines.push('    ? { to: recipient, value: amount, data: "0x" }');
      lines.push('    : {');
      lines.push('        to: token === "USDC" ? USDC_ADDRESS : USDT_ADDRESS,');
      lines.push(
        "        data: encodeFunctionData({ abi: ERC20_TRANSFER_ABI, functionName: 'transfer', args: [recipient, amount] }),"
      );
      lines.push('      };');
      lines.push('');
      lines.push('  await provider.request({');
      lines.push("    method: 'wallet_sendCalls',");
      lines.push('    params: [{');
      lines.push("      version: '2.0.0',");
      lines.push("      chainId: '0x14a34', // Base Sepolia");
      lines.push('      atomicRequired: true,');
      lines.push('      calls: [transferCall],');
      lines.push('    }],');
      lines.push('  });');
      lines.push('}');
    }

    return lines.join('\n');
  }, [demoMode]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">Share preview</Button>
            <Button>
              Start building
              <svg
                className="ml-2 w-4 h-4 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <div
          className="w-1/2 border-r border-gray-200 overflow-y-auto"
          style={{ height: 'calc(100vh - 73px)' }}
        >
          <div className="p-8">
            <div className="mb-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-[15px] font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Transact
              </Link>
              <p className="text-sm text-gray-500 mt-1 ml-6">NFT mint transaction</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <USDCFaucetButton onClick={() => setShowFaucetModal(true)} />
              </div>

              <div className="border-t border-gray-200 pt-8 space-y-4">
                <h3 className="text-[15px] font-semibold text-gray-900">Demo options</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Choose which Transact experience to showcase in the preview.
                </p>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => updateConfig({ transactDemoMode: 'mint' })}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                        demoMode === 'mint'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-500 text-gray-900'
                      }`}
                    >
                      <div className="text-sm font-semibold">Mint NFT</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateConfig({ transactDemoMode: 'transfer' })}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                        demoMode === 'transfer'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-500 text-gray-900'
                      }`}
                    >
                      <div className="text-sm font-semibold">Send Token</div>
                    </button>
                  </div>

                  {demoMode === 'mint' ? (
                    <ul className="space-y-1.5 text-xs text-gray-600 px-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Batch USDC approval & multiple NFT mints in one transaction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Each NFT generates a unique on-chain color upon minting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Demonstrates atomic multi-call bundling with wallet_sendCalls</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-gray-600 px-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Send USDC, USDT, or ETH to any address on Base Sepolia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Single-click transfer flow for both ERC-20 and native tokens</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Simplified transaction experience powered by Transact</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-5 py-2 rounded-lg text-[15px] font-medium transition-all duration-150 ${
                    activeTab === 'preview'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-5 py-2 rounded-lg text-[15px] font-medium transition-all duration-150 ${
                    activeTab === 'code' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Code
                </button>
              </div>

              {activeTab === 'preview' && (
                <PreviewControls
                  theme={productConfig.theme || 'light'}
                  viewMode={productConfig.viewMode || 'mobile'}
                  onThemeChange={updateTheme}
                  onViewModeChange={updateViewMode}
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              )}
            </div>

            {activeTab === 'preview' && (
              <MobilePreview viewMode={productConfig.viewMode || 'mobile'}>
                <iframe
                  src={`/demo/products/transact?config=${encodeURIComponent(
                    JSON.stringify(productConfig)
                  )}&viewMode=${productConfig.viewMode || 'mobile'}`}
                  className="w-full h-full border-0"
                  title="Preview"
                  key={`${JSON.stringify(productConfig)}-${refreshKey}`}
                />
              </MobilePreview>
            )}

            {activeTab === 'code' && (
              <div className="bg-[#1a1a1a] text-gray-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">
                    {demoMode === 'mint'
                      ? 'Mint demo integration code'
                      : 'Transfer demo integration code'}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(renderedCode)}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-[13px] leading-relaxed overflow-x-auto font-mono">
                  <code>{renderedCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <USDCFaucetModal isOpen={showFaucetModal} onClose={() => setShowFaucetModal(false)} />
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <ConfigProvider initialConfig={defaultTransactConfig}>
        <ConfigurePageContent />
      </ConfigProvider>
    </Suspense>
  );
}
