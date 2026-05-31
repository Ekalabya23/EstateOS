import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createTicket,
  getTickets,
  updateTicket,
  getPropertyMaintenanceHealth
} from '../controllers/maintenanceController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(authorize('tenant'), createTicket);

router.route('/:id')
  .patch(authorize('admin', 'landlord'), updateTicket);

router.route('/property/:propertyId')
  .get(getPropertyMaintenanceHealth);

export default router;
