import express from 'express';
import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  getPortfolioStats,
  buyProperty,
  rentProperty,
  calculatePropertyHealth
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);
router.get('/portfolio/stats', authorize('user', 'landlord', 'admin'), getPortfolioStats);
router.get('/:id/health', authorize('admin', 'landlord', 'investor'), calculatePropertyHealth);
router.get('/stats', getPropertyStats);
router.post('/:id/buy', authorize('user'), buyProperty);
router.post('/:id/rent', authorize('tenant'), rentProperty);
router.post('/', authorize('user', 'landlord', 'admin'), createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
