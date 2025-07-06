/**
 * Email utility functions
 * Handles sending emails for OTP verification, password reset, etc.
 */

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Email configuration
let transporter = null;
let emailConfig = {
  service: null,
  auth: {
    user: null,
    pass: null,
  },
};

// Development mode flag
const isDevelopment = process.env.NODE_ENV === "development";

// Create a test account for development if needed
if (isDevelopment) {
  // Set up a mock transporter for development
  transporter = {
    sendMail: async (mailOptions) => {
      console.log(
        "DEVELOPMENT MODE: Email would be sent with the following details:"
      );
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);

      // Extract OTP from the HTML content if it's an OTP email
      let otp = "";
      if (mailOptions.subject.includes("Verification")) {
        const match = mailOptions.html.match(
          /<h2 style="color: #000; letter-spacing: 5px; margin: 0;">(\d+)<\/h2>/
        );
        if (match && match[1]) {
          otp = match[1];
        }
      }

      // Log OTP to console and file for easy access during development
      if (otp) {
        console.log(`OTP: ${otp}`);

        // Also log to the OTP display server's data file
        try {
          const otpLogPath = path.join(process.cwd(), "otp-log.txt");
          const logEntry = `${new Date().toISOString()} - Email: ${mailOptions.to} - OTP: ${otp}\n`;
          fs.appendFileSync(otpLogPath, logEntry);
        } catch (err) {
          console.error("Error writing to OTP log:", err);
        }
      }

      return { accepted: [mailOptions.to] };
    },
  };

  console.log(
    "Email service running in DEVELOPMENT mode - emails will be logged but not sent"
  );
}

/**
 * Configure email transporter with Gmail credentials
 * @param {string} email - Gmail email address
 * @param {string} password - Gmail password or app password
 * @returns {boolean} - Success status
 */
const configureEmailTransporter = (email, password) => {
  try {
    emailConfig.service = "gmail";
    emailConfig.auth.user = email;
    emailConfig.auth.pass = password;

    transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};

/**
 * Send OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} otp - One-time password
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPEmail = async (to, otp) => {
  try {
    // In development mode, we already have a mock transporter set up
    if (!transporter && !isDevelopment) {
      console.error("Email transporter not configured");
      return false;
    }

    const mailOptions = {
      from: isDevelopment
        ? "development@lazreustech.com"
        : emailConfig.auth.user,
      to,
      subject: "Lazreus Tech - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #000; text-align: center;">Lazreus Tech</h2>
          <h3 style="color: #000;">Email Verification</h3>
          <p style="color: #333;">Thank you for registering with Lazreus Tech. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #000; letter-spacing: 5px; margin: 0;">${otp}</h2>
          </div>
          <p style="color: #333;">This OTP will expire in 10 minutes.</p>
          <p style="color: #333;">If you did not request this verification, please ignore this email.</p>
          <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Lazreus Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // In development mode, also log to console for convenience
    if (isDevelopment) {
      console.log(`Development mode: OTP for ${to} is ${otp}`);
    }

    return true;
  } catch (error) {
    console.error("Send OTP email error:", error);
    return false;
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} token - Password reset token
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async (to, token) => {
  try {
    // In development mode, we already have a mock transporter set up
    if (!transporter && !isDevelopment) {
      console.error("Email transporter not configured");
      return false;
    }

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: isDevelopment
        ? "development@lazreustech.com"
        : emailConfig.auth.user,
      to,
      subject: "Lazreus Tech - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #000; text-align: center;">Lazreus Tech</h2>
          <h3 style="color: #000;">Password Reset</h3>
          <p style="color: #333;">You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #333;">This link will expire in 1 hour.</p>
          <p style="color: #333;">If you did not request a password reset, please ignore this email.</p>
          <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Lazreus Tech. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // In development mode, also log to console for convenience
    if (isDevelopment) {
      console.log(
        `Development mode: Password reset link for ${to} is ${resetLink}`
      );
    }

    return true;
  } catch (error) {
    console.error("Send password reset email error:", error);
    return false;
  }
};

module.exports = {
  configureEmailTransporter,
  sendOTPEmail,
  sendPasswordResetEmail,
};
