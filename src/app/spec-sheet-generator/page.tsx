'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Download, FileText, Package, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '../../../types/product';
import AppLayout from '@/components/layout/AppLayout';

// Function to search for a product by SKU
const searchProductBySKU = async (sku: string): Promise<Product | null> => {
  try {
    const res = await fetch(`/api/products/${sku}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default function SpecSheetGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [skuInput, setSkuInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  const handleSearch = async () => {
    if (!skuInput.trim()) {
      setError('Please enter a SKU');
      return;
    }

    setIsSearching(true);
    setError('');
    setProduct(null);

    try {
      const foundProduct = await searchProductBySKU(skuInput.trim());
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found. Please check the SKU and try again.');
      }
    } catch (err) {
      setError('Error searching for product. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const generateSpecSheet = async () => {
    setIsGenerating(true);
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would generate and download the PDF here
    const specSheetContent = generateSpecSheetHTML(product!);
    const blob = new Blob([specSheetContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spec-sheet-${product!.sku}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const generateSpecSheetHTML = (product: Product): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Spec Sheet - ${product.sku}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .product-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .sku { font-size: 18px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
        .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .spec-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ddd; }
        .spec-label { font-weight: bold; }
        .certifications { display: flex; flex-wrap: wrap; gap: 10px; }
        .cert-badge { background: #e8f5e8; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="product-title">${product.product_description || product.type}</div>
        <div class="sku">SKU: ${product.sku}</div>
        <div style="margin-top: 10px; color: #666;">Family: ${product.family} | Series: ${product.series}</div>
    </div>

    <div class="section">
        <div class="section-title">Product Overview</div>
        <div class="spec-grid">
            <div class="spec-item"><span class="spec-label">Description:</span><span>${product.product_description}</span></div>
            <div class="spec-item"><span class="spec-label">Type:</span><span>${product.type}</span></div>
            <div class="spec-item"><span class="spec-label">Status:</span><span>${product.product_status}</span></div>
            <div class="spec-item"><span class="spec-label">Country of Origin:</span><span>${product.country_of_origin}</span></div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dimensions & Weight</div>
        <div class="spec-grid">
            <div class="spec-item"><span class="spec-label">Length:</span><span>${product.product_length_in}"</span></div>
            <div class="spec-item"><span class="spec-label">Width:</span><span>${product.product_width_in}"</span></div>
            <div class="spec-item"><span class="spec-label">Height:</span><span>${product.product_height_in}"</span></div>
            <div class="spec-item"><span class="spec-label">Depth:</span><span>${product.product_depth_in}"</span></div>
            <div class="spec-item"><span class="spec-label">Weight:</span><span>${product.product_weight_lbs} lbs</span></div>
            <div class="spec-item"><span class="spec-label">Shipping Weight:</span><span>${product.shipping_weight_lbs} lbs</span></div>
            <div class="spec-item"><span class="spec-label">Shipping Dimensions:</span><span>${product.shipping_dimensions}</span></div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Technical Specifications</div>
        <div class="spec-grid">
            ${product.voltage ? `<div class="spec-item"><span class="spec-label">Voltage:</span><span>${product.voltage}</span></div>` : ''}
            ${product.amps ? `<div class="spec-item"><span class="spec-label">Amperage:</span><span>${product.amps}</span></div>` : ''}
            ${product.hp ? `<div class="spec-item"><span class="spec-label">Horsepower:</span><span>${product.hp}</span></div>` : ''}
            ${product.hertz_hz ? `<div class="spec-item"><span class="spec-label">Frequency:</span><span>${product.hertz_hz} Hz</span></div>` : ''}
            ${product.flow_rate_gpm ? `<div class="spec-item"><span class="spec-label">Flow Rate:</span><span>${product.flow_rate_gpm} GPM</span></div>` : ''}
            ${product.operating_range ? `<div class="spec-item"><span class="spec-label">Operating Range:</span><span>${product.operating_range}</span></div>` : ''}
            ${product.refrigerant ? `<div class="spec-item"><span class="spec-label">Refrigerant:</span><span>${product.refrigerant}</span></div>` : ''}
            ${product.btuhr_k ? `<div class="spec-item"><span class="spec-label">BTU/HR:</span><span>${product.btuhr_k}K</span></div>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Features & Construction</div>
        <div class="spec-grid">
            ${product.materials ? `<div class="spec-item"><span class="spec-label">Materials:</span><span>${product.materials}</span></div>` : ''}
            ${product.finish ? `<div class="spec-item"><span class="spec-label">Finish:</span><span>${product.finish}</span></div>` : ''}
            ${product.mounting_style ? `<div class="spec-item"><span class="spec-label">Mounting:</span><span>${product.mounting_style}</span></div>` : ''}
            ${product.features ? `<div class="spec-item"><span class="spec-label">Features:</span><span>${product.features}</span></div>` : ''}
            ${product.number_of_taps ? `<div class="spec-item"><span class="spec-label">Number of Taps:</span><span>${product.number_of_taps}</span></div>` : ''}
            ${product.ice_capacity_lbs ? `<div class="spec-item"><span class="spec-label">Ice Capacity:</span><span>${product.ice_capacity_lbs} lbs</span></div>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Certifications</div>
        <div class="certifications">
            ${product.nsf_certification ? `<span class="cert-badge">NSF: ${product.nsf_certification}</span>` : ''}
            ${product.ul_certification ? `<span class="cert-badge">UL: ${product.ul_certification}</span>` : ''}
            ${product.etl_certification ? `<span class="cert-badge">ETL: ${product.etl_certification}</span>` : ''}
            ${product.csa_certification ? `<span class="cert-badge">CSA: ${product.csa_certification}</span>` : ''}
            ${product.ada_compliance ? `<span class="cert-badge">ADA Compliant</span>` : ''}
            ${product.massachusetts_listed_certification ? `<span class="cert-badge">MA Listed</span>` : ''}
            ${product.cec_listed_certification ? `<span class="cert-badge">CEC Listed</span>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Pricing & Packaging</div>
        <div class="spec-grid">
            <div class="spec-item"><span class="spec-label">List Price:</span><span>$${product.list_price.toFixed(2)}</span></div>
            <div class="spec-item"><span class="spec-label">MAP Price:</span><span>$${product.map_price.toFixed(2)}</span></div>
            <div class="spec-item"><span class="spec-label">Case Quantity:</span><span>${product.case_quantity}</span></div>
            <div class="spec-item"><span class="spec-label">Pallet Quantity:</span><span>${product.pallet_quantity}</span></div>
            <div class="spec-item"><span class="spec-label">UPC:</span><span>${product.upc}</span></div>
            <div class="spec-item"><span class="spec-label">HTS Code:</span><span>${product.hts_code}</span></div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Warranty & Support</div>
        <div class="spec-grid">
            <div class="spec-item"><span class="spec-label">Warranty:</span><span>${product.warranty}</span></div>
            ${product.parts_and_accessories ? `<div class="spec-item"><span class="spec-label">Parts & Accessories:</span><span>${product.parts_and_accessories}</span></div>` : ''}
            ${product.related_products ? `<div class="spec-item"><span class="spec-label">Related Products:</span><span>${product.related_products}</span></div>` : ''}
        </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666;">
        Generated on ${new Date().toLocaleDateString()} | SKU: ${product.sku}
    </div>

</body>
</html>
    `;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Spec Sheet Generator</h1>
            </div>
            <p className="text-gray-600">Search for products by SKU and generate professional specification sheets</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Product Search</h2>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter SKU to search for products"
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          {product && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Product Details</h2>
                </div>
                <button
                  onClick={generateSpecSheet}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Generate Spec Sheet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Family:</span>
                      <span>{product.family}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Type:</span>
                      <span>{product.type}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Series:</span>
                      <span>{product.series}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Status:</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                        {product.product_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions & Weight</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Length:</span>
                      <span>{product.product_length_in}"</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Width:</span>
                      <span>{product.product_width_in}"</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Height:</span>
                      <span>{product.product_height_in}"</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span>{product.product_weight_lbs} lbs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* More sections can go here like Technical Specs, Certifications, etc. if needed */}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}