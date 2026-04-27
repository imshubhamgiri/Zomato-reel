import 'dotenv/config';
import app from './src/app';
import { connectDB } from './src/db/db';
import path from 'path';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const startServer = (): void => {
  const entryPoint = process.argv[1] || '';
  const normalizedEntry = entryPoint.split(path.sep).join('/');
  const runtime = normalizedEntry.includes('/dist/') ? 'compiled-js' : 'ts-node';

  const server = app.listen(PORT, HOST, () => {
    console.log(`[BOOT] pid=${process.pid} runtime=${runtime} env=${process.env.NODE_ENV || 'development'} url=http://${HOST}:${PORT}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[BOOT] Port ${PORT} is already in use. Stop the existing server process before starting another one.`);
      process.exit(1);
    }

    console.error('[BOOT] Server listen error:', error);
    process.exit(1);
  });
};

const bootstrap = async (): Promise<void> => {
  startServer();

  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed during startup:', error);
  }
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

bootstrap().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});