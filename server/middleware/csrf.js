/**
 * CSRF Protection middleware
 * Validates CSRF tokens to prevent cross-site request forgery attacks
 */

/**
 * CSRF Protection middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF check for GET requests and OPTIONS (preflight) requests
  if (req.method === "GET" || req.method === "OPTIONS") {
    return next();
  }
  
  const csrfToken = req.headers["x-csrf-token"];
  
  if (!csrfToken) {
    return res.status(403).json({ message: "CSRF token missing" });
  }
  
  // In a real implementation, you would validate the token against a stored value
  // For this demo, we're just checking that it exists
  // A more secure implementation would store tokens in a database or Redis
  
  next();
};

module.exports = csrfProtection;
