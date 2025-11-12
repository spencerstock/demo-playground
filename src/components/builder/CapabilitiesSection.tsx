'use client';

import { useConfig } from '@/lib/contexts/ConfigContext';

export function CapabilitiesSection() {
  const { config, updateCapabilities } = useConfig();

  // This section is only for ProductConfig, not BasePayConfig
  if (!('capabilities' in config)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Capabilities</h3>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] text-gray-900">Sign in with Ethereum</div>
            <div className="text-sm text-gray-500 mt-0.5">Standard protocol for authentication</div>
          </div>
          <input
            type="checkbox"
            checked={config.capabilities.signInWithEthereum}
            onChange={(e) => updateCapabilities({ signInWithEthereum: e.target.checked })}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
