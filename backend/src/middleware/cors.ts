import cors from 'cors';

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '');

const parseAllowedOrigins = (): string[] => {
  const raw = process.env.CORS_ORIGINS || '[]';

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((value): value is string => typeof value === 'string')
      .map(normalizeOrigin)
      .filter(Boolean);
  } catch {
    return [];
  }
};

const allowedOrigins = parseAllowedOrigins();

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalized = normalizeOrigin(origin);
    callback(null, allowedOrigins.includes(normalized));
  },
  credentials: true,
});

export default corsMiddleware;
