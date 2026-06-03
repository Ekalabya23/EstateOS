/**
 * Environment Configuration
 *
 * Validates and exports all required environment variables.
 * Provides sensible defaults for development mode.
 * Fails fast if critical variables are missing in production.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env from project root (server/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * List of required environment variables.
 * In development, defaults are provided where possible.
 */
const requiredVars = ['JWT_SECRET'];

const validateEnv = () => {
  const missing = [];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      // Allow missing in development with defaults
      if (process.env.NODE_ENV !== 'development') {
        missing.push(key);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please check your .env file or environment configuration.`
    );
  }
};

validateEnv();

/**
 * Exported environment configuration object.
 * All access to env vars should go through this object.
 */
export const env = {
  // ─── App ───────────────────────────────────────────────────────────────────
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // ─── Database ──────────────────────────────────────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/estateos',

  // ─── JWT ───────────────────────────────────────────────────────────────────
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // ─── Cloudinary ────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // ─── Razorpay ──────────────────────────────────────────────────────────────
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',

  // ─── AI Providers ──────────────────────────────────────────────────────────
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || '',

  // ─── Client ────────────────────────────────────────────────────────────────
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default env;
