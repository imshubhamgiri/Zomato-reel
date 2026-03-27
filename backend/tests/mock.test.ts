import request from 'supertest';

// Mock uuid before importing app
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

import app from '../src/app';
import mongoose from 'mongoose';
// Path to your express app

beforeAll(async () => {
  // Connect to your local compass/community server
  const url = 'mongodb://127.0.0.1:27017/testdb';
  await mongoose.connect(url);
});

afterAll(async () => {
  // This stops the "Jest did not exit" error
  await mongoose.connection.close();
});

const add = (a: number, b: number) => a + b;

describe('Learning Testing', () => {
  it('should add two numbers correctly', () => {
    // 1. Arrange
    const num1 = 5;
    const num2 = 10;

    // 2. Act
    const result = add(num1, num2);

    // 3. Assert
    expect(result).toBe(15);
  });
});

describe('API Health Check', () => {
  // Test 1: Root endpoint should be accessible
  it('GET / should return 200 status and "Hello, World!" message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Hello, World!');
  });
});

describe('Protected Routes - Authorization', () => {
  // Test 2: Unauthorized access to protected route
  it('GET /api/foods should return 401 when user is not authenticated', async () => {
    const response = await request(app)
      .get('/api/foods')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('not authenticated');
  });

  // Test 3: Verify error response structure for authentication
  it('should return proper error structure for unauthorized requests', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({ email: 'test@test.com', password: 'wrongpass' })
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });
});

// // ADVANCED TESTS (uncomment when writing integration tests)
// describe('Authentication Flow', () => {
//   it('should register a new user successfully', async () => {
//     const newUser = {
//       name: 'Test User',
//       email: 'testuser@example.com',
//       password: 'SecurePassword123!'
//     };
//
//     return request(app)
//       .post('/api/auth/users/register')
//       .send(newUser)
//       .expect(201)
//       .then((res) => {
//         expect(res.body).toHaveProperty('user');
//         expect(res.body.user.email).toBe(newUser.email);
//       });
//   });
// });

// // describe('GET /api/foods/', () => {
//   //   it('should return all foods with 401 status when unauthorized', async () => {
//   //     return request(app)
//   //       .get('/api/foods/')
//   //       .expect('Content-Type', /json/)
//   //       .expect(401)
//   //       .then((res) => {
//   //         expect(res.statusCode).toBe(401);
//   //         expect(res.body).toHaveProperty('message', 'Please login first');
//   //         // expect(res.body.name).toBe('AuthError');
//   //       });
//   //   });
// // });
// });

describe('POST /api/auth/partners/register', () => {
  it('should not register a new partner and return 409 status', async () => {
    const newPartner = {
      name: 'Test Partner',
      email: 'testpartner@example.com',
      password: 'password123',
      restaurantName: 'Test Restaurant',
      address:'test address',
      phone:'1234567890'
    };

    return request(app)
      .post('/api/auth/partners/register')
      .send(newPartner)
      .expect('Content-Type', /json/)
      .expect(409)
      .then((res) => {
        // expect(res.body).toHaveProperty('user');
        // expect(res.body).toHaveProperty('message', 'Partner with this email already exists');
         expect(res.body.name).toBe('ConflictError');
      });
  },15000);
});
