'use client';

import { ReactNode } from 'react';
import { SDKProvider } from '@/lib/contexts/SDKContext';

export function Providers({ children }: { children: ReactNode }) {
  return <SDKProvider>{children}</SDKProvider>;
}
<<<<<<< HEAD
=======


>>>>>>> 58ba0e8 (update transact)
