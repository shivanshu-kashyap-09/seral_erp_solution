import pool from '../config/db.js';

/**
 * ProductService - Manages product catalog and inventory updates.
 */
class ProductService {
  async getAllProducts() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
  }

  async createProduct(name, stock, price) {
    const [result] = await pool.query(
      'INSERT INTO products (name, stock, price) VALUES (?, ?, ?)',
      [name, stock, price]
    );
    return { id: result.insertId, name, stock, price };
  }

  async updateProduct(productId, data) {
    const { name, stock, price } = data;
    await pool.query(
      'UPDATE products SET name = ?, stock = ?, price = ? WHERE id = ?',
      [name, stock, price, productId]
    );
    return { id: productId, ...data };
  }

  async findByIdsWithLock(connection, productIds) {
    if (productIds.length === 0) return [];
    const [rows] = await connection.query(
      'SELECT * FROM products WHERE id IN (?) FOR UPDATE',
      [productIds]
    );
    return rows;
  }

  async updateStock(connection, productId, quantityChange) {
    await connection.query(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantityChange, productId]
    );
  }
}

export default new ProductService();