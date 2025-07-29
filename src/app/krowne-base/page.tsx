'use client';

import { useState, useEffect, ChangeEvent } from 'react'; // Import ChangeEvent
import { Product } from '../../../types/product'; // Import the Product type with correct relative path
import AppLayout from '@/components/layout/AppLayout';
import SearchBar from '@/components/krownebase/SearchBar';
import ProductCard from '@/components/krownebase/ProductCard';
import ProductDetail from '@/components/krownebase/ProductDetail';
import AddProductOverlay from '@/components/krownebase/AddProductOverlay';
import Link from 'next/link'; // Import Link for navigation


export default function KrowneBase() {
  const [products, setProducts] = useState<Product[]>([]); // Use Product[] for state type
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Use Product[] for state type
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Use Product | null for state type
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.statusText}`);
        }
        const data: Product[] = await res.json(); // Explicitly type the fetched data
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter((product: Product) => // Explicitly type product
      product.sku.toLowerCase().includes(lowerCaseSearchTerm) || // Use product.sku
      product.product_description?.toLowerCase().includes(lowerCaseSearchTerm) || // Search product description with optional chaining
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
      // Add other fields to search as needed based on your table columns
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleCardClick = (product: Product) => { // Explicitly type product
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleOpenAddOverlay = () => {
    setIsAddOverlayOpen(true);
  };

  const handleCloseAddOverlay = () => {
    setIsAddOverlayOpen(false);
  };

  const handleAddProduct = async (newProduct: Product) => { // Explicitly type newProduct
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        throw new Error(`Error adding product: ${res.statusText}`);
      }
      const addedProduct: Product = await res.json(); // Explicitly type the added product
      setProducts([...products, addedProduct]);
      setFilteredProducts([...filteredProducts, addedProduct]); // Update filtered list as well
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Krowne Base</h1> {/* Keep h1 separate */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6"> {/* Container for search and buttons */}
        <div className="flex-grow mr-4"> {/* Container for SearchBar */}
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchInputChange} />
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0"> {/* Container for buttons */}
          <button
            onClick={async () => {
              try {
                setIsGeneratingTags(true); // Optional: add loading state
                const response = await fetch('/api/tags', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                  throw new Error('Failed to generate tags');
                }

                const result = await response.json();
                console.log('Tags generated successfully:', result.message);

                // Optional: show success message or refresh data
                alert('Tags generated successfully!');
                // window.location.reload(); // or use your state management to refresh the product list

              } catch (error) {
                console.error('Error generating tags:', error);
                alert('Failed to generate tags. Please try again.');
              } finally {
                setIsGeneratingTags(false); // Optional: remove loading state
              }
            }}
            disabled={isGeneratingTags} // Optional: disable during loading
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isGeneratingTags ? 'Generating...' : 'Generate Tags'}
          </button>
          <button
            onClick={handleOpenAddOverlay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Grid of product cards remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.sku} product={product} onClick={() => handleCardClick(product)} />
        ))}
      </div>

      {/* Product Detail and Add Product Overlay remain the same */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={handleCloseDetail} />
      )}

      {isAddOverlayOpen && (
        <AddProductOverlay
          isOpen={isAddOverlayOpen}
          onClose={handleCloseAddOverlay}
          onAddProduct={handleAddProduct}
        />
      )}
    </AppLayout>
  );
}
