const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// JWT secret from environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  console.error("ERROR: NEXTAUTH_SECRET environment variable is not set!");
  console.error("Please set NEXTAUTH_SECRET in your .env file");
  process.exit(1); // Exit the process to prevent insecure operation
}

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "1h"; // 1 hour
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Password reset token expiry
const PASSWORD_RESET_EXPIRY = 30 * 60 * 1000; // 30 minutes

// Rate limiting settings
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// Store for tracking login attempts
const loginAttempts = {};

const app = express();

// Middleware
// Configure CORS with allowed origins from environment variable or default for development
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.use(express.json());
app.use(cookieParser());

// CSRF Protection middleware
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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

// Rate limiting middleware for login attempts
const loginRateLimiter = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const now = Date.now();

  // Check if user is in timeout
  if (loginAttempts[email] && loginAttempts[email].timeout > now) {
    const remainingTime = Math.ceil(
      (loginAttempts[email].timeout - now) / 1000 / 60
    );
    return res.status(429).json({
      message: `Too many failed login attempts. Please try again in ${remainingTime} minutes.`,
    });
  }

  // Reset attempts if timeout has passed
  if (loginAttempts[email] && loginAttempts[email].timeout < now) {
    loginAttempts[email].attempts = 0;
    loginAttempts[email].timeout = 0;
  }

  next();
};

// In-memory database (replace with a real database in production)
const users = [];
const otpStore = {};
const passwordResetTokens = {};

// Email configuration
let transporter;

// Function to set up Gmail transporter
function setupGmailTransporter(email, password) {
  try {
    // Create a transporter using Gmail
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password, // This should be an App Password, not your regular Gmail password
      },
    });

    console.log("Gmail transporter set up for:", email);
    return true;
  } catch (error) {
    console.error("Error setting up Gmail transporter:", error);

    // Fallback to console logging if email setup fails
    transporter = {
      sendMail: async (mailOptions) => {
        console.log("Email would be sent to:", mailOptions.to);
        console.log("Email subject:", mailOptions.subject);
        console.log(
          "OTP:",
          mailOptions.html.match(
            /<h2 style="color: #000; letter-spacing: 5px; margin: 0;">(.*?)<\/h2>/
          )[1]
        );
        return { messageId: "test" };
      },
    };
    return false;
  }
}

// Initialize with default console logger until Gmail credentials are provided
transporter = {
  sendMail: async (mailOptions) => {
    console.log("Email would be sent to:", mailOptions.to);
    console.log("Email subject:", mailOptions.subject);
    // Don't try to parse the HTML - just log that we would send an email
    console.log("Email content would be sent (not showing for brevity)");
    return { messageId: "test" };
  },
};

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  try {
    // Log the OTP for testing purposes with high visibility
    console.log("\n\n");
    console.log("=======================================================");
    console.log(`🔑 OTP CODE FOR ${email}: ${otp}`);
    console.log("=======================================================");
    console.log("\n\n");

    // Also log to the OTP log file directly as a fallback
    try {
      const fs = require("fs");
      const path = require("path");
      const otpLogFile = path.join(__dirname, "..", "otp-log.txt");

      // Ensure the file exists
      if (!fs.existsSync(otpLogFile)) {
        fs.writeFileSync(otpLogFile, "# OTP Log\n\n", "utf8");
      }

      // Append the OTP to the log file
      const logEntry = `${new Date().toISOString()} - Email: ${email} - OTP: ${otp}\n`;
      fs.appendFileSync(otpLogFile, logEntry, "utf8");

      console.log("OTP logged to file successfully");
    } catch (logError) {
      console.error("Error logging OTP to file:", logError);
    }

    // In development mode, we'll skip actual email sending and just log to the OTP display server
    try {
      // Use the built-in http module instead of fetch for better compatibility
      const http = require("http");

      // Create the request data
      const postData = JSON.stringify({ email, otp });

      // Set up the request options
      const options = {
        hostname: "localhost",
        port: 5001,
        path: "/log-otp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      // Send the request
      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            console.log("OTP sent to display server successfully");
          } else {
            console.error(
              `Failed to send OTP to display server: ${res.statusCode}`
            );
          }
        });
      });

      req.on("error", (e) => {
        console.error(`Error sending OTP to display server: ${e.message}`);

        // Log OTP to console as a fallback with high visibility
        console.log("\n\n");
        console.log("============================================");
        console.log(`🔑 FALLBACK OTP for ${email}: ${otp}`);
        console.log("Please use this OTP to complete registration");
        console.log("============================================");
        console.log("\n\n");
      });

      // Write data to request body
      req.write(postData);
      req.end();

      // Always return true to allow registration to proceed
      return true;
    } catch (displayError) {
      console.error("Error sending OTP to display server:", displayError);

      // Log OTP to console as a fallback with high visibility
      console.log("\n\n");
      console.log("============================================");
      console.log(`🔑 FALLBACK OTP for ${email}: ${otp}`);
      console.log("Please use this OTP to complete registration");
      console.log("============================================");
      console.log("\n\n");

      // Return true anyway to allow registration to proceed
      return true;
    }
  } catch (error) {
    console.error("Error in sendOTPEmail:", error);
    return false;
  }
}

// Send password reset email
async function sendPasswordResetEmail(email, token) {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    // Log the reset URL for testing purposes
    console.log(`Password reset URL for ${email}: ${resetUrl}`);

    // In development mode, we'll skip actual email sending and just log to the console
    console.log("============================================");
    console.log(`Password reset link for ${email}:`);
    console.log(resetUrl);
    console.log("This link is valid for 30 minutes");
    console.log("============================================");

    // Try to log to the OTP display server as well
    try {
      const response = await fetch("http://localhost:5001/log-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: `RESET_LINK: ${resetUrl.substring(0, 20)}...`,
        }),
      });

      if (response.ok) {
        console.log("Reset link info sent to display server");
      }
    } catch (displayError) {
      console.error(
        "Error sending reset info to display server:",
        displayError
      );
      // Don't fail the process if the display server is down
    }

    return true;
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return false;
  }
}

// Routes
// Apply CSRF protection to all API routes
app.use("/api", csrfProtection);

// Set up Gmail credentials
app.post("/api/setup-gmail", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const success = setupGmailTransporter(email, password);

    if (success) {
      res
        .status(200)
        .json({ message: "Gmail transporter set up successfully" });
    } else {
      res.status(500).json({ message: "Failed to set up Gmail transporter" });
    }
  } catch (error) {
    console.error("Setup Gmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required (name, email, phone, password)",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format (simple validation)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if email already exists
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }

    // Hash password immediately - don't store plaintext password
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
      hashedPassword, // Store hashed password instead of plaintext
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
});

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
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
      password: otpStore[email].hashedPassword, // Use the already hashed password
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
});

// Resend OTP
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in OTP store
    if (!otpStore[email]) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update OTP store
    otpStore[email] = {
      ...otpStore[email],
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

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
});

// Login
app.post("/api/auth/login", loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Initialize login attempts tracking if not exists
    if (!loginAttempts[email]) {
      loginAttempts[email] = { attempts: 0, timeout: 0 };
    }

    // Find user
    const user = users.find((user) => user.email === email);

    // Check if user exists and password is valid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Increment failed attempts
      loginAttempts[email].attempts += 1;

      // Check if max attempts reached
      if (loginAttempts[email].attempts >= MAX_LOGIN_ATTEMPTS) {
        loginAttempts[email].timeout = Date.now() + LOGIN_TIMEOUT;
        return res.status(429).json({
          message: `Too many failed login attempts. Please try again in 15 minutes.`,
        });
      }

      return res.status(401).json({
        message: "Invalid credentials",
        attemptsLeft: MAX_LOGIN_ATTEMPTS - loginAttempts[email].attempts,
      });
    }

    // Reset login attempts on successful login
    loginAttempts[email].attempts = 0;
    loginAttempts[email].timeout = 0;

    // Generate access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Set refresh token in HTTP-only cookie for better security
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
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
});

// Get user profile (protected route)
app.get("/api/user/profile", authenticateToken, (req, res) => {
  try {
    // Find user (req.user is set by authenticateToken middleware)
    const user = users.find((user) => user.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Request password reset
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the token with expiration
    passwordResetTokens[email] = {
      token: resetToken,
      expiry: Date.now() + PASSWORD_RESET_EXPIRY,
    };

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send password reset email" });
    }

    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password with token
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Validate input
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if token exists and is valid
    if (
      !passwordResetTokens[email] ||
      passwordResetTokens[email].token !== token
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Check if token is expired
    if (Date.now() > passwordResetTokens[email].expiry) {
      delete passwordResetTokens[email];
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;

    // Clean up reset token
    delete passwordResetTokens[email];

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh token
app.post("/api/auth/refresh-token", (req, res) => {
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
      const accessToken = jwt.sign(
        { id: foundUser.id, email: foundUser.email, role: foundUser.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

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
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
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
});

// Add some test users
(async () => {
  try {
    // Admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    users.push({
      id: 1,
      name: "Admin User",
      email: "admin@lazreustech.com",
      phone: "1234567890",
      password: adminPassword,
      role: "ADMIN",
      createdAt: new Date(),
    });

    // Customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    users.push({
      id: 2,
      name: "Test Customer",
      email: "customer@example.com",
      phone: "9876543210",
      password: customerPassword,
      role: "CUSTOMER",
      createdAt: new Date(),
    });

    console.log("Test users created");
  } catch (error) {
    console.error("Error creating test users:", error);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
