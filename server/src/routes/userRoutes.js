import { Router } from 'express';
import { toggleSaveProperty, getSavedProperties, completeOnboarding, updateProfileCompletion, verifyFast2SMSMock } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/saved')
  .get(getSavedProperties);

router.route('/saved/:propertyId')
  .post(toggleSaveProperty);

router.post('/onboarding-complete', completeOnboarding);
router.put('/profile', updateProfileCompletion);
router.post('/verify-phone', verifyFast2SMSMock);

export default router;
