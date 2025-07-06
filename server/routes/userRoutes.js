/**
 * User routes
 * Routes for user profile management
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// All user routes require authentication
router.use(authenticateToken);

// Get user profile
router.get("/profile", userController.getUserProfile);

// Update user profile
router.put("/profile", userController.updateUserProfile);

// Change password
router.post("/change-password", userController.changePassword);

// Delete account
router.delete("/account", userController.deleteAccount);

module.exports = router;
