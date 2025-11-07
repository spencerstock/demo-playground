'use client';

import { Toggle } from '../ui/Toggle';
import { useConfig } from '@/lib/contexts/ConfigContext';

export function CapabilitiesSection() {
  const { config, updateCapabilities } = useConfig();

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Capabilities</h3>
      
      <div className="space-y-5">
        <Toggle
          label="Sign in with ethereum"
          checked={config.capabilities.signInWithEthereum}
          onChange={(checked) => updateCapabilities({ signInWithEthereum: checked })}
        />
        
        <Toggle
          label="Request app account"
          description="A dedicated account for your app"
          checked={config.capabilities.requestAppAccount}
          onChange={(checked) => updateCapabilities({ requestAppAccount: checked })}
        />
      </div>
    </div>
  );
}

