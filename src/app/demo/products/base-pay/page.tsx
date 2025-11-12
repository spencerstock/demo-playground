'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BasePayProductPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the wooden chair demo page, which now serves as the Base Pay demo
    router.push('/demo/products/wooden-chair');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Base Pay demo...</p>
    </div>
  );
}


