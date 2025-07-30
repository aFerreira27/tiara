import { checkDatabaseHealth } from '../../../../lib/product-db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = await checkDatabaseHealth();
    return NextResponse.json(healthStatus);
  } catch (error: any) {
    return NextResponse.json(
      {
        healthy: false,
        message: 'Failed to perform database health check',
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
