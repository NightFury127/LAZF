/**
 * Validation utility functions
 * Validates user input for registration, login, etc.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Is valid phone number
 */
const isValidPhone = (phone) => {
  // Remove non-numeric characters and validate
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ""));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - Is valid password
 */
const isValidPassword = (password) => {
  // Password must be at least 8 characters and include uppercase, lowercase, number and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate registration input
 * @param {Object} data - Registration data
 * @returns {Object} - Validation result
 */
const validateRegistration = (data) => {
  const { name, email, phone, password } = data;
  const errors = {};

  // Validate required fields
  if (!name) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  if (!phone) errors.phone = "Phone number is required";
  if (!password) errors.password = "Password is required";

  // Validate email format
  if (email && !isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  // Validate phone format
  if (phone && !isValidPhone(phone)) {
    errors.phone = "Invalid phone number format";
  }

  // Validate password strength
  if (password && !isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login input
 * @param {Object} data - Login data
 * @returns {Object} - Validation result
 */
const validateLogin = (data) => {
  const { email, password } = data;
  const errors = {};

  // Validate required fields
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  // Validate email format
  if (email && !isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  validateRegistration,
  validateLogin
};
