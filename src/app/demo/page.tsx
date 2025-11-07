import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { baseProducts } from '@/lib/data/products';

export default function DemoProductsPage() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="flex flex-col gap-4">
        {baseProducts.map((product) => (
          <Link 
            key={product.id}
            href={`/demo/products/${product.id}`}
            className="block"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}

