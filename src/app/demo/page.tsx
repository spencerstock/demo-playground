import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { baseProducts } from '@/lib/data/products';
import { MobileContentContainer, spacing } from '@/components/demo/MobileContentContainer';

export default function DemoProductsPage() {
  return (
    <MobileContentContainer viewMode="mobile" variant="default">
      <h1 className={`text-2xl font-bold ${spacing.section.md}`}>Products</h1>
      <div className={`flex flex-col ${spacing.gap.lg}`}>
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
    </MobileContentContainer>
  );
}

