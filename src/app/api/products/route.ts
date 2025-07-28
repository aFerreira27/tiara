import { getProducts } from '../../../../lib/product-db';

export async function GET() {
  try {
    const products = await getProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ message: 'Error fetching products' }), { status: 500 });
  }
}