import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import AppLayout from '@/components/layout/AppLayout';
import ProductDetail from '@/components/krownebase/ProductDetail';
import { Product } from '../../../../types/product';

interface ProductDetailPageProps {
  params: { sku: string };
}

const ProductDetailPage = async ({
  params,
}: ProductDetailPageProps) => {
  const { sku } = params;
  const router = useRouter(); // Initialize useRouter

  // In a real application, you would fetch product data from a database
  // based on the SKU. Here, we'll use a placeholder.

  // Placeholder data - replace with your actual data fetching logic
  const products: Product[] = [
    // Your product data here (e.g., fetched from an API or database)
    // Example:
    // { sku: 'SKU123', name: 'Product 1', description: 'Description 1' },
    // { sku: 'SKU456', name: 'Product 2', description: 'Description 2' },
  ];

  // Filter products to find the one with the matching SKU
  const productData = products.filter(p => p.sku === sku);

  // If product not found (array is empty), show 404 page
  if (!products || products.length === 0) {
    notFound();
  }

  // Get the first product from the returned array
  const product = products[0];

  // Define the onClose function to navigate back
  const handleCloseDetail = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <AppLayout>
      <div>
        <ProductDetail product={product} onClose={handleCloseDetail} /> {/* Pass the onClose prop */}
      </div>
    </AppLayout>
  );
};

export default ProductDetailPage;
