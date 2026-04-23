import OrderService from '../services/OrderService.js';
import { withRetry } from '../utils/retryHandler.js';

class OrderController {
  async createOrder(req, res) {
    const { userId, items, idempotencyKey } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !idempotencyKey) {
      return res.status(400).json({ error: 'Missing required fields: userId, items, idempotencyKey' });
    }

    try {
      const result = await withRetry(() => OrderService.placeOrder(userId, items, idempotencyKey));
      
      if (result.status === 'SUCCESS') {
        return res.status(201).json(result);
      } else if (result.status === 'DUPLICATE') {
        return res.status(409).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    const { id } = req.params;
    try {
      const order = await OrderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const { userId, status } = req.query;
      const orders = await OrderService.getAllOrders({ userId, status });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OrderController();
