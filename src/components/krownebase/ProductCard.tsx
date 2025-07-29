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
      className="card cursor-pointer hover:shadow-lg p-4"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{product.sku}</h3>
      <p className="text-gray-600 text-sm">{product.product_description}</p>
      {/* Render other product details as needed */}
    </div>
  );
}
