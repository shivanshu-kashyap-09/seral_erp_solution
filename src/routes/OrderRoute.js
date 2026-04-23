import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router();

router.post('/', OrderController.createOrder);
router.get('/:id', OrderController.getOrderById);
router.get('/', OrderController.getAllOrders);

export default router;