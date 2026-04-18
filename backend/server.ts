import app from './src/app';
import { connectDB } from './src/db/db';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const startServer = (): void => {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
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