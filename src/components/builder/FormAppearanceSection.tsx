'use client';

import { Input } from '../ui/Input';
import { useConfig } from '@/lib/contexts/ConfigContext';

export function FormAppearanceSection() {
  const { config, updateFormAppearance } = useConfig();

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Form appearance</h3>
      
      <div className="space-y-5">
        <Input
          label="Logo URL"
          value={config.formAppearance.logoUrl}
          onChange={(e) => updateFormAppearance({ logoUrl: e.target.value })}
          placeholder="https://example.com/logo.svg or example.com"
        />

        <Input
          label="App Name"
          value={config.formAppearance.appName}
          onChange={(e) => updateFormAppearance({ appName: e.target.value })}
          placeholder="Your App Name"
        />
      </div>
    </div>
  );
}

