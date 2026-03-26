import request from 'supertest';

// Mock uuid before importing app
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

import app from '../src/app';

// A simple function to test
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

describe('GET /api/foods/', () => {
  it('should return all foods with 401 status when unauthorized', async () => {
    return request(app)
      .get('/api/foods/')
      .expect('Content-Type', /json/)
      .expect(401)
      .then((res) => {
        expect(res.statusCode).toBe(401);
      });
  });
});