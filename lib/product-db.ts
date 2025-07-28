// lib/product-db.ts

import { Pool } from 'pg';
import { Product } from '../types/product';

// Configure your database connection pool for Google Cloud PostgreSQL
const pool = new Pool({
  user: "Tiara Admin",
  password: process.env.TIARAADMINPASS,
  database: "prodinfo",
  host: "tiara-269e6:us-central1:tiarasql",
});

const db = {
  query: (text: string, params?: (string | number | boolean | null)[]) => pool.query(text, params),
};

// Function to add a new product
export async function addProduct(productData: Product): Promise<Product> {
  const { sku, product_description, /* ... other product properties */ } = productData;
  const sql = `INSERT INTO product_data (sku, product_description, /* ... other columns */) VALUES ($1, $2, /* ... other values */) RETURNING *`;
  const params: (string | number | boolean | null)[] = [sku, product_description /* ... other values */];
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
  const params = [sku];
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
  const { product_description, /* ... other product properties to update */ } = productData;

  // Handle undefined values by converting them to null or filtering them out
  const sql = `UPDATE product_data SET product_description = $1 /* ... other column = $X */ WHERE sku = $2 RETURNING *`;
  const params: (string | number | boolean | null)[] = [
    product_description ?? null, // Convert undefined to null
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
  const params: (string | number | boolean | null)[] = [];

  if (sku) {
    sql += ` WHERE sku = $1`;
    params.push(sku);
  }

  try {
    const result = await db.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting products:', error);
    // Log the specific error object
    console.error(error);
    throw error;
  }
}