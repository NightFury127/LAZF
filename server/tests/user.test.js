const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';

// Import server
const app = express();
require('../server');

describe('User API', () => {
  let validToken;
  
  beforeAll(() => {
    // Create a valid token for testing
    validToken = jwt.sign(
      { id: 1, email: 'test@example.com', role: 'CUSTOMER' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  // Test protected profile route
  describe('GET /api/user/profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.role).toBe('CUSTOMER');
    });

    it('should return 401 with no token', async () => {
      const response = await request(app)
        .get('/api/user/profile');
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid_token');
      
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  // Test token refresh
  describe('POST /api/auth/refresh-token', () => {
    it('should issue new access token with valid refresh token', async () => {
      // This test would need to mock cookies
      const refreshToken = jwt.sign(
        { id: 1, email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Mock the cookie
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', [`refreshToken=${refreshToken}`]);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('should return 401 with no refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token');
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('No refresh token provided');
    });
  });

  // Test role-based authorization
  describe('Role-based Authorization', () => {
    let adminToken;
    let customerToken;
    
    beforeAll(() => {
      // Create tokens with different roles
      adminToken = jwt.sign(
        { id: 1, email: 'admin@example.com', role: 'ADMIN' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      customerToken = jwt.sign(
        { id: 2, email: 'customer@example.com', role: 'CUSTOMER' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    // This would test a hypothetical admin-only endpoint
    it('should allow access to admin routes with admin token', async () => {
      // Assuming there's an admin-only endpoint
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.statusCode).toBe(200);
    });

    it('should deny access to admin routes with customer token', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toContain('Forbidden');
    });
  });
});
