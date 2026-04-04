import express from 'express';
import { getCart, updateCart, deleteCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, updateCart);
router.delete('/', protect, deleteCart);

export default router;
