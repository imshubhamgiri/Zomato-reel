const express = require('express');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
dotenv.config();

const app = express();
app.use(cookieparser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;