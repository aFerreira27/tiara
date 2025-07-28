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

  return (
    <div 
      className="bg-white border-2 border-gray-400 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="w-full aspect-[4/3] relative mb-3 rounded overflow-hidden bg-blue-100">
        <Image 
          src={product.images || '/api/placeholder/200/150'} // Use product.images (lowercase) for image source
          alt={product.product_description || 'Product Image'} // Use product.product_description (lowercase) for alt text
          layout="fill" 
          objectFit="cover"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.product_description}</h3> {/* Use product.product_description (lowercase) for name */}
      <div className="flex flex-wrap gap-1">
        <span className="px-2 py-1 bg-gray-200 border border-gray-400 rounded-full text-xs font-medium text-gray-700">
          SKU: {product.sku} {/* Display product.sku (lowercase) */}
        </span>
        {/* Remove placeholder Series and Tags display for now */}
      </div>
    </div>
  );
};

export default ProductCard;
