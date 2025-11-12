'use client';

import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';

interface PayerInfoRequest {
  enabled: boolean;
  optional: boolean;
}

interface PayerInfoSectionProps {
  requests: {
    email: PayerInfoRequest;
    physicalAddress: PayerInfoRequest;
    phoneNumber: PayerInfoRequest;
    name: PayerInfoRequest;
    onchainAddress: PayerInfoRequest;
  };
  callbackUrl?: string;
  onRequestChange: (type: string, enabled: boolean, optional: boolean) => void;
  onCallbackUrlChange: (value: string) => void;
}

type RequestState = 'disabled' | 'required' | 'optional';

type Preset = 'all' | 'ecommerce' | 'email-only' | 'custom';

export function PayerInfoSection({
  requests,
  callbackUrl,
  onRequestChange,
  onCallbackUrlChange,
}: PayerInfoSectionProps) {
  const requestTypes = [
    { key: 'email', label: 'Email' },
    { key: 'physicalAddress', label: 'Physical Address' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'name', label: 'Name' },
    { key: 'onchainAddress', label: 'Onchain Address' },
  ];

  const stateOptions = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'required', label: 'Required' },
    { value: 'optional', label: 'Optional' },
  ];

  const anyEnabled = Object.values(requests).some((req) => req.enabled);

  const getRequestState = (request: PayerInfoRequest): RequestState => {
    if (!request.enabled) return 'disabled';
    return request.optional ? 'optional' : 'required';
  };

  const handleStateChange = (key: string, state: RequestState) => {
    switch (state) {
      case 'disabled':
        onRequestChange(key, false, false);
        break;
      case 'required':
        onRequestChange(key, true, false);
        break;
      case 'optional':
        onRequestChange(key, true, true);
        break;
    }
  };

  const handleMasterToggle = (enabled: boolean) => {
    if (!enabled) {
      // Disable all
      requestTypes.forEach(({ key }) => {
        onRequestChange(key, false, false);
      });
    } else {
      // Enable email by default
      onRequestChange('email', true, false);
    }
  };

  const applyPreset = (preset: Preset) => {
    switch (preset) {
      case 'all':
        // Enable all fields as required
        requestTypes.forEach(({ key }) => {
          onRequestChange(key, true, false);
        });
        break;
      case 'ecommerce':
        // Email, name, physical address required; phone optional
        onRequestChange('email', true, false);
        onRequestChange('name', true, false);
        onRequestChange('physicalAddress', true, false);
        onRequestChange('phoneNumber', true, true);
        onRequestChange('onchainAddress', false, false);
        break;
      case 'email-only':
        // Just email required
        onRequestChange('email', true, false);
        onRequestChange('physicalAddress', false, false);
        onRequestChange('phoneNumber', false, false);
        onRequestChange('name', false, false);
        onRequestChange('onchainAddress', false, false);
        break;
    }
  };

  const getCurrentPreset = (): Preset | null => {
    // Check if matches "all"
    if (
      requestTypes.every(({ key }) => {
        const req = requests[key as keyof typeof requests];
        return req.enabled && !req.optional;
      })
    ) {
      return 'all';
    }

    // Check if matches "ecommerce"
    if (
      requests.email.enabled &&
      !requests.email.optional &&
      requests.name.enabled &&
      !requests.name.optional &&
      requests.physicalAddress.enabled &&
      !requests.physicalAddress.optional &&
      requests.phoneNumber.enabled &&
      requests.phoneNumber.optional &&
      !requests.onchainAddress.enabled
    ) {
      return 'ecommerce';
    }

    // Check if matches "email-only"
    if (
      requests.email.enabled &&
      !requests.email.optional &&
      !requests.physicalAddress.enabled &&
      !requests.phoneNumber.enabled &&
      !requests.name.enabled &&
      !requests.onchainAddress.enabled
    ) {
      return 'email-only';
    }

    return null;
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Payer information</h3>
            <p className="text-sm text-gray-600">
              Request additional information from the payer during checkout
            </p>
          </div>
          <Toggle checked={anyEnabled} onChange={handleMasterToggle} />
        </div>
      </div>

      {anyEnabled && (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => applyPreset('email-only')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPreset === 'email-only'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email only
            </button>
            <button
              onClick={() => applyPreset('ecommerce')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPreset === 'ecommerce'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ecommerce
            </button>
            <button
              onClick={() => applyPreset('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPreset === 'all'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {currentPreset === null && (
              <span className="px-3 py-1.5 text-sm text-gray-500 italic">Custom</span>
            )}
          </div>

          <div className="space-y-3">
            {requestTypes.map(({ key, label }) => {
              const request = requests[key as keyof typeof requests];
              const currentState = getRequestState(request);

              return (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                    {label}
                  </label>
                  <div className="flex-1 max-w-xs">
                    <select
                      value={currentState}
                      onChange={(e) => handleStateChange(key, e.target.value as RequestState)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {stateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Input
              label="Callback URL (optional)"
              value={callbackUrl || ''}
              onChange={(e) => onCallbackUrlChange(e.target.value)}
              placeholder="https://api.example.com/webhooks/payer-info"
            />
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p className="font-medium">Where should we send the collected information?</p>
              <p className="text-gray-500">
                After payment, we&apos;ll POST the payer&apos;s information to this URL. Use this to
                save customer data to your database, fulfill orders, or trigger email sequences.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Example:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  https://api.yoursite.com/webhooks/base-pay
                </code>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
