import { Product } from '../../../types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void; // Add the onClick prop
}

export default function ProductCard({
  product,
  onClick,
}: ProductCardProps) {
  return (
    <div
      key={product.sku} // Keep the key prop here
      className="card cursor-pointer hover:shadow-lg p-4 flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-full relative overflow-hidden rounded-md mb-4 bg-gray-200 pb-[100%]"> {/* Added relative and pb-[100%], removed h-32 */}
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.product_description || 'Product Image'} className="absolute inset-0 h-full w-full object-cover" /> //Added absolute inset-0
        ) : (
          <img src="/imgPlaceholder.svg" alt="Product Placeholder" className="absolute inset-0 h-full w-full object-cover p-8 text-gray-500" /> //Added absolute inset-0 and padding for placeholder
        )}
      </div>

      {/* Product Name (using product_description) */}
      <h3 className="text-lg font-semibold mb-2">{product.product_description || 'Product Name Placeholder'}</h3> {/* Use product.product_description */}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {/* Example Tags - replace with actual product.tags mapping */}
        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">{product.sku}</span>
        {product.series && (
          <span className="px-2 py-1 bg-gray-500 text-gray-700 rounded-full text-xs font-medium">{product.series}</span>
        )}
        {product.tags && product.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">{tag}</span>
        ))}
      </div>
      {/* Render other product details as needed */}
    </div>
  );
}
