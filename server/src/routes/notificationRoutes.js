import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protect all routes
router.use(protect);

router.route('/read-all')
  .patch(markAllAsRead);

router.route('/')
  .get(getNotifications);

router.route('/:id/read')
  .patch(markAsRead);

router.route('/:id')
  .delete(deleteNotification);

export default router;
