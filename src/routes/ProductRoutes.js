import express from 'express';
import ProductController from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProductById);

export default router;