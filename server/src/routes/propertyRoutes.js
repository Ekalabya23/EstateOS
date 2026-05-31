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
  calculatePropertyHealth,
  getPropertyPassport,
  submitInspection
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';
import { cacheRoute } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Stats routes (Must be before /:id)
router.get('/portfolio/stats', protect, authorize('user', 'landlord', 'admin'), getPortfolioStats);
router.get('/stats', protect, cacheRoute(600), getPropertyStats);

// Public routes
router.get('/', cacheRoute(300), getAllProperties);

// Protected root routes
router.post('/', protect, authorize('user', 'landlord', 'admin'), createProperty);

// Parameterized routes (/:id)
router.get('/:id', getProperty);
router.get('/:id/health', protect, authorize('admin', 'landlord', 'investor'), calculatePropertyHealth);
router.post('/:id/buy', protect, authorize('user'), buyProperty);
router.post('/:id/rent', protect, authorize('tenant'), rentProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.get('/:id/passport', getPropertyPassport); // Public access allowed for QR scanning
router.post('/:id/inspections', protect, authorize('admin', 'landlord', 'tenant'), submitInspection);

export default router;
