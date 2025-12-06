const express = require('express');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const profileRoutes = require('./routes/profile.routes');
const actionRoutes = require('./routes/useraction.routes')
dotenv.config();

const app = express();
app.use(cookieparser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

app.use('/api/food', foodRoutes);

app.use('/api/profile', profileRoutes);
app.use('/api/actions',actionRoutes)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;