/**
 * Rate limiting middleware
 * Prevents brute force attacks by limiting request frequency
 */

// In-memory store for login attempts
// In production, use Redis or another distributed store
const loginAttempts = {};

/**
 * Rate limiting middleware for login attempts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const email = req.body.email;
  const key = `${ip}-${email}`;
  
  // Initialize or get current attempts
  if (!loginAttempts[key]) {
    loginAttempts[key] = {
      count: 0,
      lastAttempt: Date.now(),
      blocked: false,
      blockExpiry: 0
    };
  }
  
  const attempt = loginAttempts[key];
  const now = Date.now();
  
  // Check if IP is blocked
  if (attempt.blocked && now < attempt.blockExpiry) {
    const remainingTime = Math.ceil((attempt.blockExpiry - now) / 1000 / 60);
    return res.status(429).json({
      message: `Too many login attempts. Please try again after ${remainingTime} minutes.`
    });
  }
  
  // Reset block if expired
  if (attempt.blocked && now >= attempt.blockExpiry) {
    attempt.blocked = false;
    attempt.count = 0;
  }
  
  // Reset count if last attempt was more than 15 minutes ago
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    attempt.count = 0;
  }
  
  // Update attempt data
  attempt.count++;
  attempt.lastAttempt = now;
  
  // Block after 5 failed attempts
  if (attempt.count >= 5 && !attempt.blocked) {
    attempt.blocked = true;
    attempt.blockExpiry = now + 30 * 60 * 1000; // Block for 30 minutes
    return res.status(429).json({
      message: "Too many login attempts. Please try again after 30 minutes."
    });
  }
  
  next();
};

/**
 * Clear login attempts for a specific user after successful login
 * @param {string} ip - IP address
 * @param {string} email - User email
 */
const clearLoginAttempts = (ip, email) => {
  const key = `${ip}-${email}`;
  if (loginAttempts[key]) {
    delete loginAttempts[key];
  }
};

module.exports = {
  loginRateLimiter,
  clearLoginAttempts
};
