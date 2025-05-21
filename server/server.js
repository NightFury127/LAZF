const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Load environment variables
dotenv.config();

// Hardcoded JWT secret (for development only)
const JWT_SECRET = "lazreus_tech_jwt_secret_key";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with a real database in production)
const users = [];
const otpStore = {};

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
    console.log(
      "OTP:",
      mailOptions.html.match(
        /<h2 style="color: #000; letter-spacing: 5px; margin: 0;">(.*?)<\/h2>/
      )[1]
    );
    return { messageId: "test" };
  },
};

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: '"Lazreus Tech" <noreply@lazreustech.com>',
    to: email,
    subject: "Lazreus Tech - Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #000; text-align: center;">Lazreus Tech</h2>
        <h3 style="color: #000; text-align: center;">Email Verification</h3>
        <p style="color: #333; font-size: 16px;">Thank you for registering with Lazreus Tech. Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #000; letter-spacing: 5px; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #333; font-size: 14px;">This OTP is valid for 10 minutes. If you did not request this verification, please ignore this email.</p>
        <p style="color: #333; font-size: 14px; text-align: center; margin-top: 30px;">© 2025 Lazreus Tech. All rights reserved.</p>
      </div>
    `,
  };

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    // Log the OTP for testing purposes
    console.log(`OTP for ${email}: ${otp}`);

    // Log success message
    if (info.messageId) {
      console.log(`Email sent to ${email} with message ID: ${info.messageId}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Routes
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
    const { email, password } = req.body;

    // Check if email already exists
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (10 minutes)
    otpStore[email] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      password,
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

    // Hash password
    const hashedPassword = await bcrypt.hash(otpStore[email].password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
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
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile (protected route)
app.get("/api/user/profile", (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = users.find((user) => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

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
      email: "admin@lazreustech.com",
      password: adminPassword,
      role: "ADMIN",
      createdAt: new Date(),
    });

    // Customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    users.push({
      id: 2,
      email: "customer@example.com",
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
