'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/product'; // Import the Product interface
import React from 'react'; // Import React

interface ProductCardProps {
  product: Product; // Use the imported Product interface
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the product detail page using the product's SKU
    router.push(`/krowne-base/${product.sku}`); // Use product.sku (lowercase to match interface/db)
  };

  // Determine the image source, using the first image in the array or a placeholder
  const imageSrc = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/imgPlaceholder.svg'; // Use the static placeholder image

  return (
    <div 
      className="bg-white border-2 border-gray-400 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="w-full aspect-[4/3] relative mb-3 rounded overflow-hidden bg-blue-100">
        <Image 
          src={imageSrc} // Use the determined imageSrc
          alt={product.product_description || 'Product Image'} // Use product.product_description (lowercase) for alt text
          layout="fill" 
          objectFit="cover"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{product.product_description}</h3> {/* Changed text color to text-gray-900 */}
      <div className="flex flex-wrap gap-1">
        <span className="px-2 py-1 bg-gray-200 border border-gray-400 rounded-full text-xs font-medium text-gray-700">
          {product.sku} {/* Display product.sku (lowercase) */}
        </span>
        {product.tags && product.tags.length > 0 && (
          product.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-gray-700">
                        {tag}
          </span>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCard;
