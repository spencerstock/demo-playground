'use client';

import { Toggle } from '../ui/Toggle';
import { Input } from '../ui/Input';
import { useConfig } from '@/lib/contexts/ConfigContext';

export function FormAppearanceSection() {
  const { config, updateFormAppearance } = useConfig();

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Form appearance</h3>
      
      <div className="space-y-5">
        <Toggle
          label="Contact information"
          checked={config.formAppearance.showContactInfo}
          onChange={(checked) => updateFormAppearance({ showContactInfo: checked })}
        />
        
        <Toggle
          label="Shipping information"
          checked={config.formAppearance.showShippingInfo}
          onChange={(checked) => updateFormAppearance({ showShippingInfo: checked })}
        />

        <Input
          label="Logo URL"
          value={config.formAppearance.logoUrl}
          onChange={(e) => updateFormAppearance({ logoUrl: e.target.value })}
          placeholder="morpho.org"
        />

        <Input
          label="App Name"
          value={config.formAppearance.appName}
          onChange={(e) => updateFormAppearance({ appName: e.target.value })}
          placeholder="Morpho"
        />
      </div>
    </div>
  );
}

