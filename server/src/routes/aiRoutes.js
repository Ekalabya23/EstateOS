import express from 'express';
import { generateDescription, valuateProperty, summarizeContract } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/generate-description', authorize('admin', 'landlord'), generateDescription);
router.post('/valuate', authorize('admin', 'landlord', 'investor'), valuateProperty);
router.post('/summarize-contract', summarizeContract); // Any logged in user

export default router;
