/**
 * EstateOS Server Entry Point
 *
 * Bootstraps the Express application, connects to MongoDB,
 * starts the HTTP server, and handles process-level errors
 * for graceful shutdown.
 */

import { createServer } from 'http';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import { initSocket } from './src/socket.js';
import { startScheduler } from './src/jobs/scheduler.js';
import { env } from './src/config/env.js';
import logger from './src/utils/logger.js';

dotenv.config();

// ─── Handle Uncaught Exceptions ────────────────────────────────────────────
// These are synchronous errors that were never caught.
// Log the error and exit immediately — the process is in an undefined state.
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// ─── Create HTTP Server ────────────────────────────────────────────────────
const server = createServer(app);

// ─── Initialize WebSockets ──────────────────────────────────────────────────
initSocket(server);

// ─── Start Server ──────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start background cron jobs
    startScheduler();

    // Start listening
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📡 Health check: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

// ─── Handle Unhandled Promise Rejections ───────────────────────────────────
// These are async errors that were never caught by a .catch() or try/catch.
// Shut the server down gracefully before exiting.
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// ─── Graceful Shutdown on SIGTERM ──────────────────────────────────────────
// Allows in-flight requests to complete before shutting down.
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('💤 Process terminated.');
  });
});

// ─── Graceful Shutdown on SIGINT (Ctrl+C) ──────────────────────────────────
process.on('SIGINT', () => {
  logger.info('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('💤 Process terminated.');
    process.exit(0);
  });
});
