'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobilePreview } from '@/components/builder/MobilePreview';
import { PreviewControls } from '@/components/builder/PreviewControls';
import { ProductDetailsSection } from '@/components/builder/ProductDetailsSection';
import { PaymentSettingsSection } from '@/components/builder/PaymentSettingsSection';
import { PayerInfoSection } from '@/components/builder/PayerInfoSection';
import { ButtonStyleSection } from '@/components/builder/ButtonStyleSection';
import { ConfigProvider, useConfig } from '@/lib/contexts/ConfigContext';
import { defaultBasePayConfig } from '@/lib/data/products';
import { BasePayConfig } from '@/lib/types';

function ConfigurePageContent() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    config,
    updateProduct,
    updatePayment,
    updatePayerInfoRequest,
    updatePayerInfo,
    updateButtonStyle,
    updateTheme,
    updateViewMode,
  } = useConfig();

  // Type guard to ensure we have a BasePayConfig
  const basePayConfig = config as BasePayConfig;

  const generateCode = () => {
    const lines: string[] = [];

    // Imports
    lines.push(`import { pay } from '@base-org/account';`);
    lines.push(`import { BasePayButton } from '@base-org/account-ui/react';`);
    lines.push('');

    // Component
    lines.push('function CheckoutPage() {');
    lines.push('  const handlePayment = async () => {');
    lines.push('    try {');

    // Build the payment options
    lines.push('      const result = await pay({');
    lines.push(`        amount: "${basePayConfig.product.price}",`);
    lines.push(`        to: "${basePayConfig.payment.recipientAddress}",`);

    if (basePayConfig.payment.testnet) {
      lines.push('        testnet: true,');
    }

    if (!basePayConfig.payment.enableTelemetry) {
      lines.push('        telemetry: false,');
    }

    // Add payerInfo if any requests are enabled
    const enabledRequests = Object.entries(basePayConfig.payerInfo.requests)
      .filter(([, req]) => req.enabled)
      .map(([type, req]) => ({ type, optional: req.optional }));

    if (enabledRequests.length > 0) {
      lines.push('        payerInfo: {');
      lines.push('          requests: [');
      enabledRequests.forEach((req, i) => {
        const comma = i < enabledRequests.length - 1 ? ',' : '';
        if (req.optional) {
          lines.push(`            { type: '${req.type}', optional: true }${comma}`);
        } else {
          lines.push(`            { type: '${req.type}' }${comma}`);
        }
      });
      lines.push('          ],');

      if (basePayConfig.payerInfo.callbackUrl) {
        lines.push(`          callbackURL: '${basePayConfig.payerInfo.callbackUrl}',`);
      }

      lines.push('        },');
    }

    lines.push('      });');
    lines.push('');
    lines.push('      if (result.success) {');
    lines.push("        console.log('Payment successful!', result.id);");
    lines.push('        // Handle successful payment');
    lines.push('      }');
    lines.push('    } catch (error) {');
    lines.push("      console.error('Payment failed:', error);");
    lines.push('      // Handle payment error');
    lines.push('    }');
    lines.push('  };');
    lines.push('');
    lines.push('  return (');
    lines.push('    <div>');
    lines.push(`      <h1>${basePayConfig.product.name}</h1>`);
    lines.push(`      <p>${basePayConfig.product.subtitle}</p>`);
    lines.push(`      <p>$${basePayConfig.product.price}</p>`);
    lines.push('');
    lines.push('      <BasePayButton');
    lines.push('        onClick={handlePayment}');
    lines.push(`        colorScheme="${basePayConfig.buttonStyle.colorScheme}"`);
    lines.push('      />');
    lines.push('    </div>');
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
                Base Pay
              </Link>
              <p className="text-sm text-gray-500 mt-1 ml-6">Payment configuration</p>
            </div>

            <div className="space-y-8">
              <ProductDetailsSection
                productName={basePayConfig.product.name}
                subtitle={basePayConfig.product.subtitle}
                imageUrl={basePayConfig.product.imageUrl}
                price={basePayConfig.product.price}
                onProductNameChange={(value) => updateProduct({ name: value })}
                onSubtitleChange={(value) => updateProduct({ subtitle: value })}
                onImageUrlChange={(value) => updateProduct({ imageUrl: value })}
                onPriceChange={(value) => updateProduct({ price: value })}
              />

              <div className="border-t border-gray-200 pt-8">
                <PaymentSettingsSection
                  recipientAddress={basePayConfig.payment.recipientAddress}
                  testnet={basePayConfig.payment.testnet}
                  enableTelemetry={basePayConfig.payment.enableTelemetry}
                  onRecipientAddressChange={(value) => updatePayment({ recipientAddress: value })}
                  onTestnetChange={(value) => updatePayment({ testnet: value })}
                  onEnableTelemetryChange={(value) => updatePayment({ enableTelemetry: value })}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <PayerInfoSection
                  requests={basePayConfig.payerInfo.requests}
                  callbackUrl={basePayConfig.payerInfo.callbackUrl}
                  onRequestChange={updatePayerInfoRequest}
                  onCallbackUrlChange={(value) => updatePayerInfo({ callbackUrl: value })}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <ButtonStyleSection
                  colorScheme={basePayConfig.buttonStyle.colorScheme}
                  onColorSchemeChange={(value) => updateButtonStyle({ colorScheme: value })}
                />
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
                  theme={basePayConfig.theme || 'light'}
                  viewMode={basePayConfig.viewMode || 'mobile'}
                  onThemeChange={updateTheme}
                  onViewModeChange={updateViewMode}
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              )}
            </div>

            {activeTab === 'preview' && (
              <MobilePreview viewMode={basePayConfig.viewMode || 'mobile'}>
                <iframe
                  src={`/demo/products/wooden-chair?config=${encodeURIComponent(JSON.stringify(basePayConfig))}&viewMode=${basePayConfig.viewMode || 'mobile'}`}
                  className="w-full h-full border-0"
                  title="Preview"
                  key={`${JSON.stringify(basePayConfig)}-${refreshKey}`}
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
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <ConfigProvider initialConfig={defaultBasePayConfig}>
        <ConfigurePageContent />
      </ConfigProvider>
    </Suspense>
  );
}
