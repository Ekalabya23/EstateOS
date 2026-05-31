import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';
import { cacheRoute } from '../middleware/cacheMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/stats', cacheRoute(600), getTransactionStats);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .delete(deleteTransaction);

export default router;
