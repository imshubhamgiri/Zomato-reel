import express  from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import foodRoutes from './routes/food.routes';
import profileRoutes from './routes/partnerProfile.routes';
import actionRoutes from './routes/useraction.routes';
import orderRoutes from './routes/order.routes';
import corsMiddleware from './middleware/cors';
import logger from './middleware/logging';
import { attachAuthContext } from './middleware/auth';
import { globalApiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { helmetMiddleware } from './middleware/helmet';
import userprofileRoutes from './routes/userProfiles.routes';
import { getDbHealth } from './db/db';


dotenv.config();

const app = express();

app.use(helmetMiddleware);
app.use(globalApiLimiter);

app.use(cookieParser());
app.use(express.json());

// GLOBAL MIDDLEWARES (run before all routes)
app.use(corsMiddleware);
app.use(attachAuthContext);
app.use(logger);

app.use('/api/auth', authRoutes);

app.use('/api/foods', foodRoutes);

app.use('/api/users', userprofileRoutes);
app.use('/api/partners', profileRoutes);
app.use('/api/actions',actionRoutes)
app.use('/api/orders', orderRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

// Health check endpoint
app.get('/health', (_req, res) => {
  const db = getDbHealth();
  const status = db.isConnected ? 'healthy' : 'degraded';

  res.status(db.isConnected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'FoodInReels API',
    db,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;