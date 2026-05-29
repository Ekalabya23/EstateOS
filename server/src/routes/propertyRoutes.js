import express from 'express';
import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes below are protected
router.use(protect);

router.get('/', getAllProperties);
router.get('/stats', getPropertyStats);
router.get('/:id', getProperty);
router.post('/', authorize('user', 'landlord', 'admin'), createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
