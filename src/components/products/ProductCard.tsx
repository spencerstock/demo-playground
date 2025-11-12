import { ProductIcon } from './ProductIcon';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      className="group bg-gray-100 rounded-xl p-4 hover:bg-gray-200 cursor-pointer transition-all duration-150"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <ProductIcon icon={product.icon} />
        <div className="flex-1">
          <h3 className="text-[15px] font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 leading-snug">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
