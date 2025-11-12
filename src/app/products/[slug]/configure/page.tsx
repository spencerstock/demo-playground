'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobilePreview } from '@/components/builder/MobilePreview';
import { PreviewControls } from '@/components/builder/PreviewControls';
import { FormAppearanceSection } from '@/components/builder/FormAppearanceSection';
import { CapabilitiesSection } from '@/components/builder/CapabilitiesSection';
import { RequestsSection } from '@/components/builder/RequestsSection';
import { ConfigProvider, useConfig } from '@/lib/contexts/ConfigContext';

function ConfigurePageContent() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [refreshKey, setRefreshKey] = useState(0);
  const { config, updateTheme, updateViewMode } = useConfig();

  const generateCode = () => {
    const lines: string[] = [];

    // Check if this is a ProductConfig (not BasePayConfig)
    if (!('formAppearance' in config) || !('requests' in config) || !('capabilities' in config)) {
      return '// This configuration page is only available for Sign in with Base product';
    }

    // Imports
    lines.push(`import { createBaseAccountSDK } from '@base-org/account';`);
    lines.push(`import { SignInWithBaseButton } from '@base-org/account-ui/react';`);
    lines.push('');

    // Create SDK instance
    lines.push('// Initialize the Base Account SDK');
    lines.push('const sdk = createBaseAccountSDK({');
    lines.push(`  appName: '${config.formAppearance.appName}',`);
    if (config.formAppearance.logoUrl) {
      lines.push(`  appLogoUrl: '${config.formAppearance.logoUrl}',`);
    }
    lines.push('  appChainIds: [8453], // Base mainnet');

    // Add subAccounts configuration if app account is enabled
    if (config.requests.appAccount?.enabled) {
      const defaultAccount = config.requests.appAccount.defaultAccount || 'sub';
      const funding = config.requests.appAccount.funding || 'spend-permissions';

      lines.push('  subAccounts: {');
      lines.push(`    creation: 'on-connect', // Auto-create app account during wallet_connect`);
      lines.push(
        `    defaultAccount: '${defaultAccount}', // ${defaultAccount === 'sub' ? 'Use app account as default' : 'Use main account as default'}`
      );
      lines.push(
        `    funding: '${funding}', // ${funding === 'spend-permissions' ? 'Route through main account if needed' : 'Direct execution from app account'}`
      );
      lines.push('  },');
    }

    lines.push('});');
    lines.push('');
    lines.push('const provider = sdk.getProvider();');
    lines.push('');

    // App component
    lines.push('function App() {');
    lines.push('  const handleSignIn = async () => {');
    lines.push('    try {');

    // Build capabilities object
    const hasCapabilities =
      config.capabilities.signInWithEthereum ||
      config.requests.appAccount?.enabled ||
      config.requests.spendPermission?.enabled;

    if (hasCapabilities) {
      lines.push('      // Build capabilities for the sign-in request');
      lines.push('      const capabilities = {');

      // Sign in with Ethereum
      if (config.capabilities.signInWithEthereum) {
        lines.push('        signInWithEthereum: {');
        lines.push('          chainId: 8453, // Base mainnet');
        lines.push('          nonce: Math.random().toString(36).substring(2, 15),');
        lines.push('        },');
      }

      // Spend permissions
      if (config.requests.spendPermission?.enabled) {
        lines.push('        spendPermissions: {');
        lines.push('          8453: [ // Base mainnet');
        lines.push('            {');
        lines.push(
          '              token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base'
        );
        const allowanceInWei = parseFloat(config.requests.spendPermission.allowance) * 1e6; // USDC has 6 decimals
        lines.push(
          `              allowance: "0x${allowanceInWei.toString(16)}", // ${config.requests.spendPermission.allowance} USDC`
        );
        const periodMap = { Daily: 86400, Weekly: 604800, Monthly: 2592000 };
        const period =
          periodMap[config.requests.spendPermission.frequency as keyof typeof periodMap] || 86400;
        lines.push(
          `              period: ${period}, // ${config.requests.spendPermission.frequency}`
        );
        lines.push('            },');
        lines.push('          ],');
        lines.push('        },');
      }

      lines.push('      };');
      lines.push('');
      lines.push('      // Request connection with capabilities');
      if (config.requests.appAccount?.enabled) {
        lines.push('      // Note: The app account (subaccount) will be automatically created');
        lines.push(
          "      // during wallet_connect because we set creation: 'on-connect' in SDK config"
        );
      }
      lines.push('      const response = await provider.request({');
      lines.push("        method: 'wallet_connect',");
      lines.push('        params: [');
      lines.push('          {');
      lines.push("            version: '1',");
      lines.push('            capabilities,');
      lines.push('          },');
      lines.push('        ],');
      lines.push('      });');
    } else {
      lines.push('      // Request basic connection');
      lines.push('      const response = await provider.request({');
      lines.push("        method: 'wallet_connect',");
      lines.push("        params: [{ version: '1', capabilities: {} }],");
      lines.push('      });');
    }

    lines.push('');
    lines.push("      console.log('Connected:', response);");

    // Add app account explanation if enabled
    if (config.requests.appAccount?.enabled) {
      lines.push('');
      lines.push('      // The app account address can be accessed from the response');
      lines.push('      // response.accounts[0].capabilities.subAccounts[0].address');
      lines.push('      // The SDK will automatically use the app account as the default account');
    }

    lines.push('    } catch (error) {');
    lines.push("      console.error('Connection failed:', error);");
    lines.push('    }');
    lines.push('  };');
    lines.push('');
    lines.push('  return (');
    lines.push('    <SignInWithBaseButton');
    lines.push('      onClick={handleSignIn}');
    lines.push('      variant="solid"');
    lines.push(`      colorScheme="${config.theme || 'light'}"`);
    lines.push('    />');
    lines.push('  );');
    lines.push('}');

    return lines.join('\n');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
        {/* Left Panel - Configuration */}
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
                Sign in with Base
              </Link>
              <p className="text-sm text-gray-500 mt-1 ml-6">Sign in form</p>
            </div>

            <div className="space-y-8">
              <FormAppearanceSection />
              <div className="border-t border-gray-200 pt-8">
                <CapabilitiesSection />
              </div>
              <div className="border-t border-gray-200 pt-8">
                <RequestsSection />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="p-8">
            {/* Tab buttons */}
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

              {/* Preview Controls */}
              {activeTab === 'preview' && (
                <PreviewControls
                  theme={config.theme || 'light'}
                  viewMode={config.viewMode || 'mobile'}
                  onThemeChange={updateTheme}
                  onViewModeChange={updateViewMode}
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              )}
            </div>

            {activeTab === 'preview' && (
              <MobilePreview viewMode={config.viewMode || 'mobile'}>
                <iframe
                  src={`/demo/auth?config=${encodeURIComponent(JSON.stringify(config))}&viewMode=${config.viewMode || 'mobile'}`}
                  className="w-full h-full border-0"
                  title="Preview"
                  key={`${JSON.stringify(config)}-${refreshKey}`} // Force re-render when config changes or refresh is clicked
                />
              </MobilePreview>
            )}

            {activeTab === 'code' && (
              <div className="bg-[#1a1a1a] text-gray-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Integration Code</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-[13px] leading-relaxed overflow-x-auto font-mono">
                  <code>{generateCode()}</code>
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
    <ConfigProvider>
      <ConfigurePageContent />
    </ConfigProvider>
  );
}
