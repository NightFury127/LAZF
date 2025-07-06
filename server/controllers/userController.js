/**
 * User controller
 * Handles user profile management
 */

const bcrypt = require("bcrypt");
const { users } = require("./authController");
const { isValidPassword } = require("../utils/validation");

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserProfile = (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data (excluding password)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Find user by ID
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    if (name) users[userIndex].name = name;
    if (phone) users[userIndex].phone = phone;

    // Return updated user data
    res.status(200).json({
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      phone: users[userIndex].phone,
      role: users[userIndex].role,
      createdAt: users[userIndex].createdAt,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Validate password strength
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }

    // Find user by ID
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      users[userIndex].password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    users[userIndex].password = hashedPassword;

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find user by ID
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      users[userIndex].password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Remove user
    users.splice(userIndex, 1);

    // Clear cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
};
