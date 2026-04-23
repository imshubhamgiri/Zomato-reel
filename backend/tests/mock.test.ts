import request from 'supertest';

// Mock uuid before importing app
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

import app from '../src/app';
import mongoose from 'mongoose';

beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/testdb';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ============================================================================
// UNIT TESTS - Basic functionality tests
// ============================================================================

describe('Unit Tests - Basic Math Operations', () => {
  it('should add two numbers correctly', () => {
    const add = (a: number, b: number) => a + b;
    expect(add(5, 10)).toBe(15);
  });

  it('should subtract two numbers correctly', () => {
    const subtract = (a: number, b: number) => a - b;
    expect(subtract(10, 5)).toBe(5);
  });
});

// ============================================================================
// INTEGRATION TESTS - API Endpoints
// ============================================================================

describe('Integration Tests - Health & Status Endpoints', () => {
  // Test 1: Root endpoint accessibility
  it('GET / should return 200 status and "Hello, World!" message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Hello, World!');
  });

  // Test 2: Health check endpoint
  it('GET /health should return 200 with service info', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('service', 'FoodInReels API');
  });
});

describe('Integration Tests - Authentication & Protected Routes', () => {
  // Test 3: Unauthorized access to protected routes
  it('GET /api/foods should return 401 when user is not authenticated', async () => {
    const response = await request(app)
      .get('/api/foods')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Please login');
  });

  // Test 4: Invalid login credentials error handling
  it('POST /api/auth/users/login should return error for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({ email: 'nonexistent@test.com', password: 'wrongpass' })
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  // Test 5: Partner registration with existing email (conflict)
  it('POST /api/auth/partners/register should return 409 for duplicate email', async () => {
    const newPartner = {
      name: 'Test Partner',
      email: 'testpartner@example.com',
      password: 'password123',
      restaurantName: 'Test Restaurant',
      address: 'test address',
      phone: '1234567890'
    };

    const response = await request(app)
      .post('/api/auth/partners/register')
      .send(newPartner)
      .expect('Content-Type', /json/);

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('name');
  });
});

describe('Integration Tests - Error Handling & Validation', () => {
  // Test 6: Verify proper error response structure
  it('should return structured error response for bad requests', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({ email: '', password: '' })
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  // Test 7: 404 Not Found for non-existent endpoint
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent/endpoint')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  // Test 8: Invalid HTTP method should return error
  it('should reject invalid request methods', async () => {
    const response = await request(app)
      .del('/api/auth/users/login')
      .expect(404);

    expect(response.status).toEqual(404);
  });
});

describe('Integration Tests - Multiple Request Scenarios', () => {
  // Test 9: Sequential requests should maintain isolation
  it('should handle multiple sequential requests independently', async () => {
    const request1 = await request(app)
      .get('/health')
      .expect(200);

    const request2 = await request(app)
      .get('/')
      .expect(200);

    const request3 = await request(app)
      .get('/health')
      .expect(200);

    expect(request1.body).toHaveProperty('status', 'healthy');
    expect(request2.text).toBe('Hello, World!');
    expect(request3.body).toHaveProperty('status', 'healthy');
  });

  // Test 10: Content-Type negotiation should work correctly
  it('should return correct content types for different endpoints', async () => {
    const textResponse = await request(app)
      .get('/')
      .expect('Content-Type', /text/);

    const jsonResponse = await request(app)
      .get('/health')
      .expect('Content-Type', /json/);

    expect(textResponse.text).toBe('Hello, World!');
    expect(jsonResponse.body).toHaveProperty('status');
  });
});


describe('Integration Tests - Create Order Endpoint', () => {
  // Test 11: Create order with valid data
  it('POST /api/orders should create an order with valid data', async () => {
      // First, we need to register and login a user to get an access token
      const uniqueEmail = `testuser-${Date.now()}@example.com`;
      const userCredentials = {
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      };

      const userResponse = await request(app)
        .post('/api/auth/users/register')
        .send(userCredentials)
        .expect(201);

      expect(userResponse.body).toHaveProperty('user');
      expect(userResponse.body).toHaveProperty('tokens');
      const token = userResponse.body.tokens?.accessToken;

      // Now we can create an order using the token
      const orderData = {
        foodPartner: '64b8f8d8f6e5c2a1b0d9e123',
        deliveryAddressSnapshot: {
          fullName: 'Test User',
          phone: '9876543210',
          address: '123 Main St',
          city: 'Anytown',
          state: 'California',
          postalCode: '123456',
          country: 'India',
        },
        items: [
          {
            food: '64b8f8d8f6e5c2a1b0d9e124',
            nameSnapshot: 'Test Food Item',
            quantity: 2,
            priceSnapshot: 500
          }
        ]
      };

      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(201);

      expect(orderResponse.body).toHaveProperty('data');
      expect(orderResponse.body.data).toHaveProperty('price');


    });


  // Test 12: Create order without authentication
  // it('POST /api/orders should return 401 when user is not authenticated', async () => {

  // });

  // Test 13: Create order with missing required fields
  // it('POST /api/orders should return error for missing required fields', async () => {});

  // Test 14: Create order with invalid data types
  // it('POST /api/orders should return error for invalid data types', async () => {});


})