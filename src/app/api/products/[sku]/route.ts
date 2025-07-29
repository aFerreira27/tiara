import { getProducts } from '../../../../../lib/product-db';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    // Await the params since it's now a Promise
    const { sku } = await params;
    
    const products = await getProducts(sku);
    const product = products[0];

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}