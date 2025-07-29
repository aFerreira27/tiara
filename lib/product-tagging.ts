import { Product } from '../types/product';
import { getProducts, editProduct } from './product-db';

export const allTags = [
  'Air Switches', 'Alchemy', 'Bar Sinks', 'Beer Systems', 'Beverage Dispensing', 
  'Bottle Coolers', 'Casters', 'Direct Draw Coolers', 'Dispensing Faucets', 'Drainboards', 
  'Drainers & Rinsers', 'Drains', 'Dry Storage Cabinets', 'Dump Sinks', 'Electric', 
  'Electric Sensor Faucets', 'Faucets', 'Foodservice', 'Freezers', 'Gas Connectors', 'Gas Systems', 
  'Glass Chiller', 'Glass Washer', 'Hand Sinks', 'Home', 'Hose Reels', 'HydroSift', 
  'Ice Bin', 'Kits', 'Liquor Displays', 'Locking Covers', 'Mixology', 
  'Mop Floor Sinks', 'MoveWell', 'Mug Froster', 'Parts & Accessories', 'Pass Thru Units', 
  'Perforated Inserts', 'Pet Grooming', 'Plumbing', 'Pot Fillers', 'Power Packs', 
  'Pre-Rinse Units', 'Refrigeration', 'Regulator Panels', 'Remote', 'Robotic Bartenders', 
  'Sinks', 'Soap Dispensers', 'Soda Gun Holders', 'Specialized Stations', 
  'Speed Units', 'Spouts', 'Stations', 'Storage Cabinets', 'Towers', 'Trash Chute', 
  'Trunk Lines', 'Underbar', 'Utility', 'Vinyl Wrap', 'Water Filters', 'Workstations'
] as const;

// Keyword mapping for intelligent tagging
const tagKeywords: Record<string, string[]> = {
  'Air Switches': ['air switch', 'pneumatic switch', 'air operated'],
  'Bar Sinks': ['bar sink', 'bartender sink', 'cocktail sink'],
  'Beer Systems': ['beer', 'keg', 'tap', 'draft', 'brewery', 'ale', 'lager'],
  'Beverage Dispensing': ['beverage', 'dispenser', 'drink', 'pour', 'serving'],
  'Bottle Coolers': ['bottle cooler', 'bottle chiller', 'bottle refrigerator'],
  'Casters': ['caster', 'wheel', 'rolling', 'mobile', 'swivel wheel'],
  'Direct Draw Coolers': ['direct draw', 'kegerator', 'beer cooler'],
  'Dispensing Faucets': ['dispensing faucet', 'tap faucet', 'beer faucet'],
  'Drainboards': ['drainboard', 'drain board', 'drying board'],
  'Drainers & Rinsers': ['drainer', 'rinser', 'rinse', 'drain basket'],
  'Drains': ['drain', 'drainage', 'floor drain', 'sink drain'],
  'Dry Storage Cabinets': ['dry storage', 'storage cabinet', 'pantry cabinet'],
  'Dump Sinks': ['dump sink', 'janitor sink', 'utility sink', 'slop sink'],
  'Electric': ['electric', 'electrical', 'powered', 'motor', 'wiring'],
  'Electric Sensor Faucets': ['sensor faucet', 'automatic faucet', 'touchless faucet', 'infrared'],
  'Faucets': ['faucet', 'spigot', 'valve', 'tap'],
  'Foodservice': ['foodservice', 'restaurant', 'commercial kitchen', 'food prep'],
  'Freezers': ['freezer', 'frozen', 'ice cream', 'gelato'],
  'Gas Connectors': ['gas connector', 'gas fitting', 'gas line'],
  'Gas Systems': ['gas system', 'propane', 'natural gas', 'gas supply'],
  'Glass Chiller': ['glass chiller', 'glass froster', 'mug chiller'],
  'Glass Washer': ['glass washer', 'glassware washer', 'bar glass'],
  'Hand Sinks': ['hand sink', 'handwashing', 'wash station', 'lavatory'],
  'Home': ['home', 'residential', 'household', 'domestic'],
  'Hose Reels': ['hose reel', 'hose storage', 'retractable hose'],
  'HydroSift': ['hydrosift', 'sift', 'filtration'],
  'Ice Bin': ['ice bin', 'ice chest', 'ice storage', 'ice well'],
  'Kits': ['kit', 'package', 'set', 'bundle', 'assembly'],
  'Liquor Displays': ['liquor display', 'bottle display', 'wine rack', 'spirit display'],
  'Locking Covers': ['locking cover', 'security cover', 'lockable lid'],
  'Mixology': ['mixology', 'cocktail', 'bartending', 'mixing'],
  'Mop Floor Sinks': ['mop sink', 'floor sink', 'janitor sink', 'cleaning sink'],
  'MoveWell': ['movewell', 'mobile', 'portable'],
  'Mug Froster': ['mug froster', 'mug chiller', 'beer mug'],
  'Parts & Accessories': ['part', 'accessory', 'component', 'replacement', 'spare'],
  'Pass Thru Units': ['pass thru', 'pass through', 'serving window'],
  'Perforated Inserts': ['perforated', 'insert', 'strainer', 'colander'],
  'Pet Grooming': ['pet grooming', 'dog wash', 'animal bathing'],
  'Plumbing': ['plumbing', 'pipe', 'fitting', 'connection', 'water line'],
  'Pot Fillers': ['pot filler', 'pasta arm', 'swing faucet', 'wall mount faucet'],
  'Power Packs': ['power pack', 'motor', 'pump', 'electrical unit'],
  'Pre-Rinse Units': ['pre-rinse', 'pre rinse', 'spray rinse', 'dish rinse'],
  'Refrigeration': ['refrigeration', 'cooling', 'chiller', 'cooler', 'refrigerator'],
  'Regulator Panels': ['regulator panel', 'gas regulator', 'pressure regulator'],
  'Remote': ['remote', 'wireless', 'control panel', 'digital'],
  'Robotic Bartenders': ['robotic bartender', 'automated bartender', 'robot'],
  'Sinks': ['sink', 'basin', 'wash basin'],
  'Soap Dispensers': ['soap dispenser', 'hand soap', 'sanitizer dispenser'],
  'Soda Gun Holders': ['soda gun', 'beverage gun', 'gun holder'],
  'Specialized Stations': ['station', 'workstation', 'prep station'],
  'Speed Units': ['speed unit', 'quick serve', 'fast service'],
  'Spouts': ['spout', 'nozzle', 'pour spout'],
  'Stations': ['station', 'work station', 'prep area'],
  'Storage Cabinets': ['storage cabinet', 'cabinet', 'storage unit'],
  'Towers': ['tower', 'beer tower', 'draft tower', 'dispensing tower'],
  'Trash Chute': ['trash chute', 'garbage chute', 'waste chute'],
  'Trunk Lines': ['trunk line', 'main line', 'supply line'],
  'Underbar': ['underbar', 'under bar', 'bar equipment'],
  'Utility': ['utility', 'general purpose', 'multi-use'],
  'Vinyl Wrap': ['vinyl wrap', 'vinyl coating', 'wrap'],
  'Water Filters': ['water filter', 'filtration', 'purification', 'filter cartridge'],
  'Workstations': ['workstation', 'work station', 'prep station', 'work surface']
};

/**
 * Analyzes product text and assigns relevant tags based on keyword matching
 */
function analyzeProductForTags(product: Product): string[] {
  const searchText = [
    product.product_description,
    product.sku,
    // Add other relevant fields you want to analyze
    // product.title, product.category, etc.
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const assignedTags: string[] = [];

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    const hasMatch = keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      assignedTags.push(tag);
    }
  }

  // Remove duplicates and return
  return [...new Set(assignedTags)];
}

/**
 * Auto-tags all products in the database
 */
export async function autoTagAllProducts(): Promise<void> {
  try {
    console.log('Starting auto-tagging process...');
    
    // Get all products
    const products = await getProducts();
    console.log(`Found ${products.length} products to analyze`);

    let taggedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Generate tags for this product
        const suggestedTags = analyzeProductForTags(product);
        
        if (suggestedTags.length > 0) {
          // Update the product with new tags
          await editProduct(product.sku, { tags: suggestedTags });
          console.log(`Tagged ${product.sku} with: ${suggestedTags.join(', ')}`);
          taggedCount++;
        } else {
          console.log(`No tags found for ${product.sku}`);
        }
      } catch (error) {
        console.error(`Error tagging product ${product.sku}:`, error);
        errorCount++;
      }
    }

    console.log(`Auto-tagging complete! Tagged ${taggedCount} products, ${errorCount} errors`);
  } catch (error) {
    console.error('Error in auto-tagging process:', error);
    throw error;
  }
}

/**
 * Auto-tags a specific product by SKU
 */
export async function autoTagProduct(sku: string): Promise<string[]> {
  try {
    const products = await getProducts(sku);
    if (products.length === 0) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    const product = products[0];
    const suggestedTags = analyzeProductForTags(product);
    
    if (suggestedTags.length > 0) {
      await editProduct(sku, { tags: suggestedTags });
      console.log(`Tagged ${sku} with: ${suggestedTags.join(', ')}`);
    }

    return suggestedTags;
  } catch (error) {
    console.error(`Error auto-tagging product ${sku}:`, error);
    throw error;
  }
}

/**
 * Preview tags for a product without saving to database
 */
export async function previewProductTags(sku: string): Promise<string[]> {
  try {
    const products = await getProducts(sku);
    if (products.length === 0) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    return analyzeProductForTags(products[0]);
  } catch (error) {
    console.error(`Error previewing tags for product ${sku}:`, error);
    throw error;
  }
}