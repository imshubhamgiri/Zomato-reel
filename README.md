# 🍽️ Zomato Reel - Food Discovery Platform

A modern food ordering platform featuring Instagram/TikTok-style video reels where food partners showcase their dishes through engaging short videos. Built with the MERN stack and cookie-based authentication.

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
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **ImageKit** - Video CDN service
- **Cookie-parser** - Cookie handling middleware

## 📁 Project Structure

```
Zomato-reel/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx           # Video reel feed
│   │   │   ├── UserLogin.jsx      # User authentication
│   │   │   ├── UserRegister.jsx
│   │   │   ├── PartnerLogin.jsx   # Partner authentication
│   │   │   ├── PartnerRegister.jsx
│   │   │   ├── Addfood.jsx        # Video upload
│   │   │   └── PartnerProfileUser.jsx
│   │   ├── services/       # API services
│   │   └── config/         # Configuration files
│   └── package.json
│
├── backend/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── food.controller.js
│   │   │   └── actionController.js
│   │   ├── models/        # Mongoose models
│   │   │   ├── userModel.js
│   │   │   ├── foodPartner.model.js
│   │   │   ├── food.model.js
│   │   │   ├── like.model.js
│   │   │   └── save.model.js
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   │   └── auth.js
│   │   └── service/       # External services
│   │       └── storage.service.js (ImageKit)
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

## 📡 API Documentation

### Authentication Endpoints

#### User Routes
```http
POST /api/auth/user/register
POST /api/auth/user/login
GET  /api/auth/user/logout
```

#### Partner Routes
```http
POST /api/auth/partner/register
POST /api/auth/partner/login
GET  /api/auth/partner/logout
```

#### Auth Check
```http
GET /api/auth/loginCheck
# Returns user type (user/partner) and profile data
```

### Food Endpoints

```http
POST /api/food/add
# Protected: Partner only
# Content-Type: multipart/form-data
# Body: { name, description, price, video (file) }

GET /api/food/listfood
# Protected: User authentication required
# Returns: Array of food items with like/save status

GET /api/food/getfood/:id
# Get single food item by ID
```

### Action Endpoints

```http
POST /api/actions/like
# Body: { foodId }
# Toggles like on food item

POST /api/actions/save
# Body: { foodId }
# Toggles save on food item
```

### Profile Endpoints

```http
GET /api/profile/foodpartner/:id
# Get food partner profile and their dishes
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

✅ **Password hashing** with bcrypt (10 rounds)  
✅ **JWT expiration** (1 hour)  
✅ **HttpOnly cookies** - Prevents XSS attacks  
✅ **CORS configuration** with credentials  
✅ **Protected routes** - Middleware verification  
✅ **Input validation** - Mongoose schema validation  
✅ **File type validation** - Video uploads only  

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

- [ ] Order placement functionality
- [ ] Real-time chat between users and partners
- [ ] Advanced search and filters (cuisine, price, rating)
- [ ] User reviews and ratings
- [ ] Partner analytics dashboard
- [ ] Push notifications
- [ ] Payment gateway integration
- [ ] Geolocation-based food discovery
- [ ] Social sharing features
- [ ] Video compression before upload
- [ ] Admin dashboard for moderation

## 🐛 Known Issues

- Video autoplay may require user interaction on some browsers
- Large video files may take time to upload
- Mobile video performance depends on device capabilities

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
- Email: skgiri569@gmail.com

## 🙏 Acknowledgments

- ImageKit for video CDN services
- MongoDB for flexible database solution
- React community for excellent documentation
- TikTok/Instagram for reel UI inspiration

---

**Note**: This is a portfolio/learning project demonstrating modern web development practices with video handling, authentication, and real-time interactions.

## 📸 Screenshots

> Add screenshots of your application here:
> - Home page with video reels
> - Partner dashboard
> - Video upload interface
> - User profile
> - Mobile responsive views