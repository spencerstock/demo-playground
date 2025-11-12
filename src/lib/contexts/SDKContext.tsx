'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { createBaseAccountSDK } from '@base-org/account';

interface SDKContextValue {
  sdk: ReturnType<typeof createBaseAccountSDK>;
  provider: ReturnType<ReturnType<typeof createBaseAccountSDK>['getProvider']>;
}

const SDKContext = createContext<SDKContextValue | undefined>(undefined);

interface SDKProviderProps {
  children: ReactNode;
  appName?: string;
  appChainIds?: number[];
  walletUrl?: string;
  mode?: 'popup' | 'embedded';
}

export function SDKProvider({
  children,
  appName = 'Base Demo Playground',
  appChainIds = [8453],
  walletUrl = 'https://keys.coinbase.com/connect?externalCorrelationId=pl_01k9wzx0h3fcts0g1ya3bfkswa',
  mode = 'embedded',
}: SDKProviderProps) {
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

  const provider = useMemo(() => sdk.getProvider(), [sdk]);

  return <SDKContext.Provider value={{ sdk, provider }}>{children}</SDKContext.Provider>;
}

export function useSDK() {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK must be used within an SDKProvider');
  }
  return context;
}


