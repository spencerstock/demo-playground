import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { baseProducts } from '@/lib/data/products';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-[800px] h-[800px]">
          <Image src="/bg-effect.png" alt="" fill className="object-contain opacity-50" priority />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <a
            href="https://docs.base.org/base-account/overview/what-is-base-account"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Start building
              <svg
                className="ml-2 w-4 h-4 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex gap-8">
          {/* Left Sidebar - Products */}
          <aside className="w-80 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Products</h2>
            <div className="flex flex-col gap-4">
              {baseProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}/configure`} className="block">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-300 rounded"></div>
              <p className="text-[15px] text-gray-600">Select a product to start your demo</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
