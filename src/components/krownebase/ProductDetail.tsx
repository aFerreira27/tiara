"use client";

import { useRouter } from 'next/navigation';
import { Product } from '../../../types/product';
import Overlay from '../sidebar/overlay/Overlay';

interface ProductDetailProps {
  product: Product;
  onClose?: () => void; // Add this line
}

function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <Overlay 
      isOpen={true}
      title="Product Details"
      onClose={handleClose}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Description:</strong> {product.product_description}</p>
        {/* Display other product details here */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3">
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {product.images && product.images.length > 0 && (
          <div className="mt-3">
            <strong>Images:</strong>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {product.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`Product ${product.sku} - ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </Overlay>
  );
}

export default ProductDetail;