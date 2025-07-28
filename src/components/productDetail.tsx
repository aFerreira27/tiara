import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const ProductDetail = ({ productData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllTags, setShowAllTags] = useState(false);

  // Default data structure for when no data is passed
  const defaultData = {
    name: 'Product Name',
    images: [
      { id: 1, url: '/api/placeholder/400/300', alt: 'Product Image 1' },
      { id: 2, url: '/api/placeholder/400/300', alt: 'Product Image 2' },
      { id: 3, url: '/api/placeholder/400/300', alt: 'Product Image 3' },
      { id: 4, url: '/api/placeholder/400/300', alt: 'Product Image 4' }
    ],
    sku: 'SKU123',
    series: 'Series A',
    tags: ['Tag #1', 'Tag #2', 'Tag #3', 'Tag #4', 'Tag #5', 'Tag #6', 'Long Tag Name', 'Another Tag'],
    description: 'Product description will appear here...',
    standardFeatures: 'Standard features content goes here...',
    specifications: 'Technical specifications content...',
    certifications: 'Certifications and warnings information...',
    downloads: [
      { id: 1, name: 'Spec Sheets', type: 'pdf', url: '#' },
      { id: 2, name: '2D-Drawings', type: 'dwg', url: '#' },
      { id: 3, name: '3D-Drawings', type: 'step', url: '#' }
    ]
  };

  const data = productData || defaultData;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleDownload = (download) => {
    // In a real implementation, this would trigger the download
    console.log('Downloading:', download.name);
    window.open(download.url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Images and Downloads */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-blue-100 border-2 border-gray-400 rounded overflow-hidden">
            <div className="aspect-[4/3] relative">
              <img
                src={data.images[currentImageIndex]?.url || '/api/placeholder/400/300'}
                alt={data.images[currentImageIndex]?.alt || `Product Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2">
            {data.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => selectImage(index)}
                className={`flex-1 aspect-[4/3] border-2 rounded overflow-hidden relative ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-400'
                }`}
              >
                <img
                  src={image.url || '/api/placeholder/400/300'}
                  alt={image.alt || `Product Image ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-2 relative">
            <div
              className="absolute top-0 left-0 bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${100 / data.images.length}%`,
                transform: `translateX(${(currentImageIndex / (data.images.length - 1)) * (100 - (100 / data.images.length))}%)` 
              }}
            />
          </div>

          {/* Downloads */}
          <div className="space-y-2">
            {data.downloads.map((download) => (
              <button
                key={download.id}
                onClick={() => handleDownload(download)}
                className="w-full bg-blue-100 border-2 border-gray-400 rounded p-4 flex items-center justify-between hover:bg-blue-200 transition-colors"
              >
                <span className="font-medium text-gray-700">{download.name}</span>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Download size={16} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-4">
          {/* Product Name and Tags */}
          <div className="bg-white border-2 border-gray-400 rounded p-4">
            <h1 className="text-xl font-bold mb-3">{data.name}</h1>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-3 py-1 bg-gray-200 border border-gray-400 rounded-full text-sm font-medium whitespace-nowrap">
                {data.sku}
              </span>
              <span className="px-3 py-1 bg-gray-200 border border-gray-400 rounded-full text-sm font-medium whitespace-nowrap">
                Series: {data.series}
              </span>
              {data.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 border border-gray-400 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              <div className="relative inline-block flex-shrink-0">
                <span 
                  className="px-3 py-1 bg-gray-200 border border-gray-400 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap"
                  onMouseEnter={() => setShowAllTags(true)}
                  onMouseLeave={() => setShowAllTags(false)}
                >
                  ...
                </span>
                {showAllTags && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-400 rounded-lg shadow-lg p-3 z-10 min-w-64"
                    onMouseEnter={() => setShowAllTags(true)}
                    onMouseLeave={() => setShowAllTags(false)}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-2">All Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {data.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 border border-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-100 border-2 border-gray-400 rounded p-6 min-h-[100px] flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Description</h2>
          </div>

          {/* Standard Features */}
          <div className="bg-blue-100 border-2 border-gray-400 rounded p-6 min-h-[120px] flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Standard Features</h2>
          </div>

          {/* Specifications */}
          <div className="bg-blue-100 border-2 border-gray-400 rounded p-6 min-h-[100px] flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Specifications</h2>
          </div>

          {/* Certifications & Warnings */}
          <div className="bg-blue-100 border-2 border-gray-400 rounded p-6 min-h-[100px] flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Certifications & Warnings</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;