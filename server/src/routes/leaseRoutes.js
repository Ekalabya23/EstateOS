import express from 'express';
import { generateLeasePDF, signLease } from '../controllers/leaseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, authorize('admin', 'landlord'), generateLeasePDF);
router.post('/sign', signLease); // Public endpoint for tenants to sign

export default router;
