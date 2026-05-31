import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
// Optional: restrict payments strictly to tenants/users, but since landlords are testing, we'll allow all protected users.
// router.use(authorize('tenant', 'user'));

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
