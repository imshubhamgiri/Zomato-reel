# 🍽️ Zomato Reel - Food Discovery Platform

A modern food ordering platform featuring Instagram/TikTok-style video reels where food partners showcase their dishes through engaging short videos. Built with MERN + TypeScript, featuring production-ready error handling, structured logging, and enterprise-grade architecture patterns.

## 🌐 Features

### 🎥 Video Reel Experience
- **Vertical scroll reels** - Instagram/TikTok-style video feed with scroll-snap
- **Auto-play videos** - Smooth playback as users scroll
- **Interactive actions** - Like, save, and share food videos
- **Optimistic UI updates** - Instant feedback on user interactions
- **Mute/Unmute controls** - Toggle audio on videos

### 👤 Dual User System

#### For Users:
- Browse food videos in an engaging reel format
- Like and save favorite food items
- View partner profiles and their menu
- Real-time interaction counters (likes/saves)

#### For Food Partners:
- Upload food videos with descriptions and pricing
- Manage restaurant profile
- Track video engagement (likes, saves)
- Showcase culinary creations to potential customers

### 🔐 Authentication & Security
- **Cookie-based authentication** - Secure, httpOnly cookies instead of localStorage
- **JWT tokens** - Server-side token verification
- **Role-based access control** - Separate routes for users and partners
- **Protected routes** - Middleware-based authorization
- **Separate login/register flows** for users and partners

### 📤 Video Management
- **Video upload** - Multer with memory storage
- **CDN integration** - ImageKit for video hosting
- **Video preview** - Real-time preview before upload
- **Metadata management** - Name, description, price per dish

## 🛠️ Tech Stack

### Frontend
- **React** (v18) - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with credentials support
- **Tailwind CSS** - Utility-first styling
- **React Toastify** - Toast notifications

### Backend
- **Node.js** + **TypeScript** - Typed runtime environment
- **Express.js** - Lightweight web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing (10 rounds)
- **Multer** - File upload handling
- **ImageKit** - Video CDN service
- **Helmet** - HTTP security headers middleware
- **Zod** - Runtime type validation
- **Cookie-parser** - Secure httpOnly cookie handling

### Architecture & Patterns (Backend)
- **TypeScript** - Full type safety across codebase
- **Custom Error Classes** - Type-safe error handling with operational vs programming error discrimination
- **Async Error Handler** - Centralized error catching utility eliminating boilerplate try-catch blocks
- **Repository Pattern** - Abstracted data access layer for clean data access
- **Middleware Pipeline** - Helmet, rate-limiting, CORS, auth, validation, logging, error handling
- **Service Layer** - Business logic encapsulation separate from controllers
- **Structured Logging** - Request/response logging with context and error tracking
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

## 🏗️ Backend Architecture (Recent Refactor)

The backend underwent a significant refactor to implement production-grade error handling and architecture patterns:

### Error Handling System
- **Custom Error Classes** (`AppError`, `AuthError`, `ConflictError`, `NotFoundError`, `ValidationError`, etc.)
  - Type-safe error throwing: `throw new ConflictError('Email already exists')`
  - Automatic status code assignment per error type
  - `isOperational` flag to distinguish expected errors from programming bugs
  
- **Async Error Handler Utility**
  - Eliminates repetitive try-catch blocks in controllers
  - Centralized error catching: `export const register = asyncHandler(async (req, res) => { ... })`
  - All promise rejections automatically routed to error middleware
  
- **Centralized Error Middleware**
  - Type discrimination: checks `instanceof AppError` vs unknown errors
  - Stack trace sanitization: hidden in production, visible in development
  - Consistent error response format
  - Logging with error context

### Code Organization
- **Service Layer**: Business logic with typed error throwing
- **Repository Pattern**: Abstracted database queries
- **Middleware Pipeline**: Auth → Validation → Logging → Rate-limiting → Routes → Error Handler
- **Type Safety**: Full TypeScript codebase with interfaces for API contracts

### Example: Error Flow
```typescript
// Service throws typed error
if (existingUser) {
  throw new ConflictError('Email already registered');  // statusCode: 409, isOperational: true
}

// Controller wrapped with asyncHandler (no try-catch needed!)
export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ success: true, user });
});

// Error automatically caught → middleware → responds with 409 JSON
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

```http
GET /api/profiles/foodpartner/:id
# Get food partner profile and all their dishes
# Returns: { partner: {...}, foods: [...], totalLikes: number }

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
✅ **Password hashing** with bcrypt (10 rounds)  
✅ **JWT expiration** (15m access, 7d refresh)  
✅ **HttpOnly cookies** - Prevents XSS attacks  
✅ **CORS configuration** - Restricted origins, with credentials support  
✅ **Protected routes** - Middleware-based role verification  
✅ **Input validation** - Zod schema validation before business logic  
✅ **File type validation** - Video uploads only  
✅ **CSP Policy** - Content Security Policy for media (ImageKit CDN whitelisted)  
✅ **Stack trace sanitization** - Never exposed to clients in production  
✅ **Error type discrimination** - Programming errors handled separately from operational errors  
✅ **Rate limiting** - Global API throttling to prevent abuse  

## 📊 Database Schema

### User Model
```javascript
{
    name: String,
    email: String (unique),
    password: String (hashed),
    timestamps: true
}
```

### FoodPartner Model
```javascript
{
    name: String,
    restaurantName: String,
    email: String (unique),
    phone: String (unique),
    address: String,
    password: String (hashed),
    timestamps: true
}
```

### Food Model
```javascript
{
    name: String,
    video: String (CDN URL),
    description: String,
    price: Number,
    likeCount: Number,
    saveCount: Number,
    foodPartner: ObjectId (ref: FoodPartner),
    timestamps: true
}
```

### Like/Save Models
```javascript
{
    userId: ObjectId (ref: User),
    food: ObjectId (ref: Food),
    timestamps: true
}
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Structured logging upgrade (Winston/Pino)
- [ ] Error tracking service (Sentry integration)
- [ ] Real-time chat system (WebSocket)
- [ ] Advanced search and filters (cuisine, price, ratings)
- [ ] User reviews and ratings system
- [ ] Partner analytics dashboard
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Geolocation-based discovery
- [ ] Video compression pipeline
- [ ] Admin moderation dashboard
- [ ] Push notifications
- [ ] Order placement & tracking

### Refactoring Complete ✅
- Migrated backend to TypeScript
- Implemented type-safe error handling system
- Removed repetitive try-catch boilerplate
- Established repository pattern for data access
- Standardized middleware pipeline

## � Project Status

**Backend**: Production-ready with enterprise-grade error handling and TypeScript support  
**Frontend**: Feature-complete and stable  
**Database**: Fully structured with proper relationships  

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