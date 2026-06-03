import NodeCache from 'node-cache';

// Initialize cache with a default TTL of 300 seconds (5 minutes)
// Disable cloning so Mongoose documents aren't corrupted during caching
const cache = new NodeCache({ stdTTL: 300, useClones: false });

/**
 * Cache middleware that stores responses in memory.
 * @param {number} duration - Time to live in seconds
 */
export const cacheRoute = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = `${req.user?._id || 'public'}_${req.originalUrl}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  // Intercept res.json to store the response body before sending it
  res.originalJson = res.json;
  res.json = function(body) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body, duration);
    }
    return res.originalJson.call(this, body);
  };

  next();
};

/**
 * Utility to flush all cached data
 */
export const clearCache = () => {
  cache.flushAll();
};
