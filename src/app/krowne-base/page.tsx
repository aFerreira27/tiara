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
  const [isTagging, setIsTagging] = useState(false);

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
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
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

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Optionally re-fetch products after adding a new one
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const allProducts = await response.json();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => { // Explicitly type event
    setSearchTerm(event.target.value);
  };

  const handleGenerateTags = async () => {
    setIsTagging(true);
    try {
      // Call the API endpoint instead of directly calling the function
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate tags: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Tagging result:', result);

      // Re-fetch products to show updated tags
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
          }
          const allProducts = await response.json();
          setProducts(allProducts);
          setFilteredProducts(allProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
      await fetchProducts();
      
      // Optional: Show success message to user
      alert('Tags generated successfully!');
    } catch (error) {
      console.error('Error generating tags:', error);
      // Optional: Show error message to user
      alert('Error generating tags. Please try again.');
    } finally {
      setIsTagging(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6">Krowne Base</h1>
        <div className="flex justify-between items-center mb-6">
          <SearchBar onSearchChange={handleSearchChange} />
          <div className="flex gap-4">
            <button
              onClick={handleGenerateTags}
              disabled={isTagging}
              className={`px-4 py-2 rounded text-white ${isTagging ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isTagging ? 'Generating Tags...' : 'Generate Tags'}
            </button>
            <button
              onClick={handleOpenOverlay}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
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