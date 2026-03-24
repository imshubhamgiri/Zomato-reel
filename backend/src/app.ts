import express  from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import foodRoutes from './routes/food.routes';
import profileRoutes from './routes/profile.routes';
import actionRoutes from './routes/useraction.routes';
import corsMiddleware from './middleware/cors';
import logger from './middleware/logging';
import { attachAuthContext } from './middleware/auth';
import { globalApiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';


dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

// GLOBAL MIDDLEWARES (run before all routes)
app.use(corsMiddleware);
app.use(attachAuthContext);
app.use(logger);
app.use(globalApiLimiter);

app.use('/api/auth', authRoutes);

app.use('/api/foods', foodRoutes);

app.use('/api/profiles', profileRoutes);
app.use('/api/actions',actionRoutes)

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;