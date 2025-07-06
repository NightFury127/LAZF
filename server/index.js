/**
 * Main server file
 * Sets up Express server with middleware and routes
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Import middleware
const csrfProtection = require("./middleware/csrf");

// Import utilities
const { configureEmailTransporter } = require("./utils/email");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
if (!JWT_SECRET) {
  console.error("ERROR: NEXTAUTH_SECRET environment variable is not set!");
  console.error("Please set NEXTAUTH_SECRET in your .env file");
  process.exit(1); // Exit the process to prevent insecure operation
}

// Configure CORS with allowed origins from environment variable or default for development
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

// Middleware
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

// Security middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Compress responses
app.use(compression());

// Apply CSRF protection to all API routes
app.use("/api", csrfProtection);

// Configure email transporter if environment variables are set
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const configured = configureEmailTransporter(
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );
  if (configured) {
    console.log("Email transporter configured successfully");
  } else {
    console.warn("Failed to configure email transporter");
  }
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Set up Gmail credentials
app.post("/api/setup-gmail", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const configured = configureEmailTransporter(email, password);

    if (!configured) {
      return res.status(500).json({
        message: "Failed to configure email transporter",
      });
    }

    res.status(200).json({
      message: "Email transporter configured successfully",
    });
  } catch (error) {
    console.error("Setup Gmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
