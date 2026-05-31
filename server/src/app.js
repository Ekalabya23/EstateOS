/**
 * Express Application Setup
 *
 * Configures all middleware, security headers, request parsing,
 * route mounting, and error handling for the EstateOS API.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import corsOptions from './config/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import v1Routes from './routes/v1/index.js';
import { auditLogger } from './middleware/auditMiddleware.js';

// ─── Initialize Express App ───────────────────────────────────────────────
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Static Files ─────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Security Headers ─────────────────────────────────────────────────────
// Helmet sets various HTTP headers to help protect the app
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────
// Enable Cross-Origin Resource Sharing with configured options
app.use(cors(corsOptions));

// ─── Request Logging ───────────────────────────────────────────────────────
// Use 'dev' format in development, 'combined' in production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Body Parsing ──────────────────────────────────────────────────────────
// Parse JSON bodies with a 10KB limit to prevent abuse
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Cookie Parser ─────────────────────────────────────────────────────────
app.use(cookieParser());

// ─── Data Sanitization ────────────────────────────────────────────────────
// Prevent NoSQL injection by stripping MongoDB operators from req.body/params/query
app.use(mongoSanitize());

// ─── Rate Limiting ─────────────────────────────────────────────────────────
// Apply general rate limiting to all API routes
app.use('/api', generalLimiter);

// ─── Audit Logging ─────────────────────────────────────────────────────────
app.use(auditLogger);

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1', v1Routes);

// ─── 404 Handler ───────────────────────────────────────────────────────────
// Catch all unmatched routes
app.all('*', (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.method} ${req.originalUrl} on this server.`));
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

export default app;
