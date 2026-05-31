/**
 * API v1 Route Aggregator
 *
 * Central hub for all v1 API routes. As feature routes are
 * created (auth, properties, users, etc.), import and mount
 * them here.
 */

import { Router } from 'express';

const router = Router();

// ─── Health Check ──────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'EstateOS API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Feature Routes ────────────────────────────────────────────────────────
import authRoutes from '../authRoutes.js';
import propertyRoutes from '../propertyRoutes.js';
import tenantRoutes from '../tenantRoutes.js';
import transactionRoutes from '../transactionRoutes.js';
import aiRoutes from '../aiRoutes.js';
import uploadRoutes from '../uploadRoutes.js';
import paymentRoutes from '../paymentRoutes.js';
import maintenanceRoutes from '../maintenanceRoutes.js';
import searchRoutes from '../searchRoutes.js';

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/tenants', tenantRoutes);
router.use('/transactions', transactionRoutes);
router.use('/ai', aiRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/search', searchRoutes);

export default router;
