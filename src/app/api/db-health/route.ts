import { checkDatabaseHealth } from '../../../../lib/product-db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = await checkDatabaseHealth();
    return NextResponse.json(healthStatus);
  } catch (error: unknown) { // Changed 'Error' to 'unknown'
    // You can now check the type of error before accessing its properties
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        healthy: false,
        message: 'Failed to perform database health check',
        error: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
