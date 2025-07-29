// src/app/krowne-base/[sku]/page.tsx

import { notFound } from 'next/navigation';
import ProductDetail from '../../../components/krownebase/ProductDetail';
import { getProducts } from '../../../../lib/product-db'; // Importing getProducts

interface ProductDetailPageProps {
  params: { 
    sku: string; 
  };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { sku } = params;

  // Fetch product data based on SKU
  const products = await getProducts(sku);

  // If product not found (array is empty), show 404 page
  if (!products || products.length === 0) {
    notFound();
  }

  // Get the first product from the returned array
  const productData = products[0];

  return (
    <div>
      {/* You might want to add a layout or wrapper here if needed */}
      <ProductDetail productData={productData} />
    </div>
  );
};

export default ProductDetailPage;
