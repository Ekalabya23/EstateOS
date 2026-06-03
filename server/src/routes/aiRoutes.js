import express from 'express';
import { generateDescription, valuateProperty, analyzeLeaseContract, generateInsights, aiChat, screenTenant } from '../controllers/aiController.js';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/chat', aiChat);

router.use(protect);

router.post('/insights', generateInsights);
router.post('/generate-description', authorize('admin', 'landlord'), generateDescription);
router.post('/valuate', authorize('admin', 'landlord', 'investor'), valuateProperty);
router.post('/analyze-lease', upload.single('contractFile'), analyzeLeaseContract);
router.post('/screen-tenant', authorize('admin', 'landlord'), screenTenant);

export default router;
