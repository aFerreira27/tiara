// lib/product-db.ts

import { Pool } from 'pg';
import { Product } from '../types/product';

// Configure your database connection pool for Google Cloud PostgreSQL
const pool = new Pool({
  user: "Tiara Admin",
  password: process.env.TIARAADMINPASS,
  database: "prodinfo",
  host: "127.0.0.1", // Changed to connect via Cloud SQL Proxy
  port: 5432, // Ensure this matches the proxy port
});

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

  // Handle undefined values by converting them to null or filtering them out
  const sql = `UPDATE product_data SET 
    product_description = $1,
    tags = $2
    /* ... other column = $X */ 
    WHERE sku = $3 RETURNING *`;
    
  const params: QueryParam[] = [
    product_description ?? null, // Convert undefined to null
    tags ?? null, // PostgreSQL will handle the array conversion automatically
    sku
    /* ... other values, converting undefined to null as needed */
  ];

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
    const products: Product[] = result.rows.map((row: any) => ({
      ...row,
      // Handle images as array directly since it's now text[] type
      images: row.images && Array.isArray(row.images) ? row.images : null,
      // Handle tags as array directly since it's text[] type
      tags: row.tags && Array.isArray(row.tags) ? row.tags : null,
    }));
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    console.error(error);
    throw error;
  }
}