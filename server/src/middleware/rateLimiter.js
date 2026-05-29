/**
 * Rate Limiter Configuration
 *
 * Provides Express rate-limiting middleware using express-rate-limit.
 * Two limiters are exported:
 *   - generalLimiter: for all API routes
 *   - authLimiter: stricter limit for auth endpoints (login/register)
 */

import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter.
 * Allows 100 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // limit each IP to 100 requests per window
  standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,      // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    status: 'fail',
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Authentication rate limiter.
 * Stricter limit for login/register to prevent brute-force attacks.
 * Allows 10 requests per 15-minute window per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 'fail',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

export default { generalLimiter, authLimiter };
