import express  from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import foodRoutes from './routes/food.routes';
import profileRoutes from './routes/profile.routes';
import actionRoutes from './routes/useraction.routes';

// Initialize dotenv
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

app.use('/api/food', foodRoutes);

app.use('/api/profile', profileRoutes);
app.use('/api/actions',actionRoutes)

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

export default app;