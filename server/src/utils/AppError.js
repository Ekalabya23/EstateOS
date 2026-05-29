/**
 * Custom Application Error Class
 *
 * Extends the native Error to include HTTP status codes and
 * operational error classification. Operational errors are
 * expected errors (bad input, not found, etc.) and are safe
 * to send to the client. Programming errors are not.
 */

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Factory Methods ─────────────────────────────────────────────────────
  // Convenient static creators for common HTTP error types.

  /**
   * 400 Bad Request - Invalid input, missing fields, etc.
   * @param {string} [message='Bad request']
   * @returns {AppError}
   */
  static badRequest(message = 'Bad request') {
    return new AppError(message, 400);
  }

  /**
   * 401 Unauthorized - Missing or invalid authentication
   * @param {string} [message='Unauthorized. Please log in.']
   * @returns {AppError}
   */
  static unauthorized(message = 'Unauthorized. Please log in.') {
    return new AppError(message, 401);
  }

  /**
   * 403 Forbidden - Authenticated but lacking permissions
   * @param {string} [message='You do not have permission to perform this action.']
   * @returns {AppError}
   */
  static forbidden(message = 'You do not have permission to perform this action.') {
    return new AppError(message, 403);
  }

  /**
   * 404 Not Found - Resource does not exist
   * @param {string} [message='Resource not found.']
   * @returns {AppError}
   */
  static notFound(message = 'Resource not found.') {
    return new AppError(message, 404);
  }

  /**
   * 409 Conflict - Duplicate resource or conflicting state
   * @param {string} [message='Resource already exists.']
   * @returns {AppError}
   */
  static conflict(message = 'Resource already exists.') {
    return new AppError(message, 409);
  }

  /**
   * 429 Too Many Requests - Rate limit exceeded
   * @param {string} [message='Too many requests. Please try again later.']
   * @returns {AppError}
   */
  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new AppError(message, 429);
  }

  /**
   * 500 Internal Server Error - Unexpected server-side error
   * @param {string} [message='Internal server error.']
   * @returns {AppError}
   */
  static internal(message = 'Internal server error.') {
    return new AppError(message, 500);
  }
}

export default AppError;
