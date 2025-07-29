import { previewProductTags } from '../../../../../../lib/product-tagging';

export async function GET(request: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    // Await params before accessing its properties
    const { sku } = await params;
    const tags = await previewProductTags(sku);
    return new Response(JSON.stringify({ tags }), { status: 200 });
  } catch (error) {
    console.error('Error previewing tags:', error);
    return new Response(JSON.stringify({ message: 'Error previewing tags' }), { status: 500 });
  }
}