'use client'; // Revert to Client Component

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent } from 'react'; // Import ChangeEvent
import AppLayout from '../../components/layout/AppLayout';
import SearchBar from '../../components/krownebase/SearchBar';
import ProductCard from '../../components/krownebase/ProductCard';
import AddProductOverlay from '../../components/krownebase/AddProductOverlay';
import { Product } from '../../../types/product'; // Import the Product interface from types

export default function KrowneBase() { // Remove async
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // Use Product[] type
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Use Product[] type

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const allProducts = await response.json();
        console.log('Fetched products:', allProducts); // Log fetched products
        setProducts(allProducts);
        setFilteredProducts(allProducts); // Initially show all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []); // Empty dependency array to fetch only once on mount

  // Filter products based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter((product: Product) => // Explicitly type product
      product.sku.toLowerCase().includes(lowerCaseSearchTerm) || // Use product.sku
      product.product_description.toLowerCase().includes(lowerCaseSearchTerm) || // Search product description
      (product.tags && product.tags.toLowerCase().includes(lowerCaseSearchTerm))
      // Add other fields to search as needed based on your table columns
    );
    console.log('Filtered products:', filtered); // Log filtered products
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => { // Explicitly type event
    setSearchTerm(event.target.value);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6">Krowne Base</h1>
        <div className="flex justify-between items-center mb-6">
          <SearchBar onSearchChange={handleSearchChange} />
          {/* <AddProductButton onClick={handleOpenOverlay} />*/}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pr-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.sku} product={product} /> // Use product.sku for key
          ))}
        </div>
      </div>
      <AddProductOverlay isOpen={isOverlayOpen} onClose={handleCloseOverlay} />
    </AppLayout>
  );
}
