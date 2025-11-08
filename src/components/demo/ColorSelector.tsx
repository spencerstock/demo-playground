'use client';

import { useState } from 'react';

const colors = [
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

export function ColorSelector() {
  const [selected, setSelected] = useState('blue');

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900">Select color</div>
      <div className="flex gap-2">
        {colors.map(color => (
          <button
            key={color.value}
            onClick={() => setSelected(color.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selected === color.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}


