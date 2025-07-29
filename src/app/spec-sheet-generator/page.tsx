'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Download, FileText, Package, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '../../../types/product';
import AppLayout from '@/components/layout/AppLayout';
import { formatProductData, FormattedProduct } from '../../../lib/product-formatter';
import { generateSpecSheetPDF } from '../../../lib/spec-sheet-pdf';
import pdfMake from 'pdfmake/build/pdfmake';

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
  const [product, setProduct] = useState<FormattedProduct | null>(null);
  const [error, setError] = useState('');
  const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
        const formattedProduct = formatProductData(foundProduct);
        setProduct(formattedProduct);
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

  const generateHTMLSpecSheet = async () => {
    if (!product) return;
    setIsGeneratingHTML(true);
    
    // Simulate HTML generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const specSheetContent = generateSpecSheetHTML(product);
    const blob = new Blob([specSheetContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spec-sheet-${product.sku}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGeneratingHTML(false);
  };

  const generatePDFSpecSheet = async () => {
    if (!product) return;
    setIsGeneratingPDF(true);

    try {
      generateSpecSheetPDF(product);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      setError('Error generating PDF spec sheet. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateSpecSheetHTML = (product: FormattedProduct): string => {
    const specs = product.specifications;
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
        <div class="product-title">${product.productName}</div>
        <div class="sku">SKU: ${product.sku}</div>
        ${product.images && product.images.length > 0 ? `<div style="margin-top: 20px;"><img src="${product.images[0]}" alt="Product Image" style="max-width: 200px; height: auto;"></div>` : ''}
    </div>

    ${product.standardFeatures && product.standardFeatures.length > 0 ? `
    <div class="section">
        <div class="section-title">Standard Features</div>
        <ul>
            ${product.standardFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${Object.keys(specs.dimensionsAndWeight).length > 0 ? `
    <div class="section">
        <div class="section-title">Dimensions & Weight</div>
        <div class="spec-grid">
            ${specs.dimensionsAndWeight.length ? `<div class="spec-item"><span class="spec-label">Length:</span><span>${specs.dimensionsAndWeight.length}"</span></div>` : ''}
            ${specs.dimensionsAndWeight.width ? `<div class="spec-item"><span class="spec-label">Width:</span><span>${specs.dimensionsAndWeight.width}"</span></div>` : ''}
            ${specs.dimensionsAndWeight.height ? `<div class="spec-item"><span class="spec-label">Height:</span><span>${specs.dimensionsAndWeight.height}"</span></div>` : ''}
            ${specs.dimensionsAndWeight.depth ? `<div class="spec-item"><span class="spec-label">Depth:</span><span>${specs.dimensionsAndWeight.depth}"</span></div>` : ''}
            ${specs.dimensionsAndWeight.productWeightLbs ? `<div class="spec-item"><span class="spec-label">Weight:</span><span>${specs.dimensionsAndWeight.productWeightLbs} lbs</span></div>` : ''}
            ${specs.dimensionsAndWeight.shippingWeightLbs ? `<div class="spec-item"><span class="spec-label">Shipping Weight:</span><span>${specs.dimensionsAndWeight.shippingWeightLbs} lbs</span></div>` : ''}
            ${specs.dimensionsAndWeight.shippingDimensions ? `<div class="spec-item"><span class="spec-label">Shipping Dimensions:</span><span>${specs.dimensionsAndWeight.shippingDimensions}</span></div>` : ''}
        </div>
    </div>
    ` : ''}

    ${Object.keys(specs.technicalSpecifications).length > 0 ? `
    <div class="section">
        <div class="section-title">Technical Specifications</div>
        <div class="spec-grid">
            ${specs.technicalSpecifications.voltage ? `<div class="spec-item"><span class="spec-label">Voltage:</span><span>${specs.technicalSpecifications.voltage}</span></div>` : ''}
            ${specs.technicalSpecifications.amps ? `<div class="spec-item"><span class="spec-label">Amperage:</span><span>${specs.technicalSpecifications.amps}</span></div>` : ''}
            ${specs.technicalSpecifications.hp ? `<div class="spec-item"><span class="spec-label">Horsepower:</span><span>${specs.technicalSpecifications.hp}</span></div>` : ''}
            ${specs.technicalSpecifications.hertzHz ? `<div class="spec-item"><span class="spec-label">Frequency:</span><span>${specs.technicalSpecifications.hertzHz} Hz</span></div>` : ''}
            ${specs.technicalSpecifications.flowRateGpm ? `<div class="spec-item"><span class="spec-label">Flow Rate:</span><span>${specs.technicalSpecifications.flowRateGpm} GPM</span></div>` : ''}
            ${specs.technicalSpecifications.operatingRange ? `<div class="spec-item"><span class="spec-label">Operating Range:</span><span>${specs.technicalSpecifications.operatingRange}</span></div>` : ''}
            ${specs.technicalSpecifications.refrigerant ? `<div class="spec-item"><span class="spec-label">Refrigerant:</span><span>${specs.technicalSpecifications.refrigerant}</span></div>` : ''}
            ${specs.technicalSpecifications.btuhrK ? `<div class="spec-item"><span class="spec-label">BTU/HR:</span><span>${specs.technicalSpecifications.btuhrK}K</span></div>` : ''}
        </div>
    </div>
    ` : ''}

    ${Object.keys(specs.featuresAndConstruction).length > 0 ? `
    <div class="section">
        <div class="section-title">Features & Construction</div>
        <div class="spec-grid">
            ${specs.featuresAndConstruction.materials ? `<div class="spec-item"><span class="spec-label">Materials:</span><span>${specs.featuresAndConstruction.materials}</span></div>` : ''}
            ${specs.featuresAndConstruction.finish ? `<div class="spec-item"><span class="spec-label">Finish:</span><span>${specs.featuresAndConstruction.finish}</span></div>` : ''}
            ${specs.featuresAndConstruction.mountingStyle ? `<div class="spec-item"><span class="spec-label">Mounting:</span><span>${specs.featuresAndConstruction.mountingStyle}</span></div>` : ''}
            ${specs.featuresAndConstruction.features ? `<div class="spec-item"><span class="spec-label">Features:</span><span>${specs.featuresAndConstruction.features}</span></div>` : ''}
            ${specs.featuresAndConstruction.numberOfTaps ? `<div class="spec-item"><span class="spec-label">Number of Taps:</span><span>${specs.featuresAndConstruction.numberOfTaps}</span></div>` : ''}
            ${specs.featuresAndConstruction.iceCapacityLbs ? `<div class="spec-item"><span class="spec-label">Ice Capacity:</span><span>${specs.featuresAndConstruction.iceCapacityLbs} lbs</span></div>` : ''}
        </div>
    </div>
    ` : ''}

    ${product.compliance && product.compliance.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        <div class="certifications">
            ${product.compliance.map(cert => `<span class="cert-badge">${cert}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${Object.keys(specs.pricingAndPackaging).length > 0 ? `
    <div class="section">
        <div class="section-title">Pricing & Packaging</div>
        <div class="spec-grid">
            ${specs.pricingAndPackaging.listPrice !== undefined && specs.pricingAndPackaging.listPrice !== null ? `<div class="spec-item"><span class="spec-label">List Price:</span><span>$${specs.pricingAndPackaging.listPrice}</span></div>` : ''}
            ${specs.pricingAndPackaging.mapPrice !== undefined && specs.pricingAndPackaging.mapPrice !== null ? `<div class="spec-item"><span class="spec-label">MAP Price:</span><span>$${specs.pricingAndPackaging.mapPrice}</span></div>` : ''}
            ${specs.pricingAndPackaging.caseQuantity ? `<div class="spec-item"><span class="spec-label">Case Quantity:</span><span>${specs.pricingAndPackaging.caseQuantity}</span></div>` : ''}
            ${specs.pricingAndPackaging.palletQuantity ? `<div class="spec-item"><span class="spec-label">Pallet Quantity:</span><span>${specs.pricingAndPackaging.palletQuantity}</span></div>` : ''}
            ${specs.pricingAndPackaging.upc ? `<div class="spec-item"><span class="spec-label">UPC:</span><span>${specs.pricingAndPackaging.upc}</span></div>` : ''}
            ${specs.pricingAndPackaging.htsCode ? `<div class="spec-item"><span class="spec-label">HTS Code:</span><span>${specs.pricingAndPackaging.htsCode}</span></div>` : ''}
        </div>
    </div>
    ` : ''}

    ${Object.keys(specs.warrantyAndSupport).length > 0 ? `
    <div class="section">
        <div class="section-title">Warranty & Support</div>
        <div class="spec-grid">
            ${specs.warrantyAndSupport.warranty ? `<div class="spec-item"><span class="spec-label">Warranty:</span><span>${specs.warrantyAndSupport.warranty}</span></div>` : ''}
            ${specs.warrantyAndSupport.partsAndAccessories ? `<div class="spec-item"><span class="spec-label">Parts & Accessories:</span><span>${specs.warrantyAndSupport.partsAndAccessories}</span></div>` : ''}
            ${specs.warrantyAndSupport.relatedProducts ? `<div class="spec-item"><span class="spec-label">Related Products:</span><span>${specs.warrantyAndSupport.relatedProducts}</span></div>` : ''}
        </div>
    </div>
    ` : ''}

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spec Sheet Generator</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Search for products by SKU and generate professional specification sheets</p>
          </div>

          {/* Search Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Search</h2>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter SKU to search for products"
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          {product && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-500" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Product Details</h2>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={generateHTMLSpecSheet}
                    disabled={isGeneratingHTML}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGeneratingHTML ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating HTML...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Generate HTML Spec Sheet</span>
                      </>
                    )}
                  </button>
                   <button
                    onClick={generatePDFSpecSheet}
                    disabled={isGeneratingPDF}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Generate PDF Spec Sheet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">SKU:</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Family:</span>
                      <span>{product.specifications.dimensionsAndWeight.length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Type:</span>
                      <span>{product.specifications.dimensionsAndWeight.width}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Series:</span>
                      <span>{product.specifications.dimensionsAndWeight.height}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm">
                        {product.specifications.dimensionsAndWeight.depth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dimensions & Weight</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Length:</span>
                      <span>{product.specifications.dimensionsAndWeight.productWeightLbs}&quot;</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Width:</span>
                      <span>{product.specifications.dimensionsAndWeight.shippingWeightLbs}&quot;</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Height:</span>
                      <span>{product.specifications.dimensionsAndWeight.shippingDimensions}&quot;</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Weight:</span>
                      <span>{product.specifications.dimensionsAndWeight.productWeightLbs} lbs</span>
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