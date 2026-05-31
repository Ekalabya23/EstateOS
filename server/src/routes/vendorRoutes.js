import { Router } from 'express';
import { getVendors, hireVendor, reviewVendor } from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getVendors);

router.route('/:id/hire')
  .post(authorize('admin', 'landlord'), hireVendor);

router.route('/:id/review')
  .post(reviewVendor);

export default router;
