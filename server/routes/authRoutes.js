/**
 * Authentication routes
 * Routes for user registration, login, and authentication
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginRateLimiter } = require("../middleware/rateLimiter");

// Register a new user
router.post("/register", authController.register);

// Verify OTP
router.post("/verify-otp", authController.verifyOTP);

// Resend OTP
router.post("/resend-otp", authController.resendOTP);

// Login user (with rate limiting)
router.post("/login", loginRateLimiter, authController.login);

// Logout user
router.post("/logout", authController.logout);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
