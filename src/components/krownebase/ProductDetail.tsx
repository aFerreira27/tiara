"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Product } from '../../../types/product'; // Import the Product interface
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

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

  // Use product.tags directly as it is now an array
  const tagsArray = product.tags || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 relative">
          {product.images && product.images.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={true}
              infiniteLoop={true}
              dynamicHeight={false}
              className="product-carousel"
            >
              {product.images.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image}
                    alt={`Product Image ${index + 1}`} // More descriptive alt text
                    width={600} // Adjust size as needed
                    height={400} // Adjust size as needed
                    layout="responsive"
                    objectFit="contain"
                  />
                </div>
              ))}
            </Carousel>
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
              {/* Handle spec_sheet as an array */}
              {product.spec_sheet && product.spec_sheet.length > 0 ? (
                product.spec_sheet.map((sheet, index) => (
                  <button
                    key={index}
                    className="flex items-center text-blue-500 hover:underline"
                    onClick={() => handleDownloadClick(sheet)}
                  >
                    <Download size={18} className="mr-2" />
                    Specification Sheet {index + 1}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No specification sheets available.</p>
              )}

              {product.manuals && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.manuals)}
                >
                  <Download size={18} className="mr-2" />
                  Manual
                </button>
              )}
              {product.sell_sheet && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.sell_sheet)}
                >
                  <Download size={18} className="mr-2" />
                  Sell Sheet
                </button>
              )}
              {product.brochure && (
                <button
                  className="flex items-center text-blue-500 hover:underline"
                  onClick={() => handleDownloadClick(product.brochure)}
                >
                <Download size={18} className="mr-2" />
                  Brochure
                </button>
              )}
              {/* Add similar blocks for other downloadable files that are strings */}
              {/* You might want to add a check here to see if ANY download links exist */}
              {/* This check is more complex now with arrays, you might need a state or a combined check */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
