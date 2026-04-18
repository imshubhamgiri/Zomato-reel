import cors from 'cors';

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173' || '*') //allow all temporarily
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
});

export default corsMiddleware;
