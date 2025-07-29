import { getProducts } from '../../../../../lib/product-db';
import { NextResponse } from 'next/server';

// Define error interface for better type safety
interface DatabaseError extends Error {
  name: 'DatabaseError';
  operation: string;
  originalError?: Error;
}

interface PostgreSQLError extends Error {
  code?: string;
}

// Helper function to safely extract error information
function getErrorInfo(error: unknown): {
  message: string;
  code?: string;
  stack?: string;
  name?: string;
  operation?: string;
} {
  if (error instanceof Error) {
    const pgError = error as PostgreSQLError;
    const dbError = error as DatabaseError;
    return {
      message: error.message,
      code: pgError.code,
      stack: error.stack,
      name: error.name,
      operation: dbError.operation,
    };
  }
  return {
    message: String(error),
    code: undefined,
    stack: undefined,
    name: undefined,
    operation: undefined,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    // Await the params since it's now a Promise
    const { sku } = await params;
    
    // Validate SKU parameter
    if (!sku || typeof sku !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid SKU parameter',
          message: 'SKU must be a non-empty string' 
        }, 
        { status: 400 }
      );
    }

    console.log(`Fetching product with SKU: ${sku}`);
    
    const products = await getProducts(sku);
    const product = products[0];

    if (!product) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          message: `Product with SKU ${sku} does not exist` 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
    
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    
    console.error('API Route Error:', {
      sku: (await params).sku,
      error: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      name: errorInfo.name,
      operation: errorInfo.operation || 'route_handler'
    });
    
    // Handle custom DatabaseError from your database functions
    if (errorInfo.name === 'DatabaseError') {
      console.log('Database error detected:', {
        message: errorInfo.message,
        operation: errorInfo.operation,
      });
      
      // Return appropriate status codes based on the error
      if (errorInfo.message.includes('not found')) {
        return NextResponse.json(
          { 
            error: 'Product not found',
            message: errorInfo.message,
            operation: errorInfo.operation 
          },
          { status: 404 }
        );
      }
      
      if (errorInfo.message.includes('connection') || errorInfo.message.includes('database')) {
        return NextResponse.json(
          { 
            error: 'Database connection error',
            message: 'Unable to connect to database. Please try again later.',
            operation: errorInfo.operation 
          },
          { status: 503 } // Service Unavailable
        );
      }
      
      // Other database errors
      return NextResponse.json(
        { 
          error: 'Database error',
          message: errorInfo.message,
          operation: errorInfo.operation 
        },
        { status: 500 }
      );
    }
    
    // Handle specific PostgreSQL errors that might not be wrapped
    if (errorInfo.code) {
      switch (errorInfo.code) {
        case '42P01': // Table does not exist
          return NextResponse.json(
            { 
              error: 'Database schema error',
              message: 'Required database table not found'
            },
            { status: 500 }
          );
          
        case '42703': // Column does not exist
          return NextResponse.json(
            { 
              error: 'Database schema error',
              message: 'Database column not found'
            },
            { status: 500 }
          );
          
        case 'ECONNREFUSED':
          return NextResponse.json(
            { 
              error: 'Database connection refused',
              message: 'Unable to connect to database'
            },
            { status: 503 }
          );
          
        case 'ENOTFOUND':
          return NextResponse.json(
            { 
              error: 'Database host not found',
              message: 'Database server unreachable'
            },
            { status: 503 }
          );
          
        case 'ETIMEDOUT':
          return NextResponse.json(
            { 
              error: 'Database timeout',
              message: 'Database query timed out'
            },
            { status: 504 } // Gateway Timeout
          );
      }
    }
    
    // Generic error fallback
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}