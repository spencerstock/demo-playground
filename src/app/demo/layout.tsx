import { ReactNode } from 'react';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import { MobileChrome } from '@/components/demo/MobileChrome';

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <Logo />
          <button className="p-2">
            <Image 
              src="/hamburger-menu.png" 
              alt="Menu"
              width={24}
              height={24}
            />
          </button>
        </div>
      </header>

      {children}

      <MobileChrome />
    </div>
  );
}

