import { Router } from 'express';
import {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  getMyLease,
  rateTenant,
  getMyPayments,
} from '../controllers/tenantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all routes
router.use(protect);

router.route('/me')
  .get(authorize('tenant'), getMyLease);

router.route('/me/payments')
  .get(authorize('tenant'), getMyPayments);

router.route('/:id/rate')
  .post(authorize('admin', 'landlord'), rateTenant);

router.route('/')
  .get(authorize('admin', 'landlord'), getTenants)
  .post(authorize('admin', 'landlord'), createTenant);

router.route('/:id')
  .get(authorize('admin', 'landlord'), getTenant)
  .put(authorize('admin', 'landlord'), updateTenant)
  .delete(authorize('admin', 'landlord'), deleteTenant);

export default router;
