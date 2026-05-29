/**
 * CORS Configuration
 *
 * Defines allowed origins and CORS options for the Express app.
 * Supports both development (Vite on localhost:5173) and production URLs.
 */

import { env } from './env.js';

/**
 * Whitelist of allowed origins.
 * In development, localhost variants are included.
 * In production, only CLIENT_URL is allowed.
 */
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:3000',   // Alternative dev port
  'http://127.0.0.1:5173',  // Vite via IP
  env.CLIENT_URL,            // Production / custom client URL
].filter(Boolean);

/**
 * CORS options object.
 * Uses a dynamic origin callback to validate against the whitelist.
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },

  // Allow cookies and authorization headers to be sent cross-origin
  credentials: true,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed request headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],

  // Headers exposed to the browser
  exposedHeaders: ['X-Total-Count', 'Content-Range'],

  // Preflight cache duration (24 hours)
  maxAge: 86400,
};

export default corsOptions;
