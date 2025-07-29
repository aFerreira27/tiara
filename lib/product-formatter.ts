import { Product } from "../types/product";

export interface FormattedProduct {
  productName: string;
  sku: string;
  images: string[];
  standardFeatures: string[];
  specifications: {
    dimensionsAndWeight: {
      length?: string | number;
      width?: string | number;
      height?: string | number;
      depth?: string | number;
      productWeightLbs?: string | number;
      shippingWeightLbs?: string | number;
      shippingDimensions?: string | number;
    };
    technicalSpecifications: {
      voltage?: string;
      amps?: string;
      hp?: string;
      hertzHz?: string | number;
      flowRateGpm?: string | number;
      operatingRange?: string;
      refrigerant?: string;
      btuhrK?: string | number;
    };
    featuresAndConstruction: {
      materials?: string;
      finish?: string;
      mountingStyle?: string;
      features?: string;
      numberOfTaps?: number;
      iceCapacityLbs?: string | number;
    };
    pricingAndPackaging: {
      listPrice?: number;
      mapPrice?: number;
      caseQuantity?: number;
      palletQuantity?: number;
      upc?: string;
      htsCode?: string;
    };
    warrantyAndSupport: {
      warranty?: string;
      partsAndAccessories?: string;
      relatedProducts?: string;
    };
  };
  compliance: string[];
}

export function formatProductData(product: Product): FormattedProduct {
  return {
    productName: product.product_description || product.type,
    sku: product.sku,
    images: product.images || [],
    standardFeatures: product.features ? product.features.split(',').map(feature => feature.trim()) : [],
    specifications: {
      dimensionsAndWeight: {
        length: product.product_length_in,
        width: product.product_width_in,
        height: product.product_height_in,
        depth: product.product_depth_in,
        productWeightLbs: product.product_weight_lbs,
        shippingWeightLbs: product.shipping_weight_lbs,
        shippingDimensions: product.shipping_dimensions,
      },
      technicalSpecifications: {
        voltage: product.voltage,
        amps: product.amps,
        hp: product.hp,
        hertzHz: product.hertz_hz,
        flowRateGpm: product.flow_rate_gpm,
        operatingRange: product.operating_range,
        refrigerant: product.refrigerant,
        btuhrK: product.btuhr_k,
      },
      featuresAndConstruction: {
        materials: product.materials,
        finish: product.finish,
        mountingStyle: product.mounting_style,
        features: product.features, // Keep the raw string here for now
        numberOfTaps: product.number_of_taps,
        iceCapacityLbs: product.ice_capacity_lbs,
      },
      pricingAndPackaging: {
        listPrice: product.list_price,
        mapPrice: product.map_price,
        caseQuantity: product.case_quantity,
        palletQuantity: product.pallet_quantity,
        upc: product.upc,
        htsCode: product.hts_code,
      },
      warrantyAndSupport: {
        warranty: product.warranty,
        partsAndAccessories: product.parts_and_accessories,
        relatedProducts: product.related_products,
      },
    },
    compliance: [
      product.nsf_certification ? `NSF: ${product.nsf_certification}` : '',
      product.ul_certification ? `UL: ${product.ul_certification}` : '',
      product.etl_certification ? `ETL: ${product.etl_certification}` : '',
      product.csa_certification ? `CSA: ${product.csa_certification}` : '',
      product.ada_compliance ? 'ADA Compliant' : '',
      product.massachusetts_listed_certification ? 'MA Listed' : '',
      product.cec_listed_certification ? 'CEC Listed' : '',
    ].filter(Boolean), // Filter out empty strings
  };
}
