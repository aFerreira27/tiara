import { Product } from '../../../types/product';
import Overlay from '../sidebar/overlay/Overlay'; // Assuming Overlay component is in this path

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({
  product,
  onClose,
}: ProductDetailProps) {
  return (
    <Overlay onClose={onClose}> {/* Assuming Overlay component accepts an onClose prop */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Description:</strong> {product.product_description}</p>
        {/* Display other product details here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </Overlay>
  );
}
