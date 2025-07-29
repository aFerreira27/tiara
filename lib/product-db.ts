import { Pool } from 'pg';
import { Product } from '../types/product';

// Define PostgreSQL error interface
interface PostgreSQLError extends Error {
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: string;
  routine?: string;
}

// Helper function to safely extract error information
function getErrorInfo(error: unknown): {
  message: string;
  code?: string;
  stack?: string;
} {
  if (error instanceof Error) {
    const pgError = error as PostgreSQLError;
    return {
      message: error.message,
      code: pgError.code,
      stack: error.stack,
    };
  }
  return {
    message: String(error),
    code: undefined,
    stack: undefined,
  };
}

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';

let poolConfig;

if (isProduction) {
  // Firebase App Hosting - use Unix socket
  poolConfig = {
    user: process.env.DB_USER,
    password: process.env.TIARAADMINPASS,
    database: process.env.DB_NAME,
    host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    // Add production-specific settings
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    connectionTimeoutMillis: 5000, // Connection timeout
  };
} else {
  // Local development - use Cloud SQL Proxy
  poolConfig = {
    user: "Tiara Admin",
    password: process.env.TIARAADMINPASS,
    database: "prodinfo",
    host: "127.0.0.1",
    port: 5432,
    // Add development-specific settings
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

const pool = new Pool(poolConfig);

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Updated type to include string[] for PostgreSQL arrays
type QueryParam = string | number | boolean | null | string[];

const db = {
  query: async (text: string, params?: QueryParam[]) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error: unknown) {
      const errorInfo = getErrorInfo(error);
      const duration = Date.now() - start;
      console.error('Query error', { 
        text, 
        duration, 
        error: errorInfo.message,
        code: errorInfo.code 
      });
      throw error;
    }
  },
};

// Custom error class for database operations
class DatabaseError extends Error {
  constructor(message: string, public originalError: Error | null, public operation: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Function to add a new product
export async function addProduct(productData: Product): Promise<Product> {
  const { sku, product_description, tags, /* ... other product properties */ } = productData;
  
  // Validate required fields
  if (!sku) {
    throw new DatabaseError('SKU is required', null, 'addProduct');
  }

  const sql = `INSERT INTO product_data (sku, product_description, tags, /* ... other columns */) 
               VALUES ($1, $2, $3, /* ... other values */) RETURNING *`;
  const params: QueryParam[] = [sku, product_description, tags ?? null /* ... other values */];
  
  try {
    const result = await db.query(sql, params);
    
    if (!result.rows[0]) {
      throw new DatabaseError('Product was not created successfully', null, 'addProduct');
    }
    
    console.log(`Product added successfully: ${sku}`);
    return result.rows[0];
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error adding product:', {
      sku,
      error: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      operation: 'addProduct'
    });
    
    // Handle specific PostgreSQL errors
    if (errorInfo.code === '23505') { // Unique violation
      throw new DatabaseError(`Product with SKU ${sku} already exists`, error as Error, 'addProduct');
    } else if (errorInfo.code === '23502') { // Not null violation
      throw new DatabaseError('Required field is missing', error as Error, 'addProduct');
    } else if (errorInfo.code === '42703') { // Undefined column
      throw new DatabaseError('Database schema error - column does not exist', error as Error, 'addProduct');
    }
    
    throw new DatabaseError(`Failed to add product: ${errorInfo.message}`, error as Error, 'addProduct');
  }
}

// Function to delete a product by SKU
export async function deleteProduct(sku: string): Promise<Product> {
  // Validate input
  if (!sku) {
    throw new DatabaseError('SKU is required for deletion', null, 'deleteProduct');
  }

  const sql = `DELETE FROM product_data WHERE sku = $1 RETURNING *`;
  const params: QueryParam[] = [sku];
  
  try {
    const result = await db.query(sql, params);
    
    if (!result.rows[0]) {
      throw new DatabaseError(`Product with SKU ${sku} not found`, null, 'deleteProduct');
    }
    
    console.log(`Product deleted successfully: ${sku}`);
    return result.rows[0];
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error deleting product:', {
      sku,
      error: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      operation: 'deleteProduct'
    });
    
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    throw new DatabaseError(`Failed to delete product: ${errorInfo.message}`, error as Error, 'deleteProduct');
  }
}

// Function to edit an existing product by SKU
export async function editProduct(sku: string, productData: Partial<Product>): Promise<Product> {
  // Validate input
  if (!sku) {
    throw new DatabaseError('SKU is required for editing', null, 'editProduct');
  }

  const { product_description, tags, /* ... other product properties to update */ } = productData;

  let sql = `UPDATE product_data SET `;
  const updates: string[] = [];
  const params: QueryParam[] = [];
  let paramIndex = 1;

  if (product_description !== undefined) {
    updates.push(`product_description = $${paramIndex++}`);
    params.push(product_description ?? null);
  }

  if (tags !== undefined) {
    updates.push(`tags = $${paramIndex++}`);
    params.push(tags ?? null);
  }

  // Add other fields to update similarly
  // if (otherField !== undefined) { updates.push(`other_field = $${paramIndex++}`); params.push(otherField); }

  // Check if there are any updates to make
  if (updates.length === 0) {
    throw new DatabaseError('No fields provided for update', null, 'editProduct');
  }

  sql += updates.join(', ');
  sql += ` WHERE sku = $${paramIndex++} RETURNING *`;
  params.push(sku);

  try {
    const result = await db.query(sql, params);
    
    if (!result.rows[0]) {
      throw new DatabaseError(`Product with SKU ${sku} not found`, null, 'editProduct');
    }
    
    console.log(`Product edited successfully: ${sku}`);
    return result.rows[0];
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error editing product:', {
      sku,
      updates: Object.keys(productData),
      error: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      operation: 'editProduct'
    });
    
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    // Handle specific PostgreSQL errors
    if (errorInfo.code === '42703') { // Undefined column
      throw new DatabaseError('Database schema error - column does not exist', error as Error, 'editProduct');
    }
    
    throw new DatabaseError(`Failed to edit product: ${errorInfo.message}`, error as Error, 'editProduct');
  }
}

// Function to get product(s)
export async function getProducts(sku?: string): Promise<Product[]> {
  let sql = `SELECT * FROM product_data`;
  const params: QueryParam[] = [];

  if (sku) {
    sql += ` WHERE sku = $1`;
    params.push(sku);
  }

  try {
    console.log(`Fetching products${sku ? ` for SKU: ${sku}` : ' (all)'}`);
    
    const result = await db.query(sql, params);
    
    if (sku && result.rows.length === 0) {
      throw new DatabaseError(`Product with SKU ${sku} not found`, null, 'getProducts');
    }
    
    const products: Product[] = result.rows.map((row: Record<string, unknown>) => {
      try {
        return {
          ...row,
          // Handle images as array directly since it's now text[] type
          images: row.images && Array.isArray(row.images) ? row.images : null,
          // Handle tags as array directly since it's now text[] type
          tags: row.tags && Array.isArray(row.tags) ? row.tags : null,
        } as Product;
      } catch (mappingError: unknown) {
        const errorInfo = getErrorInfo(mappingError);
        console.error('Error mapping product row:', {
          row,
          error: errorInfo.message,
          sku: row.sku
        });
        throw new DatabaseError(`Error processing product data for SKU ${row.sku}`, mappingError as Error, 'getProducts');
      }
    });
    
    console.log(`Successfully fetched ${products.length} product(s)`);
    return products;
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error getting products:', {
      sku,
      error: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      operation: 'getProducts'
    });
    
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    // Handle specific PostgreSQL errors
    if (errorInfo.code === '42P01') { // Undefined table
      throw new DatabaseError('Database table "product_data" does not exist', error as Error, 'getProducts');
    } else if (errorInfo.code === '42703') { // Undefined column
      throw new DatabaseError('Database schema error - column does not exist', error as Error, 'getProducts');
    } else if (errorInfo.code === 'ECONNREFUSED') {
      throw new DatabaseError('Database connection refused - check if database is running', error as Error, 'getProducts');
    } else if (errorInfo.code === 'ENOTFOUND') {
      throw new DatabaseError('Database host not found - check connection settings', error as Error, 'getProducts');
    }
    
    throw new DatabaseError(`Failed to get products: ${errorInfo.message}`, error as Error, 'getProducts');
  }
}

// Health check function to test database connectivity
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await db.query('SELECT 1 as health_check');
    return result.rows[0]?.health_check === 1;
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Database health check failed:', errorInfo.message);
    return false;
  }
}

// Graceful shutdown function
export async function closeDatabasePool(): Promise<void> {
  try {
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error closing database pool:', errorInfo.message);
  }
}