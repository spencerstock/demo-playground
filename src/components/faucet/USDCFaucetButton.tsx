'use client';

import Image from 'next/image';

interface USDCFaucetButtonProps {
  onClick: () => void;
}

export function USDCFaucetButton({ onClick }: USDCFaucetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Image src="/usdc-logo.png" alt="USDC" width={24} height={24} />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-900">Testnet USDC required</h3>
          <p className="text-xs text-gray-500 mt-0.5">Get sepolia USDC on Base</p>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

