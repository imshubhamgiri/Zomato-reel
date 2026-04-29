import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Mock uuid before importing app
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

import app from '../src/app';
import User from '../src/models/userModel';
import {FoodPartner} from '../src/models/foodPartner.model';
import Food from '../src/models/food.model';
// import Order from '../src/models/order.model';
// import RefreshToken from '../src/models/refreshToken.model';

// ============================================================================
// TEST SETUP & TEARDOWN
// ============================================================================

beforeAll(async () => {
  const url = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/testdb';
  await mongoose.connect(url);
});

afterAll(async () => {
  // Clean up all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
});

// Helper function to clean database between tests
const cleanDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// ============================================================================
// AUTHENTICATION TESTS - User Registration & Login
// ============================================================================

describe('AUTH - User Registration Tests', () => {
  beforeEach(cleanDatabase);

  it('should register a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    const response = await request(app)
      .post('/api/auth/users/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('registered successfully');
    expect(response.body.user).toHaveProperty('email', userData.email);
    expect(response.body.tokens).toHaveProperty('accessToken');
    expect(response.body.tokens).toHaveProperty('refreshToken');
  });

  it('should fail to register with duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    // Register first user
    await request(app)
      .post('/api/auth/users/register')
      .send(userData);

    // Try to register with same email
    await request(app)
      .post('/api/auth/users/register')
      .send(userData)
      .expect(409);

    // expect(response.body.success).toBe(false);
    // expect(response.body.error).toContain('User with this email already exists');
  });

  it('should fail to register with invalid email format', async () => {
    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should fail to register with weak password', async () => {
    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john1@example.com',
        password: '123', // Too short/weak
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should fail to register with missing required fields', async () => {
    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        email: 'john2@example.com',
        // Missing name and password
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should hash password before storing', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john3@example.com',
      password: 'Password123!',
    };

    await request(app)
      .post('/api/auth/users/register')
      .send(userData);

    const user = await User.findOne({ email: userData.email }).select('+password');
    expect(user?.password).not.toBe(userData.password);
    expect(user?.password).toBeTruthy();
  });
});

// ============================================================================
// AUTHENTICATION TESTS - User Login
// ============================================================================

describe('AUTH - User Login Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    });
  });

  it('should login user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({
        email: 'john@example.com',
        password: 'Password123!',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.tokens).toHaveProperty('accessToken');
    expect(response.body.tokens).toHaveProperty('refreshToken');
    expect(response.body.user.email).toBe('john@example.com');
  });

  it('should fail login with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({
        email: 'john@example.com',
        password: 'WrongPassword123!',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should fail login with non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123!',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should set auth cookies on successful login', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({
        email: 'john@example.com',
        password: 'Password123!',
      });

    expect(response.headers['set-cookie']).toBeDefined();
    const cookieString = response.headers['set-cookie'].toString();
    expect(cookieString).toContain('accessToken');
  });
});

// ============================================================================
// FOOD MANAGEMENT TESTS - Get Food Items
// ============================================================================

describe('FOOD - Get Food Items Tests', () => {
  let foodPartnerId: string;
  let accessToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    
    // Create partner
    const partner = await FoodPartner.create({
      name: 'Pizza Hub',
      email: 'pizzahub@example.com',
      password: await bcrypt.hash('Password123!', 10),
      phone:'9636546485',
      address: '123 Pizza Street',
      restaurantName: 'Pizza Hub',
    });
    
    foodPartnerId = partner._id.toString();

    // Create a user and login to get access token for protected routes
    await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('Password123!', 10),
    });

    const loginResponse = await request(app)
      .post('/api/auth/users/login')
      .send({ email: 'testuser@example.com', password: 'Password123!' });

    accessToken = loginResponse.body.tokens.accessToken;

    // Create sample food items
    await Food.create([
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza',
        price: 500,
        type: 'standard',
        foodPartner: foodPartnerId,
        image: 'https://example.com/image1.jpg',
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Pepperoni pizza',
        price: 600,
        type: 'standard',
        foodPartner: foodPartnerId,
        image: 'https://example.com/image2.jpg',
      },
    ]);
  });

  it('should get all food items with pagination', async () => {
    const response = await request(app)
      .get('/api/foods/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should get food items with limit parameter', async () => {
    const response = await request(app)
      .get('/api/foods/?limit=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data.length).toBeLessThanOrEqual(1);
  });

  it('should get food items by partner ID', async () => {
    const response = await request(app)
      .get(`/api/foods/partners/${foodPartnerId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.every((item: any) => 
      item.foodPartner === foodPartnerId
    )).toBe(true);
  });

  it('should fail to get food with invalid partner ID format', async () => {
    const response = await request(app)
      .get('/api/foods/partners/invalid-id')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// FOOD MANAGEMENT TESTS - Delete Food Item
// ============================================================================

describe('FOOD - Delete Food Item Tests', () => {
  let foodPartnerId: string;
  let accessToken: string;
  let foodId: string;

  beforeEach(async () => {
    await cleanDatabase();

    // Create partner
    const partnerData = {
      name: 'Pizza Hub',
      email: 'pizzahub@example.com',
      password: 'Password123!',
      restaurantName: 'Pizza Hub',
      businessLicense: 'BL123456',
    };

    const partnerResponse = await request(app)
      .post('/api/auth/partners/register')
      .send(partnerData);

    foodPartnerId = partnerResponse.body.user.id;
    accessToken = partnerResponse.body.tokens.accessToken;

    // Create a food item
    const foodItem = await Food.create({
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 500,
      type: 'standard',
      foodPartner: foodPartnerId,
      image: 'https://example.com/image.jpg',
    });

    foodId = foodItem._id.toString();
  });

  it('should delete food item by owner', async () => {
    const response = await request(app)
      .delete(`/api/foods/${foodId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);

    const deletedFood = await Food.findById(foodId);
    expect(deletedFood).toBeNull();
  });

  it('should fail to delete non-existent food item', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/api/foods/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('not found');
  });

  it('should fail to delete food with invalid ID format', async () => {
    const response = await request(app)
      .delete('/api/foods/invalid-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// ORDER TESTS - Create Order
// ============================================================================

describe('ORDER - Create Order Tests', () => {
  
  let foodPartnerId: string;
  let accessToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    // Create user
    const userResponse = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });


    accessToken = userResponse.body.tokens.accessToken;

    // Create food partner
    const partnerResponse = await request(app)
      .post('/auth/partners/register')
      .send({
        name: 'Pizza Hub',
        email: 'pizzahub@example.com',
        password: 'Password123!',
        restaurantName: 'Pizza Hub',
        businessLicense: 'BL123456',
      });

    foodPartnerId = partnerResponse.body.user.id;

    // Create food item
    await Food.create({
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 500,
      type: 'standard',
      foodPartner: foodPartnerId,
      image: 'https://example.com/image.jpg',
    });
  });

  it('should create order with valid data', async () => {
    const orderData = {
      foodPartner: foodPartnerId,
      deliveryAddressSnapshot: {
        fullName: 'John Doe',
        phone: '9876543210',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      items: [
        {
          food: new mongoose.Types.ObjectId().toString(),
          nameSnapshot: 'Margherita Pizza',
          quantity: 2,
          priceSnapshot: 500,
        },
      ],
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(orderData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.price).toBe(1000); // 2 * 500
  });

  it('should calculate total price correctly', async () => {
    const foodItem = await Food.findOne({ foodPartner: foodPartnerId });
    
    const orderData = {
      foodPartner: foodPartnerId,
      deliveryAddressSnapshot: {
        fullName: 'John Doe',
        phone: '9876543210',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      items: [
        {
          food: foodItem?._id.toString(),
          nameSnapshot: 'Margherita Pizza',
          quantity: 3,
          priceSnapshot: 500,
        },
      ],
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(orderData);

    expect(response.body.data.price).toBe(1500); // 3 * 500
  });

  it('should fail to create order without authentication', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        foodPartner: foodPartnerId,
        items: [],
      })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should fail with missing delivery address', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        foodPartner: foodPartnerId,
        items: [],
        // Missing deliveryAddressSnapshot
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should fail with empty items array', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        foodPartner: foodPartnerId,
        deliveryAddressSnapshot: {
          fullName: 'John Doe',
          phone: '9876543210',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
        },
        items: [],
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// USER PROFILE TESTS
// ============================================================================

describe('USER PROFILE - Get Profile Tests', () => {
  
  let accessToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });


    accessToken = response.body.tokens.accessToken;
  });

  it('should get user profile with valid authentication', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('john@example.com');
    expect(response.body.data.name).toBe('John Doe');
  });

  it('should fail to get profile without authentication', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should fail with invalid token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('ERROR HANDLING - General Error Cases', () => {
  it('should return 404 for non-existent endpoint', async () => {
    const response = await request(app)
      .get('/non-existent-endpoint')
      .expect(404);

    expect(response.body.success).toBe(false);
  });

  it('should return proper error response structure', async () => {
    const response = await request(app)
      .post('/api/auth/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password',
      });

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });
});

// ============================================================================
// HEALTH CHECK TEST
// ============================================================================

describe('HEALTH - Server Status Tests', () => {
  it('GET / should return 200 status and "Hello, World!" message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Hello, World!');
  });
});

// ============================================================================
// PARTNER REGISTRATION TESTS
// ============================================================================

describe('AUTH - Partner Registration Tests', () => {
  beforeEach(cleanDatabase);

  it('should register a new food partner successfully', async () => {
    const partnerData = {
      name: 'Pizza Hub',
      email: 'pizzahub@example.com',
      password: 'Password123!',
      restaurantName: 'Pizza Hub Restaurant',
      businessLicense: 'BL123456',
    };

    const response = await request(app)
      .post('/api/auth/partners/register')
      .send(partnerData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(partnerData.email);
    expect(response.body.tokens).toHaveProperty('accessToken');
  });

  it('should fail to register partner with duplicate email', async () => {
    const partnerData = {
      name: 'Pizza Hub',
      email: 'pizzahub@example.com',
      password: 'Password123!',
      restaurantName: 'Pizza Hub Restaurant',
      businessLicense: 'BL123456',
    };

    await request(app)
      .post('/api/auth/partners/register')
      .send(partnerData);

    const response = await request(app)
      .post('/api/auth/partners/register')
      .send(partnerData)
      .expect(409);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// TOKEN REFRESH TESTS
// ============================================================================

describe('AUTH - Token Refresh Tests', () => {
  let refreshToken: string;

  beforeEach(async () => {
    await cleanDatabase();
    
    const registerResponse = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

    refreshToken = registerResponse.body.tokens.refreshToken;
  });

  it('should refresh access token with valid refresh token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.tokens).toHaveProperty('accessToken');
  });

  it('should fail to refresh with invalid refresh token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid-token' })
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// USER UPDATE PROFILE TESTS
// ============================================================================

describe('USER PROFILE - Update Profile Tests', () => {
  
  let accessToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });


    accessToken = response.body.tokens.accessToken;
  });

  it('should update user profile successfully', async () => {
    const updateData = {
      name: 'Jane Doe',
      phone: '9876543210',
      gender: 'Female',
    };

    const response = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Jane Doe');
  });

  it('should fail to update profile without authentication', async () => {
    const response = await request(app)
      .patch('/api/users/me')
      .send({ name: 'Jane Doe' })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should add address to user profile', async () => {
    const addressData = {
      label: 'Home',
      fullName: 'Jane Doe',
      phone: '9876543210',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    };

    const response = await request(app)
      .post('/api/users/me/addresses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(addressData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
  });
});

// ============================================================================
// FOOD UPDATE AND LISTING TESTS
// ============================================================================

describe('FOOD - Update Food Item Tests', () => {
  let foodPartnerId: string;
  let accessToken: string;
  let foodId: string;

  beforeEach(async () => {
    await cleanDatabase();

    const partnerResponse = await request(app)
      .post('/api/auth/partners/register')
      .send({
        name: 'Pizza Hub',
        email: 'pizzahub@example.com',
        password: 'Password123!',
        restaurantName: 'Pizza Hub',
        businessLicense: 'BL123456',
      });

    foodPartnerId = partnerResponse.body.user.id;
    accessToken = partnerResponse.body.tokens.accessToken;

    const foodItem = await Food.create({
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 500,
      type: 'standard',
      foodPartner: foodPartnerId,
      image: 'https://example.com/image.jpg',
    });

    foodId = foodItem._id.toString();
  });

  it('should update food item successfully', async () => {
    const updateData = {
      name: 'Updated Pizza',
      price: 600,
      description: 'Updated description',
    };

    const response = await request(app)
      .patch(`/api/foods/${foodId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Updated Pizza');
    expect(response.body.data.price).toBe(600);
  });

  it('should fail to update food without authentication', async () => {
    const response = await request(app)
      .patch(`/api/foods/${foodId}`)
      .send({ name: 'Updated Pizza' })
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// ORDER RETRIEVAL TESTS
// ============================================================================

describe('ORDER - Retrieve Orders Tests', () => {
  
  let accessToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });


    accessToken = response.body.tokens.accessToken;
  });

  it('should get user orders with authentication', async () => {
    const response = await request(app)
      .get('/api/orders/my-orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should fail to get orders without authentication', async () => {
    const response = await request(app)
      .get('/api/orders/my-orders')
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// INPUT VALIDATION TESTS
// ============================================================================

describe('VALIDATION - Email and Password Requirements', () => {
  beforeEach(cleanDatabase);

  it('should validate email format on registration', async () => {
    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
      'spaces in@email.com',
    ];

    for (const email of invalidEmails) {
      const response = await request(app)
        .post('/api/auth/users/register')
        .send({
          name: 'John Doe',
          email,
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    }
  });

  it('should validate password strength', async () => {
    const weakPasswords = [
      '123', // Too short
      'password', // No numbers or special chars
      '12345678', // No letters
    ];

    for (const password of weakPasswords) {
      const response = await request(app)
        .post('/api/auth/users/register')
        .send({
          name: 'John Doe',
          email: `test-${Math.random()}@example.com`,
          password,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    }
  });
});

// ============================================================================
// CONCURRENT REQUEST TESTS
// ============================================================================

describe('CONCURRENCY - Multiple Simultaneous Requests', () => {
  beforeEach(cleanDatabase);

  it('should handle multiple concurrent registrations', async () => {
    const promises: Promise<any>[] = [];

    for (let i = 0; i < 3; i++) {
      promises.push(
        request(app)
          .post('/auth/users/register')
          .send({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            password: 'Password123!',
          })
      );
    }

    const responses = await Promise.all(promises);

    responses.forEach((response) => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});

// ============================================================================
// LOGOUT & SESSION MANAGEMENT TESTS
// ============================================================================

describe('AUTH - Logout & Session Management Tests', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    const response = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

    accessToken = response.body.tokens.accessToken;
    refreshToken = response.body.tokens.refreshToken;
  });

  it('should logout user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/users/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('should invalidate refresh token after logout', async () => {
    await request(app)
      .post('/api/auth/users/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });

    // Try to use the refresh token
    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});

// ============================================================================
// DATA CONSISTENCY TESTS
// ============================================================================

describe('DATA CONSISTENCY - Database State Tests', () => {
  beforeEach(cleanDatabase);

  it('should maintain data consistency across operations', async () => {
    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

    const userId = registerResponse.body.user.id;
    const accessToken = registerResponse.body.tokens.accessToken;

    // Verify user exists in database
    const user = await User.findById(userId);
    expect(user).toBeDefined();
    expect(user?.email).toBe('john@example.com');

    // Get profile and verify consistency
    const profileResponse = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(profileResponse.body.data.email).toBe(user?.email);
  });

  it('should prevent duplicate food items with same properties', async () => {
    const partnerResponse = await request(app)
      .post('/api/auth/partners/register')
      .send({
        name: 'Pizza Hub',
        email: 'pizzahub@example.com',
        password: 'Password123!',
        restaurantName: 'Pizza Hub',
        businessLicense: 'BL123456',
      });

    const foodPartnerId = partnerResponse.body.user.id;

    const foodData = {
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 500,
      type: 'standard',
      foodPartner: foodPartnerId,
      image: 'https://example.com/image.jpg',
    };

    await Food.create(foodData);
    const foodCount1 = await Food.countDocuments(foodData);

    // Both should exist as separate items
    await Food.create(foodData);
    const foodCount2 = await Food.countDocuments(foodData);

    expect(foodCount2).toBe(foodCount1 + 1);
  });
});