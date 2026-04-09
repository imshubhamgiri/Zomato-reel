# 🍽️ Zomato Reel - Food Discovery Platform

A modern food ordering platform featuring Instagram/TikTok-style video reels where food partners showcase their dishes through engaging short videos. Built with MERN + TypeScript, featuring production-ready error handling, structured logging, and enterprise-grade architecture patterns.

## 🌐 Features

### 🎥 Video Reel Experience
- **Vertical scroll reels** - Instagram/TikTok-style video feed with scroll-snap
- **Auto-play videos** - Smooth playback as users scroll
- **Interactive actions** - Like, save, and share food videos (with atomic transactions)
- **Optimistic UI updates** - Instant feedback on user interactions
- **Mute/Unmute controls** - Toggle audio on videos
- **Responsive design** - Works seamlessly on mobile, tablet, and desktop

### 👤 Dual User System

#### For Users:
- Browse food videos in an engaging reel format
- Like and save favorite food items with real-time counters
- View partner profiles and their complete menu
- Manage multiple delivery addresses (Home, Work, Other)
- Update personal profile information (name, email, phone, gender)
- View saved items and order history
- Real-time interaction counters (likes/saves)

#### For Food Partners:
- Upload food videos with descriptions and pricing
- Manage restaurant profile with details and contact info
- Track video engagement (likes, saves) in real-time
- Edit or delete food items
- Showcase culinary creations to potential customers
- Monitor viewer activity and interactions

### 🔐 Authentication & Security
- **Dual-token system** - Access token (15m) + Refresh token (7d) with rotation
- **Cookie-based authentication** - Secure, httpOnly cookies instead of localStorage
- **Refresh token revocation** - Logout invalidates all existing tokens
- **JWT tokens** - Server-side token verification with type discrimination
- **Role-based access control** - Separate routes for users and partners
- **Protected routes** - Middleware-based authorization with role checking
- **Separate login/register flows** for users and partners
- **Token hash storage** - Tokens are hashed in database for enhanced security

### 📤 Video Management
- **Video upload** - Multer with memory storage for optimized performance
- **CDN integration** - ImageKit for reliable video hosting
- **Video deletion** - Remove videos with proper cleanup
- **Video preview** - Real-time preview before upload
- **Metadata management** - Name, description, price per dish
- **Public ID tracking** - ImageKit public IDs for reliable deletion

### 👥 User Profile Management
- **Profile updates** - User can update name, email, phone, gender
- **Multiple addresses** - Add multiple delivery addresses with labels (Home, Work, Other)
- **Address defaults** - Mark preferred delivery address
- **Complete address info** - Street, city, state, postal code, country, landmark
- **Profile endpoints** - `/api/users/me` for GET and PATCH operations

## 🛠️ Tech Stack

### Frontend
- **React** (v19) - Modern UI library with hooks
- **Vite** (v7) - Lightning-fast build tool & dev server
- **React Router DOM** (v7) - Client-side routing with latest features
- **Axios** (v1.13) - HTTP client with credentials support
- **Tailwind CSS** (v4) - Utility-first styling with Vite plugin
- **React Toastify** (v11) - Toast notifications with React 19 support
- **Lucide React** - Modern icon library

### Backend
- **Node.js** + **TypeScript** (v5.9) - Typed runtime environment
- **Express.js** (v5) - Modern web framework with better error handling
- **MongoDB** (v9 Mongoose) - NoSQL database with improved types
- **JWT** - Token-based authentication with rotation support
- **Bcrypt** - Password hashing (10 rounds) for security
- **Multer** (v2) - File upload handling with memory storage
- **ImageKit** - Professional video CDN service
- **Helmet** (v8) - HTTP security headers middleware
- **Zod** (v4) - Runtime type validation and schema parsing
- **Cookie-parser** - Secure httpOnly cookie handling
- **Express Rate Limit** (v8) - Multiple rate limiting strategies
- **Jest** & **Supertest** - Testing framework and HTTP assertions

### Architecture & Patterns (Backend)
- **TypeScript** - Full type safety across codebase with strict mode
- **Custom Error Classes** - Type-safe error hierarchy (`AppError`, `AuthError`, `ConflictError`, `NotFoundError`, `ValidationError`, `ForbiddenError`)
  - Type-safe error throwing with automatic status code mapping
  - `isOperational` flag to distinguish expected errors from programming bugs
  
- **Async Error Handler Utility** - Eliminates repetitive try-catch blocks
  - Centralized error catching: `asyncHandler(async (req, res) => { ... })`
  - All promise rejections automatically routed to error middleware
  
- **Repository Pattern** - Abstracted data access layer
  - Separation of concerns between business logic and data access
  - Session support for transactional operations
  
- **Service Layer** - Business logic encapsulation
  - Typed error throwing with custom error classes
  - Complex operations like transaction management
  
- **MongoDB Transactions** - ACID-compliant operations
  - Atomic like/save operations with session support
  - Automatic rollback on errors
  - Maintains data consistency across related collections
  
- **Middleware Pipeline** - Ordered execution of cross-cutting concerns
  - Helmet → Rate-limiting → Cookie Parser → JSON Parser → CORS → Auth Context → Logger → Routes → Error Handler
  
- **Role-Based Access Control (RBAC)** - Granular permission management
  - User vs Partner role differentiation
  - Route-level and operation-level access control
  
- **Structured Logging** - Request/response logging with context
  - Error tracking with stack traces
  - Request timing and method logging
  
- **RESTful Endpoints** - Plural resource names and standard HTTP methods (GET, POST, PATCH, DELETE)

## 📁 Project Structure

```
Zomato-reel/
├── frontend/                # React frontend (stable, feature-complete)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   │   ├── Home.jsx           # Video reel feed
│   │   │   ├── UserLogin.jsx      # User authentication
│   │   │   ├── UserRegister.jsx
│   │   │   ├── PartnerLogin.jsx   # Partner authentication
│   │   │   ├── PartnerRegister.jsx
│   │   │   ├── Addfood.jsx        # Video upload interface
│   │   │   └── PartnerProfile*.jsx
│   │   ├── services/       # API client services
│   │   └── config/         # Configuration
│   └── package.json
│
├── backend/                # Express backend (TypeScript, refactored)
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── food.controller.ts
│   │   │   ├── actionController.ts
│   │   │   └── profileController.ts
│   │   ├── services/       # Business logic layer
│   │   │   ├── auth.service.ts      # Auth logic with typed errors
│   │   │   ├── food.service.ts
│   │   │   └── profile.service.ts
│   │   ├── repositories/   # Data access layer
│   │   │   ├── auth.repository.ts
│   │   │   ├── food.repository.ts
│   │   │   └── profile.repository.ts
│   │   ├── middleware/     # Express middleware pipeline
│   │   │   ├── helmet.ts          # HTTP security headers (CSP, X-Frame-Options, etc.)
│   │   │   ├── errorHandler.ts    # Centralized error with type discrimination
│   │   │   ├── auth.ts            # JWT verification & context attachment
│   │   │   ├── validation.ts      # Zod schema validation
│   │   │   ├── logging.ts         # Request/response logging
│   │   │   ├── rateLimiter.ts     # Global API rate limiting
│   │   │   └── cors.ts            # CORS configuration
│   │   ├── routes/         # Express route definitions
│   │   ├── models/         # Mongoose schemas
│   │   ├── types/          # TypeScript interfaces & types
│   │   ├── utils/          # Utility functions
│   │   │   ├── asyncHandler.ts    # Async error wrapper
│   │   │   └── error.ts           # Custom error classes
│   │   ├── db/             # Database configuration
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Entry point
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- ImageKit account (for video hosting)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/imshubhamgiri/Zomato-reel.git
cd Zomato-reel
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

4. Start backend server:
```bash
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🐳 Docker & Containerization

The project includes Docker Compose configuration for complete containerization:

### Services
- **Backend Service** - Express server running on port 3000
- **Frontend Service** - React/Vite app running on port 8080


### Running with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Files
- **backend/Dockerfile** - TypeScript compilation and Node.js runtime
- **frontend/Dockerfile** - Vite build and static server
- **docker-compose.yml** - Service orchestration with networking



## 🏗️ Backend Architecture (Production-Grade)

The backend implements enterprise-grade architecture patterns with complete type safety and error handling:

### Error Handling System

#### Custom Error Classes Hierarchy
```typescript
AppError (abstract base)
├── AuthError (401 Unauthorized)
├── ConflictError (409 Conflict)
├── NotFoundError (404 Not Found)
├── ValidationError (400 Bad Request)
└── ForbiddenError (403 Forbidden)
```

Each error includes:
- Automatic status code assignment per error type
- `isOperational` flag for error classification
- Message context and optional details
- Stack trace sanitization in production

#### Async Error Handler Utility
Eliminates repetitive try-catch blocks:
```typescript
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, user });
  // Errors automatically caught and passed to error middleware
});
```

#### Centralized Error Middleware
```typescript
// Analyzes error type
if (error instanceof AppError) {
  // Operational error - safe to expose
  res.status(error.statusCode).json({ success: false, message: error.message });
} else {
  // Programming error - log and return generic message
  logger.error('Unexpected error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
```

### Request Processing Pipeline

Requests pass through middleware in this order:
1. **Helmet** - Security headers
2. **Rate Limiter** - Global throttling (300 req/15min)
3. **Cookie Parser** - Parse httpOnly cookies
4. **JSON Parser** - Parse request bodies
5. **CORS** - Cross-origin validation
6. **Auth Context** - Attach user to request if authenticated
7. **Logger** - Log request method/path/duration
8. **Route Handlers** - Business logic
9. **Error Handler** - Centralized error response

### Rate Limiting Strategy

```typescript
// Global limiter: 300 requests per 15 minutes
globalApiLimiter: { windowMs: 900000, max: 300 }

// Auth-specific: 20 requests per 15 minutes  
authLimiter: { windowMs: 900000, max: 20 }

// Action-specific: 60 requests per 5 minutes
actionLimiter: { windowMs: 300000, max: 60 }
```

### Authentication Context Attachment

```typescript
// User/Partner object automatically attached to req
req.user = {
  id: decoded.Id,
  email: decoded.email,
  type: 'user' | 'partner'
}
```

### Service Layer Architecture

```typescript
Controller → Service → Repository
   ↓           ↓            ↓
Handler    Business Logic   Database
 (HTTP)     (Validation)    (Queries)
           + Error Throwing
```

- **Controllers** -HTTP handlers, validate input format
- **Services** - Business logic, type-safe error throwing
- **Repositories** - Database operations, session support

### Example: Error Flow in Action

### Example: Error Flow in Action

```typescript
// 1. Service throws typed error
if (existingUser) {
  throw new ConflictError('Email already registered');  
  // statusCode: 409, isOperational: true
}

// 2. Controller wrapped with asyncHandler (no try-catch needed!)
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, user });
});

// 3. Error automatically caught → middleware → responds with 409 JSON
// Response: { success: false, message: 'Email already registered' }
```

## 📡 API Documentation

### Middleware Pipeline
All requests pass through the following middleware stack (order matters):
1. **Helmet** - HTTP security headers (CSP, X-Frame-Options, etc.)
2. **Rate Limiter** - Global API throttling
3. **Cookie Parser** - Parse httpOnly cookies
4. **JSON Parser** - Parse request bodies
5. **CORS** - Cross-origin resource sharing
6. **Auth Context** - Attach user/partner context if authenticated
7. **Logger** - Request/response logging
8. **Route Handlers**
9. **Error Handler** - Centralized error response formatting

### Authentication Endpoints

#### User Routes (Plural)
```http
POST /api/auth/users/register
# Body: { name, email, password }
# Response: { user: {...}, token: "..." }

POST /api/auth/users/login
# Body: { email, password }
# Response: { user: {...}, token: "..." }

POST /api/auth/users/logout
GET  /api/auth/users/logout
# Clears authentication cookie
```

#### Partner Routes (Plural)
```http
POST /api/auth/partners/register
# Body: { name, restaurantName, email, phone, address, password }
# Response: { partner: {...}, token: "..." }

POST /api/auth/partners/login
# Body: { email, password }
# Response: { partner: {...}, token: "..." }

POST /api/auth/partners/logout
GET  /api/auth/partners/logout
# Clears authentication cookie
```

#### Auth Check
```http
GET /api/auth/loginCheck
# Returns user type (user/partner) and profile data
# Protected: Requires valid JWT in cookie

POST /api/auth/refresh
# Refresh expired access token
# Uses refresh token from secure cookie
```

### Food Endpoints (RESTful Plural)

#### List & Create
```http
GET /api/foods
# Protected: User authentication required
# Returns: Array of all food items with like/save status

POST /api/foods
# Protected: Partner only
# Content-Type: multipart/form-data
# Body: { name, description, price, video (file) }
# Alternative path: POST /api/foods/add
```

#### Get Single Food Item
```http
GET /api/foods/partners/:id
# Get all food items by a specific partner
# Alternative path: GET /api/foods/getfood/:id
```

#### Update & Delete
```http
PATCH /api/foods/:foodId
# Protected: Partner only (owner of food item)
# Body: { name, description, price }
# Alternative path: PUT /api/foods/update

DELETE /api/foods/:foodId
# Protected: Partner only (owner of food item)
# Alternative path: DELETE /api/foods/delete?foodId=...
```

### Action Endpoints (Interactions)

```http
POST /api/actions/like
# Protected: User authentication required
# Body: { foodId }
# Toggles like on food item
# Response: { isLiked: boolean, likeCount: number }

POST /api/actions/save
# Protected: User authentication required
# Body: { foodId }
# Toggles save on food item
# Response: { isSaved: boolean, saveCount: number }
```

### Profile Endpoints (Plural) 

#### Get & Update User Profile
```http
GET /api/users/me
# Protected: User authentication required
# Returns: { _id, name, email, phone, gender, address[] }

PATCH /api/users/me
# Protected: User authentication required
# Body: { name?, email?, phone?, gender? }
# Returns: Updated user profile
```

#### Manage User Addresses
```http
# Addresses are stored in the user's address array
# Each address can have labels: 'Home', 'Work', 'Other'
# Addressfields: label, fullName, phone, line1, city, state, postalCode, country, landmark, isDefault
```

#### Get Food Partner Profile
```http
GET /api/partners/:id
# Get food partner profile and all their dishes
# Returns: { partner: {...}, foods: [...], totalLikes: number }

GET /api/profiles/foodpartner/:id
# Alternative endpoint for partner profile
```

#### Get User Profile from Partner View
```http
GET /api/profiles/user/:id
# Get user profile information
```

## 🔑 Key Features Implementation

### Cookie-Based Authentication
Unlike many projects that store JWT in localStorage, this app uses **httpOnly cookies** for enhanced security:

```javascript
// Backend - Setting cookie
res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
});

// Frontend - Axios with credentials
axios.create({
    baseURL: API_URL,
    withCredentials: true  // Send cookies with requests
});
```

### Video Reel Scroll Snap
```css
.video-feed {
    scroll-snap-type: y mandatory; 
    height: 100vh;
    scroll-behavior: smooth;
}
.reel-item {
    scroll-snap-align: start;
    height: 100vh;
}
```

### Optimistic UI Updates
```javascript
// Update UI immediately, revert on error
setVideos(prev => prev.map(v => 
    v._id === foodId 
        ? { ...v, isLiked: !v.isLiked, likeCount: v.likeCount + 1 }
        : v
));
await axios.post('/api/actions/like', { foodId });
```

### Role-Based Middleware
```javascript
// Partner authentication
const FoodPartnerAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foodPartner = await FoodPartner.findById(decoded.Id);
    req.foodPartner = foodPartner;
    next();
};
```

## 💡 Code Architecture & Best Practices

### TypeScript Patterns
- **Strict null checking** - Prevents null/undefined errors
- **Type inference** - Uses interfaces for API contracts
- **Generic types** - Reusable components and utilities
- **Enum usage** - Type-safe constants (Gender, AddressLabel values)
- **Union types** - For discriminated user types (user | partner)

### Backend Patterns
- **Service-Repository separation** - Business logic decoupled from data access
- **Middleware composition** - Ordered execution of cross-cutting concerns
- **Transaction boundaries** - Sessions passed through repository methods
- **Async/await** - Consistent async error handling
- **Type discrimination** - `instanceof` checks for error handling

### Frontend Patterns
- **React Hooks** - useState, useEffect for state management
- **Context API** - Theme and authentication context
- **Composition** - Reusable UI components
- **Axios interceptors** - Request/response configuration
- **Optimistic updates** - Instant UI feedback before server confirmation
- **Error boundaries** - Graceful error handling in components

### Database Patterns
- **Unique constraints** - Email, phone fields have indexes
- **Foreign keys** - Mongoose refs for relationships
- **Timestamps** - Auto-tracking of creation/update times
- **Lean queries** - Performance optimization for read-only operations
- **Transactions** - ACID guarantees for critical operations

## 🎨 UI/UX Highlights

- **Dark theme** - Modern, eye-friendly design
- **Responsive layout** - Works on mobile, tablet, desktop
- **Skeleton loaders** - Better perceived performance
- **Toast notifications** - User feedback on actions
- **Video controls** - Play/pause, mute/unmute
- **Smooth animations** - Tailwind transitions
- **Profile avatars** - Initial-based avatars
- **Dropdown menus** - Polished navigation

## 🔒 Security Features

✅ **Helmet middleware** - HTTP security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)  
✅ **Password hashing** with bcrypt (10 rounds, salted)  
✅ **Dual-token system** - Access token (15m) + Refresh token (7d)  
✅ **Token rotation** - Refresh tokens are rotated on every use  
✅ **Token revocation** - Logout invalidates all user tokens immediately  
✅ **Token hash storage** - Refresh tokens are hashed before storage  
✅ **HttpOnly cookies** - Prevents XSS attacks by restricting JavaScript access  
✅ **SameSite cookies** - CSRF protection with strict SameSite policy  
✅ **CORS configuration** - Restricted origins, with credentials support  
✅ **Protected routes** - Middleware-based role verification on sensitive endpoints  
✅ **Input validation** - Zod schema validation before business logic  
✅ **File type validation** - Video uploads with proper MIME type checking  
✅ **CSP Policy** - Content Security Policy for media (ImageKit CDN whitelisted)  
✅ **Stack trace sanitization** - Never exposed to clients in production  
✅ **Error type discrimination** - Programming errors handled separately from operational errors  
✅ **Rate limiting** - Global API throttling + auth-specific + action-specific limiters  
✅ **Session-based access control** - User context attached to all requests  

## 💾 Database Transactions

The application implements **ACID-compliant MongoDB transactions** for critical operations:

### Like/Save Operations (Atomic)
```typescript
// Transaction ensures consistency across Like/Save and Food documents
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Create/delete like record
  // 2. Increment/decrement food.likeCount
  // Both operations succeed or both fail
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

**Benefits:**
- Counter accuracy: Like/Save count always matches actual records
- Data consistency: No orphaned or missing records
- Automatic rollback on failure: Device disconnect or server error triggers full rollback
- No race conditions: Database-level atomicity prevents concurrent conflicts

## 📊 Database Schema

### User Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    email: String (unique, required),
    password: String (hashed, required),
    phone: String (optional),
    gender: String (enum: 'Male', 'Female', 'Other'),
    address: [
        {
            _id: ObjectId,
            label: String (enum: 'Home', 'Work', 'Other'),
            fullName: String,
            phone: String,
            line1: String (street address),
            city: String,
            state: String,
            postalCode: String,
            country: String,
            landmark: String,
            isDefault: Boolean
        }
    ],
    timestamps: true
}
```

### FoodPartner Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    restaurantName: String (required),
    email: String (unique, required),
    phone: String (unique, required),
    address: String (required),
    password: String (hashed, required),
    timestamps: true
}
```

### Food Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    video: String (CDN URL, required),
    videoPublicId: String (ImageKit public ID, required),
    description: String (required),
    price: Number (required),
    likeCount: Number (default: 0),
    saveCount: Number (default: 0),
    foodPartner: ObjectId (ref: FoodPartner, required),
    timestamps: true
}
```

### Like Model
```javascript
{
    _id: ObjectId (unique),
    userId: ObjectId (ref: User, required),
    food: ObjectId (ref: Food, required),
    timestamps: true,
    // Unique constraint: one like per user per food item
    uniqueIndex: [userId, food]
}
```

### Save Model
```javascript
{
    _id: ObjectId (unique),
    userId: ObjectId (ref: User, required),
    food: ObjectId (ref: Food, required),
    timestamps: true,
    // Unique constraint: one save per user per food item
    uniqueIndex: [userId, food]
}
```

### RefreshToken Model
```javascript
{
    _id: ObjectId (unique),
    userId: String (required),
    userType: String (enum: 'user', 'partner', required),
    tokenHash: String (SHA256 hash, required),
    expiresAt: Date (required),
    revokedAt: Date (null if active, set to Date if revoked),
    timestamps: true
}
```

## 🎯 Future Enhancements

### Immediate Priorities  
- [ ] **MongoDB Replica Set Setup** - For production transactions (documented in MONGODB_REPLICA_SET_SETUP.md)
- [ ] **Order Management System** - Complete checkout and order flow
- [ ] **Payment Gateway Integration** - Stripe or Razorpay for secure payments
- [ ] **Email Notifications** - Order confirmations, promotional emails
- [ ] **Search & Filters** - Advanced filtering by cuisine, price range, ratings

### Planned Features
- [ ] **User Reviews & Ratings** - Rate food items and partners
- [ ] **Partner Analytics Dashboard** - Real-time engagement metrics and sales data
- [ ] **Advanced Search** - Full-text search with faceted filtering
- [ ] **Geolocation-based Discovery** - Show restaurants near user location
- [ ] **Video Compression Pipeline** - Optimize video sizes before upload
- [ ] **Admin Moderation Dashboard** - Content approval and dispute resolution
- [ ] **Push Notifications** - Real-time updates on order status
- [ ] **Real-time Chat System** - WebSocket-based customer-partner communication
- [ ] **Wishlist/Favorites** - Enhanced saved items with collections
- [ ] **Social Features** - Follow partners, share videos, comments
- [ ] **Structured Logging Upgrade** - Winston/Pino for production logging
- [ ] **Error Tracking Service** - Sentry integration for error monitoring
- [ ] **GraphQL API** - Alternative to REST for flexible data queries
- [ ] **Mobile App** - React Native version for iOS/Android

### DevOps & Infrastructure
- [ ] **Production MongoDB Cluster** - Atlas or self-hosted with backup
- [ ] **CDN Configuration** - Global content delivery for videos
- [ ] **CI/CD Pipeline** - GitHub Actions for automated testing/deployment
- [ ] **Load Balancing** - Handle high traffic scenarios
- [ ] **Caching Strategy** - Redis for session and frequently accessed data
- [ ] **Database Indexing** - Performance optimization for queries
- [ ] **Monitoring & Alerts** - Health checks and performance tracking
- [ ] Order placement & tracking

### Refactoring Complete ✅
- Migrated backend to TypeScript
- Implemented type-safe error handling system
- Removed repetitive try-catch boilerplate
- Established repository pattern for data access
- Standardized middleware pipeline
## 📚 Learning Resources & Documentation

The repository includes comprehensive learning guides for understanding key concepts:

### Core Concepts
- **[TRANSACTIONS_LEARNING_GUIDE.md](TRANSACTIONS_LEARNING_GUIDE.md)** - Understanding MongoDB transactions and ACID guarantees
- **[TRANSACTIONS_IMPLEMENTATION_GUIDE.md](TRANSACTIONS_IMPLEMENTATION_GUIDE.md)** - How transactions are implemented in the codebase
- **[MONGODB_REPLICA_SET_SETUP.md](MONGODB_REPLICA_SET_SETUP.md)** - Setting up MongoDB replica set for transactions
- **[THE_CRITICAL_RETURN_STATEMENT.md](THE_CRITICAL_RETURN_STATEMENT.md)** - Important patterns in database operations

### React Patterns
- **[USECALLBACK_SIMPLE.md](USECALLBACK_SIMPLE.md)** - Understanding useCallback hook basics
- **[USECALLBACK_AND_USEMEMO_EXPLAINED.md](USECALLBACK_AND_USEMEMO_EXPLAINED.md)** - Performance optimization with React hooks
- **[USECALLBACK_REAL_FLOW.md](USECALLBACK_REAL_FLOW.md)** - Real-world implementation examples

### Advanced Topics
- **[REDUCE_COMPLETE_GUIDE.md](REDUCE_COMPLETE_GUIDE.md)** - Comprehensive useReducer documentation
- **[REDUCE_FLOW_EXPLAINED.md](REDUCE_FLOW_EXPLAINED.md)** - State management flow diagrams
- **[REDUCE_DETAILED_TABLE.md](REDUCE_DETAILED_TABLE.md)** - Detailed action handlers reference

### Troubleshooting
- **[IMAGEKIT_ERROR_ANALYSIS.md](IMAGEKIT_ERROR_ANALYSIS.md)** - Common ImageKit errors and solutions

These guides are living documentation - refer to them while understanding the codebase and implementing new features.

## 🏁 Project Status

### Backend ✅ Production-Ready
- Full TypeScript with strict type checking
- Enterprise-grade error handling system
- Complete API with 20+ endpoints
- MongoDB transactions for data consistency
- Rate limiting at multiple levels
- Comprehensive middleware pipeline
- Docker containerization

### Frontend ✅ Feature-Complete
- React 19 with modern hooks
- Vite 7 build optimization
- Tailwind CSS v4 styling
- Real-time UI updates with optimistic rendering
- Responsive design for all devices
- Dark theme support

### Database ✅ Well-Structured
- Proper relationships with foreign keys
- Indexed fields for performance
- Transaction support with replica set
- Timestamp tracking on all models
- Unique constraints for data integrity

## 🐛 Known Limitations

- Video autoplay requires user interaction on some browsers
- Large video uploads (~500MB+) may timeout; recommend compression before upload
- Real-time features require WebSocket upgrade (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Shubham Kumar**  
- GitHub: [@imshubhamgiri](https://github.com/imshubhamgiri)  
- Portfolio: Food discovery platform with focus on type-safe backend architecture and production-grade error handling

---

**Latest Update**: Backend refactor complete. TypeScript migration, custom error handling system, and repository pattern implementation. Ready for scaling and integrating additional services.

## 🙏 Acknowledgments

- ImageKit for video CDN services
- MongoDB for flexible database solution
- React community for excellent documentation
- TikTok/Instagram for reel UI inspiration

---

**Note**: This project demonstrates enterprise-level full-stack development practices. The backend implements type-safe error handling, proper separation of concerns (repository/service/controller), and middleware-based request processing. Production deployment-ready with structured logging and error tracking hooks prepared for external services.

## 📸 Screenshots

> Add screenshots of your application here:
> - Home page with video reels
> - Partner dashboard
> - Video upload interface
> - User profile
> - Mobile responsive views