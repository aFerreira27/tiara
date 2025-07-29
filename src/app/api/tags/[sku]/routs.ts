import { autoTagProduct } from '../../../../../lib/product-tagging';

export async function POST(request: Request, { params }: { params: { sku: string } }) {
  try {
    const tags = await autoTagProduct(params.sku);
    return new Response(JSON.stringify({ message: 'Product tagged', tags }), { status: 200 });
  } catch (error) {
    console.error('Error tagging product:', error);
    return new Response(JSON.stringify({ message: 'Error tagging product' }), { status: 500 });
  }
}