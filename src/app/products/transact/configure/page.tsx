'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobilePreview } from '@/components/builder/MobilePreview';
import { PreviewControls } from '@/components/builder/PreviewControls';
import { FormAppearanceSection } from '@/components/builder/FormAppearanceSection';
import { ConfigProvider, useConfig } from '@/lib/contexts/ConfigContext';
import { defaultTransactConfig } from '@/lib/data/products';
import { ProductConfig } from '@/lib/types';

function ConfigurePageContent() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [refreshKey, setRefreshKey] = useState(0);
  const { config, updateTheme, updateViewMode } = useConfig();

  const productConfig = config as ProductConfig;

  const renderedCode = useMemo(() => {
    const lines: string[] = [];

    lines.push(`import { createBaseAccountSDK } from '@base-org/account';`);
    lines.push('');
    lines.push('const sdk = createBaseAccountSDK({');
    lines.push(`  appName: '${productConfig.formAppearance.appName}',`);
    if (productConfig.formAppearance.logoUrl) {
      lines.push(`  appLogoUrl: '${productConfig.formAppearance.logoUrl}',`);
    }
    lines.push('  appChainIds: [84532], // Base Sepolia');
    lines.push('});');
    lines.push('');
    lines.push('const provider = sdk.getProvider();');
    lines.push('');
    lines.push('export async function mintExplorerPass() {');
    lines.push('  try {');
    lines.push('    const [{ address }] = await provider.request({');
    lines.push("      method: 'wallet_connect',");
    lines.push('      params: [{ version: \'1\', capabilities: {} }],');
    lines.push('    });');
    lines.push('');
    lines.push('    const txHash = await provider.request({');
    lines.push("      method: 'wallet_sendTransaction',");
    lines.push('      params: [{');
    lines.push("        chainId: '0x14a34', // Base Sepolia");
    lines.push("        to: '0x0000000000000000000000000000000000000000', // NFT contract");
    lines.push("        from: address,");
    lines.push("        value: '0x6f05b59d3b2000', // 0.0005 ETH");
    lines.push("        data: '0x', // encoded mint function");
    lines.push('      }],');
    lines.push('    });');
    lines.push('');
    lines.push("    console.log('Mint complete:', txHash);");
    lines.push('  } catch (error) {');
    lines.push("    console.error('Mint failed:', error);");
    lines.push('  }');
    lines.push('}');

    return lines.join('\n');
  }, [productConfig]);

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
              <svg className="ml-2 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Transact
              </Link>
              <p className="text-sm text-gray-500 mt-1 ml-6">NFT mint transaction</p>
            </div>

            <div className="space-y-8">
              <FormAppearanceSection />
              <div className="border-t border-gray-200 pt-8 space-y-4">
                <h3 className="text-[15px] font-semibold text-gray-900">Demo details</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The Transact demo now focuses on a minimal NFT mint flow. Update the app name to see how it appears in the preview, then use the preview controls to switch view mode or theme.
                </p>
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
                    activeTab === 'code'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
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
                    JSON.stringify(productConfig),
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
                  <span className="text-sm text-gray-400">Mint integration code</span>
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
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <ConfigProvider initialConfig={defaultTransactConfig}>
      <ConfigurePageContent />
    </ConfigProvider>
  );
}


