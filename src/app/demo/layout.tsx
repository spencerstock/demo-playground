'use client';

import { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { MobileChrome } from '@/components/demo/MobileChrome';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ConfigProvider } from '@/lib/contexts/ConfigContext';

export default function DemoLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get('viewMode') || 'mobile';
  const isDesktop = viewMode === 'desktop';

  return (
    <AuthProvider>
      <ConfigProvider>
        <div className={`min-h-screen ${!isDesktop ? 'bg-gray-50' : 'bg-transparent'}`}>
          {children}

          {/* Mobile Chrome - only show in mobile view */}
          {!isDesktop && <MobileChrome />}
        </div>
      </ConfigProvider>
    </AuthProvider>
  );
}

