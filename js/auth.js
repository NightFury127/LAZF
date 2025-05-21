// API URL
const API_URL = 'http://localhost:5000/api';

// Token storage
function setToken(token) {
  localStorage.setItem('auth_token', token);
}

function getToken() {
  return localStorage.getItem('auth_token');
}

function removeToken() {
  localStorage.removeItem('auth_token');
}

// User storage
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function removeUser() {
  localStorage.removeItem('user');
}

// Check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Register user
async function register(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Verify OTP
async function verifyOTP(email, otp) {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Resend OTP
async function resendOTP(email) {
  try {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Login user
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user data
    setToken(data.token);
    setUser(data.user);

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Logout user
function logout() {
  removeToken();
  removeUser();
  window.location.href = 'index.html';
}

// Get user profile
async function getUserProfile() {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return { success: true, user: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Check authentication and redirect based on role
function checkAuth() {
  const user = getUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Redirect based on role
  if (user.role === 'ADMIN') {
    if (!window.location.pathname.includes('admin-dashboard')) {
      window.location.href = 'admin-dashboard.html';
    }
  } else if (user.role === 'CUSTOMER') {
    if (!window.location.pathname.includes('dashboard')) {
      window.location.href = 'dashboard.html';
    }
  }
}

// Check if on protected page and redirect if not authenticated
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Check if on admin page and redirect if not admin
function protectAdminPage() {
  const user = getUser();
  
  if (!isLoggedIn() || !user || user.role !== 'ADMIN') {
    window.location.href = 'login.html';
  }
}

// Export functions
window.Auth = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
  getUserProfile,
  isLoggedIn,
  getUser,
  checkAuth,
  protectPage,
  protectAdminPage
};
