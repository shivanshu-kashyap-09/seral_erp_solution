import pool from '../config/db.js';
import ProductService from './ProductService.js';
import PaymentService from './PaymentService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * OrderService - Handles order placement, payments, and product stock updates.
 */
class OrderService {
  async placeOrder(userId, items, idempotencyKey) {
    const existingOrder = await this._findByIdempotencyKey(idempotencyKey);
    if (existingOrder) {
      return {
        status: 'DUPLICATE',
        orderId: existingOrder.id,
        orderStatus: existingOrder.status,
        message: 'Order already exists'
      };
    }

    const connection = await pool.getConnection();
    const orderId = uuidv4();

    try {
      await connection.beginTransaction();

      const productIds = [...new Set(items.map(item => item.productId))].sort((a, b) => a - b);
      const dbProducts = await ProductService.findByIdsWithLock(connection, productIds);
      const productMap = new Map(dbProducts.map(p => [p.id, p]));

      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = productMap.get(item.productId);
        const qty = item.qty || item.quantity;

        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < qty) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        totalAmount += product.price * qty;
        validatedItems.push({
          productId: product.id,
          quantity: qty,
          priceAtTime: product.price
        });

        await ProductService.updateStock(connection, product.id, qty);
      }

      await this._createOrder(connection, {
        id: orderId,
        idempotency_key: idempotencyKey,
        user_id: userId,
        total_amount: totalAmount,
        status: 'PROCESSING'
      });

      await this._addOrderItems(connection, orderId, validatedItems);

      const paymentSuccess = await PaymentService.processPayment(totalAmount);

      if (paymentSuccess) {
        await this._updateOrderStatus(connection, orderId, 'SUCCESS');
        await connection.commit();
        return { status: 'SUCCESS', orderId, totalAmount };
      } else {
        await connection.rollback();
        await this._recordFailedOrder(orderId, userId, idempotencyKey, totalAmount);
        return { status: 'FAILED', message: 'Payment failed' };
      }
    } catch (error) {
      await connection.rollback();
      return { status: 'ERROR', message: error.message };
    } finally {
      connection.release();
    }
  }

  async _findByIdempotencyKey(key) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE idempotency_key = ?', [key]);
    return rows[0];
  }

  async _createOrder(connection, orderData) {
    const { id, idempotency_key, user_id, total_amount, status } = orderData;
    await connection.query(
      'INSERT INTO orders (id, idempotency_key, user_id, total_amount, status) VALUES (?, ?, ?, ?, ?)',
      [id, idempotency_key, user_id, total_amount, status]
    );
  }

  async _addOrderItems(connection, orderId, items) {
    const values = items.map(item => [orderId, item.productId, item.quantity, item.priceAtTime]);
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ?',
      [values]
    );
  }

  async _updateOrderStatus(connection, orderId, status) {
    await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  }

  async _recordFailedOrder(orderId, userId, idempotencyKey, totalAmount) {
    try {
      await pool.query(
        'INSERT INTO orders (id, idempotency_key, user_id, total_amount, status) VALUES (?, ?, ?, ?, ?)',
        [orderId, idempotencyKey, userId, totalAmount, 'ROLLED_BACK']
      );
    } catch (err) {
      console.error('Failed to log rolled back order', err);
    }
  }

  async getOrderById(orderId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (rows.length === 0) return null;
    
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return { ...rows[0], items };
  }

  async getAllOrders(filters = {}) {
    let query = 'SELECT * FROM orders';
    const params = [];
    const conditions = [];

    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

export default new OrderService();