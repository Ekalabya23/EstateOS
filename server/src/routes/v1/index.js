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

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);

export default router;
