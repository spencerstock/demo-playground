'use client';

import { Select } from '../ui/Select';

interface ButtonStyleSectionProps {
  colorScheme: 'light' | 'dark' | 'system';
  onColorSchemeChange: (value: 'light' | 'dark' | 'system') => void;
}

export function ButtonStyleSection({
  colorScheme,
  onColorSchemeChange,
}: ButtonStyleSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Button style</h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color scheme
          </label>
          <Select
            value={colorScheme}
            onChange={(e) => onColorSchemeChange(e.target.value as 'light' | 'dark' | 'system')}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

