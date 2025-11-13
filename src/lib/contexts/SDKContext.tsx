'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { createBaseAccountSDK } from '@base-org/account';

interface SDKContextType {
  sdk: ReturnType<typeof createBaseAccountSDK> | null;
  provider: ReturnType<ReturnType<typeof createBaseAccountSDK>['getProvider']> | null;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

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
  const [sdkState, setSDKState] = useState<SDKContextType>({
    sdk: null,
    provider: null,
  });
  const initializingRef = useRef(false);

  // Create SDK instance only on the client side
  useEffect(() => {
    // Prevent double initialization in development mode (React StrictMode)
    if (initializingRef.current) return;
    initializingRef.current = true;

    // Only initialize if not already initialized
    if (typeof window !== 'undefined') {
      const sdkInstance = createBaseAccountSDK({
        appName,
        appChainIds,
        preference: {
          walletUrl,
          mode,
        },
      });

      // Single state update to avoid cascading renders
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSDKState({
        sdk: sdkInstance,
        provider: sdkInstance.getProvider(),
      });
    }
  }, [appChainIds, appName, mode, walletUrl]);

  return <SDKContext.Provider value={sdkState}>{children}</SDKContext.Provider>;
}

export function useSDK() {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK must be used within an SDKProvider');
  }
  return context;
}
