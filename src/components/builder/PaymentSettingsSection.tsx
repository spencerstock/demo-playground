'use client';

import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';

interface PaymentSettingsSectionProps {
  recipientAddress: string;
  testnet: boolean;
  enableTelemetry: boolean;
  onRecipientAddressChange: (value: string) => void;
  onTestnetChange: (value: boolean) => void;
  onEnableTelemetryChange: (value: boolean) => void;
}

export function PaymentSettingsSection({
  recipientAddress,
  testnet,
  enableTelemetry,
  onRecipientAddressChange,
  onTestnetChange,
  onEnableTelemetryChange,
}: PaymentSettingsSectionProps) {
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const hasError = recipientAddress && !isValidAddress(recipientAddress);

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Payment settings</h3>
      
      <div className="space-y-5">
        <div>
          <Input
            label="Recipient address"
            value={recipientAddress}
            onChange={(e) => onRecipientAddressChange(e.target.value)}
            placeholder="0x0000000000000000000000000000000000000000"
            className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {hasError && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid Ethereum address (0x + 40 hex characters)
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            The Ethereum address that will receive the payment
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <Select
            value={testnet ? 'testnet' : 'mainnet'}
            onChange={(e) => onTestnetChange(e.target.value === 'testnet')}
            options={[
              { label: 'Base Sepolia (Testnet)', value: 'testnet' },
              { label: 'Base (Mainnet)', value: 'mainnet' },
            ]}
          />
        </div>

        <Toggle
          label="Enable telemetry"
          checked={enableTelemetry}
          onChange={onEnableTelemetryChange}
          description="Send usage data to help improve the SDK"
        />
      </div>
    </div>
  );
}


