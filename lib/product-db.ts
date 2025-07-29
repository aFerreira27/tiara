import { Pool } from 'pg';
import { Product } from '../types/product';

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
    // No port needed for Unix socket
  };
} else {
  // Local development - use Cloud SQL Proxy
  poolConfig = {
    user: "Tiara Admin",
    password: process.env.TIARAADMINPASS,
    database: "prodinfo",
    host: "127.0.0.1",
    port: 5432,
  };
}

const pool = new Pool(poolConfig);

// Updated type to include string[] for PostgreSQL arrays
type QueryParam = string | number | boolean | null | string[];

const db = {
  query: (text: string, params?: QueryParam[]) => pool.query(text, params),
};

// Function to add a new product
export async function addProduct(productData: Product): Promise<Product> {
  const { sku, product_description, tags, /* ... other product properties */ } = productData;
  const sql = `INSERT INTO product_data (sku, product_description, tags, /* ... other columns */) VALUES ($1, $2, $3, /* ... other values */) RETURNING *`;
  const params: QueryParam[] = [sku, product_description, tags ?? null /* ... other values */];
  try {
    const result = await db.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Function to delete a product by SKU
export async function deleteProduct(sku: string): Promise<Product> {
  const sql = `DELETE FROM product_data WHERE sku = $1 RETURNING *`;
  const params: QueryParam[] = [sku];
  try {
    const result = await db.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Function to edit an existing product by SKU
export async function editProduct(sku: string, productData: Partial<Product>): Promise<Product> {
  const { product_description, tags, /* ... other product properties to update */ } = productData;

  let sql = `UPDATE product_data SET 
`;
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

  sql += updates.join(', ');
  sql += ` WHERE sku = $${paramIndex++} RETURNING *`;
  params.push(sku);

  try {
    const result = await db.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error('Error editing product:', error);
    throw error;
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
    const result = await db.query(sql, params);
    const products: Product[] = result.rows.map((row: Record<string, unknown>) => ({
      ...row,
      // Handle images as array directly since it's now text[] type
      images: row.images && Array.isArray(row.images) ? row.images : null,
      // Handle tags as array directly since it's now text[] type
      tags: row.tags && Array.isArray(row.tags) ? row.tags : null,
    })) as Product[];
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    console.error(error);
    throw error;
  }
}