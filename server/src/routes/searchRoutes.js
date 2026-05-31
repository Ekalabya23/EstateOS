import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', authorize('admin', 'landlord', 'investor'), globalSearch);

export default router;
