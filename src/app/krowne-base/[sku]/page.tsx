'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ProductDetailComponent from '@/components/krownebase/ProductDetail';
import { Product } from '../../../../types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const sku = params.sku as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${sku}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        const productData: Product = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <AppLayout>
      <ProductDetailComponent product={product} />
    </AppLayout>
  );
}