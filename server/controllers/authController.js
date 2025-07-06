/**
 * Authentication controller
 * Handles user registration, login, and authentication
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegistration, validateLogin } = require("../utils/validation");
const {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  generateResetToken,
} = require("../utils/tokens");

// Get JWT secret from environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
const { sendOTPEmail, sendPasswordResetEmail } = require("../utils/email");
const { clearLoginAttempts } = require("../middleware/rateLimiter");

// In-memory data stores (replace with database in production)
const users = [];
const otpStore = {};
const resetTokens = {};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    const validation = validateRegistration({ name, email, phone, password });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if email already exists
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (10 minutes)
    otpStore[email] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      name,
      email,
      phone,
      hashedPassword,
      verified: false,
    };

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Verify OTP and create user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP exists and is valid
    if (!otpStore[email] || otpStore[email].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (Date.now() > otpStore[email].expiry) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    // Create new user with the already hashed password
    const newUser = {
      id: users.length + 1,
      name: otpStore[email].name,
      email,
      phone: otpStore[email].phone,
      password: otpStore[email].hashedPassword,
      role: email.includes("admin") ? "ADMIN" : "CUSTOMER", // Simple role assignment for demo
      createdAt: new Date(),
    };

    // Add user to database
    users.push(newUser);

    // Clean up OTP store
    delete otpStore[email];

    res.status(201).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Resend OTP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in OTP store
    if (!otpStore[email]) {
      return res.status(400).json({ message: "No pending registration found" });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update OTP and expiry
    otpStore[email].otp = otp;
    otpStore[email].expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find user by email
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Clear login attempts on successful login
    clearLoginAttempts(ip, email);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data and access token
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshToken = (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Find user
      const foundUser = users.find((u) => u.id === user.id);

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new access token
      const accessToken = generateAccessToken(foundUser);

      res.status(200).json({
        accessToken,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          role: foundUser.role,
        },
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
  refreshToken,
  users, // Export for other controllers to use
};
