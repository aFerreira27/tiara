import { autoTagAllProducts } from '../../../../lib/product-tagging';

export async function POST() {
  try {
    await autoTagAllProducts();
    return new Response(JSON.stringify({ message: 'Tagging complete' }), { status: 200 });
  } catch (error) {
    console.error('Error initiating tagging:', error);
    return new Response(JSON.stringify({ message: 'Error initiating tagging' }), { status: 500 });
  }
}