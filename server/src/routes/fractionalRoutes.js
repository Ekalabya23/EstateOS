import express from 'express';
import { getFractionalProperty, buyShares } from '../controllers/fractionalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:propertyId', getFractionalProperty);
router.post('/:propertyId/buy', protect, buyShares);

export default router;
