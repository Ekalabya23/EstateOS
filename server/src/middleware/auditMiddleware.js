import AuditLog from '../models/AuditLog.js';

/**
 * Middleware to log all POST, PUT, DELETE requests.
 * Should be placed after auth middleware if we want req.user to be populated.
 */
export const auditLogger = async (req, res, next) => {
  // We only want to log modifying actions
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Intercept the response to log AFTER it successfully completes? 
    // Yes, we only want to log successful actions.
    const originalSend = res.send;

    res.send = function (body) {
      res.send = originalSend; // Restore it

      // If success, log it
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const actionMap = {
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE'
          };

          // Extract resource from path e.g. /api/v1/properties -> properties
          const pathParts = req.baseUrl.split('/');
          const resource = pathParts[pathParts.length - 1] || 'unknown';

          // Fire and forget
          AuditLog.create({
            user: req.user ? req.user._id : null,
            action: `${actionMap[req.method]}_${resource.toUpperCase()}`,
            resource: resource,
            resourceId: req.params.id || null, // Best effort
            ipAddress: req.ip,
            details: {
              body: req.method !== 'DELETE' ? req.body : null,
              query: req.query
            }
          }).catch(err => console.error('Audit Log Error:', err));

        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      }

      return res.send(body); // Send original response
    };
  }
  next();
};
