"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Product } from '../../../types/product'; // Import the Product interface

interface ProductDetailProps {
  productData: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productData }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const product = productData;

  const handleDownloadClick = (url: string) => {
    console.log(`Downloading from: ${url}`);
    window.open(url, '_blank');
  };

  // Assuming tags are comma-separated strings
  const tagsArray = product.tags ? product.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 relative">
          {product.images ? (
            <Image
              src={product.images}
              alt={'Product Image'} // Use a generic alt text
              width={400}
              height={300}
              layout="responsive"
              objectFit="contain"
              className="rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-md text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">{product.sku}</h2>{/* Using SKU as placeholder for name */}
          <p className="text-gray-600 text-sm mb-4">SKU: {product.sku} | Series: {product.series}</p>

          {/* Tags */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagsArray.length > 0 ? (
                tagsArray.slice(0, showAllTags ? tagsArray.length : 5).map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No tags available.</p>
              )}
              {tagsArray.length > 5 && (
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.product_description}</p>
          </div>

          {/* Tabs for detailed information */}
          {/* You can implement a tabbed interface here for standard features, specifications, and certifications */}
          <div className="mb-4">
             <h3 className="text-lg font-semibold mb-2">Standard Features</h3>
             <p className="text-gray-700">{product.features}</p>
          </div>

          <div className="mb-4">
             <h3 className="text-lg font-semibold mb-2">Specifications</h3>
             <p className="text-gray-700">{product.aq_description}</p>
          </div>

           <div className="mb-4">
             <h3 className="text-lg font-semibold mb-2">Certifications & Warnings</h3>
             <p className="text-gray-700">{product.california_prop_warning}</p>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Downloads</h3>
            <div className="flex flex-col space-y-2">
              {/* Assuming 'downloads' is an array in your Product type */}
              {/* You would need to map through the actual download fields from your schema */} 
              {/* For example, if you have 'spec_sheet', 'manuals', 'sell_sheet', 'brochure' fields */}
              {product.spec_sheet && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.spec_sheet!)}
                >
                  <Download size={18} className="mr-2" />
                  Specification Sheet
                </button>
              )}
              {product.manuals && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.manuals!)}
                >
                  <Download size={18} className="mr-2" />
                  Manual
                </button>
              )}
              {product.sell_sheet && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.sell_sheet!)}
                >
                  <Download size={18} className="mr-2" />
                  Sell Sheet
                </button>
              )}
              {product.brochure && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.brochure!)}
                >
                <Download size={18} className="mr-2" />
                  Brochure
                </button>
              )}
              {/* Add similar blocks for other downloadable files */} 
              {!product.spec_sheet && !product.manuals && !product.sell_sheet && !product.brochure && (
                <p className="text-gray-500">No downloads available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
