const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('nodemailer');
jest.mock('node-fetch');
jest.mock('crypto');

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';

// Import server after mocking dependencies
const app = express();
require('../server');

describe('Authentication API', () => {
  // Test user registration
  describe('POST /api/auth/register', () => {
    it('should register a new user and send OTP', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('OTP sent to your email');
    });

    it('should return error if email already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!'
        });
      
      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!'
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email already registered');
    });
  });

  // Test OTP verification
  describe('POST /api/auth/verify-otp', () => {
    it('should verify OTP and create user account', async () => {
      // Register first
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'verify@example.com',
          password: 'Password123!'
        });
      
      // Get OTP from console log or mock
      const otp = '123456'; // This would be mocked
      
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: 'verify@example.com',
          otp
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Account verified successfully');
    });

    it('should return error for invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: 'verify@example.com',
          otp: 'invalid'
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid OTP');
    });
  });

  // Test login
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      // Add user to the users array (this depends on how your server stores users)
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword'
        });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should enforce rate limiting after multiple failed attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'ratelimit@example.com',
            password: 'WrongPassword'
          });
      }
      
      // 6th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ratelimit@example.com',
          password: 'WrongPassword'
        });
      
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toContain('Too many failed login attempts');
    });
  });

  // Test password reset
  describe('Password Reset Flow', () => {
    it('should send password reset email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'reset@example.com'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain('If your email is registered');
    });

    it('should reset password with valid token', async () => {
      // This test would need to mock the token generation and storage
      const token = 'valid_reset_token';
      
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'reset@example.com',
          token,
          newPassword: 'NewPassword123!'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Password has been reset successfully');
    });
  });
});
