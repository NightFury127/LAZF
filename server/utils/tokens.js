/**
 * Token utility functions
 * Handles JWT token generation and OTP generation
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Get JWT secret from environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate JWT access token
 * @param {Object} user - User data to include in token
 * @returns {string} - JWT token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate JWT refresh token
 * @param {Object} user - User data to include in token
 * @returns {string} - JWT token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Generate 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate password reset token
 * @returns {string} - Random token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  generateResetToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
