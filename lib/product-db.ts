import { Pool, PoolConfig } from 'pg';
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

// Validate required environment variables
function validateEnvironment() {
  const required = ['TIARAADMINPASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (isProduction) {
    const prodRequired = ['DB_USER', 'DB_NAME', 'INSTANCE_CONNECTION_NAME'];
    const prodMissing = prodRequired.filter(key => !process.env[key]);
    if (prodMissing.length > 0) {
      throw new Error(`Missing required production environment variables: ${prodMissing.join(', ')}`);
    }
  }
}

// Validate environment on startup
validateEnvironment();

let poolConfig: PoolConfig;

if (isProduction) {
  // Firebase App Hosting - use Unix socket
  console.log('Configuring database for production environment');
  poolConfig = {
    user: process.env.DB_USER!,
    password: process.env.TIARAADMINPASS!,
    database: process.env.DB_NAME!,
    host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    // Production-specific settings
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    connectionTimeoutMillis: 10000, // Increased timeout for Cloud SQL
    // SSL configuration for Cloud SQL
    ssl: false, // Unix socket doesn't need SSL
  };
} else {
  // Local development - use Cloud SQL Proxy or direct connection
  console.log('Configuring database for development environment');
  poolConfig = {
    user: process.env.DB_USER || "Tiara Admin",
    password: process.env.TIARAADMINPASS!,
    database: process.env.DB_NAME || "prodinfo",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    // Development-specific settings
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // SSL configuration for development
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

console.log('Database configuration:', {
  host: poolConfig.host,
  database: poolConfig.database,
  user: poolConfig.user,
  port: poolConfig.port,
  max: poolConfig.max,
  ssl: !!poolConfig.ssl,
  environment: isProduction ? 'production' : 'development'
});

const pool = new Pool(poolConfig);

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit process on pool error
});

// Add connect event for debugging
pool.on('connect', (client) => {
  console.log('New client connected to database');
});

// Add remove event for debugging
pool.on('remove', (client) => {
  console.log('Client removed from database pool');
});

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('Database connection successful:', {
      currentTime: result.rows[0].current_time,
      version: result.rows[0].db_version.split(' ')[0] // Just get PostgreSQL version
    });
    client.release();
    return true;
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('Database connection failed:', {
      error: errorInfo.message,
      code: errorInfo.code,
      host: poolConfig.host,
      database: poolConfig.database,
      user: poolConfig.user
    });
    return false;
  }
}

// Test connection on module load
testConnection().catch(console.error);

// Updated type to include string[] for PostgreSQL arrays
type QueryParam = string | number | boolean | null | string[] | Date;

const db = {
  query: async (text: string, params?: QueryParam[]) => {
    const start = Date.now();
    const client = await pool.connect();
    
    try {
      const res = await client.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { 
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), 
        duration, 
        rows: res.rowCount 
      });
      return res;
    } catch (error: unknown) {
      const errorInfo = getErrorInfo(error);
      const duration = Date.now() - start;
      console.error('Query error', { 
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), 
        duration, 
        error: errorInfo.message,
        code: errorInfo.code 
      });
      throw error;
    } finally {
      client.release();
    }
  },

  // Add a method to get pool status
  getPoolStatus: () => {
    return {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    };
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
  const { sku, product_description, tags } = productData;
  
  // Validate required fields
  if (!sku) {
    throw new DatabaseError('SKU is required', null, 'addProduct');
  }

  // Build dynamic query based on provided fields
  const fields = Object.keys(productData).filter(key => productData[key as keyof Product] !== undefined);
  const values = fields.map(key => productData[key as keyof Product]);
  const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
  
  const sql = `INSERT INTO product_data (${fields.join(', ')}) 
               VALUES (${placeholders}) RETURNING *`;
  
  try {
    const result = await db.query(sql, values as QueryParam[]);
    
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

  // Remove undefined values and SKU from update data
  const updateData = Object.fromEntries(
    Object.entries(productData).filter(([key, value]) => value !== undefined && key !== 'sku')
  );

  // Check if there are any updates to make
  if (Object.keys(updateData).length === 0) {
    throw new DatabaseError('No fields provided for update', null, 'editProduct');
  }

  const updates = Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`);
  const values = Object.values(updateData);
  
  const sql = `UPDATE product_data SET ${updates.join(', ')} WHERE sku = $${values.length + 1} RETURNING *`;
  const params: QueryParam[] = [...values as QueryParam[], sku];

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
      updates: Object.keys(updateData),
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

  sql += ` ORDER BY sku`; // Add consistent ordering

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
          // Handle arrays properly - PostgreSQL returns them as arrays already
          images: Array.isArray(row.images) ? row.images : 
                   typeof row.images === 'string' ? [row.images] : null,
          tags: Array.isArray(row.tags) ? row.tags : 
                typeof row.tags === 'string' ? [row.tags] : null,
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
    } else if (errorInfo.code === '28P01') { // Invalid password
      throw new DatabaseError('Database authentication failed - check username and password', error as Error, 'getProducts');
    } else if (errorInfo.code === '3D000') { // Invalid database name
      throw new DatabaseError('Database does not exist - check database name', error as Error, 'getProducts');
    }
    
    throw new DatabaseError(`Failed to get products: ${errorInfo.message}`, error as Error, 'getProducts');
  }
}

// Health check function to test database connectivity
export async function checkDatabaseHealth(): Promise<{ 
  healthy: boolean; 
  message: string; 
  poolStatus: { totalCount: number; idleCount: number; waitingCount: number; };
  timestamp: Date;
}> {
  try {
    const result = await db.query('SELECT NOW() as current_time, version() as db_version');
    const poolStatus = db.getPoolStatus();
    
    return {
      healthy: true,
      message: `Connected to ${result.rows[0].db_version.split(' ')[0]}`,
      poolStatus,
      timestamp: result.rows[0].current_time
    };
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Database health check failed:', errorInfo.message);
    
    return {
      healthy: false,
      message: `Health check failed: ${errorInfo.message}`,
      poolStatus: db.getPoolStatus(),
      timestamp: new Date()
    };
  }
}

// Graceful shutdown function
export async function closeDatabasePool(): Promise<void> {
  try {
    console.log('Closing database pool...');
    await pool.end();
    console.log('Database pool closed successfully');
  } catch (error: unknown) {
    const errorInfo = getErrorInfo(error);
    console.error('Error closing database pool:', errorInfo.message);
  }
}

// Export pool for advanced usage if needed
export { pool };