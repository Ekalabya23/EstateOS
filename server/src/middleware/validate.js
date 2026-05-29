/**
 * Joi Validation Middleware
 *
 * Factory function that returns Express middleware to validate
 * req.body, req.params, and/or req.query against Joi schemas.
 *
 * Usage:
 *   import Joi from 'joi';
 *
 *   const createPropertySchema = {
 *     body: Joi.object({
 *       title: Joi.string().required(),
 *       price: Joi.number().positive().required(),
 *     }),
 *   };
 *
 *   router.post('/properties', validate(createPropertySchema), createProperty);
 */

import AppError from '../utils/AppError.js';

/**
 * Validate request data against a Joi schema object.
 *
 * @param {Object} schema - Object with optional keys: body, params, query.
 *                          Each value should be a Joi schema.
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each request property that has a corresponding schema
    for (const property of ['body', 'params', 'query']) {
      if (schema[property]) {
        const { error, value } = schema[property].validate(req[property], {
          abortEarly: false,      // Collect all errors, not just the first
          stripUnknown: true,     // Remove fields not in the schema
          allowUnknown: false,    // Reject unknown fields
        });

        if (error) {
          const details = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
          }));
          errors.push(...details);
        } else {
          // Replace req data with validated & sanitized values
          req[property] = value;
        }
      }
    }

    if (errors.length > 0) {
      const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      return next(AppError.badRequest(`Validation error — ${errorMessage}`));
    }

    next();
  };
};

export default validate;
