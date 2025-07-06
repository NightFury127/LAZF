// Mock API for demonstration purposes
// In a real application, this would connect to a backend server
const SESSION_STORAGE_KEY = "lazreus_session";
const USER_SESSION_KEY = "lazreus_user_session";

// Mock user database for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@lazreustech.com",
    phone: "1234567890",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    id: "2",
    name: "Customer User",
    email: "user@lazreustech.com",
    phone: "9876543210",
    password: "User@123",
    role: "CUSTOMER",
  },
];

// Mock OTP storage
const MOCK_OTPS = {};

// CSRF protection
let csrfToken = "";

// Initialize CSRF token
function initCsrfToken() {
  csrfToken = generateRandomToken();
  sessionStorage.setItem("csrf_token", csrfToken);
  return csrfToken;
}

// Generate a random token for CSRF protection
function generateRandomToken() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Get CSRF token
function getCsrfToken() {
  if (!csrfToken) {
    csrfToken = sessionStorage.getItem("csrf_token") || initCsrfToken();
  }
  return csrfToken;
}

// Session storage (more secure than localStorage, cleared when browser is closed)
function setSessionData(data) {
  if (!data) return;

  // Store only non-sensitive data
  const sessionData = {
    isLoggedIn: true,
    lastActive: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
}

function getSessionData() {
  const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function clearSessionData() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem(USER_SESSION_KEY);
}

// User data storage (minimal, non-sensitive info only)
function setUserSession(user) {
  if (!user) return;

  // Store only non-sensitive user data
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
}

function getUserSession() {
  const userData = sessionStorage.getItem(USER_SESSION_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Check if user is logged in
function isLoggedIn() {
  const session = getSessionData();
  return !!session && session.isLoggedIn;
}

// Register user (mock implementation)
async function register(name, email, phone, password) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if email already exists
      const existingUser = MOCK_USERS.find((user) => user.email === email);
      if (existingUser) {
        resolve({ success: false, message: "Email already registered" });
        return;
      }

      // Create new user
      const newUser = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        phone,
        password,
        role: "CUSTOMER", // Default role
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      MOCK_OTPS[email] = otp;

      // Log OTP to console for testing
      console.log(`OTP for ${email}: ${otp}`);

      resolve({
        success: true,
        message:
          "Registration successful! Please verify your email with the OTP code.",
      });
    }, 800);
  });
}

// Verify OTP (mock implementation)
async function verifyOTP(email, otp) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const storedOTP = MOCK_OTPS[email];

      if (!storedOTP) {
        resolve({
          success: false,
          message: "No OTP found for this email. Please request a new one.",
        });
        return;
      }

      if (storedOTP === otp) {
        // OTP verified, clear it
        delete MOCK_OTPS[email];

        // Find the user and mark as verified
        const user = MOCK_USERS.find((u) => u.email === email);
        if (user) {
          user.verified = true;
        }

        resolve({ success: true, message: "Email verified successfully!" });
      } else {
        resolve({ success: false, message: "Invalid OTP. Please try again." });
      }
    }, 800);
  });
}

// Resend OTP (mock implementation)
async function resendOTP(email) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email);

      if (!user) {
        resolve({ success: false, message: "Email not found" });
        return;
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      MOCK_OTPS[email] = otp;

      // Log OTP to console for testing
      console.log(`New OTP for ${email}: ${otp}`);

      resolve({ success: true, message: "OTP resent successfully" });
    }, 800);
  });
}

// Login user (mock implementation)
async function login(email, password) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Find user by email
      const user = MOCK_USERS.find((u) => u.email === email);

      if (!user) {
        resolve({ success: false, message: "Invalid email or password" });
        return;
      }

      // Check password
      if (user.password !== password) {
        resolve({ success: false, message: "Invalid email or password" });
        return;
      }

      // Check if user is verified (skip for demo users)
      if (
        !user.verified &&
        !["admin@lazreustech.com", "user@lazreustech.com"].includes(email)
      ) {
        resolve({
          success: false,
          message: "Please verify your email before logging in",
        });
        return;
      }

      // Set session data
      setSessionData({ isLoggedIn: true });

      // Create a safe user object without password
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      setUserSession(safeUser);

      resolve({ success: true, user: safeUser });
    }, 800);
  });
}

// Logout user (mock implementation)
async function logout() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Clear client-side session data
      clearSessionData();
      window.location.href = "index.html";
      resolve();
    }, 300);
  });
}

// Get user profile (mock implementation)
async function getUserProfile() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const user = getUserSession();

      if (!user) {
        resolve({ success: false, message: "User not logged in" });
        return;
      }

      // Find the user in our mock database to get latest data
      const latestUser = MOCK_USERS.find((u) => u.email === user.email);

      if (!latestUser) {
        clearSessionData();
        resolve({ success: false, message: "User not found" });
        return;
      }

      // Create a safe user object without password
      const safeUser = {
        id: latestUser.id,
        name: latestUser.name,
        email: latestUser.email,
        role: latestUser.role,
      };

      // Update session with latest data
      setUserSession(safeUser);

      resolve({ success: true, user: safeUser });
    }, 500);
  });
}

// Check authentication and redirect based on role
function checkAuth() {
  const user = getUserSession();

  if (!isLoggedIn() || !user) {
    window.location.href = "login.html";
    return;
  }

  // Redirect based on role
  if (user.role === "ADMIN") {
    if (!window.location.pathname.includes("admin-dashboard")) {
      window.location.href = "admin-dashboard.html";
    }
  } else if (user.role === "CUSTOMER") {
    if (!window.location.pathname.includes("dashboard")) {
      window.location.href = "dashboard.html";
    }
  }
}

// Check if on protected page and redirect if not authenticated
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// Check if on admin page and redirect if not admin
function protectAdminPage() {
  const user = getUserSession();

  if (!isLoggedIn() || !user || user.role !== "ADMIN") {
    window.location.href = "login.html";
  }
}

// Initialize auth on page load
function initAuth() {
  // Initialize CSRF token if not already set
  if (!sessionStorage.getItem("csrf_token")) {
    initCsrfToken();
  }

  // Refresh the session if user is logged in
  if (isLoggedIn()) {
    getUserProfile().catch(() => {
      // If profile fetch fails, user might be logged out on server
      clearSessionData();
    });
  }
}

// Run initialization
initAuth();

// Export functions
window.Auth = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
  getUserProfile,
  isLoggedIn,
  getUser: getUserSession,
  checkAuth,
  protectPage,
  protectAdminPage,
};
