/**
 * Authentication middleware
 * Verifies JWT tokens and adds user data to request object
 */

const jwt = require('jsonwebtoken');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Invalid token" });
      }

      // Add user data to request object
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }

  next();
};

/**
 * Middleware to check if user is the owner of the resource or an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  // Allow if user is admin
  if (req.user.role === "ADMIN") {
    return next();
  }

  // Allow if user is the owner (userId from params or body)
  const resourceUserId = parseInt(req.params.userId || req.body.userId);
  if (req.user.id === resourceUserId) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Access denied" });
};

module.exports = {
  authenticateToken,
  isAdmin,
  isOwnerOrAdmin
};
