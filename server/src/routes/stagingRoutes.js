import express from 'express';
import { generateVirtualStaging } from '../controllers/stagingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, authorize('admin', 'landlord'), generateVirtualStaging);

export default router;
