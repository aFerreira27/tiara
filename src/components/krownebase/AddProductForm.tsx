// AddProductForm.tsx
import { useState } from 'react';
import { Product } from '../../../types/product';

interface AddProductFormProps {
  onAddProduct: (newProduct: Product) => Promise<void>; // Add this prop
  onClose?: () => void; // Make this optional if it's not always used
}

export default function AddProductForm({ onAddProduct, onClose }: AddProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    product_description: '',
    tags: [],
    // ... other product fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.sku || !formData.product_description) {
        throw new Error('SKU and description are required');
      }

      // Call the onAddProduct function passed from parent
      await onAddProduct(formData as Product);
      
      // Reset form after successful submission
      setFormData({
        sku: '',
        product_description: '',
        tags: [],
      });

      // Close the form if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU *
        </label>
        <input
          type="text"
          id="sku"
          name="sku"
          value={formData.sku || ''}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="product_description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="product_description"
          name="product_description"
          value={formData.product_description || ''}
          onChange={handleInputChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Add other form fields as needed */}

      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
    </form>
  );
}