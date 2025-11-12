'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { createBaseAccountSDK } from '@base-org/account';

interface SDKContextType {
  sdk: ReturnType<typeof createBaseAccountSDK>;
  provider: ReturnType<ReturnType<typeof createBaseAccountSDK>['getProvider']>;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

export interface SDKProviderProps {
  children: ReactNode;
  appName?: string;
  appChainIds?: number[];
  walletUrl?: string;
  mode?: 'popup' | 'embedded';
}

export function SDKProvider({ 
  children, 
  appName = 'Base Demo Playground',
  appChainIds = [8453], // Base mainnet
  walletUrl = 'http://localhost:3005/connect',
  mode = 'embedded'
}: SDKProviderProps) {
  // Create SDK instance once using useMemo
  const sdk = useMemo(() => {
    return createBaseAccountSDK({
      appName,
      appChainIds,
      preference: {
        walletUrl,
        mode,
      },
    });
  }, [appName, appChainIds, walletUrl, mode]);

  // Get provider from SDK
  const provider = useMemo(() => sdk.getProvider(), [sdk]);

  return (
    <SDKContext.Provider value={{ sdk, provider }}>
      {children}
    </SDKContext.Provider>
  );
}

export function useSDK() {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK must be used within SDKProvider');
  }
  return context;
}

