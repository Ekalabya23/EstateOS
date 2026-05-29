/**
 * Centralized Error Handler Middleware
 *
 * Catches all errors forwarded via next(err) and returns
 * a consistent JSON error response. Handles specific
 * Mongoose and JWT error types gracefully.
 */

import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

/**
 * Convert a Mongoose CastError (invalid ObjectId) into an AppError.
 * @param {Error} err
 * @returns {AppError}
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Convert a Mongoose ValidationError into an AppError.
 * Combines all field-level validation messages.
 * @param {Error} err
 * @returns {AppError}
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Validation failed: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Convert a MongoDB duplicate key error (code 11000) into an AppError.
 * @param {Error} err
 * @returns {AppError}
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue).join(', ');
  const message = `Duplicate value for field: ${field}. Please use a different value.`;
  return new AppError(message, 409);
};

/**
 * Convert a JWT invalid token error into an AppError.
 * @returns {AppError}
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Convert a JWT expired token error into an AppError.
 * @returns {AppError}
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Send detailed error response in development.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Send sanitized error response in production.
 * Only operational (trusted) errors expose their message.
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown errors: don't leak details
    logger.error('NON-OPERATIONAL ERROR 💥', err);

    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global error-handling middleware.
 * Must have 4 parameters for Express to recognise it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default to 500 if no status code was set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone the error to avoid mutating the original
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export default errorHandler;
